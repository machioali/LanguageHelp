'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Phone, 
  PhoneOff, 
  Clock, 
  AlertTriangle, 
  User,
  Globe,
  Zap
} from 'lucide-react';
import { CallRequest } from '@/hooks/useCallRequests';

interface IncomingCallNotificationProps {
  request: CallRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export default function IncomingCallNotification({
  request,
  onAccept,
  onDecline
}: IncomingCallNotificationProps) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRinging, setIsRinging] = useState(true);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [hasDeclined, setHasDeclined] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio for ringing
  useEffect(() => {
    try {
      // Create ringing sound (you can replace this with an actual ringtone file)
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a simple beeping sound
      const createBeep = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      };

      // Play beep every 2 seconds
      const beepInterval = setInterval(() => {
        if (isRinging && !hasAccepted && !hasDeclined) {
          createBeep();
        }
      }, 2000);

      // Initial beep
      if (isRinging) {
        createBeep();
      }

      return () => {
        clearInterval(beepInterval);
      };
    } catch (error) {
      console.log('Audio not supported or blocked');
    }
  }, [isRinging, hasAccepted, hasDeclined]);

  // Countdown timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRinging(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleAccept = () => {
    if (hasAccepted || hasDeclined) return;
    
    setHasAccepted(true);
    setIsRinging(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    onAccept(request.requestId);
  };

  const handleDecline = () => {
    if (hasAccepted || hasDeclined) return;
    
    setHasDeclined(true);
    setIsRinging(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    onDecline(request.requestId);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500 animate-pulse';
      case 'normal': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'URGENT';
      case 'normal': return 'NORMAL';
      case 'low': return 'LOW PRIORITY';
      default: return 'NORMAL';
    }
  };

  const progressPercentage = (timeLeft / 30) * 100;

  if (timeLeft <= 0 && !hasAccepted && !hasDeclined) {
    return (
      <Card className="border-red-500 bg-red-50 dark:bg-red-900/20 max-w-sm">
        <CardContent className="p-6 text-center">
          <Clock className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 dark:text-red-300 font-medium">Call Request Expired</p>
          <p className="text-sm text-red-600 dark:text-red-400">No response within 30 seconds</p>
        </CardContent>
      </Card>
    );
  }

  if (hasAccepted) {
    return (
      <Card className="border-green-500 bg-green-50 dark:bg-green-900/20 max-w-sm">
        <CardContent className="p-6 text-center">
          <Phone className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-green-700 dark:text-green-300 font-medium">Call Accepted</p>
          <p className="text-sm text-green-600 dark:text-green-400">Connecting to video session...</p>
        </CardContent>
      </Card>
    );
  }

  if (hasDeclined) {
    return (
      <Card className="border-gray-500 bg-gray-50 dark:bg-gray-900/20 max-w-sm">
        <CardContent className="p-6 text-center">
          <PhoneOff className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-700 dark:text-gray-300 font-medium">Call Declined</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 shadow-lg ${isRinging ? 'animate-pulse border-blue-500' : 'border-gray-300'} max-w-sm`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Phone className="w-6 h-6 text-blue-500" />
              {isRinging && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              )}
            </div>
            <CardTitle className="text-lg">Incoming Call Request</CardTitle>
          </div>
          
          <Badge className={`${getUrgencyColor(request.urgency)} text-white`}>
            {getUrgencyLabel(request.urgency)}
          </Badge>
        </div>
        
        {/* Timer and Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Time remaining</span>
            <span className={`text-sm font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-blue-600'}`}>
              {timeLeft}s
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${timeLeft <= 10 ? 'bg-red-100' : 'bg-blue-100'}`}
          />
          {timeLeft <= 10 && (
            <div className="flex items-center justify-center mt-2 text-red-600 text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Call will expire soon!
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Client Information */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Client</p>
                <p className="font-medium">{request.clientName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Language</p>
                <p className="font-medium">{request.language}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {request.sessionType === 'VRI' ? 'Video Call' : 'Audio Call'}
              </span>
            </div>
            
            {request.interpretersNotified && (
              <span className="text-xs text-muted-foreground">
                {request.interpretersNotified} interpreters notified
              </span>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleAccept}
            disabled={hasAccepted || hasDeclined}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <Phone className="w-4 h-4 mr-2" />
            Accept Call
          </Button>
          
          <Button
            onClick={handleDecline}
            disabled={hasAccepted || hasDeclined}
            variant="destructive"
            size="lg"
          >
            <PhoneOff className="w-4 h-4 mr-2" />
            Decline
          </Button>
        </div>
        
        {/* Additional Info */}
        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">
            First to accept gets the call
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
