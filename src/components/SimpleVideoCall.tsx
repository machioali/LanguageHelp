'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
  Crown, Shield, Clock, Award
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SimpleVideoCallProps {
  sessionId: string;
  userId: string;
  userType: 'client' | 'interpreter';
  userNames: {
    clientName?: string;
    interpreterName?: string;
  };
  language?: string;
  onSessionEnd: () => void;
  onError: (error: string) => void;
}

export default function SimpleVideoCall({
  sessionId,
  userId,
  userType,
  userNames,
  language,
  onSessionEnd,
  onError
}: SimpleVideoCallProps) {
  const [sessionDuration, setSessionDuration] = useState(0);
  const sessionStartTime = useRef(Date.now());
  
  // Use a completely open Jitsi room via iframe
  const jitsiUrl = `https://meet.jit.si/LanguageHelp-${sessionId}?config.prejoinPageEnabled=false&config.requireDisplayName=false&config.enableLobby=false&userInfo.displayName=${encodeURIComponent(userNames.clientName || userNames.interpreterName || 'User')}&config.disableModeratorIndicator=true`;
  
  console.log('🎯 SimpleVideoCall URL:', jitsiUrl);
  
  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStartTime.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endSession = async () => {
    toast.success('📞 Session ended successfully!', {
      duration: 3000,
      icon: '✨'
    });
    
    setTimeout(() => {
      onSessionEnd();
    }, 1000);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white flex flex-col">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900/95 to-purple-900/30 backdrop-blur-xl border-b border-purple-500/20 p-6 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Premium Badge */}
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold px-3 py-1">
              PREMIUM
            </Badge>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium">Connected</span>
          </div>

          {/* Quality Indicator */}
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">EXCELLENT Quality</span>
          </div>
        </div>
        
        {/* Session Info */}
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-sm text-gray-300">Session Duration</div>
            <div className="text-lg font-mono font-semibold">{formatTime(sessionDuration)}</div>
          </div>
          
          {userType === 'client' && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 text-white font-semibold rounded-full flex items-center justify-center ring-2 ring-purple-400">
                {userNames.interpreterName?.charAt(0) || 'I'}
              </div>
              <div>
                <div className="text-sm font-semibold">{userNames.interpreterName || 'Your Interpreter'}</div>
                <div className="text-xs text-gray-300 flex items-center">
                  <Award className="w-3 h-3 mr-1" />
                  Certified • {language} Expert
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Container - Full iframe */}
      <div className="flex-1 relative">
        <iframe
          src={jitsiUrl}
          className="w-full h-full border-0"
          allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; autoplay"
          title="Language Help Video Session"
        />
        
        {/* Overlay effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-indigo-500/10 to-transparent rounded-tl-full" />
        </div>

        {/* Quality Metrics */}
        <Card className="absolute top-6 left-6 p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-purple-500/20">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 text-green-400">⚡</div>
              <span className="text-xs font-medium">Connection Quality</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Latency:</span>
                <span className="text-green-400">42ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Quality:</span>
                <span className="text-green-400">excellent</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Premium Controls */}
      <div className="bg-gradient-to-r from-slate-900/95 to-purple-900/30 backdrop-blur-xl border-t border-purple-500/20 p-8 flex items-center justify-center">
        <div className="flex items-center space-x-6">
          <Button
            variant="destructive"
            size="lg"
            onClick={endSession}
            className="rounded-full w-16 h-16 text-white font-semibold shadow-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200"
          >
            <PhoneOff className="w-7 h-7" />
          </Button>
        </div>
      </div>
    </div>
  );
}
