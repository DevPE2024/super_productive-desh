import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

export interface AuthSession {
  user: {
    id: string;
    email?: string;
    name?: string;
    image?: string;
    username?: string;
    surname?: string;
    completedOnboarding?: boolean;
  };
}

export async function getAuthSession(request?: NextRequest): Promise<AuthSession | null> {
  try {
    // Pegar token do cookie ou header Authorization
    let token: string | undefined;
    
    if (request) {
      // Tentar pegar do cookie primeiro
      token = request.cookies.get("auth-token")?.value;
      
      // Se não encontrar no cookie, tentar no header Authorization
      if (!token) {
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.substring(7);
        }
      }
    } else {
      // Para server components, usar cookies() do Next.js
      try {
        const cookieStore = cookies();
        token = cookieStore.get("auth-token")?.value;
      } catch (error) {
        console.log("Erro ao acessar cookies:", error);
        return null;
      }
    }

    if (!token) {
      console.log("Token não encontrado");
      return null;
    }

    // Verificar e decodificar o JWT
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { userId: string };
    
    if (!decoded.userId) {
      return null;
    }

    // Buscar usuário no banco de dados
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        username: true,
        surname: true,
        completedOnboarding: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email || undefined,
        name: user.name || undefined,
        image: user.image || undefined,
        username: user.username || undefined,
        surname: user.surname || undefined,
        completedOnboarding: user.completedOnboarding || undefined,
      },
    };
  } catch (error) {
    console.error("Erro ao verificar sessão:", error);
    return null;
  }
}

