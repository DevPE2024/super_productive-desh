import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const workspaceId = url.searchParams.get("workspaceId");

  if (!workspaceId)
    return NextResponse.json("ERRORS.NO_WORKSPACE", { status: 404 });

  try {
    const users = await db.user.findMany({
      where: {
        workspaceSubscriptions: {
          some: { workspaceId },
        },
      },
      include: {
        workspaceSubscriptions: {
          where: {
            workspaceId,
          },
          select: {
            userRole: true,
          },
        },
      },
    });

    const returnUsers = users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        image: user.image,
        userRole: user.workspaceSubscriptions[0].userRole,
      };
    });

    return NextResponse.json(returnUsers, { status: 200 });
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
};


