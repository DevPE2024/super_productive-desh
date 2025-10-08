'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface CheckoutSuccessHandlerProps {
  userId: string;
}

export function CheckoutSuccessHandler({ userId }: CheckoutSuccessHandlerProps) {
  const searchParams = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    const sessionId = searchParams.get('session_id');
    const plan = searchParams.get('plan');

    // Verificar se é um checkout success e se ainda não foi processado
    if (success === 'true' && sessionId && plan && !processed && !processing) {
      processCheckoutSuccess(sessionId, plan);
    }
  }, [searchParams, processed, processing]);

  const processCheckoutSuccess = async (sessionId: string, planName: string) => {
    setProcessing(true);
    
    try {
      console.log('Processando checkout success:', { sessionId, planName, userId });
      
      const response = await fetch('/api/checkout/process-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          planName,
          userId
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Plano atualizado com sucesso!",
          description: `Seu plano foi alterado para ${planName}. Seus créditos foram atualizados.`,
          variant: "default",
        });
        
        setProcessed(true);
        
        // Recarregar a página após 2 segundos para atualizar os dados
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(data.error || 'Erro ao processar checkout');
      }
    } catch (error) {
      console.error('Erro ao processar checkout success:', error);
      toast({
        title: "Erro ao atualizar plano",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Mostrar indicador de processamento apenas se estiver processando
  if (processing) {
    return (
      <Card className="mb-4 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Processando seu pagamento...</p>
              <p className="text-sm text-blue-700">Atualizando seu plano e créditos.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mostrar confirmação se foi processado com sucesso
  if (processed) {
    return (
      <Card className="mb-4 border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Plano atualizado com sucesso!</p>
              <p className="text-sm text-green-700">Seus créditos foram renovados. A página será recarregada em breve.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Não renderizar nada se não há checkout success para processar
  return null;
}