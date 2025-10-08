'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Infinity, Sparkles } from 'lucide-react';

interface AppPoints {
  appKey: string;
  appName: string;
  monthlyPoints: number | null;
  remaining: number;
  isUnlimited: boolean;
}

interface PointsByAppData {
  planName: string;
  appsWithCredits: AppPoints[];
  unlimitedApps: AppPoints[];
  totalMonthlyCredits: number;
  totalRemaining: number;
}

const APP_ICONS: Record<string, string> = {
  PRODIFY: '🧭',
  ONSCOPE: '🎨',
  JAZZUP: '🖼️',
  DEEPQUEST: '🔍',
  OPENUIX: '🤖',
  TESTPATH: '🧪'
};

const APP_COLORS: Record<string, string> = {
  ONSCOPE: 'from-blue-900/20 to-blue-800/20 border-blue-700',
  JAZZUP: 'from-purple-900/20 to-purple-800/20 border-purple-700',
  DEEPQUEST: 'from-green-900/20 to-green-800/20 border-green-700',
  OPENUIX: 'from-orange-900/20 to-orange-800/20 border-orange-700',
  PRODIFY: 'from-gray-800/20 to-gray-700/20 border-gray-600',
  TESTPATH: 'from-gray-800/20 to-gray-700/20 border-gray-600'
};

export function PointsByApp() {
  const [data, setData] = useState<PointsByAppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/points/by-app');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Erro ao buscar pontos por app:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-8 bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const getProgressPercentage = (remaining: number, total: number) => {
    return Math.min((remaining / total) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-gray-800 border-gray-700 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            AI Credits by App
          </div>
          <Badge variant="outline" className="text-blue-400 border-blue-600">
            {data.planName} Plan
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumo Total */}
        <div className="p-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Total AI Credits</span>
            <span className="text-2xl font-bold text-white">
              {data.totalRemaining} / {data.totalMonthlyCredits}
            </span>
          </div>
          <Progress 
            value={getProgressPercentage(data.totalRemaining, data.totalMonthlyCredits)} 
            className="h-2"
          />
        </div>

        {/* Apps com Créditos */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            AI Apps (with credits)
          </h3>
          {data.appsWithCredits.map((app) => {
            const percentage = getProgressPercentage(app.remaining, app.monthlyPoints || 0);
            return (
              <div
                key={app.appKey}
                className={`p-4 bg-gradient-to-r ${APP_COLORS[app.appKey]} rounded-lg border transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{APP_ICONS[app.appKey]}</span>
                    <div>
                      <p className="font-semibold text-white">{app.appName}</p>
                      <p className="text-xs text-gray-400">{app.appKey}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      {app.remaining} / {app.monthlyPoints}
                    </p>
                    <p className="text-xs text-gray-400">
                      {Math.round(percentage)}% remaining
                    </p>
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className={`h-2 ${getProgressColor(percentage)}`}
                />
              </div>
            );
          })}
        </div>

        {/* Apps Ilimitados */}
        {data.unlimitedApps.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Unlimited Apps (no credits needed)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.unlimitedApps.map((app) => (
                <div
                  key={app.appKey}
                  className={`p-4 bg-gradient-to-r ${APP_COLORS[app.appKey]} rounded-lg border`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{APP_ICONS[app.appKey]}</span>
                      <div>
                        <p className="font-semibold text-white text-sm">{app.appName}</p>
                        <p className="text-xs text-gray-400">{app.appKey}</p>
                      </div>
                    </div>
                    <Infinity className="h-5 w-5 text-green-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nota */}
        <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700 rounded-lg">
          <p className="text-xs text-amber-300">
            💡 <strong>Note:</strong> {data.unlimitedApps.map(a => a.appName).join(' and ')} are always unlimited 
            and don't consume AI credits. Credits shown above are for AI-powered features only.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

