"use client";

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient, authHelpers, AuthUser } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

// Tipos para o contexto de autenticação
interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithProvider: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

// Contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider de autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Função para transformar User do Supabase em AuthUser
  const transformUser = (supabaseUser: User): AuthUser => ({
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || '',
    image: supabaseUser.user_metadata?.avatar_url || '',
    user_metadata: supabaseUser.user_metadata
  });

  // Inicializar autenticação
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await authHelpers.getSession();
        
        if (session?.user) {
          setSession(session);
          setUser(transformUser(session.user));
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = authHelpers.onAuthStateChange(
      async (event, session) => {
        console.log('Evento de autenticação:', event, session);
        
        if (session?.user) {
          setSession(session);
          setUser(transformUser(session.user));
        } else {
          setSession(null);
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Login com email e senha
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await authHelpers.signInWithEmail(email, password);
      
      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      if (data.user) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta!",
        });
        router.push('/dashboard');
        return { success: true };
      }

      return { success: false, error: "Erro desconhecido" };
    } catch (error: any) {
      const errorMessage = error?.message || "Erro interno do servidor";
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Registro com email e senha
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      const { data, error } = await authHelpers.signUpWithEmail(email, password, name);
      
      if (error) {
        toast({
          title: "Erro no registro",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      if (data.user) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu email para confirmar a conta.",
        });
        return { success: true };
      }

      return { success: false, error: "Erro desconhecido" };
    } catch (error: any) {
      const errorMessage = error?.message || "Erro interno do servidor";
      toast({
        title: "Erro no registro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login com provedor OAuth
  const signInWithProvider = async (provider: 'google' | 'github') => {
    try {
      setLoading(true);
      const { error } = await authHelpers.signInWithProvider(provider);
      
      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error?.message || "Erro interno do servidor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const signOut = async () => {
    try {
      setLoading(true);
      await authHelpers.signOut();
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      router.push('/');
    } catch (error: any) {
      toast({
        title: "Erro no logout",
        description: error?.message || "Erro interno do servidor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithProvider,
    signOut,
    isAuthenticated: !!user && !!session
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

