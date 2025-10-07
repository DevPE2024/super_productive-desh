import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Sistema de pontos não implementado completamente
    // Retornando dados mockados para evitar erros
    const packages = [
      {
        id: 1,
        name: "Small Pack",
        extraPoints: 50,
        priceUsd: 5.00,
        pricePerPoint: "0.100"
      },
      {
        id: 2,
        name: "Medium Pack", 
        extraPoints: 100,
        priceUsd: 9.00,
        pricePerPoint: "0.090"
      },
      {
        id: 3,
        name: "Large Pack",
        extraPoints: 200,
        priceUsd: 16.00,
        pricePerPoint: "0.080"
      }
    ];

    return NextResponse.json({
      success: true,
      data: packages
    });
  } catch (error) {
    console.error('Erro no endpoint de pacotes de pontos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

