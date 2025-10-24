import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POINTS_PER_PROMPT = 1; // 1 ponto por envio de prompt

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        balances: {
          where: {
            app: {
              key: "JAZZUP",
            },
          },
          include: {
            app: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const balance = user.balances[0];

    if (!balance) {
      return NextResponse.json(
        { error: "Saldo não encontrado para o JazzUp" },
        { status: 404 }
      );
    }

    // Verificar se há créditos suficientes
    if (balance.remaining < POINTS_PER_PROMPT) {
      return NextResponse.json(
        {
          error: "Créditos insuficientes",
          remaining: balance.remaining,
          required: POINTS_PER_PROMPT,
        },
        { status: 402 }
      );
    }

    // Atualizar saldo
    const updatedBalance = await prisma.userAppBalance.update({
      where: {
        id: balance.id,
      },
      data: {
        remaining: {
          decrement: POINTS_PER_PROMPT,
        },
      },
    });

    // Registrar uso
    await prisma.usageLog.create({
      data: {
        userId: user.id,
        appId: balance.appId,
        actionType: "AI_PROMPT",
        pointsUsed: POINTS_PER_PROMPT,
      },
    });

    console.log(`✅ ${POINTS_PER_PROMPT} ponto(s) consumido(s) do usuário ${user.email} no JazzUp`);

    return NextResponse.json({
      success: true,
      remaining: updatedBalance.remaining,
      pointsUsed: POINTS_PER_PROMPT,
      message: `${POINTS_PER_PROMPT} ponto(s) consumido(s) com sucesso`,
    });
  } catch (error) {
    console.error("Erro ao consumir créditos do JazzUp:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

