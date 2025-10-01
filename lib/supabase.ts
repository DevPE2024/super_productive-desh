"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

// Cliente Supabase para uso no browser
export const supabase = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// Cliente Supabase singleton para uso consistente
let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseInstance;
};

// Tipos para autenticação
export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  username?: string;
  surname?: string;
  image?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
    full_name?: string;
    username?: string;
    surname?: string;
  };
};

export type AuthSession = {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
  expires_at?: number;
};

// Funções de autenticação
export const authHelpers = {
  // Login com email e senha
  signInWithEmail: async (email: string, password: string) => {
    const client = getSupabaseClient();
    return await client.auth.signInWithPassword({ email, password });
  },

  // Registro com email e senha
  signUpWithEmail: async (email: string, password: string, name?: string) => {
    const client = getSupabaseClient();
    return await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
          full_name: name || '',
        }
      }
    });
  },

  // Login com provedor OAuth (Google, GitHub)
  signInWithProvider: async (provider: 'google' | 'github') => {
    const client = getSupabaseClient();
    return await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  },

  // Logout
  signOut: async () => {
    const client = getSupabaseClient();
    return await client.auth.signOut();
  },

  // Obter sessão atual
  getSession: async () => {
    const client = getSupabaseClient();
    return await client.auth.getSession();
  },

  // Obter usuário atual
  getUser: async () => {
    const client = getSupabaseClient();
    return await client.auth.getUser();
  },

  // Escutar mudanças de autenticação
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    const client = getSupabaseClient();
    return client.auth.onAuthStateChange(callback);
  }
};

