'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, ShoppingCart, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ExtraPointsPackage {
  id: string;
  name: string;
  extraPoints: number;
  priceUsd: number;
  pricePerPoint: string;
}

export function ExtraPointsShop() {
  const [packages, setPackages] = useState<ExtraPointsPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/points/packages');
      const data = await response.json();

      if (data.success) {
        setPackages(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load point packages",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao buscar pacotes:', error);
      toast({
        title: "Error",
        description: "Connection error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const purchasePackage = async (packageId: string) => {
    try {
      setPurchasing(packageId);
      const response = await fetch('/api/points/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ packageId })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: `Points purchased successfully! New balance: ${data.newBalance}`,
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to purchase points",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro na compra:', error);
      toast({
        title: "Error",
        description: "Connection error during purchase",
        variant: "destructive"
      });
    } finally {
      setPurchasing(null);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchPackages();
    }
  }, [mounted]);

  if (!mounted || loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Buy Extra Points</h2>
        <p className="text-gray-600 mb-4">
          Need more points? Purchase additional points to continue using AI features.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          <Check className="h-4 w-4" />
          Extra points never expire and are used after your monthly allocation
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative transition-all duration-200 hover:shadow-lg bg-white dark:bg-gray-800 ${
              pkg.name === 'Medium Pack' 
                ? 'border-blue-500 shadow-md' 
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
            }`}
          >
            {pkg.name === 'Medium Pack' && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-gray-900 dark:text-gray-100">
                <Coins className="h-5 w-5 text-yellow-500" />
                {pkg.name}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-4">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {pkg.extraPoints}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">extra points</p>
              </div>

              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ${pkg.priceUsd}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ${(pkg.priceUsd / pkg.extraPoints).toFixed(3)} per point
                </p>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Save {pkg.name === 'Large Pack' ? '30%' : pkg.name === 'Medium Pack' ? '20%' : '0%'} vs individual
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => purchasePackage(pkg.id)}
                disabled={purchasing === pkg.id}
                variant={pkg.name === 'Medium Pack' ? 'default' : 'outline'}
              >
                {purchasing === pkg.id ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Purchase
                  </div>
                )}
              </Button>

              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <Check className="h-3 w-3 text-green-500" />
                  Instant activation
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Check className="h-3 w-3 text-green-500" />
                  No expiration
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Points are added instantly to your account and never expire.</p>
        <p>Need a custom package? Contact our support team.</p>
      </div>
    </div>
  );
}

