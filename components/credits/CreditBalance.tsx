'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Coins, 
  Calendar, 
  TrendingUp, 
  Eye, 
  Palette, 
  Search, 
  MessageSquare, 
  BarChart3, 
  TestTube 
} from 'lucide-react';
import { AppKey } from '@prisma/client';

interface CreditBalance {
  appKey: AppKey;
  remaining: number;
  total: number;
  used: number;
}

interface UserCreditInfo {
  balances: CreditBalance[];
  planName: string;
  cycleEnd: string;
  daysUntilRenewal: number;
}

const appIcons = {
  [AppKey.PRODIFY]: BarChart3,
  [AppKey.ONSCOPE]: Eye,
  [AppKey.JAZZUP]: Palette,
  [AppKey.DEEPQUEST]: Search,
  [AppKey.OPENUIX]: MessageSquare,
  [AppKey.TESTPATH]: TestTube,
};

const appNames = {
  [AppKey.PRODIFY]: 'Prodify Hub',
  [AppKey.ONSCOPE]: 'OnScope',
  [AppKey.JAZZUP]: 'JazzUp',
  [AppKey.DEEPQUEST]: 'DeepQuest',
  [AppKey.OPENUIX]: 'OpenUIX',
  [AppKey.TESTPATH]: 'TestPath',
};

const appColors = {
  [AppKey.PRODIFY]: 'bg-blue-50 border-blue-200 text-blue-800',
  [AppKey.ONSCOPE]: 'bg-purple-50 border-purple-200 text-purple-800',
  [AppKey.JAZZUP]: 'bg-pink-50 border-pink-200 text-pink-800',
  [AppKey.DEEPQUEST]: 'bg-green-50 border-green-200 text-green-800',
  [AppKey.OPENUIX]: 'bg-orange-50 border-orange-200 text-orange-800',
  [AppKey.TESTPATH]: 'bg-gray-50 border-gray-200 text-gray-800',
};

export function CreditBalance() {
  const [creditInfo, setCreditInfo] = useState<UserCreditInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCreditBalance();
  }, []);

  const fetchCreditBalance = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/credits/balance');
      
      if (!response.ok) {
        throw new Error('Failed to fetch credit balance');
      }

      const data = await response.json();
      setCreditInfo(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading credit balance: {error}</p>
            <Button onClick={fetchCreditBalance} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!creditInfo) {
    return null;
  }

  const totalCredits = creditInfo.balances.reduce((sum, balance) => sum + balance.total, 0);
  const totalUsed = creditInfo.balances.reduce((sum, balance) => sum + balance.used, 0);
  const totalRemaining = creditInfo.balances.reduce((sum, balance) => sum + balance.remaining, 0);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Coins className="h-5 w-5 text-blue-600" />
            Credit Balance Overview
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {creditInfo.planName} Plan
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalRemaining}</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalUsed}</div>
              <div className="text-sm text-muted-foreground">Used</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{totalCredits}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Renews in {creditInfo.daysUntilRenewal} days ({new Date(creditInfo.cycleEnd).toLocaleDateString()})
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Per-App Credits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Credits by Application
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creditInfo.balances.map((balance) => {
              const Icon = appIcons[balance.appKey];
              const usagePercentage = balance.total > 0 ? (balance.used / balance.total) * 100 : 0;
              
              return (
                <div
                  key={balance.appKey}
                  className={`p-4 rounded-lg border ${appColors[balance.appKey]}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">
                        {appNames[balance.appKey]}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {balance.remaining}/{balance.total}
                    </Badge>
                  </div>
                  
                  {balance.total > 0 ? (
                    <div className="space-y-2">
                      <Progress value={usagePercentage} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {balance.used} used • {balance.remaining} remaining
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Unlimited usage
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

