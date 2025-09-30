"use client";

import { AuthProvider as SupabaseAuthProvider } from "@/hooks/useAuth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
};

