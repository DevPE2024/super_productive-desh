import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getAuthSession(request);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Buscar logs de uso do usuário
    const usageLogs = await db.usageLog.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    // Contar total de logs
    const totalLogs = await db.usageLog.count({
      where: { userId: session.user.id }
    });

    return NextResponse.json({
      success: true,
      data: {
        logs: usageLogs.map(log => ({
          id: log.id,
          actionType: log.actionType,
          pointsUsed: log.pointsUsed,
          createdAt: log.createdAt
        })),
        pagination: {
          total: totalLogs,
          limit,
          offset,
          hasMore: offset + limit < totalLogs
        }
      }
    });
  } catch (error) {
    console.error('Erro no endpoint de logs de uso:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

