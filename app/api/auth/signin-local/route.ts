import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const result = signInSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const { email, password } = result.data;

  try {
    // Buscar usuário no banco
    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user || !user.hashedPassword) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

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
    }, { status: 200 });

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
    console.error("Erro no signin local:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

