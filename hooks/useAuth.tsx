"use client";

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

// Tipos para o contexto de autenticação local
interface LocalUser {
  id: string;
  email?: string;
  name?: string;
  username?: string;
  surname?: string;
  image?: string;
  completedOnboarding?: boolean;
}

interface AuthContextType {
  user: LocalUser | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithProvider: (provider: 'google') => Promise<void>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
}

// Contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider de autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  // Garantir hidratação consistente
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Inicializar autenticação local apenas após hidratação
  useEffect(() => {
    if (!isHydrated) return;

    const initAuth = async () => {
      try {
        // Verificar se estamos no cliente antes de acessar localStorage
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          const userData = localStorage.getItem('user_data');
          
          if (token && userData) {
            const user = JSON.parse(userData);
            setUser(user);
            setSession({ token, user });
            
            // Garantir que o cookie também esteja definido
            document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        // Limpar dados corrompidos apenas no cliente
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [isHydrated]);

  // Login com email e senha (autenticação local)
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/signin-local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const userData = result.user;
        const token = result.token; // Usar o token JWT real do servidor
        
        // Salvar no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(userData));
          
          // Salvar no cookie para o servidor poder acessar
          document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        }
        
        // Atualizar estado
        setUser(userData);
        setSession({ token, user: userData });
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta!",
        });
        
        return { success: true };
      } else {
        return { success: false, error: result.error || "Credenciais inválidas" };
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Erro interno do servidor";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Registro com email e senha (autenticação local)
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/signup-local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username: name || email.split('@')[0] }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const userData = result.user;
        const token = result.token; // Usar o token JWT real do servidor
        
        // Salvar no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(userData));
          
          // Salvar no cookie para o servidor poder acessar
          document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        }
        
        // Atualizar estado
        setUser(userData);
        setSession({ token, user: userData });
        
        toast({
          title: "Conta criada com sucesso!",
          description: "Você já está logado!",
        });
        return { success: true };
      } else {
        return { success: false, error: result.error || "Erro ao criar conta" };
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Erro interno do servidor";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login com provedor OAuth
  const signInWithProvider = async (provider: 'google') => {
    try {
      setLoading(true);
      
      // Redirecionar para o endpoint OAuth do provedor
      const authUrl = `/api/auth/${provider}?action=login`;
      // Verificar se estamos no cliente antes de acessar window
      if (typeof window !== 'undefined') {
        window.location.href = authUrl;
      }
      
    } catch (error) {
      console.error(`Erro no login com ${provider}:`, error);
      toast({
        title: "Erro no login",
        description: `Não foi possível fazer login com ${provider}. Tente novamente.`,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Logout
  const signOut = async () => {
    try {
      setLoading(true);
      
      // Limpar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        
        // Limpar cookie
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      
      // Limpar estado
      setUser(null);
      setSession(null);
      
      toast({
        title: "Logout realizado com sucesso!",
        description: "Até logo!",
      });
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.message || "Erro ao fazer logout";
      return { success: false, error: errorMessage };
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

