-- Inicializar créditos para o usuário demo conforme plano Free
-- Plano Free: 10 créditos para cada app (OnScope, JazzUp, DeepQuest, OpenUIX)

-- Primeiro, deletar saldos antigos
DELETE FROM user_app_balances WHERE "userId" IN (
  SELECT id FROM "User" WHERE email = 'demo@prodify.com'
);

-- Inserir novos saldos baseados no plano
INSERT INTO user_app_balances ("userId", "appId", remaining)
SELECT 
  u.id as "userId",
  paa."appId",
  COALESCE(paa."monthlyPoints", 0) as remaining
FROM "User" u
JOIN plans p ON p.id = u."planId"
JOIN plan_app_allocations paa ON paa."planId" = p.id
WHERE u.email = 'demo@prodify.com';

-- Verificar resultado
SELECT 
  u.email,
  a.key as app_key,
  a.name as app_name,
  paa."monthlyPoints" as monthly_allocation,
  uab.remaining
FROM "User" u
JOIN user_app_balances uab ON uab."userId" = u.id
JOIN apps a ON a.id = uab."appId"
JOIN plans p ON p.id = u."planId"
JOIN plan_app_allocations paa ON paa."planId" = p.id AND paa."appId" = a.id
WHERE u.email = 'demo@prodify.com'
ORDER BY a.id;
