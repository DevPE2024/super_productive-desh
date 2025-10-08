'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Coins, Calendar, TrendingUp, Crown, Zap, Star, ArrowUp } from 'lucide-react';

interface UserPointsInfo {
  pointsBalance: number;
  planName: string;
  pointsPerMonth: number;
  renewDate: string;
  daysUntilRenewal: number;
}

export function PointsBalance() {
  const [pointsInfo, setPointsInfo] = useState<UserPointsInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const fetchPointsInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/points/balance');
      const data = await response.json();

      if (data.success) {
        setPointsInfo(data.data);
        setError(null);
      } else {
        setError(data.error || 'Erro ao carregar informações de pontos');
      }
    } catch (err) {
      setError('Erro de conexão');
      console.error('Erro ao buscar informações de pontos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchPointsInfo();
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <Card className="w-full max-w-md">
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

  if (loading) {
    return (
      <Card className="w-full max-w-md">
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
      <Card className="w-full max-w-md border-red-200">
        <CardContent className="p-6">
          <div className="text-red-600 text-center">
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchPointsInfo}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!pointsInfo) return null;

  const getBalanceColor = (balance: number, total: number) => {
    const percentage = (balance / total) * 100;
    if (percentage > 50) return 'text-green-600 dark:text-green-400';
    if (percentage > 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return <Zap className="h-4 w-4 text-gray-500" />;
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

  const progressPercentage = Math.min((pointsInfo.pointsBalance / pointsInfo.pointsPerMonth) * 100, 100);

  return (
    <Card className="w-full max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-xl text-gray-900 dark:text-gray-100">
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Points Balance
          </div>
          <Badge 
            variant={getPlanBadgeVariant(pointsInfo.planName)}
            className="flex items-center gap-1 px-3 py-1"
          >
            {getPlanIcon(pointsInfo.planName)}
            {pointsInfo.planName}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Saldo atual com visual melhorado */}
        <div className="text-center space-y-2">
          <div className={`text-4xl font-bold ${getBalanceColor(pointsInfo.pointsBalance, pointsInfo.pointsPerMonth)}`}>
            {pointsInfo.pointsBalance.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            of {pointsInfo.pointsPerMonth.toLocaleString()} monthly points
          </p>
        </div>

        {/* Barra de progresso melhorada */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Usage this month</span>
            <span className="font-medium">
              {Math.round(progressPercentage)}% remaining
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3"
          />
        </div>

        <Separator />

        {/* Informações do plano */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-gray-600 dark:text-gray-300">Renewal</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {pointsInfo.daysUntilRenewal} days
            </span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-500 mb-1" />
            <span className="text-gray-600 dark:text-gray-300">Monthly</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {pointsInfo.pointsPerMonth.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="space-y-2">
          {pointsInfo.pointsBalance < 10 && (
            <Button 
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md" 
              size="sm"
              onClick={() => window.location.href = '/pricing'}
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Low Balance - Upgrade Now
            </Button>
          )}
          
          {pointsInfo.planName.toLowerCase() === 'free' && (
            <Button 
              variant="outline" 
              className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/30" 
              size="sm"
              onClick={() => window.location.href = '/pricing'}
            >
              <Star className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          )}
          
          {pointsInfo.planName.toLowerCase() === 'pro' && (
            <Button 
              variant="outline" 
              className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30" 
              size="sm"
              onClick={() => window.location.href = '/pricing'}
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Max
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

