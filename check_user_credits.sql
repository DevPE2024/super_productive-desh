-- Verificar créditos do usuário de teste
SELECT 
  ub.userId, 
  a.name as appName, 
  ub.remaining 
FROM user_app_balances ub 
JOIN "App" a ON ub.appId = a.id 
WHERE ub.userId = 'test-user-checkout';