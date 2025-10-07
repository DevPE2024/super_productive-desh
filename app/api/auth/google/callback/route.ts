import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Erro na autorização Google:', error);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/sign-in?error=google_auth_failed`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/sign-in?error=no_code`);
    }

    // Trocar código por tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Obter informações do usuário
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.email) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/sign-in?error=no_email`);
    }

    // Verificar se usuário já existe
    let user = await prisma.user.findUnique({
      where: { email: userInfo.email }
    });

    // Se não existe, criar novo usuário
    if (!user) {
      // Buscar o plano "Starter" padrão
      const starterPlan = await prisma.plan.findFirst({
        where: { name: "Starter" }
      });

      if (!starterPlan) {
        console.error('Plano "Starter" não encontrado');
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/sign-in?error=plan_not_found`);
      }

      user = await prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name || '',
          image: userInfo.picture || '',
          completedOnboarding: false,
          surname: userInfo.family_name || '',
          username: userInfo.email.split('@')[0],
          planId: starterPlan.id
        }
      });
    } else {
      // Atualizar informações do usuário se necessário
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: userInfo.name || user.name,
          surname: userInfo.family_name || user.surname,
          image: userInfo.picture || user.image,
        }
      });
    }

    // Gerar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        provider: 'google'
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Criar resposta de redirecionamento
    let redirectUrl = `${process.env.NEXTAUTH_URL}/en/dashboard`;
    
    // Se o usuário não completou o onboarding, redirecionar para onboarding
    if (!user.completedOnboarding) {
      redirectUrl = `${process.env.NEXTAUTH_URL}/en/onboarding`;
    }

    const response = NextResponse.redirect(redirectUrl);
    
    // Definir cookie de autenticação
    response.cookies.set('auth-token', token, {
      httpOnly: false, // Permitir acesso via JavaScript para compatibilidade com useAuth
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Erro no callback Google:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/sign-in?error=callback_failed`);
  }
}