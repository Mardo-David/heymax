-- ============================================================
-- MISSÃO 2: Configurar numero_comercial da organização piloto
-- Deploy: Executar manualmente no Supabase Dashboard > SQL Editor
-- Data: 2026-04-02
-- ============================================================

-- 1. Confirma o estado atual antes de alterar
SELECT slug, name, numero_comercial, active
FROM organizations
WHERE slug = 'treno-paulo-afonso';

-- 2. Atualiza o numero_comercial da Brenda
UPDATE organizations
SET numero_comercial = '5511936193235'
WHERE slug = 'treno-paulo-afonso';

-- 3. Confirma a alteração
SELECT slug, name, numero_comercial
FROM organizations
WHERE slug = 'treno-paulo-afonso';
