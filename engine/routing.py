"""
HeyMax — Motor Conversacional com LangGraph
Lógica de Roteamento e Transição

Funções puras que controlam o fluxo da máquina de estados.
Recebem FunilState, avaliam e retornam valores — sem efeitos colaterais.

Não há chamadas de LLM, banco de dados ou nós LangGraph neste módulo.

Decisões de design:
- `_campo_preenchido()` protege contra valores falsy do Python
  que representam dados NÃO coletados (None, "", "   "), mas aceita
  valores legítimos como `nps=0` e `intent_matricula=False`.
- `determinar_proximo_campo()` ignora o flag `encerrando` — isso é
  responsabilidade exclusiva de `avaliar_conclusao()` (SRP).

Correções v2:
- FIX 1 (Loop de objeções): objecoes="não" ou similar é tratado como
  campo válido pelo extrator (instrução no prompt) e pelo roteador aqui.
  _campo_preenchido() já aceita qualquer str não-vazia, inclusive "Nenhuma".
- FIX 2 (Curto-circuito detrator): avaliar_conclusao() retorna True
  imediatamente quando nps <= 6 e objecoes preenchido — nunca tenta
  coletar intent_matricula de um detrator.
- FIX 3 (Disjuntor de segurança): avaliar_conclusao() força conclusão
  quando len(messages) >= MAX_TURNOS, encerrando qualquer loop infinito.
"""

from __future__ import annotations

from typing import Any

from engine.state import CampoLiteral, FunilState, ORDEM_COLETA


# ---------------------------------------------------------------------------
# Constantes
# ---------------------------------------------------------------------------

# Teto de segurança: se a conversa atingir este número de mensagens
# (incluindo bot + usuário), o funil é forçado a encerrar com os dados
# que já temos. Evita loops infinitos em produção.
MAX_TURNOS = 16


# ---------------------------------------------------------------------------
# Helpers privados
# ---------------------------------------------------------------------------

def _campo_preenchido(valor: Any) -> bool:
    """Avalia se um valor de campo é considerado "coletado".

    Regras:
    - None → NÃO preenchido.
    - str vazia ou composta apenas de whitespace → NÃO preenchido.
    - int 0 → PREENCHIDO (nota zero é válida na escala 0–10).
    - bool False → PREENCHIDO (resposta legítima para intent_matricula).
    - Qualquer outro valor não-None → PREENCHIDO.
    """
    if valor is None:
        return False

    # Strings vazias ou só whitespace não contam como coletadas.
    # Guarda defensiva contra bugs de extração do LLM.
    if isinstance(valor, str) and not valor.strip():
        return False

    # int 0 e bool False passam aqui (não são None nem str vazia).
    return True


def _nps_detrator(state: FunilState) -> bool:
    """Retorna True se o NPS coletado classifica o prospect como detrator (≤ 6)."""
    nps = state.get("nps")
    return nps is not None and isinstance(nps, int) and nps <= 6


# ---------------------------------------------------------------------------
# Funções públicas de roteamento
# ---------------------------------------------------------------------------

def determinar_proximo_campo(state: FunilState) -> CampoLiteral:
    """Determina o próximo campo a ser coletado na conversa.

    Percorre a constante ORDEM_COLETA (nps → sugestao → objecoes →
    intent_matricula) e retorna o primeiro campo cujo valor no estado
    ainda não foi preenchido.

    FIX 2 — Curto-circuito detrator estendido:
    Se nps ≤ 6, avalia objecoes para se aprofundar, mas pula intent_matricula.

    Esta função NÃO considera o flag `encerrando`. A decisão de
    encerrar por sinal inequívoco é responsabilidade exclusiva de
    `avaliar_conclusao()`.
    """
    for campo in ORDEM_COLETA:
        # FIX 2: detratores (nps <= 6) nunca passam por intent_matricula, mas devem passar por objecoes para o Bell focar na queixa
        if campo == "intent_matricula" and _nps_detrator(state):
            return "concluido"

        if not _campo_preenchido(state.get(campo)):
            return campo

    return "concluido"


def avaliar_conclusao(state: FunilState) -> bool:
    """Avalia se a conversa deve ser encerrada.

    Uma conversa deve ser encerrada em exatamente quatro cenários:

    1. **Sinal inequívoco de despedida**: o flag `encerrando` é True.

    2. **Disjuntor de segurança**: len(messages) >= MAX_TURNOS — força
       encerramento independente do estado de coleta. Evita loops infinitos.

    3. **Curto-circuito detrator**: nps ≤ 6 e objecoes preenchido — a
       conversa encerra sem tentar coletar intent_matricula.

    4. **Coleta completa**: todos os campos aplicáveis possuem valores
       significativos (determinar_proximo_campo retorna "concluido").
    """
    # Cenário 1: sinal inequívoco de despedida.
    if state.get("encerrando"):
        return True

    # FIX 3 — Disjuntor de segurança: teto de turnos.
    mensagens = state.get("messages", [])
    if len(mensagens) >= MAX_TURNOS:
        return True

    # FIX 2 — Detratores precisam apenas de objecoes preenchidas para encerrar, pulando intent_matricula
    if _nps_detrator(state) and _campo_preenchido(state.get("objecoes")):
        return True

    # Cenário 4: todos os campos aplicáveis foram coletados.
    if determinar_proximo_campo(state) == "concluido":
        return True

    return False
