"""
HeyMax — Tool: Consultar Treino do Aluno via API EVO
Com Cache em 4 Níveis no PostgreSQL (Supabase).
"""

import logging
import re
from datetime import datetime, timezone, timedelta
from typing import Optional

import httpx
from langchain_core.tools import tool
from langchain_core.runnables import RunnableConfig
from psycopg_pool import AsyncConnectionPool

logger = logging.getLogger(__name__)

# TTL do cache de treino
_TTL_TREINO = timedelta(hours=6)

# Headers blindados — força a EVO a entregar pacotes simples e inteiros
_HEADERS_BASE = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "HeyMax-SaaS/1.0",
    "Connection": "close",
    "Accept-Encoding": "identity",
}

# Timeout elevado para suportar lentidão do ERP
_TIMEOUT = httpx.Timeout(connect=5.0, read=20.0, write=5.0, pool=2.0)


# ---------------------------------------------------------------------------
# Helpers de banco
# ---------------------------------------------------------------------------

async def _get_cache_local(phone: str, pool: AsyncConnectionPool) -> dict:
    """Retorna dict com dados de cache ou None se a row não existir."""
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    SELECT evo_member_id, evo_treino_cache, evo_treino_updated_at
                    FROM trial_feedback
                    WHERE phone = %s
                    LIMIT 1
                    """,
                    (phone,),
                )
                row = await cur.fetchone()
                if row:
                    return {
                        "evo_member_id": row[0],
                        "evo_treino_cache": row[1],
                        "evo_treino_updated_at": row[2],
                    }
    except Exception as e:
        logger.error(f"[CACHE] Erro ao ler cache local para phone={phone}: {e}")

    return {"evo_member_id": None, "evo_treino_cache": None, "evo_treino_updated_at": None}


async def _salvar_cache(
    phone: str,
    id_member: int,
    texto_treino: str,
    pool: AsyncConnectionPool,
) -> None:
    """Persiste o resultado da EVO no banco. Chamado APENAS em sucesso da API."""
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    UPDATE trial_feedback
                    SET
                        evo_member_id        = %s,
                        evo_treino_cache     = %s,
                        evo_treino_updated_at = CURRENT_TIMESTAMP
                    WHERE phone = %s
                    """,
                    (id_member, texto_treino, phone),
                )
        logger.info(f"[CACHE] Cache salvo para phone={phone} | id_member={id_member}")
    except Exception as e:
        logger.error(f"[CACHE] Falha ao persistir cache para phone={phone}: {e}")


