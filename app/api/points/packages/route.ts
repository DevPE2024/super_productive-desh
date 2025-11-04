import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';

// Pacotes de pontos disponíveis
const POINT_PACKAGES = [
  {
    id: 'small',
    name: 'Small Pack',
    extraPoints: 100,
    priceUsd: 15,
    pricePerPoint: '0.150'
  },
  {
    id: 'medium', 
    name: 'Medium Pack',
    extraPoints: 250,
    priceUsd: 25,
    pricePerPoint: '0.100'
  },
  {
    id: 'large',
    name: 'Large Pack', 
    extraPoints: 500,
    priceUsd: 40,
    pricePerPoint: '0.080'
  }
];

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getAuthSession(request);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: POINT_PACKAGES
    });
  } catch (error) {
    console.error('Erro ao buscar pacotes de pontos:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
