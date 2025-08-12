'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  User,
  Clock,
  Languages,
  Volume2,
  VolumeX
} from 'lucide-react';

interface IncomingCallModalProps {
  isVisible: boolean;
  callRequest: any;
  timeLeft: number;
  onAccept: () => void;
  onDecline: () => void;
  onMute?: () => void;
  isMuted?: boolean;
}

export function IncomingCallModal({ 
  isVisible, 
  callRequest, 
  timeLeft, 
  onAccept, 
  onDecline, 
  onMute,
  isMuted = false 
}: IncomingCallModalProps) {
  const [pulseAnimation, setPulseAnimation] = useState(true);

  // Toggle pulse animation every 2 seconds for realism
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setPulseAnimation(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible || !callRequest) return null;

  const getPriorityColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityText = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'HIGH PRIORITY';
      case 'normal': return 'NORMAL PRIORITY';
      case 'low': return 'LOW PRIORITY';
      default: return 'UNKNOWN PRIORITY';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Full screen overlay for incoming call */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
        
        {/* Header with priority indicator */}
        <div className={`${getPriorityColor(callRequest.urgency)} text-white py-3 px-6`}>
          <div className="text-center">
            <p className="text-xs font-medium opacity-90">INCOMING INTERPRETATION REQUEST</p>
            <Badge variant="secondary" className="mt-1 bg-white/20 text-white border-white/30">
              {getPriorityText(callRequest.urgency)}
            </Badge>
          </div>
        </div>

        {/* Main call info */}
        <div className="p-8 text-center space-y-6">
          
          {/* Client Avatar and Name */}
          <div className="space-y-4">
            <div className={`relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ${pulseAnimation ? 'animate-pulse' : ''}`}>
              <User className="h-12 w-12 text-white" />
              {/* Ringing animation circles */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-75"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping opacity-50" style={{animationDelay: '0.5s'}}></div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{callRequest.clientName}</h2>
              <p className="text-sm text-gray-500">Requesting interpretation</p>
            </div>
          </div>

          {/* Call details */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Languages className="h-5 w-5" />
              <span className="font-medium">{callRequest.language}</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <span className="font-medium">{timeLeft}s remaining</span>
            </div>
          </div>

          {/* Progress bar for time left */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${timeLeft > 15 ? 'bg-green-500' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            ></div>
          </div>

          {/* Phone ringing indicator */}
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Phone className={`h-5 w-5 ${pulseAnimation ? 'animate-bounce' : ''}`} />
            <span className="text-sm animate-pulse">Ring... Ring... Ring...</span>
            <Phone className={`h-5 w-5 ${!pulseAnimation ? 'animate-bounce' : ''}`} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-6 bg-gray-50 space-y-4">
          <div className="flex gap-4">
            {/* Decline Button */}
            <Button
              onClick={onDecline}
              variant="outline"
              className="flex-1 h-14 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <PhoneOff className="h-6 w-6 mr-2" />
              Decline
            </Button>

            {/* Accept Button */}
            <Button
              onClick={onAccept}
              className="flex-1 h-14 bg-green-600 hover:bg-green-700 text-white"
            >
              <PhoneCall className="h-6 w-6 mr-2" />
              Accept Call
            </Button>
          </div>

          {/* Mute button */}
          {onMute && (
            <div className="flex justify-center">
              <Button
                onClick={onMute}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 mr-2" />
                ) : (
                  <Volume2 className="h-4 w-4 mr-2" />
                )}
                {isMuted ? 'Unmute Ring' : 'Mute Ring'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
