import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { getUsageHistory } from "@/lib/credit-manager";
import { AppKey } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const appKey = searchParams.get("appKey") as AppKey | null;
    const limit = parseInt(searchParams.get("limit") || "50");

    // Validar appKey se fornecido
    if (appKey && !Object.values(AppKey).includes(appKey)) {
      return NextResponse.json(
        { error: "Invalid app key" },
        { status: 400 }
      );
    }

    const history = await getUsageHistory(session.user.id, appKey || undefined, limit);

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Erro ao buscar histórico de uso:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

