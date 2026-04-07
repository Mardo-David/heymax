import requests

# 1. COLE O SEU NOVO HASH BASE64 (Plano PRO) AQUI
CHAVE_BASE64 = "dHJlbm9hY2FkZW1pYTpEMDYxQkNBNC1GMDY5LTQzOTMtQkMxNS0xMzE3NzIzNTUwNEE="

# O seu ID real na Treno que descobrimos no teste do CPF
ID_MEMBER = "7601" 

url = "https://evo-integracao-api.w12app.com.br/api/v2/workout/default-client-workout"

params = {
    "idMember": ID_MEMBER,
    "idBranch": "1"
}

headers = {
    "Authorization": f"Basic {CHAVE_BASE64}",
    "Accept": "application/json"
}

print(f"🏋️ Buscando o treino do aluno ID {ID_MEMBER} na EVO...")
try:
    resp = requests.get(url, headers=headers, params=params, timeout=15)
    print(f"\n🎯 Status HTTP: {resp.status_code}")
    print(f"📦 Resposta Bruta do Servidor:\n{resp.text}\n")
except Exception as e:
    print(f"\n❌ Erro de conexão: {e}")