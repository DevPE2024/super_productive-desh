import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Listar posts da comunidade
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const posts = await prisma.$queryRaw`
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
        (SELECT COUNT(*)::integer FROM "CommunityComment" WHERE post_id = p.id) as comments_count
      FROM "CommunityPost" p
      INNER JOIN "User" u ON p.author_id = u.id
      ${category ? prisma.$queryRaw`WHERE p.category = ${category}` : prisma.$queryRaw``}
      ORDER BY p.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar posts da comunidade' },
      { status: 500 }
    );
  }
}

// POST - Criar novo post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { author_id, category, title, content } = body;

    // Validação básica
    if (!author_id || !title || !content) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: author_id, title, content' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: author_id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Criar post
    const newPost = await prisma.$executeRaw`
      INSERT INTO "CommunityPost" (id, author_id, category, title, content)
      VALUES (gen_random_uuid()::text, ${author_id}, ${category}, ${title}, ${content})
      RETURNING *
    `;

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    return NextResponse.json(
      { error: 'Erro ao criar post' },
      { status: 500 }
    );
  }
}

