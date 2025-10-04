-- Atualizar usuário de teste com hash correto da senha
UPDATE "User" 
SET "hashedPassword" = '$2b$10$GbKz7QjJsZUx6RwHkZy93eZeA1gDNK01ZshmviOx.AIooClMXCkiq' 
WHERE email = 'admin@test.com';