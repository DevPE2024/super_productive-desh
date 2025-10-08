-- Verificar créditos do usuário de teste (corrigido)
SELECT 
  ub.userId, 
  a.name as appName, 
  ub.remaining 
FROM user_app_balances ub 
JOIN apps a ON ub.appId = a.id 
WHERE ub.userId = 'test-user-checkout';