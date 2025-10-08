'use client';

import { PointsBalance } from '@/components/points/PointsBalance';
import { PointsByApp } from '@/components/points/PointsByApp';
import { ExtraPointsShop } from '@/components/points/ExtraPointsShop';
import { UsageHistory } from '@/components/points/UsageHistory';
import { HydratedTabs as Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs-hydrated';
import { Coins, ShoppingCart, History, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PointsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('shop');

  const handleUpgradeClick = () => {
    router.push('/pricing');
  };

  const handleBuyPointsClick = () => {
    setActiveTab('shop');
    setTimeout(() => {
      const shopSection = document.querySelector('[data-value="shop"]');
      shopSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 text-white">
            <Coins className="h-8 w-8 text-blue-400" />
            Points Dashboard
          </h1>
          <p className="text-gray-300">
            Track your AI points usage and upgrade when needed.
          </p>
        </div>

        {/* Balance por App - Visão Detalhada */}
        <div className="mb-8">
          <PointsByApp />
        </div>

        {/* Seção de Upgrade */}
        <div className="mb-8">
          <Card className="border-blue-600 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-600 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                Need More Points?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200 mb-4">
                Upgrade your plan or buy extra points to continue using AI features without interruption.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={handleUpgradeClick}
                >
                  Upgrade Plan
                </Button>
                <Button 
                  variant="outline" 
                  className="border-blue-400 text-blue-300 hover:bg-blue-800/30 shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={handleBuyPointsClick}
                >
                  Buy Extra Points
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para Shop e History */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800">
            <TabsTrigger value="shop" className="flex items-center gap-2 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">
              <ShoppingCart className="h-4 w-4" />
              Buy Points
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">
              <History className="h-4 w-4" />
              Usage History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shop" className="space-y-6">
            <ExtraPointsShop />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <UsageHistory />
          </TabsContent>
        </Tabs>


        {/* Nota importante */}
        <div className="mt-6 bg-amber-900/20 border border-amber-700 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="text-amber-400 mt-0.5">💡</div>
            <div>
              <h4 className="font-medium text-amber-200 mb-1">Important to Know</h4>
              <p className="text-sm text-amber-300">
                Your monthly points reset every month, but extra points you buy never expire! 
                The system automatically uses your monthly points first, then your extra points.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}