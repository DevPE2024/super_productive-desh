import { NextRequest, NextResponse } from 'next/server';
import { getUserPointsInfo } from '@/lib/points-system';
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

    // Obter informações de pontos do usuário
    const pointsInfo = await getUserPointsInfo(session.user.id);

    if (!pointsInfo) {
      return NextResponse.json(
        { error: 'Informações de pontos não encontradas' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        pointsBalance: pointsInfo.pointsBalance,
        planName: pointsInfo.planName,
        pointsPerMonth: pointsInfo.pointsPerMonth,
        renewDate: pointsInfo.renewDate,
        daysUntilRenewal: Math.ceil(
          (pointsInfo.renewDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )
      }
    });
  } catch (error) {
    console.error('Erro no endpoint de saldo de pontos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

