-- Verificar estrutura do banco conforme pricing_prodify.md
-- 1. Verificar apps
SELECT 'APPS' as section, id, key, name FROM apps ORDER BY id;

-- 2. Verificar planos
SELECT 'PLANS' as section, id, name, "priceUsd", "stripePriceId" FROM plans ORDER BY id;

-- 3. Verificar alocações (deve ter 18 registros: 3 planos x 6 apps)
SELECT 'ALLOCATIONS' as section, 
  paa.id, 
  p.name as plan_name, 
  a.key as app_key, 
  paa."monthlyPoints"
FROM plan_app_allocations paa
JOIN plans p ON p.id = paa."planId"
JOIN apps a ON a.id = paa."appId"
ORDER BY p.id, a.id;

-- 4. Verificar usuário demo
SELECT 'USER' as section, 
  u.id, 
  u.email, 
  p.name as plan_name,
  u."cycleStart",
  u."cycleEnd"
FROM "User" u
LEFT JOIN plans p ON p.id = u."planId"
WHERE u.email = 'demo@prodify.com';

-- 5. Verificar saldos do usuário
SELECT 'USER_BALANCES' as section,
  uab.id,
  u.email,
  a.key as app_key,
  uab.remaining
FROM user_app_balances uab
JOIN "User" u ON u.id = uab."userId"
JOIN apps a ON a.id = uab."appId"
WHERE u.email = 'demo@prodify.com'
ORDER BY a.id;
