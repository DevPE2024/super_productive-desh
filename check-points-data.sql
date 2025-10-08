-- Verificar dados de pontos
SELECT 'PLANS' as table_name, id, name, "priceUsd" FROM plans;
SELECT 'APPS' as table_name, id, key, name FROM apps;
SELECT 'PLAN_APP_ALLOCATIONS' as table_name, "planId", "appId", "monthlyPoints" FROM plan_app_allocations;
SELECT 'USER_APP_BALANCES' as table_name, "userId", "appId", remaining FROM user_app_balances;
SELECT 'USERS' as table_name, id, email, "planId" FROM "User" WHERE email = 'demo@prodify.com';
