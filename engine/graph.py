"""
HeyMax — Motor Conversacional com LangGraph
Arquitetura v2: Entry Router

Topologia do grafo:

  START ──> [entry_router] ──┬─ "extrator" ──> roteador ──> [condicao_apos_roteamento] ──┬─ "comunicador" ──> END
                             │                                                             └─ END
                             └─ "consulta_evo" ──> "comunicador" ──> END

O entry_router decide na ENTRADA se o turno é de suporte (treino/ficha) ou
de funil (NPS/coleta). Intenções de suporte pulam extrator e roteador inteiramente.
"""

from __future__ import annotations

from langgraph.graph import StateGraph, START, END
from langchain_core.runnables.config import RunnableConfig

from engine.state import FunilState
from engine.routing import (
    determinar_proximo_campo,
    avaliar_conclusao
)
from engine.prompts import (
    gerar_prompt_communicator,
    gerar_prompt_extractor
)
from engine.llm import (
    chamar_llm_comunicador,
    chamar_llm_extrator
)
from tools.evo_api import consultar_treino_aluno


# ---------------------------------------------------------------------------
# Constantes compartilhadas
# ---------------------------------------------------------------------------

_TERMOS_SUPORTE = [
    "meu treino", "minha ficha", "treino vence", "ficha vencida",
    "exercício de hoje", "muda meu treino", "vencimento da ficha",
]


def _msg_usuario_pede_suporte(state: FunilState) -> bool:
    """Retorna True se a última mensagem do usuário contém intenção de suporte."""
    msgs = state.get("messages", [])
    if not msgs:
        return False
    ultima = msgs[-1]
    if ultima.get("role") != "user":
        return False
    texto = ultima.get("content", "").lower()
    return any(t in texto for t in _TERMOS_SUPORTE)


# ---------------------------------------------------------------------------
# Entry Router — decide o caminho logo após o START
# ---------------------------------------------------------------------------

def entry_router(state: FunilState) -> str:
    """
    Roteador de entrada: avalia a PRIMEIRA mensagem do turno atual.

    - Se a sessão já foi concluída/encerrada num turno anterior, 
      ignora qualquer nova mensagem do usuário e morre aqui (END).
    - Intenção de suporte (treino/ficha)  →  consulta_evo  (pula extrator/roteador)
    - Qualquer outra mensagem             →  extrator       (fluxo normal de funil)
    """
    if state.get("concluido") or state.get("encerrando"):
        print("[ENTRY ROUTER] Sessão já concluída anteriormente → END")
        return END

    if _msg_usuario_pede_suporte(state):
        print("[ENTRY ROUTER] Intenção de suporte detectada → consulta_evo")
        return "consulta_evo"
    return "extrator"

# ---------------------------------------------------------------------------
# Nós do Grafo
# ---------------------------------------------------------------------------

async def node_extrator(state: FunilState) -> dict:
    """Nó do LLM Extrator (Gemini Structured Output).

    Só é atingido para mensagens de funil (NPS, sugestão, objeções, matrícula).
    Ignora silenciosamente pings vazios ou mensagens do assistente.
    """
    if not state.get("messages"):
        return {}

    ultima_mensagem = state["messages"][-1]
    if ultima_mensagem.get("role") != "user":
        return {}

    msg_texto = ultima_mensagem.get("content", "")
    alvo_atual = determinar_proximo_campo(state)

    prompt_extractor = gerar_prompt_extractor(state, msg_texto)

    try:
        dados_extraidos = await chamar_llm_extrator(prompt_extractor, msg_texto)
    except Exception as e:
        print(f"\n[EXTRATOR CRITICAL] Falha total na extração estruturada: {e}")
        return {"tentativas": state.get("tentativas", 0) + 1}

    print(f"\n[LLM EXTRATOR] Extração concluída: {dados_extraidos}")

    update_dict = {}

    # Encerramento forçado
    if dados_extraidos.get("sinal_encerramento"):
        update_dict["encerrando"] = True
        return update_dict

    # Regra 9 (Overriding Intent Matrícula)
    if dados_extraidos.get("intent_matricula_detectada"):
        update_dict["intent_matricula"] = True

    # Preenchimento do Campo-Alvo
    valor = dados_extraidos.get("valor_extraido")
    if valor is not None:
        if isinstance(valor, str) and str(valor).strip() == "":
            update_dict["tentativas"] = state.get("tentativas", 0) + 1
        else:
            update_dict[alvo_atual] = valor
            update_dict["tentativas"] = 0
    else:
        update_dict["tentativas"] = state.get("tentativas", 0) + 1

    return update_dict


