'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const handlePlanSelection = (plan: string) => {
    setSelectedPlan(plan);
    // Simulate redirect to booking page
    setTimeout(() => {
      router.push('/book');
    }, 1000);
  };
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Choose the plan that best fits your needs
        </p>
        
        <div className="inline-flex items-center rounded-full border p-1 mb-8">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-full text-sm ${billingPeriod === 'monthly' ? 'bg-primary text-primary-foreground' : ''}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-4 py-2 rounded-full text-sm ${billingPeriod === 'annual' ? 'bg-primary text-primary-foreground' : ''}`}
          >
            Annual (Save 20%)
          </button>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto text-center mb-4 hidden">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose the plan that best fits your needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Basic Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Basic</CardTitle>
            <CardDescription>For occasional interpretation needs</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$49</span>
              <span className="text-muted-foreground">/hour</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Video interpretation</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Phone interpretation</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Basic support</span>
              </li>
            </ul>
            <Button 
              className="w-full mt-6" 
              onClick={() => handlePlanSelection('basic')}
              disabled={selectedPlan === 'basic'}
            >
              {selectedPlan === 'basic' ? 'Processing...' : 'Get Started'}
            </Button>
          </CardContent>
        </Card>

        {/* Professional Plan */}
        <Card className="border-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
            Most Popular
          </div>
          <CardHeader>
            <CardTitle>Professional</CardTitle>
            <CardDescription>For regular interpretation needs</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$39</span>
              <span className="text-muted-foreground">/hour</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>All Basic features</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Priority scheduling</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>24/7 support</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Custom terminology</span>
              </li>
            </ul>
            <Button 
              className="w-full mt-6" 
              onClick={() => handlePlanSelection('professional')}
              disabled={selectedPlan === 'professional'}
            >
              {selectedPlan === 'professional' ? 'Processing...' : 'Choose Professional'}
            </Button>
          </CardContent>
        </Card>

        {/* Enterprise Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>For high-volume needs</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">Custom</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>All Professional features</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Volume discounts</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Custom integration</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>SLA guarantee</span>
              </li>
            </ul>
            <Button 
              className="w-full mt-6" 
              variant="outline"
              onClick={() => router.push('/contact')}
            >
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">How does billing work?</h3>
              <p className="text-muted-foreground">You only pay for the time you use. Billing is calculated per minute with no minimum commitment.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Can I change plans?</h3>
              <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}