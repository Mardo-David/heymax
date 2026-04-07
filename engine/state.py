"""
HeyMax — Motor Conversacional com LangGraph
Tarefa 1: Modelagem de Estado do Funil Pós-Aula Experimental

Este módulo define o estado explícito e determinístico da conversa.
Cada campo foi especificado no documento de contexto e segue a ordem
de coleta imutável: nps → sugestao → objecoes → intent_matricula.

Notas de design:
- TypedDict garante checagem estática sem overhead de runtime.
- `proximo_campo` usa Literal para restringir valores válidos na
  máquina de estados.
- `messages` usa list[dict] simples nesta etapa; será migrado para
  o padrão de reducer do LangGraph na etapa de integração.
- `tentativas` conta por campo (reseta ao avançar para o próximo),
  permitindo detecção de não-cooperação por campo individual.
- `encerrando` ≠ `concluido`:
    encerrando = sinal inequívoco detectado (estado intermediário)
    concluido  = conversa finalizada (dados coletados OU encerramento processado)
"""

from __future__ import annotations

from typing import Literal, TypedDict


# ---------------------------------------------------------------------------
# Constantes
# ---------------------------------------------------------------------------

# Campos coletáveis na ordem IMUTÁVEL de coleta.
# Nunca pular ordem. Nunca coletar dois campos na mesma mensagem.
CAMPOS_COLETAVEIS = ("nps", "sugestao", "objecoes", "intent_matricula")

# Tipo literal para `proximo_campo`.
# Inclui os 4 campos coletáveis + "concluido" (estado terminal).
CampoLiteral = Literal[
    "nps",
    "sugestao",
    "objecoes",
    "intent_matricula",
    "concluido",
]

# Ordem de coleta como tupla imutável (referência canônica).
# Usada pelos nós do grafo para determinar a transição de campo.
ORDEM_COLETA: tuple[CampoLiteral, ...] = (
    "nps",
    "sugestao",
    "objecoes",
    "intent_matricula",
)


# ---------------------------------------------------------------------------
# Estado da conversa
# ---------------------------------------------------------------------------

class FunilState(TypedDict):
    """Estado explícito e determinístico do funil pós-aula experimental.

    Todos os campos são obrigatórios no TypedDict. Campos de coleta
    (nps, sugestao, objecoes, intent_matricula) iniciam como None e
    são preenchidos ao longo da conversa, um por vez, na ordem definida
    em ORDEM_COLETA.
    """

    # --- Identificação da sessão ---

    # UUID único da sessão de conversa (gerado na abertura do funil).
    session_id: str

    # Telefone do prospect no formato E.164 (ex: "+5511999998888").
    phone: str

    # --- Histórico de mensagens ---

    # Lista de mensagens trocadas na conversa.
    # Cada mensagem é um dict com chaves "role" ("user" | "assistant")
    # e "content" (texto da mensagem).
    # Nota: será migrado para o reducer de mensagens do LangGraph
    # na etapa de integração com o framework.
    messages: list[dict[str, str]]

    # --- Campos de coleta (ordem imutável) ---

    # 1. NPS: nota de 0 a 10 sobre a experiência na aula experimental.
    #    None = ainda não coletado.
    nps: int | None

    # 2. Sugestão: feedback aberto sobre o que pode melhorar.
    #    None = ainda não coletado.
    sugestao: str | None

    # 3. Objeções: motivos que impedem a matrícula.
    #    None = ainda não coletado.
    objecoes: str | None

    # 4. Intenção de matrícula: se o prospect pretende se matricular.
    #    None = ainda não coletado.
    #    Regra de overriding: se atualmente False mas o usuário expressar
    #    desejo claro ("sim", "quero", "vou"), a nova extração (True)
    #    deve prevalecer obrigatoriamente.
    intent_matricula: bool | None

    # --- Controle de fluxo ---

    # Próximo campo a ser coletado. Avança conforme ORDEM_COLETA.
    # Quando todos forem coletados, assume "concluido".
    proximo_campo: CampoLiteral

    # Contador de tentativas de coleta do campo ATUAL.
    # Reseta para 0 ao avançar para o próximo campo.
    # Útil para detecção de não-cooperação.
    tentativas: int

    # Sinal inequívoco de encerramento detectado ("tchau", "flw", "👋").
    # Estado intermediário: a conversa ainda precisa ser processada/finalizada.
    encerrando: bool

    # Conversa finalizada. True quando:
    #   - todos os 4 campos foram coletados, OU
    #   - o encerramento por sinal inequívoco foi processado.
    # Após concluido=True, nenhuma nova interação deve ocorrer.
    concluido: bool


# ---------------------------------------------------------------------------
# Factory
# ---------------------------------------------------------------------------

def criar_estado_inicial(session_id: str, phone: str) -> FunilState:
    """Cria um estado inicial com defaults corretos para uma nova conversa.

    Args:
        session_id: UUID único da sessão.
        phone: Telefone do prospect (formato E.164).

    Returns:
        FunilState com todos os campos de coleta como None,
        proximo_campo apontando para o primeiro da ordem ("nps"),
        e contadores/flags zerados.
    """
    return FunilState(
        session_id=session_id,
        phone=phone,
        messages=[],
        nps=None,
        sugestao=None,
        objecoes=None,
        intent_matricula=None,
        proximo_campo="nps",
        tentativas=0,
        encerrando=False,
        concluido=False,
    )
