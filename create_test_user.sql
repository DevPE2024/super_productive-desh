-- Criar usuário de teste
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
    'test-user-123', 
    'testeuser', 
    'teste@prodify.com', 
    '$2a$10$hashedpassword', 
    true, 
    1, 
    NOW(), 
    NOW() + INTERVAL '30 days'
);

-- Criar saldos de créditos para o usuário
INSERT INTO user_app_balances ("userId", "appId", remaining) VALUES
('test-user-123', 1, 100), -- OnScope
('test-user-123', 2, 100), -- JazzUp  
('test-user-123', 3, NULL), -- Prodify (ilimitado)
('test-user-123', 4, 100), -- TestPath
('test-user-123', 5, 100), -- DeepQuest
('test-user-123', 6, 100); -- OpenUIX