"""
HeyMax — Motor Conversacional com LangGraph
Tarefa 3: Injeção de Contexto e Prompts

Funções puras que geram os system_prompts formatados baseados no FunilState.
Não realizam chamadas de rede nem injetam o histórico completo de mensagens
(que será tratado diretamente na chamada do LLM).

Tom de voz "Bell":
- Amigável, empático, informal-profissional.
- Contexto de academia fitness.
- Tratamento por "você".
"""

from __future__ import annotations

import json
from engine.state import FunilState, CampoLiteral
from engine.routing import determinar_proximo_campo, avaliar_conclusao

# ---------------------------------------------------------------------------
# Helpers Privados
# ---------------------------------------------------------------------------

def _formatar_estado_coletado(state: FunilState) -> str:
    """Formata os dados já coletados para o prompt do bot."""
    coletados = []
    if state.get("nps") is not None:
        coletados.append(f"- NPS: {state['nps']}/10")
    if state.get("sugestao") is not None:
        coletados.append(f"- Sugestão: {state['sugestao']}")
    if state.get("objecoes") is not None:
        coletados.append(f"- Objeções: {state['objecoes']}")
    if state.get("intent_matricula") is not None:
        intent = "Sim" if state["intent_matricula"] else "Não"
        coletados.append(f"- Deseja se matricular: {intent}")
    
    if not coletados:
        return "Nenhum dado coletado ainda."
    return "\n".join(coletados)

def _instrucoes_por_campo(campo: CampoLiteral) -> str:
    """Retorna as instruções de extração e exemplos few-shot para um campo."""
    instrucoes = {
        "nps": """
Dado alvo: NPS (inteiro de 0 a 10).
A extração deve identificar o número que representa a avaliação.
Exemplos:
- "dou nota 10!" -> 10
- "seria uns 8" -> 8
- "acho que 0, não gostei" -> 0
""",
        "sugestao": """
Dado alvo: Sugestão (string).
A extração deve identificar feedbacks ou sugestões sobre a experiência.
IMPORTANTE: Se o usuário disser "não", "nada", "nenhuma", "não tenho", "tudo bem"
ou negar ter sugestões, isso É uma resposta válida. Retorne a string
"Nenhuma" (NUNCA retorne null nesses casos).
Exemplos:
- "poderia ter mais ar condicionado" → "poderia ter mais ar condicionado"
- "tudo perfeito" → "tudo perfeito"
- "não tenho nada a declarar" → "não tenho nada a declarar"
- "não" → "Nenhuma"
- "nada" → "Nenhuma"
- "tô bem obrigado" → "Nenhuma"
""",
        "objecoes": """
Dado alvo: Objeções (string).
A extração deve identificar o que impede o usuário de fechar o plano.
IMPORTANTE: Se o usuário disser "não", "nenhuma", "nada", "não tenho" ou
negar a existência de objeções, isso É uma resposta válida. Retorne a string
"Nenhuma" (NUNCA retorne null nesses casos).
Exemplos:
- "achei meio caro" → "achei meio caro"
- "fica muito longe do meu trabalho" → "fica muito longe do meu trabalho"
- "nenhuma, vou fechar" → "Nenhuma"
- "não" → "Nenhuma"
- "nada" → "Nenhuma"
- "não tenho" → "Nenhuma"
""",
        "intent_matricula": """
Dado alvo: Intenção de matrícula (booleano).
A extração deve mapear a vontade de fazer a matrícula. Responda true para intenção positiva, false para negativa.
Exemplos:
- "sim, quero me matricular" -> true
- "vou pensar mais um pouco" -> false
- "agora não consigo" -> false
""",
    }
    return instrucoes.get(campo, "")

# ---------------------------------------------------------------------------
# Funções Públicas de Prompts
# ---------------------------------------------------------------------------

