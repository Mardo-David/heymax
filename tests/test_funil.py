"""
Script de teste isolado para a Tool consultar_treino_aluno.
Não aciona o LangGraph inteiro nem o webhook. Testa apenas a extração de dados da EVO.
"""

import asyncio
import os
import sys
import httpx
from dotenv import load_dotenv
from psycopg_pool import AsyncConnectionPool

from tools.evo_api import consultar_treino_aluno

load_dotenv()

# ==========================================
# CONFIGURAÇÕES DE TESTE
# ==========================================
TEST_ORG_ID = "treno-paulo-afonso" 
TEST_PHONE = "5581998886610"  
# ==========================================

async def run_test():
    print("Iniciando teste da Tool consultar_treino_aluno...\n")
    
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("❌ ERRO: DATABASE_URL não encontrado no .env")
        return

    if "sslmode=" not in db_url:
        db_url += "?sslmode=require" if "?" not in db_url else "&sslmode=require"

    print("1. Inicializando conexões (simulando o FastAPI)...")
    # Adicionado open=False para remover o warning e alinhar com produção
    pool = AsyncConnectionPool(db_url, min_size=1, max_size=2, kwargs={"autocommit": True}, open=False)
    await pool.open()
    client = httpx.AsyncClient()

    try:
        print(f"2. Preparando injeção de dependências para org_id: {TEST_ORG_ID}")
        config = {
            "configurable": {
                "httpx_client": client,
                "db_pool": pool
            }
        }
        
        tool_input = {
            "phone": TEST_PHONE,
            "org_id": TEST_ORG_ID
        }

        print(f"3. Executando a tool para o telefone: {TEST_PHONE}...")
        
        resultado = await consultar_treino_aluno.ainvoke(tool_input, config=config)
        
        print("\n✅ RESULTADO RETORNADO PELA TOOL:\n")
        print("="*50)
        print(resultado)
        print("="*50)

    except Exception as e:
        print(f"\n❌ ERRO DURANTE A EXECUÇÃO: {e}")
        
    finally:
        print("\nEncerrando conexões...")
        await client.aclose()
        await pool.close()

if __name__ == "__main__":
    # Ajuste cirúrgico para o Windows rodar o psycopg3 assíncrono
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(run_test())