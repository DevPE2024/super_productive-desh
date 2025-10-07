'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Calendar, TrendingUp } from 'lucide-react';

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
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
          <Coins className="h-5 w-5 text-blue-600" />
          Points Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Saldo atual */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getBalanceColor(pointsInfo.pointsBalance, pointsInfo.pointsPerMonth)}`}>
            {pointsInfo.pointsBalance}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            of {pointsInfo.pointsPerMonth} monthly points
          </p>
        </div>

        {/* Plano atual */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Current Plan:</span>
          <Badge variant={pointsInfo.planName === 'Free' ? 'secondary' : 'default'}>
            {pointsInfo.planName}
          </Badge>
        </div>

        {/* Data de renovação */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Renewal:
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {pointsInfo.daysUntilRenewal} days
          </span>
        </div>

        {/* Barra de progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
            <span>Remaining this month</span>
            <span>
              {Math.round(Math.min((pointsInfo.pointsBalance / pointsInfo.pointsPerMonth) * 100, 100))}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((pointsInfo.pointsBalance / pointsInfo.pointsPerMonth) * 100, 100)}%` 
              }}
            />
          </div>
        </div>

        {/* Botão de upgrade se necessário */}
        {pointsInfo.pointsBalance < 10 && (
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Upgrade Plan or Buy Points
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