async def _get_evo_credentials(
    org_id: str, pool: AsyncConnectionPool
) -> tuple[Optional[str], Optional[str], Optional[str]]:
    """Busca credenciais EVO da tabela organizations pelo slug."""
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    SELECT evo_api_key, evo_branch_id, evo_base_url
                    FROM organizations
                    WHERE slug = %s
                    LIMIT 1
                    """,
                    (org_id,),
                )
                row = await cur.fetchone()
                if row:
                    return row[0], str(row[1]), row[2]
    except Exception as e:
        logger.error(f"[EVO] Erro ao buscar credenciais para org={org_id}: {e}")

    return None, None, None


# ---------------------------------------------------------------------------
# Helpers de telefone e EVO HTTP
# ---------------------------------------------------------------------------

def _gerar_variacoes_telefone(phone: str) -> list[str]:
    """Gera as 3 variações possíveis do número para garantir match na EVO."""
    numeros = re.sub(r"\D", "", phone)
    variacoes = [numeros]
    if numeros.startswith("55") and len(numeros) >= 12:
        sem_ddi = numeros[2:]
        variacoes.append(sem_ddi)
        if len(sem_ddi) == 11:
            variacoes.append(f"({sem_ddi[:2]}) {sem_ddi[2:7]}-{sem_ddi[7:]}")
    return variacoes


def _formatar_treinos(dados_treino: dict, nome_aluno: str) -> Optional[str]:
    """Formata a resposta da EVO em texto legível. Retorna None se vazia."""
    if not isinstance(dados_treino, dict):
        return None
        
    # A EVO devolve os treinos dentro da chave 'workouts'
    lista_workouts = dados_treino.get("workouts", [])
    if not lista_workouts:
        return None
        
    linhas = []
    for w in lista_workouts:
        nome_treino = w.get("workoutName", "Treino")
        vencimento = w.get("expiryDate", "N/A")
        
        # Limpa a data para ficar só YYYY-MM-DD
        if vencimento and vencimento != "N/A":
            vencimento = vencimento[:10]
            
        # Extrai os nomes das divisões (Treino A, Treino B, etc.)
        series = w.get("series", [])
        nomes_series = [s.get("seriesName", "").strip() for s in series if s.get("seriesName")]
        str_series = f" (Séries: {', '.join(nomes_series)})" if nomes_series else ""
        
        linhas.append(f"- {nome_treino}{str_series}: vence em {vencimento}")
        
    if not linhas:
        return None
        
    return f"Treinos ativos de {nome_aluno}:\n" + "\n".join(linhas)


async def _buscar_membro_evo(
    phone: str,
    evo_base_url: str,
    evo_branch_id: str,
    headers: dict,
    client: httpx.AsyncClient,
) -> tuple[Optional[int], str]:
    """Tenta localizar o idMember na EVO pelas variações do telefone."""
    for var_phone in _gerar_variacoes_telefone(phone):
        try:
            resp = await client.get(
                f"{evo_base_url}/api/v2/members",
                params={"cellphone": var_phone, "idBranch": evo_branch_id},
                headers=headers,
                timeout=_TIMEOUT,
            )
            logger.info(f"[EVO] /members?cellphone={var_phone} → HTTP {resp.status_code}")
            if resp.status_code == 200:
                membros = resp.json()
                if isinstance(membros, list) and membros:
                    id_member = membros[0].get("idMember")
                    # Busca especificamente o firstName da EVO
                    nome = membros[0].get("firstName") or membros[0].get("name", "Aluno")
                    logger.info(f"[EVO] Membro encontrado: id={id_member} nome={nome}")
                    return id_member, nome
        except Exception as e:
            logger.error(f"[EVO] Tentativa /members falhou para phone={var_phone}: {e}")

    return None, "Aluno"


async def _buscar_treino_evo(
    id_member: int,
    evo_base_url: str,
    evo_branch_id: str,
    headers: dict,
    client: httpx.AsyncClient,
    nome_aluno: str = "Aluno",
) -> Optional[str]:
    """Busca os treinos de um aluno. Retorna texto formatado ou None."""
    try:
        resp = await client.get(
            f"{evo_base_url}/api/v2/workout/default-client-workout",
            params={"idClient": id_member, "idBranch": evo_branch_id}, # Aqui foi corrigido para idClient
            headers=headers,
            timeout=_TIMEOUT,
        )
        logger.info(f"[EVO] /workout?idClient={id_member} → HTTP {resp.status_code}")

        if resp.status_code == 200:
            dados = resp.json()
            texto = _formatar_treinos(dados, nome_aluno)
            return texto or f"O aluno {nome_aluno} não possui treinos ativos no momento."
        elif resp.status_code == 404:
            return f"O aluno {nome_aluno} não possui treinos cadastrados (Erro 404)."
        else:
            logger.error(f"[EVO] /workout retornou HTTP {resp.status_code}. Resposta: {resp.text}")
            return None  # Sinaliza falha → preservar cache antigo

    except Exception as e:
        logger.error(f"[EVO] Exceção ao buscar treino para idClient={id_member}: {e}")
        return None  # Sinaliza falha → preservar cache antigo


# ---------------------------------------------------------------------------
# Tool principal
# ---------------------------------------------------------------------------

@tool
async def consultar_treino_aluno(phone: str, org_id: str, config: RunnableConfig) -> str:
    """
    Consulta os treinos ativos e a data de vencimento de um aluno a partir do
    telefone. Usa cache local de 6h para evitar chamadas HTTP desnecessárias à EVO.
    Forneça o phone e o org_id exatos do contexto da conversa.
    """
    configurable = config.get("configurable", {})
    client: httpx.AsyncClient = configurable.get("httpx_client")
    pool: AsyncConnectionPool = configurable.get("db_pool")

    if not client or not pool:
        logger.error("[TOOL] Dependências não injetadas no RunnableConfig.")
        return "Erro interno de configuração do sistema."

    # ------------------------------------------------------------------
    # NÍVEL 1: Check de cache local
    # ------------------------------------------------------------------
    logger.info(f"[TOOL] Consultando treino — phone={phone}, org={org_id}")
    cache = await _get_cache_local(phone, pool)

    id_member_cached: Optional[int] = cache["evo_member_id"]
    treino_cached: Optional[str] = cache["evo_treino_cache"]
    updated_at: Optional[datetime] = cache["evo_treino_updated_at"]

    # ------------------------------------------------------------------
    # NÍVEL 2: Cache válido dentro do TTL → retorno imediato
    # ------------------------------------------------------------------
    if treino_cached and updated_at:
        # Garante tz-aware para comparação segura
        if updated_at.tzinfo is None:
            updated_at = updated_at.replace(tzinfo=timezone.utc)
        age = datetime.now(tz=timezone.utc) - updated_at
        if age < _TTL_TREINO:
            logger.info(f"[CACHE] HIT válido (age={age}). Retornando sem chamar a EVO.")
            return treino_cached
        else:
            logger.info(f"[CACHE] MISS — cache expirado (age={age}). Indo para a EVO.")
    else:
        logger.info("[CACHE] Sem cache local. Indo para a EVO.")

    # ------------------------------------------------------------------
    # Credenciais EVO
    # ------------------------------------------------------------------
    evo_api_key, evo_branch_id, evo_base_url = await _get_evo_credentials(org_id, pool)
    if not evo_api_key or not evo_base_url:
        return "Erro: Credenciais da academia não configuradas no sistema."

    headers = {**_HEADERS_BASE, "Authorization": f"Basic {evo_api_key}"}

    # ------------------------------------------------------------------
    # NÍVEL 3: Temos o idMember em cache → pula /members, vai direto ao treino
    # ------------------------------------------------------------------
    nome_aluno = "Aluno"

    if id_member_cached:
        logger.info(f"[CACHE] id_member {id_member_cached} em cache. Pulando /members.")
        id_member = id_member_cached
    else:
        # ------------------------------------------------------------------
        # NÍVEL 4: Fluxo HTTP completo — busca membro e depois treino
        # ------------------------------------------------------------------
        id_member, nome_aluno = await _buscar_membro_evo(
            phone, evo_base_url, evo_branch_id, headers, client
        )
        if not id_member:
            return "Não encontrei nenhum aluno matriculado com este número de telefone no sistema da academia."

    # ------------------------------------------------------------------
    # Busca do treino (usada em Nível 3 e 4)
    # ------------------------------------------------------------------
    texto_treino = await _buscar_treino_evo(
        id_member, evo_base_url, evo_branch_id, headers, client, nome_aluno
    )

    # ------------------------------------------------------------------
    # Salvamento seguro — APENAS em caso de sucesso da EVO
    # ------------------------------------------------------------------
    if texto_treino:
        await _salvar_cache(phone, id_member, texto_treino, pool)
        return texto_treino
    else:
        # Falha na EVO: retorna cache antigo se existir, senão mensagem genérica
        if treino_cached:
            logger.warning("[EVO] Falha na EVO. Retornando cache antigo como fallback.")
            return f"⚠️ (dados do último cache) {treino_cached}"
        return "Ocorreu um erro técnico temporário ao tentar acessar os treinos no sistema da academia."