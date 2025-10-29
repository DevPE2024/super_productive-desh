import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST - Curtir/Descurtir um post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { post_id, user_id, action } = body;

    if (!post_id || !user_id || !action) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: post_id, user_id, action (like/unlike)' },
        { status: 400 }
      );
    }

    if (action === 'like') {
      // Adicionar like (trigger atualiza contador automaticamente)
      await prisma.$executeRaw`
        INSERT INTO "CommunityPostLike" (id, post_id, user_id)
        VALUES (gen_random_uuid()::text, ${post_id}, ${user_id})
        ON CONFLICT (post_id, user_id) DO NOTHING
      `;
    } else if (action === 'unlike') {
      // Remover like (trigger atualiza contador automaticamente)
      await prisma.$executeRaw`
        DELETE FROM "CommunityPostLike"
        WHERE post_id = ${post_id} AND user_id = ${user_id}
      `;
    }

    // Retornar número atualizado de likes
    const result = await prisma.$queryRaw<Array<{ likes: number }>>`
      SELECT likes FROM "CommunityPost" WHERE id = ${post_id}
    `;

    return NextResponse.json({ 
      success: true, 
      likes: result[0]?.likes || 0 
    }, { status: 200 });
  } catch (error) {
    console.error('Erro ao processar like:', error);
    return NextResponse.json(
      { error: 'Erro ao processar like' },
      { status: 500 }
    );
  }
}

// GET - Verificar se usuário curtiu um post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const post_id = searchParams.get('post_id');
    const user_id = searchParams.get('user_id');

    if (!post_id || !user_id) {
      return NextResponse.json(
        { error: 'post_id e user_id são obrigatórios' },
        { status: 400 }
      );
    }

    const like = await prisma.$queryRaw`
      SELECT id FROM "CommunityPostLike"
      WHERE post_id = ${post_id} AND user_id = ${user_id}
      LIMIT 1
    `;

    return NextResponse.json({ 
      liked: Array.isArray(like) && like.length > 0 
    }, { status: 200 });
  } catch (error) {
    console.error('Erro ao verificar like:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar like' },
      { status: 500 }
    );
  }
}

