# demo/agent.py

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

# ── System prompt ─────────────────────────────────────────────────────────────

def build_system_prompt(account: dict) -> str:
    nome = account.get("contact_name", "")
    academia = account.get("academy_name", "sua academia")
    objetivo = account.get("contact_goal", "aumentar retenção")

    return f"""Você é o Max, assistente comercial da HeyMax.fit.

Você está numa conversa de demonstração com {nome}, gestor da {academia}.
Objetivo declarado de {nome}: {objetivo}.

SEU PAPEL:
Você é um consultor de vendas que demonstra o HeyMax através de simulações reais.
Fale como um parceiro de negócio — direto, empático, sem enrolação.
Você conhece profundamente as dores de academias de médio porte no Brasil.

REGRAS:
- Nunca use o nome "Bell" — a IA da academia tem o nome que cada cliente escolhe
- Chame sempre o prospect pelo nome: {nome}
- Mencione sempre a academia do prospect: {academia}
- Ao simular mensagens da IA, formate como WhatsApp real: emojis, linguagem natural, não robótica
- Após cada simulação, explique o valor entregue em no máximo 2 frases
- Se o prospect fizer perguntas fora dos comandos, responda como consultor
- Nunca invente funcionalidades que o HeyMax não tem

FUNCIONALIDADES REAIS DO HEYMAX:
- Funil pós-aula experimental automático (já em produção)
- Coleta de NPS, objeção e intenção de matrícula via conversa natural
- Acompanhamento automático dos primeiros 30 dias
- Dicas fitness personalizadas pela meta do aluno
- Alerta de ausência com resumo para a gestão
- Avisos em massa via WhatsApp
- Aviso de renovação de plano 15 dias antes
- Relatório quinzenal ou mensal de presença e evolução
- FitCoins por presença — gamificação nativa da API Evo
- Mensagens de aniversário e celebração de 1 ano na academia"""


# ── Menu ──────────────────────────────────────────────────────────────────────

def build_menu(account: dict) -> str:
    nome = account.get("contact_name", "")
    academia = account.get("academy_name", "sua academia")

    return f"""👋 Olá, {nome}! Sou o Max, assistente da {academia}.

Você está numa demonstração ao vivo. 😄

Cada comando abaixo simula um momento real de comunicação com o seu aluno — eu sou a extensão da {academia} fora da {academia}.

1️⃣ /experimental
2️⃣ /primeiros30
3️⃣ /dica
4️⃣ /ausencia
5️⃣ /aviso
6️⃣ /renovacao
7️⃣ /relatorio
8️⃣ /fitcoins
9️⃣ /aniversario

📋 /menu — Voltar aqui a qualquer momento"""


# ── Comandos ──────────────────────────────────────────────────────────────────

COMMAND_PROMPTS = {
    "/experimental": "Simule a mensagem que a IA da {academia} mandou para um prospect chamado Carlos, no dia seguinte à aula experimental. Depois explique o valor em 1 frase.",

    "/primeiros30": "Simule a mensagem que a IA da {academia} mandou para uma aluna chamada Ana que foi 14 de 22 dias. Depois explique por que os primeiros 30 dias são críticos em 1 frase.",

    "/dica": "Pergunte ao {nome} qual o objetivo mais comum dos alunos dele: 1️⃣ Hipertrofia, 2️⃣ Emagrecimento ou 3️⃣ Qualidade de vida.",

    "/dica_hipertrofia": "Simule uma dica de hipertrofia que a IA da {academia} enviou para um aluno. Curta, prática, com emojis.",

    "/dica_emagrecimento": "Simule uma dica de emagrecimento que a IA da {academia} enviou para um aluno. Curta, prática, com emojis.",

    "/dica_qualidade": "Simule uma dica de qualidade de vida que a IA da {academia} enviou para um aluno. Curta, prática, com emojis.",

    "/ausencia": "Simule dois momentos: 1) mensagem empática que a IA mandou para Roberto, ausente há 8 dias na {academia}. 2) resumo automático que chegou para a gestão sobre ele.",

    "/aviso": "Simule o aviso que a IA da {academia} mandou para todos os alunos de pilates sobre mudança de horário. Depois pergunte ao {nome} qual comunicação mais consome tempo da equipe dele hoje.",

    "/renovacao": "Simule a mensagem que a IA da {academia} mandou para Fernanda, cujo plano vence em 14 dias. Tom de cuidado, não de cobrança.",

    "/relatorio": "Simule o relatório quinzenal que a IA da {academia} mandou para um aluno chamado Thiago. Inclui frequência, meta e FitCoins acumulados. Formato WhatsApp, não tabela.",

    "/fitcoins": "Simule 3 momentos: 1) crédito de FitCoins após presença. 2) celebração ao atingir 20 treinos. 3) ranking semanal dos top 3 da {academia}.",

    "/aniversario": "Simule 2 momentos: 1) mensagem de aniversário para Paulo com FitCoins de presente. 2) celebração de 1 ano na {academia} para Juliana com retrospectiva.",
}