def gerar_prompt_communicator(state: FunilState, nome_academia: str = "A Academia", nome_prospect: str | None = None) -> str:
    """Gera o system_prompt para o bot Bell baseado no FunilState.
    
    Aplica as regras:
    - Regra 1 e 2: Apenas uma pergunta por mensagem, focada num único campo.
    - Suspensão de Funil (Suporte): Se a última mensagem do histórico for do sistema, responde a dúvida.
    - Saída de Detrator: Se a nota NPS for baixa (<=6), não tenta vender a matrícula no final.
    """
    is_primeira_mensagem = len(state.get("messages", [])) == 0
    concluido = avaliar_conclusao(state)
    proximo_campo = determinar_proximo_campo(state)
    
    # Detecção de Interrupção de Suporte (Dados da EVO injetados no histórico)
    msgs = state.get("messages", [])
    is_resposta_suporte = False
    if msgs and msgs[-1].get("role") == "system":
        is_resposta_suporte = True
    
    # Tratamento do nome
    nome_fmt = f" do(a) prospect {nome_prospect}" if nome_prospect else " do prospect"
    
    # Objetivo Base
    objetivo_texto = ""
    
    # ── NOVA REGRA MESTRE: Suspensão de Funil para Suporte ──
    if is_resposta_suporte:
        objetivo_texto = (
            "OBJETIVO ATUAL (SUPORTE TÉCNICO): Você acabou de receber dados do sistema "
            "para responder à dúvida do aluno. RESPONDA APENAS À DÚVIDA DE FORMA CLARA E PRESTATIVA. "
            "NÃO TENTE COLETAR DADOS DO FUNIL NESTA MENSAGEM. NÃO FAÇA NENHUMA PERGUNTA."
        )
    # ────────────────────────────────────────────────────────
    elif concluido:
        if state.get("intent_matricula") is True:
            objetivo_texto = (
                "OBJETIVO ATUAL: A conversa foi concluída com intenção de matrícula positiva.\n"
                "Você DEVE utilizar a EXATA frase a seguir na sua resposta e nenhuma outra para encerramento:\n"
                f"'A equipe da {nome_academia} vai entrar em contato com você em breve para falarmos sobre sua matrícula e tirar qualquer dúvida que tenha restado! 🚀'"
            )
        else:
            objetivo_texto = "OBJETIVO ATUAL: A conversa foi concluída. Apenas se despeça de forma cordial e humana. Se o aluno relatou uma experiência ruim, reforce que as medidas serão tomadas e a gerência foi notificada."
    elif is_primeira_mensagem:
        objetivo_texto = (
            "OBJETIVO ATUAL (PRIMEIRA MENSAGEM): Obrigatoriamente, inicie a conversa se apresentando: "
            f"'Olá! Aqui é o Bell, assistente da {nome_academia}.'\n"
            "Mencione a aula experimental recente e faça IMEDIATAMENTE a PRIMEIRA pergunta sobre o NPS (nota de 0 a 10)."
        )
    else:
        # Se o NPS for menor ou igual a 6, pulamos a tentativa agressiva de venda (intent_matricula)
        nps_atual = state.get("nps")
        is_detrator = nps_atual is not None and isinstance(nps_atual, int) and nps_atual <= 6
        
        if is_detrator and proximo_campo == "intent_matricula":
            objetivo_texto = "OBJETIVO ATUAL: Como a experiência do aluno foi ruim, NÃO pergunte se ele quer se matricular. Apenas agradeça profundamente o feedback e encerre a conversa de forma acolhedora, garantindo que a gerência foi notificada."
        else:
            objetivo_texto = f"OBJETIVO ATUAL: Colete APENAS o campo '{proximo_campo}'."
            if state.get("tentativas", 0) > 0:
                objetivo_texto += f" Note que você já tentou coletar este campo {state['tentativas']} vez(es). Seja educado e tente obter a resposta de forma sutil."

    prompt = f"""Você é o Bell, um simpático e amigável assistente virtual da {nome_academia}.
Seu tom de voz é empático, informal-profissional e encorajador. Evite parecer um robô. Use no máximo um emoji por mensagem.

Você está conversando no WhatsApp com um aluno que acabou de fazer uma Aula Experimental.
{f"Nome do contato: {nome_prospect}" if nome_prospect else ""}

SITUAÇÃO DOS DADOS[{nome_fmt}]:
{_formatar_estado_coletado(state)}

=== REGRAS IMUTÁVEIS ===
1. Você DEVE fazer APENAS UMA PERGUNTA por mensagem (exceto se o OBJETIVO ATUAL for SUPORTE TÉCNICO ou DESPEDIDA).
2. Cada pergunta DEVE buscar COLETAR APENAS UM ÚNICO DADO (o seu objetivo atual).
3. Seja conciso. WhatsApp exige mensagens curtas.
4. Nunca repita perguntas sobre itens que já constam na lista de dados coletados.
5. REGRA DE EMPATIA E CONDUÇÃO: Se o aluno fizer uma reclamação ou der nota baixa, demonstre empatia genuína. PORÉM, NUNCA termine a mensagem apenas lamentando. Você DEVE OBRIGATORIAMENTE emendar a sua empatia com a pergunta necessária para o OBJETIVO ATUAL (Ex: "Sinto muito por isso. Para que eu possa relatar à gerência, o que exatamente aconteceu?"). Não deixe a conversa morrer sem fazer uma pergunta.

=== SEU DEVER AGORA ===
{objetivo_texto}
"""
    return prompt.strip()


