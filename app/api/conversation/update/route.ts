import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { editMessageSchema } from "@/schema/messageSchema";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 400,
      statusText: "Unauthorized User",
    });
  }

  const body: unknown = await request.json();

  const result = editMessageSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { content, id } = result.data;

  if (content.trim().length === 0) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) return NextResponse.json("ERROR.NO_USER_API", { status: 404 });

    const message = await db.message.findUnique({
      where: { id },
    });

    if (!message) return NextResponse.json("ERROR.NO_MESSAGE", { status: 404 });

    await db.message.update({
      where: { id: message.id },
      data: {
        content,
        edited: true,
      },
    });

    return NextResponse.json("ok", { status: 200 });
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}


