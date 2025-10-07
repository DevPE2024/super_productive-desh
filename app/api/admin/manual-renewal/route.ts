import { NextRequest, NextResponse } from 'next/server';
import { manualRenewal } from '@/lib/cron-jobs';

export async function POST(request: NextRequest) {
  try {
    // Verificar se é uma chamada administrativa
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_API_KEY;

    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: 'Não autorizado - chave de admin necessária' },
        { status: 401 }
      );
    }

    // Executar renovação manual
    await manualRenewal();

    return NextResponse.json({
      success: true,
      message: 'Renovação manual de pontos executada com sucesso'
    });
  } catch (error) {
    console.error('Erro no endpoint de renovação manual:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

