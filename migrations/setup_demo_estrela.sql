-- ============================================================
-- Demo Estrela — Verificação de Tabelas
-- Reutiliza demo_accounts e demo_interactions já existentes.
-- Execute no Supabase Dashboard > SQL Editor antes do deploy.
-- ============================================================

-- 1. Verifica se demo_accounts existe; cria se necessário
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'demo_accounts'
    ) THEN
        CREATE TABLE public.demo_accounts (
            demo_id       TEXT PRIMARY KEY,
            academy_name  TEXT NOT NULL,
            contact_name  TEXT NOT NULL DEFAULT '',
            contact_phone TEXT NOT NULL DEFAULT '',
            contact_goal  TEXT NOT NULL DEFAULT '',
            extra_context JSONB NOT NULL DEFAULT '{}',
            expires_at    TIMESTAMPTZ NOT NULL,
            created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        RAISE NOTICE '[Estrela] Tabela demo_accounts CRIADA.';
    ELSE
        RAISE NOTICE '[Estrela] Tabela demo_accounts já existe — reutilizando.';
    END IF;
END $$;

-- 2. Verifica se demo_interactions existe; cria se necessário
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'demo_interactions'
    ) THEN
        CREATE TABLE public.demo_interactions (
            id         BIGSERIAL PRIMARY KEY,
            demo_id    TEXT NOT NULL REFERENCES public.demo_accounts(demo_id) ON DELETE CASCADE,
            role       TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
            content    TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX idx_demo_interactions_demo_id
            ON public.demo_interactions (demo_id, created_at);
        RAISE NOTICE '[Estrela] Tabela demo_interactions CRIADA.';
    ELSE
        RAISE NOTICE '[Estrela] Tabela demo_interactions já existe — reutilizando.';
    END IF;
END $$;

-- 3. Confirma estado final
SELECT
    'demo_accounts'    AS tabela,
    COUNT(*) FILTER (WHERE academy_name = 'Laboratório Estrela') AS sessoes_estrela,
    COUNT(*) AS total_sessoes
FROM public.demo_accounts
WHERE expires_at > NOW()

UNION ALL

SELECT
    'demo_interactions' AS tabela,
    COUNT(*) FILTER (WHERE demo_id LIKE 'estrela-%') AS sessoes_estrela,
    COUNT(*) AS total_sessoes
FROM public.demo_interactions;
