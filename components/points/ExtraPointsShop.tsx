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
    fetchPackages();
  }, []);

  if (loading) {
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
        <p className="text-gray-600">
          Need more points? Purchase additional points to continue using AI features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`relative transition-all duration-200 hover:shadow-lg ${
              pkg.name === 'Medium Pack' ? 'border-blue-500 shadow-md' : ''
            }`}
          >
            {pkg.name === 'Medium Pack' && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                {pkg.name}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-4">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {pkg.extraPoints}
                </div>
                <p className="text-sm text-gray-600">extra points</p>
              </div>

              <div>
                <div className="text-2xl font-bold">
                  ${pkg.priceUsd}
                </div>
                <p className="text-xs text-gray-500">
                  ${pkg.pricePerPoint} per point
                </p>
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

              <div className="text-xs text-gray-500 space-y-1">
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

      <div className="text-center text-sm text-gray-500">
        <p>Points are added instantly to your account and never expire.</p>
        <p>Need a custom package? Contact our support team.</p>
      </div>
    </div>
  );
}