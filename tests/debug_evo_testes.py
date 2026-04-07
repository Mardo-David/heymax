import requests

# 1. COLE AQUI O HASH BASE64 QUE ESTÁ NO SEU SUPABASE (Treno)
CHAVE_BASE64 = "dHJlbm9hY2FkZW1pYTpEMDYxQkNBNC1GMDY5LTQzOTMtQkMxNS0xMzE3NzIzNTUwNEE="

# 2. COLOQUE O CPF DO EDGAR AQUI (Apenas números, sem pontos ou traços)
TEST_CPF = "75524899520"

headers = {
    "Authorization": f"Basic {CHAVE_BASE64}",
    "Accept": "application/json",
    "User-Agent": "HeyMax-SaaS/1.0"
}

base_url = "https://evo-integracao-api.w12app.com.br"

print("🚀 INICIANDO BATERIA DE 3 TESTES NA API DA EVO...\n")

# ==========================================
# TESTE 1: Buscar por CPF (Document)
# ==========================================
print("--- TESTE 1: Buscar por CPF (document) ---")
url_cpf = f"{base_url}/api/v2/members"
params_cpf = {"document": TEST_CPF, "idBranch": "1"}
try:
    resp1 = requests.get(url_cpf, headers=headers, params=params_cpf, timeout=20)
    print(f"🎯 Status HTTP: {resp1.status_code}")
    print(f"📦 Resposta: {resp1.text[:300]}...\n") # Imprime só os primeiros 300 caracteres
except Exception as e:
    print(f"❌ Erro: {e}\n")

# ==========================================
# TESTE 2: Buscar sem filtro com paginação (take=1)
# ==========================================
print("--- TESTE 2: Buscar sem filtro (take=1) ---")
url_take = f"{base_url}/api/v2/members"
params_take = {"take": "1", "skip": "0", "idBranch": "1"}
try:
    resp2 = requests.get(url_take, headers=headers, params=params_take, timeout=20)
    print(f"🎯 Status HTTP: {resp2.status_code}")
    print(f"📦 Resposta: {resp2.text[:300]}...\n")
except Exception as e:
    print(f"❌ Erro: {e}\n")

# ==========================================
# TESTE 3: Endpoint alternativo de clientes ativos
# ==========================================
print("--- TESTE 3: Endpoint alternativo (management) ---")
url_mgmt = f"{base_url}/api/v2/management/activeclients"
# Adicionei um limitador aqui também para evitar que este endpoint capote
params_mgmt = {"idBranch": "1", "take": "1", "skip": "0"} 
try:
    resp3 = requests.get(url_mgmt, headers=headers, params=params_mgmt, timeout=20)
    print(f"🎯 Status HTTP: {resp3.status_code}")
    print(f"📦 Resposta: {resp3.text[:300]}...\n")
except Exception as e:
    print(f"❌ Erro: {e}\n")