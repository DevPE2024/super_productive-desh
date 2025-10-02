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
      user = await prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name || '',
          image: userInfo.picture || '',
          completedOnboarding: false,
          surname: userInfo.family_name || '',
          username: userInfo.email.split('@')[0]
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

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        surname: user.surname,
        username: user.username,
      }
    });

  } catch (error) {
    console.error('Erro no callback Google:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/sign-in?error=callback_failed`);
  }
}