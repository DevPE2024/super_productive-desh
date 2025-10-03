import { Metadata } from 'next';
import { PointsBalance } from '@/components/points/PointsBalance';
import { ExtraPointsShop } from '@/components/points/ExtraPointsShop';
import { UsageHistory } from '@/components/points/UsageHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, ShoppingCart, History } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Points System - Super Productive',
  description: 'Manage your AI points, purchase extra points, and view usage history',
};

export default function PointsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Points System</h1>
        <p className="text-gray-600">
          Manage your AI points, track usage, and purchase additional points when needed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Saldo de pontos - sempre visível */}
        <div className="lg:col-span-1">
          <PointsBalance />
        </div>

        {/* Conteúdo principal com tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="shop" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shop" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Buy Points
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Usage History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shop" className="mt-6">
              <ExtraPointsShop />
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <UsageHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Informações sobre o sistema de pontos */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Coins className="h-5 w-5 text-blue-600" />
          How Points Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-medium mb-2">Point Costs</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Image Generation: 5 points</li>
              <li>• Video Generation: 10 points</li>
              <li>• AI Code Edit: 2 points</li>
              <li>• Perplexica Search: 3 points</li>
              <li>• RAG Query: 4 points</li>
              <li>• Next.js Project: 5 points</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Monthly Plans</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Free Plan: 10 points/month</li>
              <li>• Pro Plan: 300 points/month</li>
              <li>• Enterprise Plan: 500 points/month</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Points reset monthly on your renewal date. 
            Extra points purchased never expire and are used after your monthly allocation.
          </p>
        </div>
      </div>
    </div>
  );
}