'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PlanInfo {
  name: string;
  price: string;
  priceId: string;
  features: string[];
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  
  // Form data
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const priceId = searchParams.get('priceId');
    
    // Definir informações do plano baseado no priceId
    if (priceId === 'price_1SFgg12MKUskrPofzBJ9XZE0') {
      setPlanInfo({
        name: 'Pro',
        price: '$25',
        priceId,
        features: [
          '⚡ 400 AI credits/month',
          'Unlimited workspaces',
          'Priority support',
          'Advanced features'
        ]
      });
    } else if (priceId === 'price_1SFggA2MKUskrPofKMMHqWuJ') {
      setPlanInfo({
        name: 'Max',
        price: '$60',
        priceId,
        features: [
          '⚡ 800 AI credits/month',
          'Everything in Pro',
          'Advanced permissions',
          'Dedicated support'
        ]
      });
    } else {
      // Redirecionar para pricing se não houver priceId válido
      router.push('/pricing');
    }
  }, [searchParams, router]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!planInfo) return;

    // Validações básicas
    if (!cardNumber || !expiryDate || !cvv || !cardName || !email) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Em desenvolvimento, simular sucesso
      if (process.env.NODE_ENV === 'development') {
        toast({
          title: "Pagamento processado!",
          description: "Sua assinatura foi ativada com sucesso",
          variant: "default"
        });
        
        // Redirecionar para dashboard com sucesso
        router.push('/dashboard?success=true&plan=' + planInfo.name);
      } else {
        // Em produção, usar Stripe real
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            priceId: planInfo.priceId,
            paymentMethod: {
              cardNumber: cardNumber.replace(/\s/g, ''),
              expiryDate,
              cvv,
              cardName,
              email
            }
          }),
        });

        const data = await response.json();

        if (response.ok && data.url) {
          window.location.href = data.url;
        } else {
          throw new Error(data.error || 'Erro no processamento');
        }
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      toast({
        title: "Erro no pagamento",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!planInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
          <p className="text-gray-600 mt-2">
            Complete seu pagamento para ativar o plano {planInfo.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de Pagamento */}
          <Card className="order-2 lg:order-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Informações de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cardName">Nome no Cartão</Label>
                  <Input
                    id="cardName"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="João Silva"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Validade</Label>
                    <Input
                      id="expiry"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/AA"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <Lock className="h-4 w-4" />
                  Seus dados estão protegidos com criptografia SSL
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Pagar {planInfo.price}/mês
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Resumo do Pedido */}
          <Card className="order-1 lg:order-2 h-fit">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Plano {planInfo.name}</h3>
                  <Badge variant="secondary">Mensal</Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{planInfo.price}</div>
                  <div className="text-sm text-gray-600">por mês</div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Recursos inclusos:</h4>
                <ul className="space-y-1">
                  {planInfo.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{planInfo.price}/mês</span>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>• Cobrança recorrente mensal</p>
                <p>• Cancele a qualquer momento</p>
                <p>• Suporte prioritário incluído</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
