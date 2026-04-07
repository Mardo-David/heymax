"""
HeyMax — Motor Conversacional Integrado via Rest (FastAPI)
Arquitetura v4: Endpoint Fire-and-Forget com Debounce em Memória

Mudanças desta versão:
- POST /v1/.../message retorna HTTP 202 Accepted IMEDIATAMENTE.
- Toda a lógica pesada (debounce, LangGraph, EVO API) roda em background
  via asyncio.create_task(), sem bloquear o thread do servidor.
- Buffer de debounce por session_id: janela de 4s. Mensagens rápidas
  são concatenadas antes de invocar o LangGraph.
- Envio direto de resposta via Evolution API (sendText) — sem depender
  do n8n para nada além do roteamento inicial.
- Se concluido=True, envia também o relatório de fechamento para o
  numero_comercial da organização (Brenda).

Constantes hardcoded para S1 (migrar para organizations table na S2):
  EVO_BASE_URL  = "https://evo.heymax.fit"
  EVO_INSTANCE  = "trenobell"
  EVO_API_KEY   = "7FE740D978BC-436B-BA12-55589F0A4037"
"""

from __future__ import annotations

import asyncio
import logging
import os
from contextlib import asynccontextmanager
from dataclasses import dataclass, field
from typing import Optional

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from psycopg_pool import AsyncConnectionPool
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver

from engine.state import criar_estado_inicial, FunilState
from engine.graph import workflow
from demo.router import router as demo_router
from demo.estrela.router import router as estrela_router

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("HeyMax-API")


# ---------------------------------------------------------------------------
# Constantes EVO API (S1 — hardcoded; migrar para organizations table na S2)
# ---------------------------------------------------------------------------

EVO_BASE_URL = "https://evo.heymax.fit"
EVO_INSTANCE = "trenobell"
EVO_API_KEY  = "7FE740D978BC-436B-BA12-55589F0A4037"
DEBOUNCE_SECONDS = 4.0


# ---------------------------------------------------------------------------
# Buffer de Debounce
# ---------------------------------------------------------------------------

@dataclass
class DebounceEntry:
    texts: list[str] = field(default_factory=list)
    phone: str = ""
    org_id: str = ""
    task: Optional[asyncio.Task] = None


# Mapeamento global session_id → DebounceEntry
# Isolado por session_id (não por phone) para suportar multi-tenant corretamente.
_debounce_buffer: dict[str, DebounceEntry] = {}


# ---------------------------------------------------------------------------
# Lifespan — inicializa recursos compartilhados
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    # HTTPX AsyncClient único — reutiliza conexões HTTP (EVO API + outras)
    app.state.http_client = httpx.AsyncClient(
        timeout=httpx.Timeout(connect=5.0, read=30.0, write=5.0, pool=2.0)
    )
    logger.info("HTTPX AsyncClient iniciado.")

    app.state.db_pool = None
    app.state.graph_app = None

    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        logger.warning("DATABASE_URL não configurado. DB offline; erros esperados em produção.")
    else:
        if "sslmode=" not in db_url:
            db_url += "?sslmode=require" if "?" not in db_url else "&sslmode=require"

        logger.info("Estabelecendo AsyncConnectionPool PostgreSQL (psycopg)...")
        app.state.db_pool = AsyncConnectionPool(
            conninfo=db_url,
            min_size=1,
            max_size=10,
            kwargs={"autocommit": True, "prepare_threshold": None},
            open=False,
        )
        await app.state.db_pool.open()

        logger.info("Criando AsyncPostgresSaver e schemas do LangGraph no Supabase...")
        saver = AsyncPostgresSaver(app.state.db_pool)
        await saver.setup()

        logger.info("Compilando Grafo com AsyncPostgresSaver...")
        app.state.graph_app = workflow.compile(checkpointer=saver)

    yield  # App roda aqui

    logger.info("Encerrando HTTPX AsyncClient...")
    await app.state.http_client.aclose()

    logger.info("Encerrando AsyncConnectionPool do Supabase...")
    if app.state.db_pool:
        await app.state.db_pool.close()


# ---------------------------------------------------------------------------
# App FastAPI
# ---------------------------------------------------------------------------

