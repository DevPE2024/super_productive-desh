import { NextRequest, NextResponse } from 'next/server';
import { renewMonthlyPoints } from '@/lib/points-system';

export async function POST(request: NextRequest) {
  try {
    // Verificar se é uma chamada administrativa (pode ser um cron job ou chamada interna)
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_API_KEY;

    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: 'Não autorizado - chave de admin necessária' },
        { status: 401 }
      );
    }

    // Executar renovação mensal
    await renewMonthlyPoints();

    return NextResponse.json({
      success: true,
      message: 'Renovação mensal de pontos executada com sucesso'
    });
  } catch (error) {
    console.error('Erro no endpoint de renovação de pontos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}