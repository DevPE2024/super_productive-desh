'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Coins, TrendingUp, Calendar, ArrowRight, Star, Crown } from 'lucide-react';
import Link from 'next/link';

interface CreditsData {
  pointsBalance: number;
  planName: string;
  pointsPerMonth: number;
  renewDate: string;
  daysUntilRenewal: number;
}

export function CreditsOverview() {
  const [creditsData, setCreditsData] = useState<CreditsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/points/balance');
      const data = await response.json();

      if (data.success) {
        setCreditsData(data.data);
        setError(null);
      } else {
        setError(data.error || 'Erro ao carregar créditos');
      }
    } catch (err) {
      setError('Erro de conexão');
      console.error('Erro ao buscar créditos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditsData();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200">
        <CardContent className="p-6">
          <div className="text-red-600 text-center">
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchCreditsData}
              className="mt-2"
            >
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!creditsData) return null;

  const getBalanceColor = (balance: number, total: number) => {
    const percentage = (balance / total) * 100;
    if (percentage > 50) return 'text-green-600 dark:text-green-400';
    if (percentage > 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'pro':
        return <Star className="h-4 w-4 text-blue-500" />;
      case 'max':
        return <Crown className="h-4 w-4 text-purple-500" />;
      default:
        return <Coins className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPlanBadgeVariant = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return 'secondary';
      case 'pro':
        return 'default';
      case 'max':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const progressPercentage = Math.min((creditsData.pointsBalance / creditsData.pointsPerMonth) * 100, 100);

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-lg">Seus Créditos AI</span>
          </div>
          <Badge 
            variant={getPlanBadgeVariant(creditsData.planName)}
            className="flex items-center gap-1"
          >
            {getPlanIcon(creditsData.planName)}
            {creditsData.planName}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Saldo atual */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getBalanceColor(creditsData.pointsBalance, creditsData.pointsPerMonth)}`}>
            {creditsData.pointsBalance.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            de {creditsData.pointsPerMonth.toLocaleString()} créditos mensais
          </p>
        </div>

        {/* Barra de progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Uso este mês</span>
            <span>{Math.round(progressPercentage)}% restante</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Informações adicionais */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded">
            <Calendar className="h-4 w-4 text-blue-500" />
            <div>
              <div className="text-gray-600 dark:text-gray-300">Renovação</div>
              <div className="font-semibold">{creditsData.daysUntilRenewal} dias</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <div>
              <div className="text-gray-600 dark:text-gray-300">Mensal</div>
              <div className="font-semibold">{creditsData.pointsPerMonth.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2">
          <Link href="/dashboard/points" className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              Ver Detalhes
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          
          {creditsData.pointsBalance < 10 && (
            <Link href="/pricing" className="flex-1">
              <Button className="w-full bg-red-600 hover:bg-red-700" size="sm">
                Upgrade Agora
              </Button>
            </Link>
          )}
          
          {creditsData.planName.toLowerCase() === 'free' && creditsData.pointsBalance >= 10 && (
            <Link href="/pricing" className="flex-1">
              <Button className="w-full" size="sm">
                Upgrade para Pro
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
