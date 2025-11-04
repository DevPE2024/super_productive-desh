import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const url = new URL(request.url);

  const userId = url.searchParams.get("userId");

  if (!userId) return NextResponse.json("ERRORS.NO_USER_API", { status: 404 });

  try {
    const workspaceSubscriptions = await db.workspaceSubscription.findMany({
      where: {
        userId,
      },
      include: {
        workspace: true,
      },
    });

    const workspace = workspaceSubscriptions.map(
      (subscription) => subscription.workspace
    );

    if (!workspace) return NextResponse.json([], { status: 200 });

    return NextResponse.json(workspace, { status: 200 });
  } catch (error) {
    console.error("Error in user_workspaces:", error);
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
};


