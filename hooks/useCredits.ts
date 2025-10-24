'use client';

import { useState, useCallback } from 'react';
import { ActionType } from '@/lib/points-system';

interface UseCreditsResult {
  consumeCredits: (actionType: ActionType) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useCredits(): UseCreditsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const consumeCredits = useCallback(async (actionType: ActionType): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/points/consume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actionType }),
      });

      const result = await response.json();

      if (result.success) {
        return true;
      } else {
        setError(result.message || 'Erro ao consumir créditos');
        return false;
      }
    } catch (err) {
      setError('Erro de conexão');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    consumeCredits,
    isLoading,
    error,
  };
}