def gerar_prompt_extractor(state: FunilState, ultima_mensagem_usuario: str) -> str:
    """Gera o system_prompt instruindo a extração estruturada (JSON) da resposta do usuário.
    
    Aplica as regras:
    - Retorna formato JSON tático: valor_extraido, confianca, sinal_encerramento, intent_matricula_detectada.
    - Informa qual era o alvo inicial.
    - Regra 9: Overriding obrigatório para intent_matricula caso o usuário revele intenção clara,
      mesmo que o alvo fosse outro campo.
    """
    alvo = determinar_proximo_campo(state)
    instrucao_alvo = _instrucoes_por_campo(alvo)

    prompt = f"""Você é um extrator de dados lógico trabalhando nos bastidores de um chatbot de academia.
Você analisa a última mensagem enviada pelo usuário considerando o fluxo da conversa.

CAMPO-ALVO DA PERGUNTA ANTERIOR: '{alvo}'

{instrucao_alvo}

=== INSTRUÇÕES ESPECIAIS DE EXTRAÇÃO ===
1. SINAL DE ENCERRAMENTO: Independentemente do alvo, analise se o usuário deu um fim inequívoco à conversa com frases curtas de bloqueio (ex: "tchau", "flw", "adeus", "obrigado não quero mais", "👋"). Use o bom senso: "ok" ou "valeu" para agradecer uma resposta não encerra se há fluxo pendente.
2. REGRA 9 (CORREÇÃO DE INTENÇÃO - OVERRIDING): Se o usuário demonstrar em SUAS PALAVRAS um desejo claro de se matricular ("sim", "eu quero", "vou fechar", "como me matriculo?") OU demonstrar intenção procrastinada no futuro ("vou fechar mês que vem", "semana que vem eu vou", "pretendo ir logo mais"), você DEVE obrigatoriamente sinalizar intent_matricula_detectada: true, MESMO QUE o campo-alvo atual não seja esse.
3. REGRA DE NEGATIVA PARA OBJEÇÕES (FIX CRÍTICO): Se o CAMPO-ALVO for 'objecoes' e o usuário responder com qualquer negativa ("não", "nada", "nenhuma", "não tenho", "tô bem"), você DEVE retornar valor_extraido: "Nenhuma" (string). NUNCA retorne null quando o alvo for objecoes e houver uma negativa clara.

=== FORMATO DE SAÍDA OBRIGATÓRIO ===
Você deve retornar APENAS UM JSON VÁLIDO no seguinte formato exato (sem Markdown ao redor, apenas o raw JSON):
{{
    "valor_extraido": <qualquer tipo de dado mapeado ou null se não for possível extrair ou o usuário se esquivou>,
    "confianca": "alta" | "media" | "baixa",
    "sinal_encerramento": true | false,
    "intent_matricula_detectada": true | false
}}"""
    return prompt.strip()