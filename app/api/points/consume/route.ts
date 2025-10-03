import { NextRequest, NextResponse } from 'next/server';
import { consumePoints } from '@/lib/points-system';
import { getAuthSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getAuthSession(request);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { actionType } = body;

    if (!actionType) {
      return NextResponse.json(
        { error: 'Tipo de ação é obrigatório' },
        { status: 400 }
      );
    }

    // Consumir pontos
    const result = await consumePoints(session.user.id, actionType);

    if (result.success) {
      return NextResponse.json({
        success: true,
        remaining: result.remaining,
        message: 'Pontos consumidos com sucesso'
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: result.message 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erro no endpoint de consumo de pontos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}