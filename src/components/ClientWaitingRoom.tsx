'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Languages, 
  Star, 
  Shield, 
  User, 
  PhoneOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Headphones,
  Video,
  Mic,
  Camera,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import JitsiVideoSession from '@/components/JitsiVideoSession';

interface ClientWaitingRoomProps {
  sessionId: string;
  clientId: string;
  clientName: string;
  language: string;
  urgency: 'low' | 'normal' | 'high';
  sessionType: 'VRI' | 'OPI';
  onCancelRequest: () => void;
  onSessionEnd: () => void;
}

interface WaitingState {
  status: 'searching' | 'found' | 'connecting' | 'connected';
  timeElapsed: number;
  interpretersNotified: number;
  estimatedWait: number;
  interpreterInfo?: {
    name: string;
    rating: number;
    experience: string;
    specializations: string[];
  };
}

export default function ClientWaitingRoom({
  sessionId,
  clientId,
  clientName,
  language,
  urgency,
  sessionType,
  onCancelRequest,
  onSessionEnd
}: ClientWaitingRoomProps) {
  const [waitingState, setWaitingState] = useState<WaitingState>({
    status: 'searching',
    timeElapsed: 0,
    interpretersNotified: 0,
    estimatedWait: 30
  });
  
  const [showVideoRoom, setShowVideoRoom] = useState(false);
  const startTime = useRef(Date.now());

  // Timer for elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setWaitingState(prev => ({
        ...prev,
        timeElapsed: Math.floor((Date.now() - startTime.current) / 1000)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate interpreter matching process
  useEffect(() => {
    const stages = [
      {
        delay: 2000,
        update: { status: 'searching' as const, interpretersNotified: 3, estimatedWait: 25 }
      },
      {
        delay: 5000,
        update: { status: 'searching' as const, interpretersNotified: 7, estimatedWait: 15 }
      },
      {
        delay: 8000,
        update: {
          status: 'found' as const,
          interpreterInfo: {
            name: 'Maria Rodriguez',
            rating: 4.9,
            experience: '8+ years',
            specializations: ['Medical', 'Legal', 'Technical']
          }
        }
      },
      {
        delay: 10000,
        update: { status: 'connecting' as const }
      },
      {
        delay: 12000,
        update: { status: 'connected' as const }
      }
    ];

    const timeouts = stages.map(stage => 
      setTimeout(() => {
        setWaitingState(prev => ({ ...prev, ...stage.update }));
        
        if (stage.update.status === 'found') {
          toast.success('🎯 Professional interpreter found!', { duration: 3000 });
        } else if (stage.update.status === 'connecting') {
          toast.success('📞 Connecting to your interpreter...', { duration: 2000 });
        } else if (stage.update.status === 'connected') {
          toast.success('✨ Connected! Starting your session...', { duration: 2000 });
          setTimeout(() => setShowVideoRoom(true), 1000);
        }
      }, stage.delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'normal': return 'border-blue-500 bg-blue-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getStatusInfo = () => {
    switch (waitingState.status) {
      case 'searching':
        return {
          icon: <Loader2 className="w-8 h-8 animate-spin text-blue-500" />,
          title: 'Finding Your Perfect Interpreter',
          subtitle: `Searching our network of certified ${language} interpreters...`,
          color: 'text-blue-600'
        };
      case 'found':
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
          title: 'Interpreter Found!',
          subtitle: 'Preparing to connect you with your professional interpreter...',
          color: 'text-green-600'
        };
      case 'connecting':
        return {
          icon: <Loader2 className="w-8 h-8 animate-spin text-orange-500" />,
          title: 'Connecting...',
          subtitle: 'Establishing secure connection with your interpreter...',
          color: 'text-orange-600'
        };
      case 'connected':
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-green-500 animate-pulse" />,
          title: 'Connected Successfully!',
          subtitle: 'Your interpretation session is now starting...',
          color: 'text-green-600'
        };
    }
  };

  if (showVideoRoom) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 text-white">
        <div className="h-full flex flex-col">
          {/* Client Session Header */}
          <div className="bg-gradient-to-r from-slate-900/95 to-blue-900/30 backdrop-blur-xl border-b border-blue-500/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold px-3 py-1">
                    CLIENT SESSION
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-medium">Connected to Interpreter</span>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                {waitingState.interpreterInfo && (
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 ring-2 ring-blue-400">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold">
                        {waitingState.interpreterInfo.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold">{waitingState.interpreterInfo.name}</div>
                      <div className="text-xs text-gray-300 flex items-center">
                        <Star className="w-3 h-3 mr-1 text-yellow-400" />
                        {waitingState.interpreterInfo.rating} • {waitingState.interpreterInfo.experience}
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  variant="destructive"
                  onClick={onSessionEnd}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <PhoneOff className="w-4 h-4 mr-2" />
                  End Session
                </Button>
              </div>
            </div>
          </div>

          {/* Jitsi Video Container */}
          <div className="flex-1">
            <JitsiVideoSession
              roomName={`session-${sessionId}`}
              displayName={clientName}
              userRole="client"
              onCallStart={() => {
                toast.success('🎉 Your interpretation session has started!');
              }}
              onCallEnd={onSessionEnd}
            />
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finding Your {language} Interpreter
          </h1>
          <p className="text-gray-600">
            Please wait while we connect you with a certified professional interpreter
          </p>
        </div>

        {/* Main Status Card */}
        <Card className="p-8 mb-6 bg-white shadow-xl border-0">
          <div className="text-center">
            <div className="mb-6">
              {statusInfo.icon}
            </div>
            
            <h2 className={cn("text-2xl font-bold mb-2", statusInfo.color)}>
              {statusInfo.title}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {statusInfo.subtitle}
            </p>

            {/* Progress Indicator */}
            {waitingState.status === 'searching' && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Progress</span>
                  <span>{Math.min(Math.floor((waitingState.timeElapsed / 30) * 100), 90)}%</span>
                </div>
                <Progress 
                  value={Math.min(Math.floor((waitingState.timeElapsed / 30) * 100), 90)} 
                  className="h-3"
                />
              </div>
            )}

            {/* Interpreter Info Card (when found) */}
            {waitingState.interpreterInfo && (
              <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16 ring-4 ring-green-200">
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xl font-semibold">
                      {waitingState.interpreterInfo.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-semibold text-green-800">
                      {waitingState.interpreterInfo.name}
                    </h3>
                    
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium text-green-700">
                          {waitingState.interpreterInfo.rating}/5.0
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-700">
                          {waitingState.interpreterInfo.experience}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {waitingState.interpreterInfo.specializations.map((spec, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="bg-green-100 text-green-700 border-green-300"
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </Card>

        {/* Session Details & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Session Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Language:</span>
                <span className="font-medium text-gray-900">{language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Session Type:</span>
                <Badge variant="outline">{sessionType}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Priority:</span>
                <Badge className={cn("capitalize", getUrgencyColor(urgency))}>
                  {urgency}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time Elapsed:</span>
                <span className="font-mono font-medium text-gray-900">
                  {formatTime(waitingState.timeElapsed)}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Languages className="w-5 h-5 mr-2 text-green-500" />
              Search Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Interpreters Notified:</span>
                <span className="font-medium text-gray-900">{waitingState.interpretersNotified}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant="outline" className="capitalize">
                  {waitingState.status.replace('_', ' ')}
                </Badge>
              </div>
              {waitingState.status === 'searching' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Wait Time:</span>
                  <span className="font-medium text-gray-900">
                    ~{waitingState.estimatedWait}s
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Device Check */}
        <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            Device Check
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Camera className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-blue-900">Camera</div>
                <div className="text-xs text-green-600">Ready</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Mic className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-blue-900">Microphone</div>
                <div className="text-xs text-green-600">Ready</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Headphones className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-blue-900">Audio</div>
                <div className="text-xs text-green-600">Ready</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Cancel Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={onCancelRequest}
            className="px-8"
            disabled={waitingState.status === 'connected'}
          >
            Cancel Request
          </Button>
          
          <p className="text-xs text-gray-500 mt-2">
            You can cancel this request at any time before connecting
          </p>
        </div>
      </div>
    </div>
  );
}
