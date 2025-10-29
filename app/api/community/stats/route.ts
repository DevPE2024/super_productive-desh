import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Estatísticas da comunidade
export async function GET(request: NextRequest) {
  try {
    // Total de membros (usando query raw)
    const totalMembersResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint as count FROM "User"
    `;
    const totalMembers = Number(totalMembersResult[0]?.count || 0);

    // Posts hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const postsToday = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint as count 
      FROM "CommunityPost" 
      WHERE created_at >= ${today}
    `;

    // Novos membros (últimos 7 dias)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const newMembers = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint as count 
      FROM "User" 
      WHERE "createdAt" >= ${sevenDaysAgo}
    `;

    // Total de posts
    const totalPosts = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint as count FROM "CommunityPost"
    `;

    // Total de comentários
    const totalComments = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint as count FROM "CommunityComment"
    `;

    return NextResponse.json({
      totalMembers,
      postsToday: Number(postsToday[0]?.count || 0),
      newMembers: Number(newMembers[0]?.count || 0),
      totalPosts: Number(totalPosts[0]?.count || 0),
      totalComments: Number(totalComments[0]?.count || 0)
    }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas', details: String(error) },
      { status: 500 }
    );
  }
}

