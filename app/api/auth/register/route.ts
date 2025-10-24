import { db } from "@/lib/db";
import { signUpSchema } from "@/schema/signUpSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { initializeUserCredits } from "@/lib/credit-manager";

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const result = signUpSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("Missing fields, Wrong Data", { status: 203 });
  }

  const { email, password, username } = result.data;

  try {
    const existedUsername = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (existedUsername)
      return NextResponse.json("Username is already taken", { status: 202 });

    const existedUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existedUser)
      return NextResponse.json("Email is already taken", { status: 201 });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Buscar o plano Free
    const freePlan = await db.plan.findFirst({
      where: { name: 'Free' }
    });

    if (!freePlan) {
      return NextResponse.json("Plano Free não encontrado", { status: 500 });
    }

    const newUser = await db.user.create({
      data: {
        username,
        email,
        hashedPassword,
        planId: freePlan.id,
        completedOnboarding: false
      },
    });

    // Inicializar créditos do usuário
    await initializeUserCredits(newUser.id, freePlan.id);

    return NextResponse.json(newUser, { status: 200 });
  } catch (err) {
    return NextResponse.json("Something went wrong", { status: 204 });
  }
}


