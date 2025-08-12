'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Globe, MessageSquare } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function BookPage() {
  const router = useRouter();
  const [isBooking, setIsBooking] = useState<{[key: string]: boolean}>({});
  
  const handleBooking = (serviceType: string) => {
    setIsBooking(prev => ({ ...prev, [serviceType]: true }));
    
    // Simulate booking process
    setTimeout(() => {
      setIsBooking(prev => ({ ...prev, [serviceType]: false }));
      router.push('/dashboard');
    }, 1500);
  };
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          Start Your Interpretation Session
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose your preferred interpretation service and connect with a professional interpreter in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader>
            <div className="flex items-center gap-x-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              <CardTitle>Video Interpretation</CardTitle>
            </div>
            <CardDescription>Face-to-face interpretation through video call</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li>✓ HD video and audio quality</li>
              <li>✓ Screen sharing capability</li>
              <li>✓ Multiple participants</li>
            </ul>
            <Button 
              className="w-full" 
              onClick={() => handleBooking('video')} 
              disabled={isBooking['video']}
            >
              {isBooking['video'] ? 'Booking...' : 'Book Video Session'}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader>
            <div className="flex items-center gap-x-3">
              <Globe className="h-6 w-6 text-primary" />
              <CardTitle>Phone Interpretation</CardTitle>
            </div>
            <CardDescription>Instant phone interpretation service</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li>✓ Available worldwide</li>
              <li>✓ Conference calling</li>
              <li>✓ 24/7 availability</li>
            </ul>
            <Button 
              className="w-full" 
              onClick={() => handleBooking('phone')} 
              disabled={isBooking['phone']}
            >
              {isBooking['phone'] ? 'Booking...' : 'Book Phone Session'}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader>
            <div className="flex items-center gap-x-3">
              <Clock className="h-6 w-6 text-primary" />
              <CardTitle>Scheduled Session</CardTitle>
            </div>
            <CardDescription>Book an interpreter for a future date</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li>✓ Choose your date and time</li>
              <li>✓ Select specific interpreter</li>
              <li>✓ Special requirements</li>
            </ul>
            <Button className="w-full">Schedule Session</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}