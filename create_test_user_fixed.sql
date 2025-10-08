-- Criar novo usuário com senha hash válida (password123)
INSERT INTO "User" (
  id, 
  email, 
  username, 
  name, 
  "hashedPassword", 
  "completedOnboarding"
) VALUES (
  'test-user-checkout-new',
  'test@checkout.com',
  'testuser',
  'Test User',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', -- hash de "password123"
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  name = EXCLUDED.name,
  "hashedPassword" = EXCLUDED."hashedPassword",
  "completedOnboarding" = EXCLUDED."completedOnboarding";