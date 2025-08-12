'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSubscription } from "@/hooks/useSubscription";
import { Settings, X, Gift, Zap, Crown, Star, Check, AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Define plan interface matching upgrade page
interface TestPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  minutes: number;
  description: string;
  icon: React.ElementType;
  popular?: boolean;
}

export function SubscriptionDemo() {
  const { subscription, subscribeToPlan, cancelSubscription, updateUsage, isLoading } = useSubscription();
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Define test plans matching upgrade page exactly
  const testPlans: TestPlan[] = [
    {
      id: 'free_trial',
      name: 'Free Trial',
      price: 0,
      minutes: 60,
      description: 'Perfect for testing',
      icon: Gift
    },
    {
      id: 'basic_plan',
      name: 'Basic Plan',
      price: 29.99,
      minutes: 300,
      description: 'For occasional use',
      icon: Zap
    },
    {
      id: 'premium_plan',
      name: 'Premium Plan',
      price: 79.99,
      originalPrice: 99.99,
      minutes: 1000,
      description: 'Most popular choice',
      icon: Crown,
      popular: true
    },
    {
      id: 'enterprise_plan',
      name: 'Enterprise Plan',
      price: 199.99,
      originalPrice: 249.99,
      minutes: 9999,
      description: 'For large organizations',
      icon: Star
    }
  ];

  const handleTestSubscription = async (planId: string) => {
    if (subscription.hasSubscription && planId === subscription.plan?.id) {
      console.log('Already subscribed to plan:', planId);
      return; // Already on this plan
    }

    console.log('🧪 Testing subscription to plan:', planId);
    setSelectedPlan(planId);
    setIsUpgrading(true);

    try {
      console.log('📞 Calling subscribeToPlan API...');
      const result = await subscribeToPlan(planId);
      console.log('✅ Subscription successful:', result);
      alert(`Successfully subscribed to ${planId}!`);
    } catch (error) {
      console.error('❌ Test subscription error:', error);
      alert(`Failed to subscribe to ${planId}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      console.log('🏁 Subscription process completed');
      setIsUpgrading(false);
      setSelectedPlan('');
    }
  };

  const getCurrentPlanId = () => {
    return subscription.plan?.id || null;
  };

  const isCurrentPlan = (planId: string) => {
    return getCurrentPlanId() === planId;
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-12 h-12 shadow-lg"
          variant="default"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-96 shadow-xl border-2 max-h-[80vh] overflow-y-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Subscription Testing Panel
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Test subscription functionality with real API calls
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Current Status:</span>
            <Badge variant={subscription.hasSubscription ? "default" : "secondary"}>
              {subscription.hasSubscription ? 'Active' : 'No Plan'}
            </Badge>
          </div>
          {subscription.hasSubscription && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-medium text-primary">{subscription.plan?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-medium">${subscription.plan?.price}/month</span>
              </div>
              <div className="flex justify-between">
                <span>Minutes:</span>
                <span className="font-medium text-green-600">
                  {subscription.usage?.minutesRemaining}/{subscription.plan?.minutes}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium text-green-600 capitalize">{subscription.status?.toLowerCase()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Test Plans */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">🧪 Test Plans</h4>
            {isLoading && <RefreshCw className="h-3 w-3 animate-spin" />}
          </div>
          <div className="grid gap-2">
            {testPlans.map((plan) => {
              const Icon = plan.icon;
              const isCurrent = isCurrentPlan(plan.id);
              const isProcessing = isUpgrading && selectedPlan === plan.id;
              
              return (
                <Button 
                  key={plan.id}
                  variant={isCurrent ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleTestSubscription(plan.id)}
                  disabled={isCurrent || isUpgrading}
                  className={`justify-start h-auto p-3 relative ${
                    plan.popular ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-1 -right-1 bg-primary text-white px-1.5 py-0.5 rounded text-xs font-medium">
                      Popular
                    </div>
                  )}
                  <div className="flex items-center gap-2 w-full">
                    <Icon className={`h-4 w-4 ${
                      plan.id === 'free_trial' ? 'text-blue-500' :
                      plan.id === 'basic_plan' ? 'text-green-500' :
                      plan.id === 'premium_plan' ? 'text-yellow-500' :
                      'text-purple-500'
                    }`} />
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{plan.name}</span>
                        {isCurrent && <Check className="h-3 w-3 text-green-500" />}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {plan.minutes === 9999 ? 'Unlimited' : `${plan.minutes} min`} • 
                        {plan.originalPrice ? (
                          <>
                            <span className="line-through">${plan.originalPrice}</span> ${plan.price}
                          </>
                        ) : (
                          `$${plan.price}`
                        )}/month
                      </div>
                    </div>
                    {isProcessing && (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Test Actions */}
        {subscription.hasSubscription && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">🔧 Usage Testing</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateUsage(15)}
                className="text-xs"
                disabled={isLoading}
              >
                Use 15 min
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateUsage(30)}
                className="text-xs"
                disabled={isLoading}
              >
                Use 30 min
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateUsage(60)}
                className="text-xs"
                disabled={isLoading}
              >
                Use 60 min
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateUsage(120)}
                className="text-xs"
                disabled={isLoading}
              >
                Use 120 min
              </Button>
            </div>
            
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full flex items-center gap-2"
              onClick={cancelSubscription}
              disabled={isLoading}
            >
              <Trash2 className="h-3 w-3" />
              Cancel Subscription
            </Button>
          </div>
        )}

        {/* API Test */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">🔬 API Test</h4>
          <div className="grid gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={async () => {
                try {
                  console.log('🔍 Testing authentication...');
                  const response = await fetch('/api/debug/subscription', {
                    method: 'GET',
                    credentials: 'include'
                  });
                  const result = await response.json();
                  console.log('🔍 Auth Test Result:', result);
                  
                  if (result.success) {
                    alert(`✅ Authentication: SUCCESS\n\nUser: ${result.debug.session.userName}\nRole: ${result.debug.session.userRole}\nDB User Found: ${result.debug.database.userFound}\nClient Profile: ${result.debug.database.hasClientProfile}`);
                  } else {
                    alert(`❌ Authentication: FAILED\n\nError: ${result.error}\nStep: ${result.debug?.step}\nMessage: ${result.debug?.message}`);
                  }
                } catch (error) {
                  console.error('🔍 Auth Test Error:', error);
                  alert(`❌ Auth Test Failed: ${error instanceof Error ? error.message : String(error)}`);
                }
              }}
            >
              🔍 Test Authentication
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={async () => {
                try {
                  console.log('🧪 Testing subscription flow...');
                  const response = await fetch('/api/debug/subscription', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ planId: 'free_trial' })
                  });
                  const result = await response.json();
                  console.log('🧪 Subscription Test Result:', result);
                  
                  if (result.success) {
                    alert(`✅ Subscription Flow: SUCCESS\n\nPlan: ${result.debug.selectedPlan.name}\nPrice: $${result.debug.selectedPlan.price}\nClient Profile: ${result.debug.clientProfile.id}`);
                  } else {
                    alert(`❌ Subscription Flow: FAILED\n\nError: ${result.error}\nStep: ${result.debug?.step}\nMessage: ${result.debug?.message}`);
                  }
                } catch (error) {
                  console.error('🧪 Subscription Test Error:', error);
                  alert(`❌ Subscription Test Failed: ${error instanceof Error ? error.message : String(error)}`);
                }
              }}
            >
              🧪 Test Subscription Flow
            </Button>
          </div>
        </div>

        <Separator />

        {/* Warning */}
        <div className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-3 w-3 text-yellow-600" />
            <span className="font-medium text-yellow-800 dark:text-yellow-200">Development Mode</span>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300">
            This panel makes real API calls to test subscription functionality. Remove before production!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
