import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Teste simples da API da Comunidade
export async function GET() {
  try {
    // Teste direto com query RAW
    const result = await db.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint as count FROM "CommunityPost"
    `;

    const postCount = Number(result[0]?.count || 0);

    return NextResponse.json({
      status: 'success',
      message: 'API da Comunidade funcionando!',
      postCount,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error('Erro no teste da API:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Erro ao acessar banco',
      error: String(error)
    }, { status: 500 });
  }
}

