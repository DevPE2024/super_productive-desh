-- Criar usuário de teste para validar sistema de checkout
INSERT INTO "User" (
  id, 
  username, 
  email, 
  "hashedPassword", 
  "completedOnboarding", 
  "planId", 
  "cycleStart", 
  "cycleEnd"
) VALUES (
  'test-user-checkout', 
  'testcheckout', 
  'test@checkout.com', 
  '$2b$10$abcdefghijklmnopqrstuvwxyz123456789', 
  true, 
  1, 
  NOW(), 
  NOW() + INTERVAL '1 month'
) ON CONFLICT (username) DO UPDATE SET 
  email = EXCLUDED.email,
  "planId" = EXCLUDED."planId";