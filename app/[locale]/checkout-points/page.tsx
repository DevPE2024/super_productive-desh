'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Lock, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PointPackage {
  id: string;
  name: string;
  extraPoints: number;
  priceUsd: number;
  pricePerPoint: string;
}

const POINT_PACKAGES: Record<string, PointPackage> = {
  'small': {
    id: 'small',
    name: 'Small Pack',
    extraPoints: 100,
    priceUsd: 15,
    pricePerPoint: '0.150'
  },
  'medium': {
    id: 'medium',
    name: 'Medium Pack',
    extraPoints: 250,
    priceUsd: 25,
    pricePerPoint: '0.100'
  },
  'large': {
    id: 'large',
    name: 'Large Pack',
    extraPoints: 500,
    priceUsd: 40,
    pricePerPoint: '0.080'
  }
};

export default function CheckoutPointsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [packageInfo, setPackageInfo] = useState<PointPackage | null>(null);
  
  // Form data
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const packageId = searchParams.get('packageId');
    
    if (packageId && POINT_PACKAGES[packageId]) {
      setPackageInfo(POINT_PACKAGES[packageId]);
    } else {
      // Redirecionar para pontos se não houver packageId válido
      router.push('/dashboard/points');
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
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ packageId: packageInfo?.id })
      });

      const data = await response.json();

      if (data.success) {
        if (data.url) {
          // Redirecionar para Stripe Checkout
          window.location.href = data.url;
        } else if (data.newBalance) {
          // Compra processada diretamente (modo dev)
          toast({
            title: "Sucesso!",
            description: `${packageInfo?.extraPoints} pontos adicionados com sucesso!`,
            variant: "default"
          });
          router.push('/dashboard/points');
        }
      } else {
        toast({
          title: "Erro",
          description: data.message || "Falha ao processar pagamento",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro na compra:', error);
      toast({
        title: "Erro",
        description: "Erro de conexão durante a compra",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!packageInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-white">Buy Extra Points</h1>
          <p className="text-gray-300 mt-2 text-lg">
            Complete your payment to add {packageInfo.extraPoints} points to your account
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de Pagamento */}
          <Card className="order-2 lg:order-1 bg-gray-800 border-gray-700 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-white text-xl">
                <CreditCard className="h-6 w-6" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-gray-300 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cardName" className="text-gray-300 font-medium">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Silva"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber" className="text-gray-300 font-medium">Card Number</Label>
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry" className="text-gray-300 font-medium">Expiry Date</Label>
                    <Input
                      id="expiry"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-gray-300 font-medium">CVV</Label>
                    <Input
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-700 p-3 rounded-lg">
                  <Lock className="h-4 w-4" />
                  Your data is protected with SSL encryption
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Pay ${packageInfo.priceUsd}
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="order-1 lg:order-2 h-fit bg-gray-800 border-gray-700 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-t-lg">
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                Purchase Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-xl text-white">{packageInfo.name}</h3>
                  <Badge className="bg-orange-600 text-white">Extra Points</Badge>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">${packageInfo.priceUsd}</div>
                  <div className="text-sm text-gray-400">one-time payment</div>
                </div>
              </div>

              <Separator className="bg-gray-600" />

              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{packageInfo.extraPoints}</div>
                  <div className="text-lg text-purple-100">extra points</div>
                  <div className="text-sm text-purple-200 mt-1">
                    ${packageInfo.pricePerPoint} per point
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-white text-lg">Benefits:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Points never expire
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Instant activation
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Distributed across all apps
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Used after monthly points
                  </li>
                </ul>
              </div>

              <Separator className="bg-gray-600" />

              <div className="flex justify-between font-semibold text-xl">
                <span className="text-white">Total</span>
                <span className="text-white">${packageInfo.priceUsd}</span>
              </div>

              <div className="text-xs text-gray-400 space-y-2 bg-gray-700 p-4 rounded-lg">
                <p>• One-time payment (non-recurring)</p>
                <p>• Points added instantly</p>
                <p>• Support included</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