# ── Motor ─────────────────────────────────────────────────────────────────────

class MaxAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-preview-04-17",
            temperature=0.7,
        )
        self._waiting_dica: dict[str, bool] = {}

    async def process(
        self,
        demo_id: str,
        account: dict,
        message: str,
        history: list[dict],
    ) -> str:
        msg = message.strip().lower()
        academia = account.get("academy_name", "sua academia")
        nome = account.get("contact_name", "")

        # Menu ou primeira mensagem
        if msg in ("/menu", "/start", "menu", "oi", "olá", "ola") or not history:
            self._waiting_dica.pop(demo_id, None)
            return build_menu(account)

        # Aguardando escolha de /dica
        if self._waiting_dica.get(demo_id):
            if msg in ("1", "hipertrofia"):
                self._waiting_dica.pop(demo_id)
                return await self._run_command("/dica_hipertrofia", account, history)
            elif msg in ("2", "emagrecimento"):
                self._waiting_dica.pop(demo_id)
                return await self._run_command("/dica_emagrecimento", account, history)
            elif msg in ("3", "qualidade", "qualidade de vida"):
                self._waiting_dica.pop(demo_id)
                return await self._run_command("/dica_qualidade", account, history)
            else:
                return "Digite 1️⃣ Hipertrofia, 2️⃣ Emagrecimento ou 3️⃣ Qualidade de vida 😊"

        # /dica ativa o estado de espera
        if msg == "/dica":
            self._waiting_dica[demo_id] = True
            return await self._run_command("/dica", account, history)

        # Comandos diretos
        if msg in COMMAND_PROMPTS:
            return await self._run_command(msg, account, history)

        # Conversa livre
        return await self._run_free(account, message, history)

    async def _run_command(self, key: str, account: dict, history: list[dict]) -> str:
        academia = account.get("academy_name", "sua academia")
        nome = account.get("contact_name", "")

        user_prompt = (
            COMMAND_PROMPTS[key]
            .replace("{academia}", academia)
            .replace("{nome}", nome)
        )

        messages = [SystemMessage(content=build_system_prompt(account))]
        for h in history[-6:]:
            if h["role"] == "user":
                messages.append(HumanMessage(content=h["content"]))
            else:
                messages.append(AIMessage(content=h["content"]))
        messages.append(HumanMessage(content=user_prompt))

        response = await self.llm.ainvoke(messages)
        return response.content

    async def _run_free(self, account: dict, message: str, history: list[dict]) -> str:
        messages = [SystemMessage(content=build_system_prompt(account))]
        for h in history[-6:]:
            if h["role"] == "user":
                messages.append(HumanMessage(content=h["content"]))
            else:
                messages.append(AIMessage(content=h["content"]))
        messages.append(HumanMessage(content=message))

        response = await self.llm.ainvoke(messages)
        return response.content


# Singleton
max_agent = MaxAgent()