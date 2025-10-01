import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { AuthUser } from "./supabase";
import { syncUserWithPrisma } from "./syncUser";

interface CookieToSet {
  name: string;
  value: string;
  options?: any;
}

export async function getAuthSession() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: CookieToSet) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      console.log("Nenhuma sessão encontrada:", error?.message);
      return null;
    }

    // Buscar dados adicionais do usuário na tabela auth.users
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.log("Erro ao buscar dados do usuário:", userError?.message);
      return null;
    }

    // Criar um usuário com dados do Supabase Auth
    const user: AuthUser & { completedOnboarding: boolean } = {
      id: userData.user.id,
      email: userData.user.email,
      name: userData.user.user_metadata?.full_name || userData.user.user_metadata?.name || userData.user.email?.split('@')[0],
      username: userData.user.user_metadata?.username || userData.user.email?.split('@')[0],
      surname: userData.user.user_metadata?.surname,
      image: userData.user.user_metadata?.avatar_url,
      user_metadata: userData.user.user_metadata,
      completedOnboarding: true // Assumir que completou onboarding para permitir acesso ao dashboard
    };

    // Sincronizar usuário com a tabela User do Prisma
    await syncUserWithPrisma(userData.user.id);

    console.log("Usuário autenticado:", {
      id: user.id,
      email: user.email,
      name: user.name,
      completedOnboarding: user.completedOnboarding
    });

    return { user };
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return null;
  }
}

