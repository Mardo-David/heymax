"""
HeyMax — Motor Conversacional com LangGraph
Tarefa 5: Integração com LLMs Reais (LangChain)

Abstração das chamadas às APIs dos LLMs (Gemini e Claude).
- O comunicador usa conversão de lista de dicts para BaseMessage do LangChain,
  com fallback automático para o Claude em caso de falha do Gemini.
- O extrator usa `with_structured_output` do Gemini para garantir que o retorno
  bata com a estrutura Pydantic definida.
"""

from __future__ import annotations

import os
from typing import Literal

from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, BaseMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_anthropic import ChatAnthropic
from pydantic import BaseModel, Field

# Carrega as variáveis de ambiente (ex: .env local) se o pacote estiver disponível
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


# ---------------------------------------------------------------------------
# Schema de Extração (Pydantic)
# ---------------------------------------------------------------------------

class ExtracaoDados(BaseModel):
    """Schema estruturado para a extração da resposta do usuário."""
    # Tipagem estrita de união para suportar NPS (int), intent (bool) ou textos (str) e nulos.
    valor_extraido: int | str | bool | None = Field(
        description="O dado principal extraído (ex: a nota, o texto da sugestão, ou o booleano de intenção). null se não respondido."
    )
    confianca: Literal["alta", "media", "baixa"] = Field(
        description="O grau de certeza do LLM nesta extração."
    )
    sinal_encerramento: bool = Field(
        description="True se o usuário usou palavras explícitas de despedida/bloqueio (ex: tchau, pare)."
    )
    intent_matricula_detectada: bool = Field(
        description="True se a Regra 9 foi acionada (usuário quer se matricular)."
    )


# ---------------------------------------------------------------------------
# Instanciamento Lazy dos Modelos
# ---------------------------------------------------------------------------

_gemini_instance = None
_claude_instance = None

def _get_gemini() -> ChatGoogleGenerativeAI:
    global _gemini_instance
    if _gemini_instance is None:
        _gemini_instance = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.7
        )
    return _gemini_instance

def _get_claude() -> ChatAnthropic:
    global _claude_instance
    if _claude_instance is None:
        _claude_instance = ChatAnthropic(
            model_name="claude-sonnet-4-6",
            temperature=0.7
        )
    return _claude_instance


# ---------------------------------------------------------------------------
# Formatadores
# ---------------------------------------------------------------------------

def _converter_historico_para_langchain(prompt_sistema: str, historico: list[dict]) -> list[BaseMessage]:
    """Converte o histórico raw de dicts para objetos Message do LangChain."""
    messages: list[BaseMessage] = [SystemMessage(content=prompt_sistema)]
    for msg in historico:
        if msg.get("role") == "user":
            messages.append(HumanMessage(content=msg.get("content", "")))
        elif msg.get("role") == "assistant":
            messages.append(AIMessage(content=msg.get("content", "")))
    return messages


# ---------------------------------------------------------------------------
# Funções Públicas (Core)
# ---------------------------------------------------------------------------

async def chamar_llm_comunicador(prompt_sistema: str, mensagens_historico: list[dict], nome_modelo: str = "gemini") -> str:
    """Gera a mensagem do bot (Bell).
    
    Tenta invocar o Gemini como padrão. Se ocorrer qualquer erro de API, 
    repasse (fallback) automaticamente para o Claude.
    """
    messages_lc = _converter_historico_para_langchain(prompt_sistema, mensagens_historico)
    
    try:
        # Padrão: Gemini
        gemini = _get_gemini()
        response = await gemini.ainvoke(messages_lc)
        return str(response.content)
    except Exception as e:
        print(f"[LLM FALLBACK] Falha no Gemini: {e}. Tentando Claude...")
        try:
            # Fallback: Claude
            claude = _get_claude()
            response = await claude.ainvoke(messages_lc)
            return str(response.content)
        except Exception as fallback_err:
            print(f"[LLM ERROR] Falha no Claude (Fallback): {fallback_err}")
            raise fallback_err


async def chamar_llm_extrator(prompt_sistema: str, ultima_mensagem: str) -> dict:
    """Extrai os dados da mensagem do usuário retornando um dicionário formatado.
    
    Usa o Gemini 2.5 Flash via `with_structured_output` forçando a compatibilidade
    com o schema Pydantic `ExtracaoDados`.
    """
    gemini = _get_gemini()
    # O structured output amarra o schema na API do Gemini
    chain = gemini.with_structured_output(ExtracaoDados)
    
    messages_lc = [
        SystemMessage(content=prompt_sistema),
        HumanMessage(content=ultima_mensagem)
    ]
    
    try:
        resultado = await chain.ainvoke(messages_lc)
        # Retorna o dicionário puro formatado exatamente como o Pydantic definiu
        if hasattr(resultado, 'model_dump'):
            return resultado.model_dump()
        else:
            # Handle dictionary case if structured output returns a dict directly
            return resultado
    except Exception as e:
        print(f"[LLM EXTRACTOR ERROR] Falha na extração estruturada: {e}")
        # Em caso extremo de quebra da API, retorna um preenchimento seguro e nulo
        # para que o Roteador não quebre o grafo.
        return {
            "valor_extraido": None,
            "confianca": "baixa",
            "sinal_encerramento": False,
            "intent_matricula_detectada": False
        }
