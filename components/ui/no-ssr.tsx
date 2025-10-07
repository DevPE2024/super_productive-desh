"use client";

import { useEffect, useState } from "react";

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente que evita renderização no servidor (SSR) para prevenir erros de hidratação
 * Útil para componentes que dependem de APIs do navegador ou estado do cliente
 */
export const NoSSR = ({ children, fallback = null }: NoSSRProps) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

