import { signUpSchema } from "@/schema/signUpSchema";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { initializeUserCredits } from "@/lib/credit-manager";

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

    // Buscar o plano Free
    const freePlan = await db.plan.findFirst({
      where: { name: 'Free' }
    });

    if (!freePlan) {
      return NextResponse.json({ error: "Plano Free não encontrado" }, { status: 500 });
    }

    // Criar usuário no banco
    const user = await db.user.create({
      data: {
        email,
        username,
        hashedPassword,
        name: username,
        completedOnboarding: false,
        emailVerified: new Date(),
        planId: freePlan.id
      }
    });

    // Inicializar créditos do usuário
    await initializeUserCredits(user.id, freePlan.id);

    // Gerar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        provider: 'local'
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Criar resposta com cookie
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        completedOnboarding: user.completedOnboarding
      }
    }, { status: 201 });

    // Definir cookie com o token
    response.cookies.set('auth-token', token, {
      httpOnly: false, // Permitir acesso via JavaScript para compatibilidade
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/'
    });

    return response;

  } catch (err) {
    console.error("Erro no signup local:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

