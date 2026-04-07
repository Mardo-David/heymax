-- ============================================================
-- Adiciona coluna phone em demo_accounts para lookup via WhatsApp
-- Formato: 55 + DDD + número (ex: 5575999999999)
-- Execute no Supabase Dashboard > SQL Editor.
-- ============================================================

ALTER TABLE public.demo_accounts
    ADD COLUMN IF NOT EXISTS phone text;

-- Índice para lookup eficiente pelo webhook
CREATE INDEX IF NOT EXISTS idx_demo_accounts_phone
    ON public.demo_accounts (phone)
    WHERE phone IS NOT NULL;
