import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Erro ao trocar código por sessão:', error);
        return NextResponse.redirect(`${requestUrl.origin}/auth/error`);
      }

      // Verificar o status do usuário após login bem-sucedido
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('Usuário autenticado no callback:', user.id);
        
        // Redirecionar diretamente para o dashboard após autenticação bem-sucedida
        console.log('Usuário autenticado com sucesso, redirecionando para dashboard');
        return NextResponse.redirect(`${requestUrl.origin}/en/dashboard`);
      }
    } catch (error) {
      console.error('Erro no callback de autenticação:', error);
      return NextResponse.redirect(`${requestUrl.origin}/auth/error`);
    }
  }

  // Fallback para dashboard se não houver código
  return NextResponse.redirect(`${requestUrl.origin}/en/dashboard`);
}

