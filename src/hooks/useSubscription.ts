'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Plan {
  id: string;
  name: string;
  price: number;
  minutes: number;
  status: string;
}

interface Usage {
  minutesUsed: number;
  minutesRemaining: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  sessionsThisPeriod: number;
}

interface SubscriptionData {
  hasSubscription: boolean;
  plan: Plan | null;
  usage: Usage | null;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'TRIAL' | null;
}

export function useSubscription() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionData>({
    hasSubscription: false,
    plan: null,
    usage: null,
    status: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch subscription from API
  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/client/subscription', {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated, return empty subscription
          setSubscription({
            hasSubscription: false,
            plan: null,
            usage: null,
            status: null
          });
          return;
        }
        throw new Error(`Failed to fetch subscription: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSubscription(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch subscription');
      }

    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
      // Set empty subscription on error
      setSubscription({
        hasSubscription: false,
        plan: null,
        usage: null,
        status: null
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to subscribe to a plan
  const subscribeToPlan = async (planId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Subscribing to plan:', planId);
      
      const response = await fetch('/api/client/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ planId })
      });

      console.log('Subscription response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Subscription error response:', errorData);
        throw new Error(errorData.error || 'Failed to subscribe to plan');
      }

      const result = await response.json();
      console.log('Subscription success response:', result);
      
      if (result.success) {
        // Refetch subscription data to get updated info
        await fetchSubscription();
        return result;
      } else {
        throw new Error(result.error || 'Failed to subscribe to plan');
      }

    } catch (err) {
      console.error('Error subscribing to plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to subscribe to plan');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to cancel subscription
  const cancelSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/client/subscription', {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }

      const result = await response.json();
      
      if (result.success) {
        // Refetch subscription data to get updated info
        await fetchSubscription();
        return result;
      } else {
        throw new Error(result.error || 'Failed to cancel subscription');
      }

    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update usage (when user uses minutes)
  const updateUsage = (minutesUsed: number) => {
    if (!subscription.hasSubscription || !subscription.plan || !subscription.usage) return;

    const newMinutesUsed = subscription.usage.minutesUsed + minutesUsed;
    const newMinutesRemaining = Math.max(0, subscription.plan.minutes - newMinutesUsed);

    const updatedSubscription = {
      ...subscription,
      usage: {
        ...subscription.usage,
        minutesUsed: newMinutesUsed,
        minutesRemaining: newMinutesRemaining
      }
    };
    
    setSubscription(updatedSubscription);
    
    // Note: In a real app, you'd also update this on the server
    // For now, the server will be updated when the session completes
  };

  // Fetch subscription data on component mount and when session changes
  useEffect(() => {
    if (session?.user?.role === 'CLIENT') {
      fetchSubscription();
    } else if (session?.user?.role !== 'CLIENT') {
      // Not a client, set empty subscription
      setSubscription({
        hasSubscription: false,
        plan: null,
        usage: null,
        status: null
      });
      setIsLoading(false);
    }
  }, [session?.user]);

  return {
    subscription,
    isLoading,
    error,
    subscribeToPlan,
    cancelSubscription,
    updateUsage,
    refetch: fetchSubscription
  };
}
