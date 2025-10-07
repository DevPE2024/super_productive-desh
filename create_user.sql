-- Criar usuário de teste
INSERT INTO "User" (
    id, 
    email, 
    username, 
    "hashedPassword", 
    "completedOnboarding", 
    "pointsBalance"
) VALUES (
    'test-user-123', 
    'test@test.com', 
    'testuser', 
    '$2b$10$GbKz7QjJsZUx6RwHkZy93eZeA1gDNK01ZshmviOx.AIooClMXCkiq', 
    true, 
    100
) ON CONFLICT (email) DO UPDATE SET 
    "hashedPassword" = EXCLUDED."hashedPassword";