import { signUpSchema } from "@/schema/signUpSchema";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const result = signUpSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("Missing fields, Wrong Data", { status: 400 });
  }

  const { email, password, username } = result.data;

  try {
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

    // Criar usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          name: '',
          surname: '',
          completedOnboarding: true,
          email_confirm: true
        }
      }
    });

    if (error) {
      console.error("Erro no signup do Supabase:", error);
      
      // Verificar se é erro de usuário já existente
      if (error.message.includes('already registered')) {
        return NextResponse.json("Email is already taken", { status: 409 });
      }
      
      return NextResponse.json(error.message, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json("Failed to create user", { status: 500 });
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        username: username
      }
    }, { status: 200 });

  } catch (err) {
    console.error("Erro no signup:", err);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}