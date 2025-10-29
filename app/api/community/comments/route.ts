import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Listar comentários de um post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const post_id = searchParams.get('post_id');

    if (!post_id) {
      return NextResponse.json(
        { error: 'post_id é obrigatório' },
        { status: 400 }
      );
    }

    const comments = await prisma.$queryRaw`
      SELECT 
        c.id,
        c.content,
        c.created_at,
        u.id as author_id,
        u.name as author_name,
        u.username as author_username,
        u.image as author_image
      FROM "CommunityComment" c
      INNER JOIN "User" u ON c.author_id = u.id
      WHERE c.post_id = ${post_id}
      ORDER BY c.created_at ASC
    `;

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar comentários' },
      { status: 500 }
    );
  }
}

// POST - Criar novo comentário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { post_id, author_id, content } = body;

    if (!post_id || !author_id || !content) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: post_id, author_id, content' },
        { status: 400 }
      );
    }

    // Criar comentário
    await prisma.$executeRaw`
      INSERT INTO "CommunityComment" (id, post_id, author_id, content)
      VALUES (gen_random_uuid()::text, ${post_id}, ${author_id}, ${content})
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    return NextResponse.json(
      { error: 'Erro ao criar comentário' },
      { status: 500 }
    );
  }
}

