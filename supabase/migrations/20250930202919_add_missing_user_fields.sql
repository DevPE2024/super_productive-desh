-- Adicionar campos faltantes na tabela User
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "surname" TEXT,
ADD COLUMN IF NOT EXISTS "completedOnboarding" BOOLEAN DEFAULT false;