import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';

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

    // Buscar usuário com plano e saldos
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        plan: {
          include: {
            allocations: {
              include: { app: true }
            }
          }
        },
        balances: {
          include: { app: true }
        }
      }
    });

    if (!user || !user.plan) {
      return NextResponse.json(
        { error: 'Plano não encontrado' },
        { status: 404 }
      );
    }

    // Criar mapa de saldos por app
    const balanceMap = user.balances.reduce((acc, balance) => {
      acc[balance.app.key] = balance.remaining;
      return acc;
    }, {} as Record<string, number>);

    // Organizar dados por app
    const appPoints = user.plan.allocations.map(allocation => ({
      appKey: allocation.app.key,
      appName: allocation.app.name,
      monthlyPoints: allocation.monthlyPoints,
      remaining: balanceMap[allocation.app.key] || 0,
      isUnlimited: allocation.monthlyPoints === null
    }));

    // Separar apps com créditos e ilimitados
    const appsWithCredits = appPoints.filter(app => !app.isUnlimited);
    const unlimitedApps = appPoints.filter(app => app.isUnlimited);

    return NextResponse.json({
      success: true,
      data: {
        planName: user.plan.name,
        appsWithCredits,
        unlimitedApps,
        totalMonthlyCredits: appsWithCredits.reduce((sum, app) => sum + (app.monthlyPoints || 0), 0),
        totalRemaining: appsWithCredits.reduce((sum, app) => sum + app.remaining, 0)
      }
    });
  } catch (error) {
    console.error('Erro no endpoint de pontos por app:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

