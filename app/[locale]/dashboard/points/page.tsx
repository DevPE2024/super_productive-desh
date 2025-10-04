import { Metadata } from 'next';
import { PointsBalance } from '@/components/points/PointsBalance';
import { ExtraPointsShop } from '@/components/points/ExtraPointsShop';
import { UsageHistory } from '@/components/points/UsageHistory';
import { HydratedTabs as Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs-hydrated';
import { Coins, ShoppingCart, History, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Points System - Super Productive',
  description: 'Manage your AI points, purchase extra points, and view usage history',
};

export default function PointsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 text-gray-900 dark:text-gray-100">
          <Coins className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          Points Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your AI points usage and upgrade when needed.
        </p>
      </div>

      {/* Balance sempre visível */}
      <div className="mb-8">
        <PointsBalance />
      </div>

      {/* Seção de Upgrade */}
      <div className="mb-8">
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <TrendingUp className="h-5 w-5" />
              Need More Points?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              Upgrade your plan or buy extra points to continue using AI features without interruption.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                Upgrade Plan
              </Button>
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/30 shadow-sm hover:shadow-md transition-all duration-200">
                Buy Extra Points
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para Shop e History */}
      <Tabs defaultValue="shop" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
          <TabsTrigger value="shop" className="flex items-center gap-2 text-gray-700">
            <ShoppingCart className="h-4 w-4" />
            Buy Points
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2 text-gray-700">
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

      {/* Point Costs per Action - Seção corrigida */}
      <div className="mt-8">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Coins className="h-5 w-5 text-blue-600" />
              Point Costs per Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-gray-800">AI Code Edit</span>
                <span className="text-lg font-bold text-blue-600">2 pts</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-gray-800">Perplexica Search</span>
                <span className="text-lg font-bold text-green-600">3 pts</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-sm font-medium text-gray-800">RAG Query</span>
                <span className="text-lg font-bold text-purple-600">4 pts</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-sm font-medium text-gray-800">Image Generation</span>
                <span className="text-lg font-bold text-orange-600">5 pts</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <span className="text-sm font-medium text-gray-800">Next.js Project</span>
                <span className="text-lg font-bold text-indigo-600">5 pts</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <span className="text-sm font-medium text-gray-800">Video Generation</span>
                <span className="text-lg font-bold text-red-600">10 pts</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nota importante */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-amber-600 mt-0.5">💡</div>
          <div>
            <h4 className="font-medium text-amber-800 mb-1">Important to Know</h4>
            <p className="text-sm text-amber-700">
              Your monthly points reset every month, but extra points you buy never expire! 
              The system automatically uses your monthly points first, then your extra points.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}