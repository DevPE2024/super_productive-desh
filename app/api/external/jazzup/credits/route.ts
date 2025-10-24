import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

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
        plan: true,
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

    // Buscar alocação do plano para JazzUp
    const planAllocation = await prisma.planAppAllocation.findFirst({
      where: {
        planId: user.planId || 1,
        app: {
          key: "JAZZUP",
        },
      },
    });

    const balance = user.balances[0];
    const remaining = balance?.remaining || 0;
    const total = planAllocation?.monthlyPoints || 0;
    const percentage = total > 0 ? Math.round((remaining / total) * 100) : 0;

    return NextResponse.json({
      remaining,
      total,
      planName: user.plan?.name || "Free",
      percentage,
      userId: user.id,
    });
  } catch (error) {
    console.error("Erro ao buscar créditos do JazzUp:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

