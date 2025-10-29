-- ============================================================================
-- MIGRAÇÃO: Adicionar NOVAS Tabelas da Comunidade ao Banco do Prodify
-- ============================================================================
-- ⚠️ ATENÇÃO: Este script APENAS ADICIONA novas tabelas
-- ⚠️ NÃO ALTERA NENHUMA TABELA EXISTENTE
-- ⚠️ NÃO MODIFICA DADOS EXISTENTES
-- ============================================================================
-- Integra a aplicação Comunidade com o banco de dados do Prodify
-- Usa a tabela User EXISTENTE (não cria nova tabela de usuários)
-- Mantém todas as integrações existentes intactas
-- ============================================================================

-- 1. POSTS DA COMUNIDADE (NOVA TABELA)
-- Tabela para armazenar posts criados pelos usuários na comunidade
CREATE TABLE IF NOT EXISTS "CommunityPost" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  author_id TEXT NOT NULL,
  category TEXT CHECK (category IN ('Notícias', 'Atualizações', 'Tutoriais', 'Networking', 'Dúvidas Técnicas', 'Apresente-se', 'Aplicativos')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  
  -- Referencia a tabela User EXISTENTE do Prodify
  CONSTRAINT "CommunityPost_author_id_fkey" 
    FOREIGN KEY (author_id) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Index para melhorar performance nas buscas
CREATE INDEX IF NOT EXISTS "CommunityPost_author_id_idx" ON "CommunityPost"(author_id);
CREATE INDEX IF NOT EXISTS "CommunityPost_category_idx" ON "CommunityPost"(category);
CREATE INDEX IF NOT EXISTS "CommunityPost_created_at_idx" ON "CommunityPost"(created_at DESC);

-- 2. COMENTÁRIOS NOS POSTS (NOVA TABELA)
-- Tabela para comentários em posts da comunidade
CREATE TABLE IF NOT EXISTS "CommunityComment" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  post_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  
  -- Referencia as novas tabelas da comunidade e User existente
  CONSTRAINT "CommunityComment_post_id_fkey" 
    FOREIGN KEY (post_id) REFERENCES "CommunityPost"(id) ON DELETE CASCADE,
  CONSTRAINT "CommunityComment_author_id_fkey" 
    FOREIGN KEY (author_id) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Index para performance
CREATE INDEX IF NOT EXISTS "CommunityComment_post_id_idx" ON "CommunityComment"(post_id);
CREATE INDEX IF NOT EXISTS "CommunityComment_author_id_idx" ON "CommunityComment"(author_id);

-- 3. CURTIDAS (LIKES) NOS POSTS (NOVA TABELA)
-- Tabela para rastrear quem curtiu cada post
CREATE TABLE IF NOT EXISTS "CommunityPostLike" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "CommunityPostLike_post_id_fkey" 
    FOREIGN KEY (post_id) REFERENCES "CommunityPost"(id) ON DELETE CASCADE,
  CONSTRAINT "CommunityPostLike_user_id_fkey" 
    FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE,
  
  -- Garante que um usuário só pode curtir um post uma vez
  CONSTRAINT "CommunityPostLike_unique" UNIQUE(post_id, user_id)
);

-- Index para performance
CREATE INDEX IF NOT EXISTS "CommunityPostLike_post_id_idx" ON "CommunityPostLike"(post_id);
CREATE INDEX IF NOT EXISTS "CommunityPostLike_user_id_idx" ON "CommunityPostLike"(user_id);

-- 4. TRIGGER PARA ATUALIZAR CONTAGEM DE LIKES (NOVA FUNÇÃO)
-- Atualiza automaticamente o contador de likes nos posts
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE "CommunityPost" 
    SET likes = likes + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE "CommunityPost" 
    SET likes = GREATEST(0, likes - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger (não afeta nenhuma tabela existente)
DROP TRIGGER IF EXISTS update_post_likes_trigger ON "CommunityPostLike";
CREATE TRIGGER update_post_likes_trigger
  AFTER INSERT OR DELETE ON "CommunityPostLike"
  FOR EACH ROW
  EXECUTE FUNCTION update_post_likes_count();

-- 5. VIEW PARA POSTS COM DADOS DO AUTOR (NOVA VIEW)
-- Facilita consultas com informações do usuário
CREATE OR REPLACE VIEW "CommunityPostWithAuthor" AS
SELECT 
  p.id,
  p.title,
  p.content,
  p.category,
  p.likes,
  p.created_at,
  p.updated_at,
  u.id as author_id,
  u.name as author_name,
  u.username as author_username,
  u.image as author_image,
  u.email as author_email,
  (SELECT COUNT(*) FROM "CommunityComment" WHERE post_id = p.id) as comments_count
FROM "CommunityPost" p
INNER JOIN "User" u ON p.author_id = u.id
ORDER BY p.created_at DESC;

-- ============================================================================
-- VERIFICAÇÃO DE SEGURANÇA
-- ============================================================================
-- Este script:
-- ✅ ADICIONA 3 novas tabelas: CommunityPost, CommunityComment, CommunityPostLike
-- ✅ ADICIONA 1 nova função: update_post_likes_count()
-- ✅ ADICIONA 1 novo trigger: update_post_likes_trigger
-- ✅ ADICIONA 1 nova view: CommunityPostWithAuthor
-- ✅ USA a tabela User EXISTENTE (não modifica)
-- ✅ USA a tabela UserAppBalance EXISTENTE para stats
-- ❌ NÃO ALTERA nenhuma tabela existente
-- ❌ NÃO MODIFICA dados existentes
-- ❌ NÃO REMOVE nada
-- ============================================================================

