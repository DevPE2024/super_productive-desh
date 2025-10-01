import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = signInSchema.parse(body)

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Falha na autenticação' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username || data.user.email?.split('@')[0],
      },
    })
  } catch (error) {
    console.error('Erro no signin:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}