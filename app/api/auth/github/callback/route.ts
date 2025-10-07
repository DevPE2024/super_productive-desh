import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Erro na autorização GitHub:', error);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/sign-in?error=github_auth_failed`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/sign-in?error=no_code`);
    }

    // Trocar código por access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/sign-in?error=${tokenData.error}`);
    }

    // Usar o access token para obter informações do usuário
    const octokit = new Octokit({
      auth: tokenData.access_token,
    });

    const { data: userInfo } = await octokit.rest.users.getAuthenticated();
    
    // Obter emails do usuário
    const { data: emails } = await octokit.rest.users.listEmailsForAuthenticated();
    const primaryEmail = emails.find(email => email.primary)?.email || userInfo.email;

    if (!primaryEmail) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/sign-in?error=no_email`);
    }

    // Verificar se usuário já existe
    let user = await prisma.user.findUnique({
      where: { email: primaryEmail }
    });

    // Se não existe, criar novo usuário
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: primaryEmail,
          name: userInfo.name || userInfo.login,
          image: userInfo.avatar_url || '',
          completedOnboarding: false,
          surname: '',
          username: userInfo.login || primaryEmail.split('@')[0],
        }
      });
    } else {
      // Atualizar informações do usuário se necessário
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: userInfo.name || user.name,
          username: userInfo.login || user.username,
          image: userInfo.avatar_url || user.image,
        }
      });
    }

    // Gerar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        provider: 'github'
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Retornar dados do usuário
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
    console.error('Erro no callback GitHub:', error);
    return NextResponse.json({ error: 'Callback failed' }, { status: 500 });
  }
}

