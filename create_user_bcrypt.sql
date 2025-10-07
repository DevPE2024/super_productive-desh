-- Deletar usuário existente se houver
DELETE FROM "User" WHERE email = 'test@test.com';

-- Inserir novo usuário com senha hasheada corretamente
-- Senha: test123456
-- Hash gerado com bcryptjs rounds=12: $2b$12$Ug1GkZ7jVMr2Rm9.eF6ziurayOLQ0HXT6uMQyYyeKuHcMhbJY0fHi
INSERT INTO "User" (
  id,
  email,
  username,
  "hashedPassword",
  "completedOnboarding",
  "pointsBalance",
  "planId"
) VALUES (
  'test-user-bcrypt-123',
  'test@test.com',
  'testuser',
  '$2b$12$Ug1GkZ7jVMr2Rm9.eF6ziurayOLQ0HXT6uMQyYyeKuHcMhbJY0fHi',
  true,
  0,
  'cmgfl6fpk0000rp09t7g156gg'
) ON CONFLICT (email) DO UPDATE SET
  "hashedPassword" = EXCLUDED."hashedPassword",
  id = EXCLUDED.id,
  "planId" = EXCLUDED."planId";