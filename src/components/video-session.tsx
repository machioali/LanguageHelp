'use client';

import { useEffect, useRef, useState } from 'react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IRemoteVideoTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoSessionProps {
  appId: string;
  channelName: string;
  token: string;
  uid: string;
  userType: 'client' | 'interpreter';
  bookingDetails: {
    sourceLanguage: string;
    targetLanguage: string;
    duration: number;
    clientName?: string;
    interpreterName?: string;
  };
  onSessionEnd: () => void;
  onError: (error: string) => void;
}

export default function VideoSession({
  appId,
  channelName,
  token,
  uid,
  userType,
  bookingDetails,
  onSessionEnd,
  onError
}: VideoSessionProps) {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [chatOpen, setChatOpen] = useState(false);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const sessionStartTime = useRef(Date.now());

  // Initialize Agora client
  useEffect(() => {
    const initializeAgora = async () => {
      try {
        // Create client
        const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        setClient(agoraClient);

        // Set up event listeners
        agoraClient.on('user-published', handleUserPublished);
        agoraClient.on('user-unpublished', handleUserUnpublished);
        agoraClient.on('user-joined', handleUserJoined);
        agoraClient.on('user-left', handleUserLeft);
        agoraClient.on('connection-state-change', (curState) => {
          setConnectionStatus(curState as any);
        });

        // Join channel
        await agoraClient.join(appId, channelName, token, uid);
        
        // Create and publish local tracks
        const [videoTrack, audioTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalVideoTrack(videoTrack);
        setLocalAudioTrack(audioTrack);

        // Play local video
        if (localVideoRef.current) {
          videoTrack.play(localVideoRef.current);
        }

        // Publish tracks
        await agoraClient.publish([videoTrack, audioTrack]);
        
        setConnectionStatus('connected');

      } catch (error) {
        console.error('Failed to initialize Agora:', error);
        onError('Failed to join video session');
      }
    };

    initializeAgora();

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, []);

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStartTime.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleUserJoined = (user: any) => {
    console.log('User joined:', user);
  };

  const handleUserLeft = (user: any) => {
    console.log('User left:', user);
    setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
  };

  const handleUserPublished = async (user: any, mediaType: 'video' | 'audio') => {
    if (!client) return;

    try {
      await client.subscribe(user, mediaType);
      
      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
        if (remoteVideoRef.current) {
          remoteVideoTrack.play(remoteVideoRef.current);
        }
      }
      
      if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack as IRemoteAudioTrack;
        remoteAudioTrack.play();
      }

      setRemoteUsers(prev => {
        const existing = prev.find(u => u.uid === user.uid);
        if (existing) {
          return prev.map(u => u.uid === user.uid ? user : u);
        }
        return [...prev, user];
      });

    } catch (error) {
      console.error('Failed to subscribe to user:', error);
    }
  };

  const handleUserUnpublished = (user: any, mediaType: 'video' | 'audio') => {
    console.log('User unpublished:', user, mediaType);
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      if (isVideoEnabled) {
        await localVideoTrack.setEnabled(false);
        setIsVideoEnabled(false);
      } else {
        await localVideoTrack.setEnabled(true);
        setIsVideoEnabled(true);
      }
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      if (isAudioEnabled) {
        await localAudioTrack.setEnabled(false);
        setIsAudioEnabled(false);
      } else {
        await localAudioTrack.setEnabled(true);
        setIsAudioEnabled(true);
      }
    }
  };

  const endSession = async () => {
    await cleanup();
    onSessionEnd();
  };

  const cleanup = async () => {
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (client) {
      await client.leave();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-green-400 border-green-400">
            {connectionStatus}
          </Badge>
          <div className="text-sm">
            <span className="text-gray-400">Session:</span> {formatTime(sessionDuration)}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {bookingDetails.sourceLanguage} → {bookingDetails.targetLanguage}
          </Badge>
          <div className="text-sm text-gray-400">
            {userType === 'client' ? bookingDetails.interpreterName : bookingDetails.clientName}
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video (Main) */}
        <div className="w-full h-full bg-gray-800 relative">
          <div 
            ref={remoteVideoRef} 
            className="w-full h-full flex items-center justify-center"
          >
            {remoteUsers.length === 0 && (
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-12 h-12 text-gray-500" />
                </div>
                <p className="text-gray-400">Waiting for {userType === 'client' ? 'interpreter' : 'client'} to join...</p>
              </div>
            )}
          </div>
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <Card className="absolute top-4 right-4 w-48 h-36 bg-gray-700 border-gray-600">
          <div 
            ref={localVideoRef}
            className="w-full h-full rounded-lg overflow-hidden relative"
          >
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        </Card>

        {/* Chat Toggle */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setChatOpen(!chatOpen)}
          className="absolute top-4 left-4"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat
        </Button>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-6 flex items-center justify-center space-x-4">
        <Button
          variant={isAudioEnabled ? 'default' : 'destructive'}
          size="lg"
          onClick={toggleAudio}
          className="rounded-full w-14 h-14"
        >
          {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </Button>

        <Button
          variant={isVideoEnabled ? 'default' : 'destructive'}
          size="lg"
          onClick={toggleVideo}
          className="rounded-full w-14 h-14"
        >
          {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </Button>

        <Button
          variant="destructive"
          size="lg"
          onClick={endSession}
          className="rounded-full w-14 h-14"
        >
          <PhoneOff className="w-6 h-6" />
        </Button>
      </div>

      {/* Session Info */}
      <div className="bg-gray-900 px-4 py-2 text-xs text-gray-500 text-center">
        {userType === 'interpreter' ? 'Interpreting' : 'Session'} • {bookingDetails.duration} min allocated
      </div>
    </div>
  );
}
