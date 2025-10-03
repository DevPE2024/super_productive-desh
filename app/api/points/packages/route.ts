import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Buscar todos os pacotes de pontos extras disponíveis
    const packages = await db.extraPointsPackage.findMany({
      orderBy: { extraPoints: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: packages.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        extraPoints: pkg.extraPoints,
        priceUsd: pkg.priceUsd,
        pricePerPoint: (Number(pkg.priceUsd) / pkg.extraPoints).toFixed(3)
      }))
    });
  } catch (error) {
    console.error('Erro no endpoint de pacotes de pontos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}