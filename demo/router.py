# demo/router.py

import json
import os
import httpx
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel

from demo.agent import max_agent, build_menu

router = APIRouter(prefix="/demo", tags=["demo"])

# ── Modelos ───────────────────────────────────────────────────────────────────

class CreateDemoRequest(BaseModel):
    demo_id: str           # slug único — ex: "academia-force-sp"
    academy_name: str
    contact_name: str
    contact_phone: str     # com DDI: 5581999999999
    contact_goal: str      # objetivo declarado
    extra_context: dict = {}

class ResetDemoRequest(BaseModel):
    contact_phone: str

class WebhookPayload(BaseModel):
    event: str = ""
    data: dict = {}

# ── Admin — criar prospect ────────────────────────────────────────────────────

@router.post("/admin/create")
async def create_demo(req: CreateDemoRequest, request: Request):
    pool = request.app.state.db_pool
    if pool is None:
        raise HTTPException(status_code=503, detail="Banco de dados não conectado.")

    expires_at = datetime.now(timezone.utc) + timedelta(hours=24)

    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            # Verifica se demo_id já existe
            await cur.execute(
                "SELECT demo_id FROM demo_accounts WHERE demo_id = %s",
                (req.demo_id,)
            )
            if await cur.fetchone():
                raise HTTPException(
                    status_code=409,
                    detail="demo_id já existe. Use outro slug ou faça reset."
                )

            await cur.execute("""
                INSERT INTO demo_accounts
                    (demo_id, academy_name, contact_name, contact_phone,
                     contact_goal, extra_context, expires_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                req.demo_id,
                req.academy_name,
                req.contact_name,
                req.contact_phone,
                req.contact_goal,
                json.dumps(req.extra_context),
                expires_at,
            ))

    # Envia mensagem de boas-vindas via Evolution API
    account = req.model_dump()
    welcome = build_menu(account)
    await send_whatsapp(req.contact_phone, welcome)

    return {"ok": True, "demo_id": req.demo_id, "expires_at": expires_at.isoformat()}


# ── Admin — reset ─────────────────────────────────────────────────────────────

@router.post("/admin/reset")
async def reset_demo(req: ResetDemoRequest, request: Request):
    pool = request.app.state.db_pool
    if pool is None:
        raise HTTPException(status_code=503, detail="Banco de dados não conectado.")

    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute(
                "SELECT demo_id FROM demo_accounts WHERE contact_phone = %s",
                (req.contact_phone,)
            )
            row = await cur.fetchone()
            if not row:
                raise HTTPException(
                    status_code=404,
                    detail="Nenhuma demo encontrada para este telefone."
                )

            demo_id = row[0]
            await cur.execute(
                "DELETE FROM demo_interactions WHERE demo_id = %s",
                (demo_id,)
            )
            await cur.execute(
                "DELETE FROM demo_accounts WHERE demo_id = %s",
                (demo_id,)
            )

    return {"ok": True, "deleted": demo_id}


# ── Admin — listar demos ativas ───────────────────────────────────────────────

@router.get("/admin/list")
async def list_demos(request: Request):
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
                ORDER BY created_at DESC
            """)
            rows = await cur.fetchall()
            cols = [desc[0] for desc in cur.description]

    return [dict(zip(cols, row)) for row in rows]


# ── Webhook Evolution API — recebe mensagens do Max ──────────────────────────

@router.post("/webhook")
async def demo_webhook(payload: WebhookPayload, request: Request):
    try:
        data = payload.data
        key = data.get("key", {})

        # Ignora mensagens enviadas pelo próprio bot
        if key.get("fromMe"):
            return {"ok": True}

        # Só processa texto por enquanto
        message_type = data.get("messageType", "")
        if message_type != "conversation":
            return {"ok": True}

        raw_phone = key.get("remoteJid", "").replace("@s.whatsapp.net", "")
        text = data.get("message", {}).get("conversation", "").strip()

        if not raw_phone or not text:
            return {"ok": True}

        pool = request.app.state.db_pool
        if pool is None:
            return {"ok": True}

        # Busca demo_account pelo phone
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute("""
                    SELECT demo_id, academy_name, contact_name, contact_phone,
                           contact_goal, extra_context, expires_at
                    FROM demo_accounts
                    WHERE contact_phone = %s AND expires_at > NOW()
                """, (raw_phone,))

                account_row = await cur.fetchone()
                if not account_row:
                    return {"ok": True}  # Não é uma demo ativa

                cols = [desc[0] for desc in cur.description]
                account = dict(zip(cols, account_row))
                demo_id = account["demo_id"]

                # Carrega histórico (últimas 20 interações)
                await cur.execute("""
                    SELECT role, content FROM demo_interactions
                    WHERE demo_id = %s
                    ORDER BY created_at ASC
                    LIMIT 20
                """, (demo_id,))
                history_rows = await cur.fetchall()
                history = [{"role": r[0], "content": r[1]} for r in history_rows]

                # Salva mensagem do usuário
                await cur.execute("""
                    INSERT INTO demo_interactions (demo_id, role, content)
                    VALUES (%s, 'user', %s)
                """, (demo_id, text))

        # Processa com Max (fora do bloco de pool para não bloquear)
        response = await max_agent.process(demo_id, account, text, history)

        # Salva resposta do Max e envia via WhatsApp
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute("""
                    INSERT INTO demo_interactions (demo_id, role, content)
                    VALUES (%s, 'assistant', %s)
                """, (demo_id, response))

        await send_whatsapp(raw_phone, response)

        return {"ok": True}

    except Exception as e:
        print(f"[demo_webhook] erro: {e}")
        return {"ok": True}  # Nunca retorna erro para Evolution API


# ── Helper WhatsApp ───────────────────────────────────────────────────────────

async def send_whatsapp(phone: str, text: str):
    """Envia mensagem via instância do Max na Evolution API."""
    evo_url = os.getenv("EVO_URL", "https://evo.heymax.fit")
    evo_instance = os.getenv("EVO_DEMO_INSTANCE", "maxheymax")
    evo_apikey = os.getenv("EVO_DEMO_APIKEY", "")

    url = f"{evo_url}/message/sendText/{evo_instance}"
    headers = {"apikey": evo_apikey, "Content-Type": "application/json"}
    payload = {
        "number": phone,
        "text": text,
        "delay": 1000,
    }

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            await client.post(url, json=payload, headers=headers)
        except Exception as e:
            print(f"[send_whatsapp demo] erro: {e}")


# ── Formulário admin ──────────────────────────────────────────────────────────

@router.get("/admin", response_class=HTMLResponse)
async def admin_form():
    # O main.py está na raiz do projeto; demo/admin.html é relativo a ela
    html_path = os.path.join(os.path.dirname(__file__), "admin.html")
    with open(html_path, "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())