'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import {
  CreditCard,
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Calendar,
  AlertCircle,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubscriptionData {
  hasSubscription: boolean;
  plan: {
    id: string;
    name: string;
    price: number;
    minutes: number;
    status: string;
  } | null;
  usage: {
    minutesUsed: number;
    minutesRemaining: number;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    sessionsThisPeriod: number;
  } | null;
}

const availablePlans = [
  {
    id: 'free_trial',
    name: 'Free Trial',
    description: 'Perfect for trying our services',
    price: 0,
    minutes: 60,
    features: [
      '60 minutes of interpretation',
      'Video and audio calls',
      'Email support',
      'Basic language options'
    ],
    badge: 'Trial',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'basic_plan',
    name: 'Basic Plan',
    description: 'Great for individuals and small needs',
    price: 29.99,
    minutes: 300,
    features: [
      '300 minutes per month',
      'All language pairs',
      'Priority support',
      'Session recordings',
      'Mobile app access'
    ],
    badge: 'Popular',
    badgeColor: 'bg-green-100 text-green-800'
  },
  {
    id: 'premium_plan',
    name: 'Premium Plan',
    description: 'Best for businesses and frequent users',
    price: 79.99,
    minutes: 1000,
    features: [
      '1000 minutes per month',
      'Specialized interpreters',
      '24/7 priority support',
      'Advanced analytics',
      'API access',
      'Team management'
    ],
    badge: 'Best Value',
    badgeColor: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'enterprise_plan',
    name: 'Enterprise Plan',
    description: 'For large organizations',
    price: 199.99,
    minutes: 9999,
    features: [
      'Unlimited minutes',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced security',
      'SLA guarantees',
      'Custom reporting'
    ],
    badge: 'Enterprise',
    badgeColor: 'bg-orange-100 text-orange-800'
  }
];

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/client/subscription');
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
        toast({
          title: 'Error',
          description: 'Failed to load subscription data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchSubscription();
    }
  }, [session]);

  const handleSubscribe = async (planId: string) => {
    setSubscribing(planId);
    try {
      const response = await fetch('/api/client/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh data
        const refreshResponse = await fetch('/api/client/subscription');
        const refreshResult = await refreshResponse.json();
        if (refreshResult.success) {
          setData(refreshResult.data);
        }
        
        toast({
          title: 'Success',
          description: `Successfully subscribed to ${availablePlans.find(p => p.id === planId)?.name}!`
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      toast({
        title: 'Error',
        description: 'Failed to subscribe to plan',
        variant: 'destructive'
      });
    } finally {
      setSubscribing(null);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const response = await fetch('/api/client/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh data
        const refreshResponse = await fetch('/api/client/subscription');
        const refreshResult = await refreshResponse.json();
        if (refreshResult.success) {
          setData(refreshResult.data);
        }
        
        toast({
          title: 'Subscription Cancelled',
          description: 'Your subscription has been cancelled and you\'ve been moved back to your original Free Trial with remaining minutes preserved.'
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription. Please try again or contact support.',
        variant: 'destructive'
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentPlan = data?.plan;
  const usage = data?.usage;
  const minutesUsedPercentage = usage && currentPlan 
    ? (usage.minutesUsed / currentPlan.minutes) * 100 
    : 0;
    
  const minutesRemainingPercentage = usage && currentPlan 
    ? (usage.minutesRemaining / currentPlan.minutes) * 100 
    : 0;

  return (
    <div className="relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[calc(50%-15rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-25rem)]" aria-hidden="true">
          <div className="aspect-[1108/632] w-[50rem] bg-gradient-to-r from-primary/20 to-secondary/20 opacity-20" style={{ clipPath: 'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)' }} />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-8">
        {/* Hero Header */}
        <section className="relative py-8 mb-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative rounded-full px-4 py-2 text-sm leading-6 text-muted-foreground ring-1 ring-primary/10 hover:ring-primary/20 transition-all duration-300">
                Your subscription management
                <Link href="/dashboard" className="font-semibold text-primary ml-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Back to dashboard <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Subscription
              <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"> & Billing</span>
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Manage your subscription plan and billing information.
            </p>
          </div>
        </section>

      {/* Current Subscription Status */}
      {currentPlan && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Plan
            </CardTitle>
            <CardDescription>
              Your active subscription and usage details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan Info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{currentPlan.name}</h3>
                  <Badge variant={currentPlan.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {currentPlan.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  ${currentPlan.price}/month
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  {usage && (
                    <span>
                      Renews {new Date(usage.currentPeriodEnd).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                {/* Cancel Subscription Button - only show for paid plans */}
                {currentPlan && currentPlan.id !== 'free_trial' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={cancelling}
                    onClick={handleCancelSubscription}
                    className="w-full mt-2"
                  >
                    {cancelling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Cancelling...
                      </>
                    ) : (
                      'Cancel Subscription'
                    )}
                  </Button>
                )}
              </div>

              {/* Usage Progress */}
              {usage && (
                <div className="md:col-span-2">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span>Minutes Remaining</span>
                      <span>{usage.minutesRemaining} / {currentPlan.minutes}</span>
                    </div>
                    <Progress value={minutesRemainingPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{usage.minutesRemaining} minutes remaining</span>
                      <span>{minutesRemainingPercentage.toFixed(1)}% available</span>
                    </div>
                  </div>

                  {minutesUsedPercentage > 80 && (
                    <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <div className="text-sm">
                        <p className="font-medium text-orange-800 dark:text-orange-200">
                          Running low on minutes
                        </p>
                        <p className="text-orange-600 dark:text-orange-300">
                          Consider upgrading your plan to avoid service interruption.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{usage.sessionsThisPeriod}</div>
                      <div className="text-sm text-muted-foreground">Sessions this period</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {usage.minutesUsed > 0 ? Math.round(usage.minutesUsed / usage.sessionsThisPeriod) : 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg. minutes per session</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {currentPlan ? 'Upgrade Your Plan' : 'Choose Your Plan'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {availablePlans.map((plan) => {
            const isCurrentPlan = currentPlan?.id === plan.id;
            const isDowngrade = currentPlan && plan.price < currentPlan.price;
            
            return (
              <Card key={plan.id} className={cn(
                "relative",
                isCurrentPlan && "border-primary bg-primary/5"
              )}>
                {plan.badge && (
                  <div className="absolute -top-3 left-4">
                    <span className={cn(
                      "px-3 py-1 text-xs font-medium rounded-full",
                      plan.badgeColor
                    )}>
                      {plan.badge}
                    </span>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{plan.name}</span>
                    {isCurrentPlan && (
                      <Badge variant="default">Current</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        {plan.minutes === 9999 ? 'Unlimited' : `${plan.minutes}`} minutes/month
                      </span>
                    </div>
                    
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? "outline" : "default"}
                    disabled={isCurrentPlan || subscribing === plan.id}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {subscribing === plan.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Subscribing...
                      </>
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : isDowngrade ? (
                      'Downgrade'
                    ) : (
                      'Subscribe'
                    )}
                  </Button>
                  
                  {plan.id === 'enterprise_plan' && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Contact sales for custom pricing
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Your recent billing transactions and invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              No billing history yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your billing history will appear here after your first payment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plan Benefits */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Why Upgrade?
          </CardTitle>
          <CardDescription>
            Get more value with our premium plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Faster Connections</h3>
              <p className="text-sm text-muted-foreground">
                Priority matching with interpreters for quicker session starts
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Detailed insights into your usage patterns and session quality
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Premium Support</h3>
              <p className="text-sm text-muted-foreground">
                24/7 priority support with dedicated account management
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
