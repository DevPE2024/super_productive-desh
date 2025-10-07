import { NextRequest, NextResponse } from 'next/server';
import { purchaseExtraPoints } from '@/lib/points-system';
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
    const { packageId } = body;

    if (!packageId) {
      return NextResponse.json(
        { error: 'ID do pacote é obrigatório' },
        { status: 400 }
      );
    }

    // Comprar pontos extras
    const result = await purchaseExtraPoints(session.user.id, packageId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        newBalance: result.newBalance
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
    console.error('Erro no endpoint de compra de pontos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

