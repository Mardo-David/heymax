import requests

# 1. COLE AQUI O HASH BASE64 QUE ESTÁ NO SEU SUPABASE (Treno)
CHAVE_BASE64 = "dHJlbm9hY2FkZW1pYTowQTQ2MERBQS0wRTgxLTQ3RTYtOUVENC00NUE5OUZEMkY5RDg="

url = "https://evo-integracao-api.w12app.com.br/api/v2/members"

headers = {
    "Authorization": f"Basic {CHAVE_BASE64}",
    "Accept": "application/json",
    # Simulando um navegador Google Chrome real para burlar firewalls
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# Passando os parâmetros do jeito seguro (que faz o URL Encoding automático)
params = {
    "cellphone": "81981010198",
    "idBranch": "1"
}

print("📡 Disparando requisição com biblioteca 'requests' (Modo Permissivo)...")
try:
    response = requests.get(url, headers=headers, params=params, timeout=15)
    print(f"\n🎯 Status HTTP: {response.status_code}")
    print(f"📦 Resposta Bruta:\n{response.text}")
except Exception as e:
    print(f"\n❌ Erro Fatal: {e}")