"use client";

// Tipos para autenticação local
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

// Cliente mock para compatibilidade com código existente
export const supabase = () => {
  console.warn('Supabase client chamado, mas autenticação local está ativa');
  return null;
};

export const getSupabaseClient = () => {
  console.warn('Supabase client chamado, mas autenticação local está ativa');
  return null;
};

// Funções de autenticação (desabilitadas para autenticação local)
export const authHelpers = {
  // Login com email e senha
  signInWithEmail: async (email: string, password: string) => {
    console.warn('authHelpers.signInWithEmail chamado, mas autenticação local está ativa');
    return { data: null, error: { message: 'Use autenticação local' } };
  },

  // Registro com email e senha
  signUpWithEmail: async (email: string, password: string, name?: string) => {
    console.warn('authHelpers.signUpWithEmail chamado, mas autenticação local está ativa');
    return { data: null, error: { message: 'Use autenticação local' } };
  },

  // Login com provedor OAuth (Google, GitHub)
  signInWithProvider: async (provider: 'google' | 'github') => {
    console.warn('authHelpers.signInWithProvider chamado, mas autenticação local está ativa');
    return { data: null, error: { message: 'Use autenticação local' } };
  },

  // Logout
  signOut: async () => {
    console.warn('authHelpers.signOut chamado, mas autenticação local está ativa');
    return { error: null };
  },

  // Obter sessão atual
  getSession: async () => {
    console.warn('authHelpers.getSession chamado, mas autenticação local está ativa');
    return { data: { session: null }, error: null };
  },

  // Obter usuário atual
  getUser: async () => {
    console.warn('authHelpers.getUser chamado, mas autenticação local está ativa');
    return { data: { user: null }, error: null };
  },

  // Escutar mudanças de autenticação
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    console.warn('authHelpers.onAuthStateChange chamado, mas autenticação local está ativa');
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
};