def node_roteador(state: FunilState) -> dict:
    """Nó determinístico. Atualiza conclusões baseadas nas inserções."""
    concluido = avaliar_conclusao(state)
    prox = determinar_proximo_campo(state)

    return {
        "concluido": concluido,
        "proximo_campo": prox,
    }


async def node_comunicador(state: FunilState, config: RunnableConfig) -> dict:
    """Nó do LLM Comunicador (Bot Bell).

    Usado tanto no fluxo de funil quanto após o consulta_evo.
    Todo dado coletado pela EVO já estará no histórico de messages como
    mensagem de sistema, permitindo que a LLM formule a resposta no contexto certo.
    """
    nome_academia = config.get("configurable", {}).get("nome_academia", "A Academia")
    nome_prospect = config.get("configurable", {}).get("nome_prospect", "Aluno")

    prompt = gerar_prompt_communicator(state, nome_academia=nome_academia, nome_prospect=nome_prospect)

    print("\n[LLM BELL] Elaborando resposta baseada no estado...")

    mensagens_para_llm = state.get("messages", [])
    if not mensagens_para_llm:
        # Injeção Dummy — burla restrições das APIs que exigem ≥1 HumanMessage
        mensagens_para_llm = [{"role": "user", "content": "Olá, por favor, inicie o atendimento se apresentando."}]

    try:
        resposta_texto = await chamar_llm_comunicador(prompt, mensagens_para_llm)
    except Exception as e:
        print(f"\n[COMUNICADOR CRITICAL] Falha de conexão: {e}")
        resposta_texto = "Parece que minha conexão não tá muito boa agora, desculpe! Pode repetir o que você disse?"

    nova_mensagem = {"role": "assistant", "content": resposta_texto}
    return {"messages": state.get("messages", []) + [nova_mensagem]}


async def node_consulta_evo(state: FunilState, config: RunnableConfig) -> dict:
    """Nó de suporte: consulta treinos na EVO e injeta o resultado no histórico.

    CRÍTICO: config=config é repassado explicitamente para a tool porque NÃO
    usamos ToolNode — sem isso, httpx_client e db_pool chegam None na tool.

    Fluxo após este nó: → comunicador (hardcoded na edge do grafo).
    O comunicador lerá a mensagem de sistema com [DADOS DO TREINO DO ALUNO] e
    formulará uma resposta humanizada para o aluno.
    """
    configurable = config.get("configurable", {})
    phone = state.get("phone") or configurable.get("phone", "")
    org_id = configurable.get("org_id", "")

    if not phone or not org_id:
        print("[EVO NÓ] phone ou org_id ausentes no config — retorna sem consultar.")
        msg_erro = {"role": "system", "content": "[DADOS DO TREINO DO ALUNO]\nNão foi possível identificar o aluno para consultar os treinos."}
        return {"messages": state.get("messages", []) + [msg_erro]}

    print(f"[EVO NÓ] Consultando treino para phone={phone}, org={org_id}")
    try:
        resultado: str = await consultar_treino_aluno.ainvoke(
            {"phone": phone, "org_id": org_id},
            config=config,  # ← repasse obrigatório do RunnableConfig completo
        )
    except Exception as e:
        print(f"[EVO NÓ] Falha ao invocar tool: {e}")
        resultado = "Não consegui acessar os dados do treino neste momento."

    msg_evo = {"role": "system", "content": f"[DADOS DO TREINO DO ALUNO]\n{resultado}"}
    return {"messages": state.get("messages", []) + [msg_evo]}


# (condicao_apos_roteamento foi removida. O roteador agora aponta sempre para o comunicador)
# ---------------------------------------------------------------------------
# Construção do Grafo
# ---------------------------------------------------------------------------

workflow = StateGraph(FunilState)

# Nós
workflow.add_node("extrator",     node_extrator)
workflow.add_node("roteador",     node_roteador)
workflow.add_node("consulta_evo", node_consulta_evo)
workflow.add_node("comunicador",  node_comunicador)

# Edges
workflow.add_conditional_edges(START, entry_router)           # Entry router na entrada
workflow.add_edge("extrator",     "roteador")
workflow.add_edge("roteador",     "comunicador")              # Roteador sempre passa pro comunicador
workflow.add_edge("consulta_evo", "comunicador")              # EVO sempre passa pelo comunicador
workflow.add_edge("comunicador",  END)

# App compilado (sem checkpointer aqui — é adicionado no lifespan do FastAPI)
app = workflow.compile()
