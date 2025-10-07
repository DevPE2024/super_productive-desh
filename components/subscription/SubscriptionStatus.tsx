'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Crown
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SubscriptionInfo {
  hasActiveSubscription: boolean;
  subscriptionId?: string;
  stripeSubscriptionId?: string;
  status?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  plan: string;
  planId?: string;
}

const statusColors = {
  active: 'bg-green-50 border-green-200 text-green-800',
  past_due: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  canceled: 'bg-red-50 border-red-200 text-red-800',
  incomplete: 'bg-orange-50 border-orange-200 text-orange-800',
  trialing: 'bg-blue-50 border-blue-200 text-blue-800',
};

const statusIcons = {
  active: CheckCircle,
  past_due: AlertTriangle,
  canceled: XCircle,
  incomplete: AlertTriangle,
  trialing: Crown,
};

export function SubscriptionStatus() {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscription/status');
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription status');
      }

      const data = await response.json();
      setSubscriptionInfo(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.')) {
      return;
    }

    try {
      setCanceling(true);
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      await fetchSubscriptionStatus(); // Refresh status
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setCanceling(false);
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
            <p>Error loading subscription status: {error}</p>
            <Button onClick={fetchSubscriptionStatus} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionInfo) {
    return null;
  }

  const StatusIcon = subscriptionInfo.status ? statusIcons[subscriptionInfo.status as keyof typeof statusIcons] : CheckCircle;
  const statusColor = subscriptionInfo.status ? statusColors[subscriptionInfo.status as keyof typeof statusColors] : 'bg-gray-50 border-gray-200 text-gray-800';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          Subscription Status
        </CardTitle>
        <Badge variant="outline" className={`text-sm ${statusColor}`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {subscriptionInfo.plan} Plan
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {!subscriptionInfo.hasActiveSubscription ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You are currently on the Free plan. Upgrade to unlock more credits and premium features.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm ${statusColor}`}>
                  <StatusIcon className="h-3 w-3" />
                  {subscriptionInfo.status?.replace('_', ' ').toUpperCase()}
                </div>
              </div>
              
              {subscriptionInfo.currentPeriodEnd && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Next Billing Date</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {new Date(subscriptionInfo.currentPeriodEnd).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {subscriptionInfo.status === 'past_due' && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your payment is past due. Please update your payment method to continue using premium features.
                </AlertDescription>
              </Alert>
            )}

            {subscriptionInfo.status === 'active' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelSubscription}
                  disabled={canceling}
                >
                  {canceling ? 'Canceling...' : 'Cancel Subscription'}
                </Button>
              </div>
            )}
          </div>
        )}

        {!subscriptionInfo.hasActiveSubscription && (
          <div className="flex gap-2">
            <Button asChild>
              <a href="/pricing">Upgrade Plan</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

