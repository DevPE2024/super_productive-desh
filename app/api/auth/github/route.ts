import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'login') {
      // Gerar URL de autorização do GitHub
      const clientId = process.env.GITHUB_CLIENT_ID;
      const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/github/callback`;
      const scope = 'user:email';
      const state = 'login';

      const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

      return NextResponse.redirect(authUrl);
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    console.error('Erro na autenticação GitHub:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Código de autorização necessário' }, { status: 400 });
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
      return NextResponse.json({ error: tokenData.error_description }, { status: 400 });
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
      return NextResponse.json({ error: 'Email não encontrado' }, { status: 400 });
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
      { userId: user.id },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      token,
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
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

