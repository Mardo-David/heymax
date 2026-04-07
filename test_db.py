import os
import sys

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

def main():
    print("=" * 60)
    print("TESTE DE CONECTIVIDADE POSTGRES - LANGGRAPH")
    print("=" * 60)
    
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        print("[SKIP] Arquivo .env não contém DATABASE_URL. Teste gracioso abortado.")
        sys.exit(0)
        
    # Appends sslmode gracefully
    if "sslmode=" not in db_url:
        db_url += "?sslmode=require" if "?" not in db_url else "&sslmode=require"
    
    try:
        from psycopg_pool import ConnectionPool
        from langgraph.checkpoint.postgres import PostgresSaver
        from engine.graph import workflow
        
        print(f"[1] Testando Pool no Supabase: {db_url.split('@')[-1]}")
        with ConnectionPool(conninfo=db_url, min_size=1, max_size=10, kwargs={'autocommit': True}) as pool:
            
            print("[2] Validando setup Native Schemas no Supabase...")
            saver = PostgresSaver(pool)
            saver.setup()
            
            print("[3] Compilando Grafo Integrado...")
            app_compiled = workflow.compile(checkpointer=saver)
            
            print("[SUCCESS] Checkpointer configurado com sucesso e banco online. 🚀")
            
    except Exception as e:
        print(f"\n[FALHA] Não foi possível provisionar os schemas/persistência: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
