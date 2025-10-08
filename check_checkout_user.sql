-- Verificar usuário de teste após checkout
SELECT 
  id, 
  username, 
  email, 
  "planId", 
  "cycleStart", 
  "cycleEnd" 
FROM "User" 
WHERE id = 'test-user-checkout';