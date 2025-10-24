import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AppKey } from '@prisma/client';

// Headers CORS para permitir requisições do OpenUIX
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// OPTIONS - Preflight CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET - Verificar saldo de créditos para OpenUIX
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userEmail = searchParams.get('email');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar usuário pelo email
    const user = await db.user.findUnique({
      where: { email: userEmail },
      include: {
        plan: true,
        balances: {
          include: { app: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Buscar saldo do OpenUIX
    const openuixBalance = user.balances.find(b => b.app.key === AppKey.OPENUIX);

    if (!openuixBalance) {
      return NextResponse.json(
        { error: 'Saldo não encontrado para OpenUIX' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      credits: openuixBalance.remaining,
      planName: user.plan?.name || 'Free',
      hasCredits: openuixBalance.remaining > 0
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Erro ao verificar créditos do OpenUIX:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Consumir créditos do OpenUIX
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, credits = 1 } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar usuário pelo email
    const user = await db.user.findUnique({
      where: { email },
      include: {
        plan: true,
        balances: {
          include: { app: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Buscar saldo do OpenUIX
    const openuixBalance = user.balances.find(b => b.app.key === AppKey.OPENUIX);

    if (!openuixBalance) {
      return NextResponse.json(
        { error: 'Saldo não encontrado para OpenUIX' },
        { status: 404 }
      );
    }

    // Verificar se há créditos suficientes
    if (openuixBalance.remaining < credits) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Créditos insuficientes',
          credits: openuixBalance.remaining,
          required: credits
        },
        { status: 402 } // Payment Required
      );
    }

    // Consumir créditos
    const updatedBalance = await db.userAppBalance.update({
      where: {
        userId_appId: {
          userId: user.id,
          appId: openuixBalance.appId
        }
      },
      data: {
        remaining: openuixBalance.remaining - credits
      }
    });

    // Registrar log de uso
    await db.usageLog.create({
      data: {
        userId: user.id,
        appId: openuixBalance.appId,
        actionType: 'ai_chat_message',
        pointsUsed: credits
      }
    });

    return NextResponse.json({
      success: true,
      credits: updatedBalance.remaining,
      consumed: credits,
      message: 'Créditos consumidos com sucesso'
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Erro ao consumir créditos do OpenUIX:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
