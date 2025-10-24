import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * API para verificar e retornar dados de usuário para sincronização com OpenUIX
 * 
 * GET /api/auth/verify-user?email=usuario@example.com
 * 
 * Retorna:
 * {
 *   id: string,
 *   email: string,
 *   name: string | null,
 *   hashedPassword: string
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar usuário no banco
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        hashedPassword: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Retornar dados do usuário (incluindo hash da senha para sincronização)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      hashedPassword: user.hashedPassword,
    });
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

