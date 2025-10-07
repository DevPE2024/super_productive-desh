import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { consumeCredits } from "@/lib/credit-manager";
import { AppKey } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { appKey, credits } = await req.json();

    // Validar parâmetros
    if (!appKey || !credits || credits <= 0) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    // Validar se o appKey é válido
    if (!Object.values(AppKey).includes(appKey)) {
      return NextResponse.json(
        { error: "Invalid app key" },
        { status: 400 }
      );
    }

    const result = await consumeCredits(session.user.id, appKey, credits);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      remainingCredits: result.remainingCredits,
    });
  } catch (error) {
    console.error("Erro ao consumir créditos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

