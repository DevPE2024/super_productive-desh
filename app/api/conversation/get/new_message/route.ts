import { MESSAGES_LIMIT } from "@/lib/constants";
import { db } from "@/lib/db";
import { sortMindMapsAndTasksDataByUpdatedAt } from "@/lib/sortMindMapsAndTasksDataByUpdatedAt";
import { HomeRecentActivity } from "@/types/extended";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const messageId = url.searchParams.get("messageId");

  if (!messageId)
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 404 });

  try {
    const message = await db.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        additionalResources: {
          select: {
            id: true,
            name: true,
            type: true,
            url: true,
            message: true,
          },
        },
      },
    });

    if (!message) {
      return NextResponse.json("ERRORS.NO_MESSAGE", { status: 200 });
    }

    return NextResponse.json(message, { status: 200 });
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 404 });
  }
};

