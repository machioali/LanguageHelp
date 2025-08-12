'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import JitsiVideoSession from './JitsiVideoSession';
import VideoSession from './video-session'; // Your existing Agora component
import { FreeVideoSession } from './free-video-session'; // Your existing WebRTC component
import { Settings, Zap, DollarSign, Globe } from 'lucide-react';

interface UnifiedVideoSessionProps {
  sessionId: string;
  userRole: 'client' | 'interpreter';
  displayName: string;
  bookingDetails: {
    sourceLanguage: string;
    targetLanguage: string;
    duration: number;
    clientName?: string;
    interpreterName?: string;
  };
  onSessionEnd: () => void;
  onError: (error: string) => void;
  // Agora props (optional)
  agoraConfig?: {
    appId: string;
    channelName: string;
    token: string;
    uid: string;
  };
}

type VideoProvider = 'jitsi' | 'webrtc' | 'agora';

export default function UnifiedVideoSession({
  sessionId,
  userRole,
  displayName,
  bookingDetails,
  onSessionEnd,
  onError,
  agoraConfig,
}: UnifiedVideoSessionProps) {
  const [selectedProvider, setSelectedProvider] = useState<VideoProvider>('jitsi');
  const [sessionStarted, setSessionStarted] = useState(false);

  const providers = [
    {
      id: 'jitsi' as VideoProvider,
      name: 'Jitsi Meet',
      description: 'Free, unlimited, feature-rich',
      icon: Globe,
      pros: ['100% Free', 'No API limits', 'Screen sharing', 'Recording', 'Mobile friendly'],
      cons: ['No PSTN support', 'Basic analytics'],
      color: 'green',
      recommended: true,
    },
    {
      id: 'webrtc' as VideoProvider,
      name: 'Custom WebRTC',
      description: 'Your existing P2P system',
      icon: Zap,
      pros: ['Fully custom', 'No external deps', 'Socket.IO based', 'P2P direct'],
      cons: ['Limited features', 'NAT traversal issues', 'No recording'],
      color: 'blue',
      recommended: false,
    },
    {
      id: 'agora' as VideoProvider,
      name: 'Agora.io',
      description: 'Premium enterprise solution',
      icon: DollarSign,
      pros: ['Enterprise grade', 'Global CDN', 'Advanced analytics', 'Phone support'],
      cons: ['Costs per minute', 'API quotas', 'Complex setup'],
      color: 'purple',
      recommended: false,
    },
  ];

  const startSession = () => {
    if (!selectedProvider) {
      onError('Please select a video provider');
      return;
    }
    setSessionStarted(true);
  };

  const handleSessionEnd = () => {
    setSessionStarted(false);
    onSessionEnd();
  };

  if (sessionStarted) {
    switch (selectedProvider) {
      case 'jitsi':
        return (
          <JitsiVideoSession
            roomName={sessionId}
            displayName={displayName}
            userRole={userRole}
            onCallEnd={handleSessionEnd}
            onCallStart={() => console.log('Jitsi session started')}
          />
        );

      case 'webrtc':
        return (
          <FreeVideoSession
            sessionId={sessionId}
            userType={userRole}
            userName={displayName}
            targetLanguage={bookingDetails.targetLanguage}
            onSessionEnd={handleSessionEnd}
          />
        );

      case 'agora':
        if (!agoraConfig) {
          onError('Agora configuration not provided');
          return null;
        }
        return (
          <VideoSession
            appId={agoraConfig.appId}
            channelName={agoraConfig.channelName}
            token={agoraConfig.token}
            uid={agoraConfig.uid}
            userType={userRole}
            bookingDetails={bookingDetails}
            onSessionEnd={handleSessionEnd}
            onError={onError}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Video Provider
          </h1>
          <p className="text-gray-600">
            Select the video calling solution for your session
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg inline-block">
            <p className="text-sm text-blue-800">
              <strong>Session:</strong> {bookingDetails.sourceLanguage} → {bookingDetails.targetLanguage} | 
              <strong> Role:</strong> {userRole} | 
              <strong> Duration:</strong> {bookingDetails.duration} min
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {providers.map((provider) => {
            const IconComponent = provider.icon;
            const isSelected = selectedProvider === provider.id;
            
            return (
              <Card 
                key={provider.id} 
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  isSelected 
                    ? `ring-2 ring-${provider.color}-500 bg-${provider.color}-50` 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedProvider(provider.id)}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <IconComponent className={`w-8 h-8 text-${provider.color}-600`} />
                    {provider.recommended && (
                      <Badge className="ml-2 bg-green-100 text-green-800">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{provider.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{provider.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-green-700 mb-1">✅ Pros:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {provider.pros.map((pro, idx) => (
                          <li key={idx}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-semibold text-red-700 mb-1">❌ Cons:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {provider.cons.map((con, idx) => (
                          <li key={idx}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            onClick={startSession}
            size="lg"
            disabled={!selectedProvider}
            className="px-8 py-3"
          >
            Start Session with {providers.find(p => p.id === selectedProvider)?.name}
          </Button>
        </div>

        {selectedProvider === 'jitsi' && (
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">🎉 Great Choice!</h3>
            <p className="text-sm text-green-700">
              Jitsi Meet is perfect for your LanguageHelp platform. It's completely free, 
              has no usage limits, includes screen sharing, and works great on mobile devices. 
              You can add Twilio later for phone support if needed.
            </p>
          </div>
        )}

        {selectedProvider === 'agora' && !agoraConfig && (
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Configuration Required</h3>
            <p className="text-sm text-yellow-700">
              Agora requires additional configuration (App ID, tokens, etc.). 
              Contact your administrator to set up Agora credentials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