app = FastAPI(title="HeyMax Conversacional SaaS", version="4.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(demo_router)
app.include_router(estrela_router)


# ---------------------------------------------------------------------------
# Modelos
# ---------------------------------------------------------------------------

class PayloadMessage(BaseModel):
    message: str
    phone: str


# ---------------------------------------------------------------------------
# Helpers de banco de dados
# ---------------------------------------------------------------------------

async def obter_configuracao_filial(org_id: str, pool: AsyncConnectionPool) -> dict:
    """Busca credenciais Multi-Tenant da organização."""
    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute(
                "SELECT name, evolution_apikey, numero_comercial FROM organizations WHERE slug = %s AND active = true",
                (org_id,)
            )
            row = await cur.fetchone()
            if row:
                return {
                    "org_id": org_id,
                    "nome_unidade": row[0],
                    "evolution_apikey": row[1],
                    "numero_comercial": row[2],
                }
            else:
                raise ValueError(f"Organização '{org_id}' não encontrada ou inativa")


async def obter_nome_prospect(session_id: str, pool: AsyncConnectionPool) -> str:
    """Busca o nome do prospect no CRM (fallback: 'Aluno')."""
    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute(
                "SELECT nome FROM trial_feedback WHERE session_id = %s",
                (session_id,)
            )
            row = await cur.fetchone()
            if row and row[0]:
                return row[0]
    return "Aluno"


async def persistir_estado_crm(
    session_id: str,
    novo_estado: dict,
    pool: AsyncConnectionPool,
    concluido: bool,
) -> None:
    """Espelha os dados extraídos do LangGraph na tabela trial_feedback.

    Em um único UPDATE SQL parametrizado, atualiza:
    - Campos de coleta: nps, sugestao, objecoes, intent_matricula
    - Timestamp da última mensagem do usuário: last_user_message_at
    - engajamento_status (regras de negócio):
        * concluido=True                              → 'respondeu_completo'
        * 1ª resposta + reengajamento_enviado_at NULL → 'respondeu_parcial'
        * 1ª resposta + reengajamento_enviado_at SET  → 'reengajado'
    """
    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute(
                """
                UPDATE trial_feedback
                SET
                    nps              = %s,
                    sugestao         = %s,
                    objecoes         = %s,
                    intent_matricula = %s,
                    last_user_message_at = NOW(),
                    engajamento_status = CASE
                        WHEN %s = TRUE
                            THEN 'respondeu_completo'
                        WHEN last_user_message_at IS NULL
                             AND reengajamento_enviado_at IS NOT NULL
                            THEN 'reengajado'
                        WHEN last_user_message_at IS NULL
                            THEN 'respondeu_parcial'
                        ELSE engajamento_status
                    END,
                    status_coleta = CASE
                        WHEN %s = TRUE THEN 'concluida'
                        ELSE status_coleta
                    END,
                    finished_at = CASE
                        WHEN %s = TRUE AND finished_at IS NULL THEN NOW()
                        ELSE finished_at
                    END
                WHERE session_id = %s
                """,
                (
                    novo_estado.get("nps"),
                    novo_estado.get("sugestao"),
                    novo_estado.get("objecoes"),
                    novo_estado.get("intent_matricula"),
                    concluido,   # %s do engajamento_status CASE
                    concluido,   # %s do status_coleta CASE
                    concluido,   # %s do finished_at CASE
                    session_id,
                )
            )


# ---------------------------------------------------------------------------
# Helpers EVO API
# ---------------------------------------------------------------------------

async def evo_send_text(http_client: httpx.AsyncClient, number: str, text: str) -> None:
    """Envia uma mensagem de texto via Evolution API (fire-and-forget interno)."""
    # Missão 2: Validação de payload — aborta silenciosamente se o texto for vazio
    if not text or not text.strip():
        logger.warning(f"[EVO] sendText abortado — texto vazio para number={number[:8]}...")
        return

    url = f"{EVO_BASE_URL}/message/sendText/{EVO_INSTANCE}"
    payload = {"number": number, "text": text}
    headers = {"apikey": EVO_API_KEY, "Content-Type": "application/json"}
    try:
        r = await http_client.post(url, json=payload, headers=headers)
        if r.status_code == 201:
            logger.info(f"[EVO] sendText OK → {number[:8]}... | status=201")
        else:
            logger.error(
                f"[EVO] sendText falhou | status={r.status_code} "
                f"| number={number} | text_len={len(text)} | body={r.text}"
            )
    except Exception as e:
        logger.error(
            f"[EVO] sendText exception | number={number} "
            f"| text_len={len(text)} | erro={e}"
        )


def montar_relatorio_fechamento(
    nome: str,
    phone: str,
    nps,
    sugestao,
    objecoes,
    intent_matricula,
) -> str:
    """Monta o texto do relatório de fechamento para o WhatsApp da gerente."""
    intent_str = "Sim ✅" if intent_matricula is True else "Não ❌"
    return (
        f"🚨 *Novo Feedback - Aula Experimental* 🚨\n\n"
        f"👤 *Nome do Lead:* {nome or 'Não informado'}\n"
        f"📱 *Telefone:* {phone}\n"
        f"⭐ *Nota NPS:* {nps}/10\n"
        f"💡 *Sugestão:* {sugestao or 'Nenhuma'}\n"
        f"🚧 *Objeções:* {objecoes or 'Nenhuma'}\n"
        f"🔥 *Quer se matricular?* {intent_str}\n\n"
        f"_(O Bell já enviou a mensagem de despedida para o cliente)_"
    )


# ---------------------------------------------------------------------------
# Background Task — núcleo da lógica de negócio
# ---------------------------------------------------------------------------

async def _processar_conversa(
    org_id: str,
    session_id: str,
    phone: str,
    texto_completo: str,
    db_pool: AsyncConnectionPool,
    http_client: httpx.AsyncClient,
    graph_app,
) -> None:
    """
    Executa a lógica completa em background após o debounce:
      1. Carrega config da org e nome do prospect
      2. Recupera/cria estado no LangGraph (via AsyncPostgresSaver)
      3. Aplica Rejeição Segura (conversa já concluída → ignora silenciosamente)
      4. Invoca o LangGraph
      5. Persistência CRM
      6. Envia resposta ao prospect via EVO API
      7. Se concluido=True → envia relatório para o numero_comercial da org
    """
    try:
        # 1. Config da organização
        org_config = await obter_configuracao_filial(org_id, db_pool)
        nome_prospect = await obter_nome_prospect(session_id, db_pool)

        # 2. Monta config do LangGraph (thread isolada por session_id)
        config = {
            "configurable": {
                "thread_id": session_id,
                "nome_academia": org_config["nome_unidade"],
                "nome_prospect": nome_prospect,
                "httpx_client": http_client,
                "db_pool": db_pool,
                "org_id": org_id,
            }
        }

        # 3. Recupera estado atual do checkpointer
        current_checkpoint = await graph_app.aget_state(config)
        is_new = not bool(current_checkpoint.values)
        state = current_checkpoint.values if not is_new else {}

        # 4. Rejeição Segura: sessão já encerrada → log + silêncio
        if not is_new and (state.get("concluido") or state.get("encerrando")):
            logger.warning(f"[{org_id}] [{session_id}] Sessão já CONCLUÍDA — mensagem ignorada ('{texto_completo[:40]}...')")
            return

        # 5. Prepara estado para o LangGraph
        if is_new:
            logger.info(f"[{org_id}] [{session_id}] Nova sessão criada.")
            state = criar_estado_inicial(session_id, phone)
            if texto_completo.strip():
                state["messages"].append({"role": "user", "content": texto_completo.strip()})
        else:
            if texto_completo.strip():
                logger.info(f"[{org_id}] [{session_id}] Atualizando timeline com texto debounçado.")
                novo_historico = list(state.get("messages", []))
                novo_historico.append({"role": "user", "content": texto_completo.strip()})
                state["messages"] = novo_historico

        # 6. Invoca o LangGraph
        logger.info(f"[{org_id}] [{session_id}] Invocando LangGraph...")
        novo_estado = await graph_app.ainvoke(state, config)

        # 7. Extrai resposta e flag de conclusão
        ultima_mensagem = ""
        msgs = novo_estado.get("messages", [])
        if msgs and msgs[-1].get("role") == "assistant":
            ultima_mensagem = msgs[-1].get("content", "")

        concluido = bool(novo_estado.get("concluido") or novo_estado.get("encerrando"))
        logger.info(f"[{org_id}] [{session_id}] LangGraph OK. Concluido={concluido}.")

        # 8. Persistência CRM (inclui atualização de engajamento_status)
        await persistir_estado_crm(session_id, novo_estado, db_pool, concluido=concluido)

        # 9. Envia resposta ao prospect
        if ultima_mensagem.strip():
            await evo_send_text(http_client, phone, ultima_mensagem)

        # 10. Relatório de fechamento para a gerente (Brenda)
        if concluido:
            numero_comercial = org_config.get("numero_comercial")
            if numero_comercial:
                relatorio = montar_relatorio_fechamento(
                    nome=nome_prospect,
                    phone=phone,
                    nps=novo_estado.get("nps"),
                    sugestao=novo_estado.get("sugestao"),
                    objecoes=novo_estado.get("objecoes"),
                    intent_matricula=novo_estado.get("intent_matricula"),
                )
                await evo_send_text(http_client, numero_comercial, relatorio)
                logger.info(f"[{org_id}] [{session_id}] Relatório de fechamento enviado para {numero_comercial}.")
            else:
                logger.warning(f"[{org_id}] [{session_id}] numero_comercial não configurado — relatório não enviado.")

    except Exception as e:
        logger.error(f"[{org_id}] [{session_id}] Falha no background task: {e}", exc_info=True)
    finally:
        # Limpa o buffer após processamento (seja sucesso ou erro)
        _debounce_buffer.pop(session_id, None)


# ---------------------------------------------------------------------------
# Endpoint principal
# ---------------------------------------------------------------------------

@app.post("/v1/{org_id}/conversation/{session_id}/message", status_code=202)
async def post_message(org_id: str, session_id: str, payload: PayloadMessage, request: Request):
    """
    Recebe a mensagem do cliente (via N8n) e retorna HTTP 202 IMEDIATAMENTE.
    
    A lógica de processamento (debounce → LangGraph → EVO API) roda
    em background via asyncio.create_task().
    
    Debounce de 4s por session_id:
    - Novas mensagens do mesmo session_id dentro da janela são CONCATENADAS.
    - O timer reinicia a cada mensagem nova (comportamento "trailing edge").
    - Após 4s de silêncio, o texto completo é enviado ao LangGraph.
    """
    db_pool: AsyncConnectionPool = request.app.state.db_pool
    http_client: httpx.AsyncClient = request.app.state.http_client
    graph_app = request.app.state.graph_app

    if db_pool is None or graph_app is None:
        raise HTTPException(status_code=500, detail="Banco de dados não conectado. Verifique DATABASE_URL.")

    msg_texto = payload.message.strip()
    phone = payload.phone.strip()

    logger.info(f"[{org_id}] [{session_id}] Recebido. Debounce iniciado/reiniciado.")

    # --- Debounce Logic ---
    entry = _debounce_buffer.get(session_id)

    if entry is None:
        # Primeira mensagem desta sessão na janela de debounce
        entry = DebounceEntry(phone=phone, org_id=org_id)
        _debounce_buffer[session_id] = entry
    else:
        # Cancela o timer anterior — chegou nova mensagem antes dos 4s
        if entry.task and not entry.task.done():
            entry.task.cancel()
            logger.info(f"[{org_id}] [{session_id}] Message debouncée: timer cancelado e reiniciado.")

    # Acumula o texto desta mensagem
    if msg_texto:
        entry.texts.append(msg_texto)

    # Cria nova task que aguarda 4s antes de processar
    async def _debounce_and_fire():
        await asyncio.sleep(DEBOUNCE_SECONDS)
        texto_completo = "\n".join(entry.texts)
        await _processar_conversa(
            org_id=org_id,
            session_id=session_id,
            phone=phone,
            texto_completo=texto_completo,
            db_pool=db_pool,
            http_client=http_client,
            graph_app=graph_app,
        )

    entry.task = asyncio.create_task(_debounce_and_fire())

    # Retorna 202 imediatamente — o n8n encerra aqui
    return JSONResponse(status_code=202, content={"status": "accepted"})


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/health")
async def health():
    return {"status": "ok", "version": "4.0"}
