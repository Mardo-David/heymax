import requests

# 1. COLE SUAS CREDENCIAIS AQUI
CHAVE_BASE64 = "dHJlbm9hY2FkZW1pYTpEMDYxQkNBNC1GMDY5LTQzOTMtQkMxNS0xMzE3NzIzNTUwNEE="
PHONE_TESTE = "5581988866104" # Ex: 55819...

headers = {"Authorization": f"Basic {CHAVE_BASE64}", "Accept": "application/json"}

print(f"🕵️ 1. Buscando o cadastro pelo telefone: {PHONE_TESTE}...")
url_member = "https://evo-integracao-api.w12app.com.br/api/v2/members"

# Testando a variação padrão do telefone
resp_member = requests.get(url_member, headers=headers, params={"cellphone": PHONE_TESTE, "idBranch": "1"}, timeout=10)

if resp_member.status_code == 200 and resp_member.json():
    membros = resp_member.json()
    id_cliente = membros[0].get("idMember")
    nome = membros[0].get("firstName", "Desconhecido")
    print(f"✅ Aluno encontrado! ID: {id_cliente} | Nome: {nome}")
    
    print(f"\n🏋️ 2. Buscando os treinos para o ID {id_cliente}...")
    url_workout = "https://evo-integracao-api.w12app.com.br/api/v2/workout/default-client-workout"
    
    # Fazendo a chamada exata com idClient
    resp_workout = requests.get(url_workout, headers=headers, params={"idClient": id_cliente}, timeout=10)
    
    print(f"🎯 Status HTTP (Treino): {resp_workout.status_code}")
    print(f"📦 Resposta Bruta do Treino:\n{resp_workout.text[:1000]}")
else:
    print(f"❌ Status {resp_member.status_code}. Resposta: {resp_member.text}")