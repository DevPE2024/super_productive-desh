-- ============================================================================
-- MIGRAÇÃO AUTÔNOMA: Tabelas da Comunidade (Standalone)
-- ============================================================================
-- Cria tabelas da Comunidade que PODEM funcionar independentemente
-- OU integrar com User table quando ela existir
-- ============================================================================

-- 1. POSTS DA COMUNIDADE
CREATE TABLE IF NOT EXISTS "CommunityPost" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  author_id TEXT NOT NULL,
  author_name TEXT,
  author_username TEXT,
  author_image TEXT,
  category TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "CommunityPost_author_id_idx" ON "CommunityPost"(author_id);
CREATE INDEX IF NOT EXISTS "CommunityPost_category_idx" ON "CommunityPost"(category);
CREATE INDEX IF NOT EXISTS "CommunityPost_created_at_idx" ON "CommunityPost"(created_at DESC);

-- 2. COMENTÁRIOS
CREATE TABLE IF NOT EXISTS "CommunityComment" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  post_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT,
  author_username TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "CommunityComment_post_id_fkey" 
    FOREIGN KEY (post_id) REFERENCES "CommunityPost"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "CommunityComment_post_id_idx" ON "CommunityComment"(post_id);
CREATE INDEX IF NOT EXISTS "CommunityComment_author_id_idx" ON "CommunityComment"(author_id);

-- 3. CURTIDAS
CREATE TABLE IF NOT EXISTS "CommunityPostLike" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "CommunityPostLike_post_id_fkey" 
    FOREIGN KEY (post_id) REFERENCES "CommunityPost"(id) ON DELETE CASCADE,
  CONSTRAINT "CommunityPostLike_unique" UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS "CommunityPostLike_post_id_idx" ON "CommunityPostLike"(post_id);
CREATE INDEX IF NOT EXISTS "CommunityPostLike_user_id_idx" ON "CommunityPostLike"(user_id);

-- 4. TRIGGER PARA LIKES
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE "CommunityPost" SET likes = likes + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE "CommunityPost" SET likes = GREATEST(0, likes - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_post_likes_trigger ON "CommunityPostLike";
CREATE TRIGGER update_post_likes_trigger
  AFTER INSERT OR DELETE ON "CommunityPostLike"
  FOR EACH ROW
  EXECUTE FUNCTION update_post_likes_count();

-- 5. DADOS DE EXEMPLO
INSERT INTO "CommunityPost" (author_id, author_name, author_username, category, title, content, likes, created_at)
VALUES 
  ('demo-user-1', 'Willian Gabriel Pegoraro', 'willian.dev', 'Dúvidas Técnicas', 
   'Como fazer app multiusuário por empresa?',
   'Uma ideia de lógica que faça o meu app ficar multiusuário por empresa sendo que em cada empresa tem 3 tipos de usuários? Ex: dono, garçom e cozinha',
   8, NOW() - INTERVAL '11 minutes'),
  
  ('demo-user-2', 'Vagner Barcelos', 'vagner.tech', 'Tutor AI',
   'Redimensionar janela Data Types',
   'Fala galera, vendo o vídeo aqui reparei uma coisa, essa janela dos Data Types mostra a linha todo conteudo, o meu fica cortado, como que redimensiona isso?',
   5, NOW() - INTERVAL '17 minutes'),
  
  ('demo-user-3', 'Ane Assunção', 'ane.codes', 'Apresente-se',
   '[CONTRIBUIÇÃO] Quando o localhost virou meu maior bug!',
   'Bom dia, pessoal! Tudo certo?! Às vezes, o custo não tá no boleto, tá no stress do debug infinito. Mas aí vieram os testes que não rodavam, os erros que não faziam sentido...',
   24, NOW() - INTERVAL '4 hours'),
  
  ('demo-user-4', 'Igor Leonardo Pereira', 'igor.dev', 'Tutoriais',
   'Não consigo centralizar um popup na página',
   'Não consigo mudar as posições do popup para que fique centralizado na página. Alguém sabe como resolver?',
   7, NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- Verificação
SELECT 'Tabelas criadas com sucesso!' as status;
SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'Community%';

