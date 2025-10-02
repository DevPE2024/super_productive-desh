import { signUpSchema } from "@/schema/signUpSchema";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const result = signUpSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const { email, password, username } = result.data;

  try {
    // Verificar se o usuário já existe
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ 
        error: existingUser.email === email ? "Email já está em uso" : "Username já está em uso" 
      }, { status: 409 });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário no banco
    const user = await db.user.create({
      data: {
        email,
        username,
        hashedPassword,
        name: username,
        completedOnboarding: true,
        emailVerified: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name
      }
    }, { status: 201 });

  } catch (err) {
    console.error("Erro no signup local:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}