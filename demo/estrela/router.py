# demo/estrela/router.py

import json
import os
import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel

from demo.estrela.agent import stella_agent, build_greeting

router = APIRouter(prefix="/demo/estrela", tags=["demo-estrela"])

TTL_HOURS = 3


# ── Modelos ───────────────────────────────────────────────────────────────────

class CreateEstrelaRequest(BaseModel):
    prospect_nome: str
    contexto: str
    motivo: str
    telefone_demo: Optional[str] = None  # DDD + número; sistema normaliza para 55+DDD+número


class ResetEstrelaRequest(BaseModel):
    demo_id: str


class SendMessageRequest(BaseModel):
    message: str


# ── Admin — formulário ────────────────────────────────────────────────────────

@router.get("/admin", response_class=HTMLResponse)
async def admin_form():
    html_path = os.path.join(os.path.dirname(__file__), "admin.html")
    with open(html_path, "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())


# ── Admin — criar sessão ──────────────────────────────────────────────────────

@router.post("/admin/create")
async def create_estrela_demo(req: CreateEstrelaRequest, request: Request):
    pool = request.app.state.db_pool
    if pool is None:
        raise HTTPException(status_code=503, detail="Banco de dados não conectado.")

    slug = req.prospect_nome.lower().replace(" ", "-")
    short_id = str(uuid.uuid4())[:6]
    demo_id = f"estrela-{slug}-{short_id}"
    expires_at = datetime.now(timezone.utc) + timedelta(hours=TTL_HOURS)

    # Normaliza phone para 55+DDD+número
    raw_phone = (req.telefone_demo or "").strip().replace(" ", "").replace("-", "")
    phone = ("55" + raw_phone) if raw_phone and not raw_phone.startswith("55") else raw_phone or None

    extra_context = {
        "contexto": req.contexto,
        "motivo": req.motivo,
        "tipo": "estrela",
    }

    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                INSERT INTO demo_accounts
                    (demo_id, academy_name, contact_name, contact_phone,
                     contact_goal, extra_context, expires_at, phone)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                demo_id,
                "Laboratório Estrela",
                req.prospect_nome,
                raw_phone,
                req.motivo,
                json.dumps(extra_context),
                expires_at,
                phone,
            ))

            # Insere saudação inicial da Stella
            account = {
                "contact_name": req.prospect_nome,
                "contact_goal": req.motivo,
                "extra_context": extra_context,
            }
            greeting = build_greeting(account)
            await cur.execute("""
                INSERT INTO demo_interactions (demo_id, role, content)
                VALUES (%s, 'assistant', %s)
            """, (demo_id, greeting))

    return {
        "ok": True,
        "demo_id": demo_id,
        "chat_url": f"/demo/estrela/chat/{demo_id}",
        "expires_at": expires_at.isoformat(),
    }


# ── Admin — listar sessões ────────────────────────────────────────────────────

@router.get("/admin/list")
async def list_estrela_demos(request: Request):
    pool = request.app.state.db_pool
    if pool is None:
        raise HTTPException(status_code=503, detail="Banco de dados não conectado.")

    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                SELECT demo_id, academy_name, contact_name, contact_phone,
                       contact_goal, expires_at, created_at
                FROM demo_accounts
                WHERE expires_at > NOW()
                  AND academy_name = 'Laboratório Estrela'
                ORDER BY created_at DESC
            """)
            rows = await cur.fetchall()
            cols = [desc[0] for desc in cur.description]

    return [dict(zip(cols, row)) for row in rows]


# ── Admin — reset ─────────────────────────────────────────────────────────────

@router.post("/admin/reset")
async def reset_estrela_demo(req: ResetEstrelaRequest, request: Request):
    pool = request.app.state.db_pool
    if pool is None:
        raise HTTPException(status_code=503, detail="Banco de dados não conectado.")

    if not req.demo_id.startswith("estrela-"):
        raise HTTPException(status_code=400, detail="ID inválido para demo Estrela.")

    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute(
                "DELETE FROM demo_interactions WHERE demo_id = %s", (req.demo_id,)
            )
            await cur.execute(
                "DELETE FROM demo_accounts WHERE demo_id = %s", (req.demo_id,)
            )

    return {"ok": True, "deleted": req.demo_id}


# ── Chat — página ─────────────────────────────────────────────────────────────

@router.get("/chat/{demo_id}", response_class=HTMLResponse)
async def chat_page(demo_id: str):
    html_path = os.path.join(os.path.dirname(__file__), "chat.html")
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("__DEMO_ID__", demo_id)
    return HTMLResponse(content=content)


# ── Chat — histórico (polling) ────────────────────────────────────────────────

@router.get("/chat/{demo_id}/history")
async def get_history(demo_id: str, request: Request):
    pool = request.app.state.db_pool
    if pool is None:
        raise HTTPException(status_code=503, detail="Banco de dados não conectado.")

    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                SELECT contact_name, contact_goal, expires_at < NOW() as expired
                FROM demo_accounts
                WHERE demo_id = %s
            """, (demo_id,))
            row = await cur.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Demo não encontrada.")

            contact_name, contact_goal, expired = row

            await cur.execute("""
                SELECT role, content, created_at
                FROM demo_interactions
                WHERE demo_id = %s
                ORDER BY created_at ASC
            """, (demo_id,))
            interactions = await cur.fetchall()

    return {
        "demo_id": demo_id,
        "contact_name": contact_name,
        "expired": bool(expired),
        "messages": [
            {"role": r[0], "content": r[1], "created_at": r[2].isoformat()}
            for r in interactions
        ],
    }


