import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Listar posts diretamente do banco usando Prisma Raw Query
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');

    let posts;
    
    if (category && category !== 'Todos') {
      posts = await db.$queryRaw<any[]>`
        SELECT 
          id, author_id, author_name, author_username, author_image,
          category, title, content, likes, created_at, updated_at
        FROM "CommunityPost"
        WHERE category = ${category}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    } else {
      posts = await db.$queryRaw<any[]>`
        SELECT 
          id, author_id, author_name, author_username, author_image,
          category, title, content, likes, created_at, updated_at
        FROM "CommunityPost"
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    }
    
    return NextResponse.json({
      posts,
      total: posts.length
    }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar posts', details: String(error) },
      { status: 500 }
    );
  }
}