# ── Chat — enviar mensagem ────────────────────────────────────────────────────

@router.post("/chat/{demo_id}/send")
async def send_message(demo_id: str, req: SendMessageRequest, request: Request):
    pool = request.app.state.db_pool
    if pool is None:
        raise HTTPException(status_code=503, detail="Banco de dados não conectado.")

    message = req.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Mensagem vazia.")

    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            # Carrega conta
            await cur.execute("""
                SELECT demo_id, academy_name, contact_name, contact_phone,
                       contact_goal, extra_context, expires_at
                FROM demo_accounts
                WHERE demo_id = %s AND expires_at > NOW()
            """, (demo_id,))
            row = await cur.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Demo não encontrada ou expirada.")

            cols = ["demo_id", "academy_name", "contact_name", "contact_phone",
                    "contact_goal", "extra_context", "expires_at"]
            account = dict(zip(cols, row))
            if isinstance(account["extra_context"], str):
                try:
                    account["extra_context"] = json.loads(account["extra_context"])
                except Exception:
                    account["extra_context"] = {}

            # Carrega histórico
            await cur.execute("""
                SELECT role, content FROM demo_interactions
                WHERE demo_id = %s
                ORDER BY created_at ASC
                LIMIT 30
            """, (demo_id,))
            history_rows = await cur.fetchall()
            history = [{"role": r[0], "content": r[1]} for r in history_rows]

            # Salva mensagem do usuário
            await cur.execute("""
                INSERT INTO demo_interactions (demo_id, role, content)
                VALUES (%s, 'user', %s)
            """, (demo_id, message))

    # Processa com Stella
    response = await stella_agent.process(account, message, history)

    # Salva resposta da Stella
    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                INSERT INTO demo_interactions (demo_id, role, content)
                VALUES (%s, 'assistant', %s)
            """, (demo_id, response))

    return {"ok": True, "response": response}

# ── WhatsApp — webhook Evolution API ─────────────────────────────────────────

@router.post("/webhook")
async def estrela_webhook(request: Request):
    pool = request.app.state.db_pool
    http_client = request.app.state.http_client

    try:
        payload = await request.json()
    except Exception:
        return {"ok": False}

    data = payload.get("data", {})
    key = data.get("key", {})

    # Ignora mensagens enviadas pelo bot
    if key.get("fromMe", True):
        return {"ok": True}

    # Apenas mensagens de texto simples
    if data.get("messageType") != "conversation":
        return {"ok": True}

    # Extrai e normaliza o telefone
    remote_jid = key.get("remoteJid", "")
    phone = remote_jid.split("@")[0]
    if not phone.startswith("55"):
        phone = "55" + phone

    message = (data.get("message") or {}).get("conversation", "").strip()
    if not message:
        return {"ok": True}

    if pool is None:
        return {"ok": False}

    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                SELECT demo_id, academy_name, contact_name, contact_phone,
                       contact_goal, extra_context, expires_at
                FROM demo_accounts
                WHERE phone = %s
                  AND expires_at > NOW()
                  AND academy_name = 'Laboratório Estrela'
                ORDER BY created_at DESC
                LIMIT 1
            """, (phone,))
            row = await cur.fetchone()
            if not row:
                return {"ok": True}  # sem sessão ativa — ignora silenciosamente

            cols = ["demo_id", "academy_name", "contact_name", "contact_phone",
                    "contact_goal", "extra_context", "expires_at"]
            account = dict(zip(cols, row))
            if isinstance(account["extra_context"], str):
                try:
                    account["extra_context"] = json.loads(account["extra_context"])
                except Exception:
                    account["extra_context"] = {}

            demo_id = account["demo_id"]

            await cur.execute("""
                SELECT role, content FROM demo_interactions
                WHERE demo_id = %s
                ORDER BY created_at ASC
                LIMIT 30
            """, (demo_id,))
            history = [{"role": r[0], "content": r[1]} for r in await cur.fetchall()]

            await cur.execute("""
                INSERT INTO demo_interactions (demo_id, role, content)
                VALUES (%s, 'user', %s)
            """, (demo_id, message))

    response = await stella_agent.process(account, message, history)

    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("""
                INSERT INTO demo_interactions (demo_id, role, content)
                VALUES (%s, 'assistant', %s)
            """, (demo_id, response))

    evo_url = os.environ.get("ESTRELA_EVO_URL", "https://evo.heymax.fit")
    evo_instance = os.environ.get("ESTRELA_EVO_INSTANCE", "stellaestrela")
    evo_apikey = os.environ.get("ESTRELA_EVO_APIKEY", "")

    await http_client.post(
        f"{evo_url}/message/sendText/{evo_instance}",
        headers={"apikey": evo_apikey},
        json={"number": phone, "text": response},
    )

    return {"ok": True}


# ── Avatar — imagem ──────────────────────────────────────────────────────────

@router.get("/avatar")
async def get_avatar():
    img_path = os.path.join(os.path.dirname(__file__), "img", "Estella.png")
    if not os.path.exists(img_path):
        raise HTTPException(status_code=404, detail="Avatar não encontrado.")
    return FileResponse(img_path)
