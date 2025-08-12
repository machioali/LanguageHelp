'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { WebRTCManager } from '@/lib/webrtc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, MessageSquare, Send } from 'lucide-react';

interface FreeVideoSessionProps {
  sessionId: string;
  userId: string;
  userType: 'client' | 'interpreter';
  userNames: {
    clientName?: string;
    interpreterName?: string;
  };
  language?: string; // Add language parameter
  onSessionEnd: () => void;
  onError: (error: string) => void;
}

export default function FreeVideoSession({
  sessionId,
  userId,
  userType,
  userNames,
  language,
  onSessionEnd,
  onError
}: FreeVideoSessionProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [webrtc, setWebrtc] = useState<WebRTCManager | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isAudioOnlyMode, setIsAudioOnlyMode] = useState(false);
  const [connectionStats, setConnectionStats] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{message: string, senderType: string, timestamp: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [remoteUserConnected, setRemoteUserConnected] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const sessionStartTime = useRef(Date.now());

  // Initialize Socket.IO connection
  useEffect(() => {
    const socketConnection = io('http://localhost:3001', {
      transports: ['websocket'],
      timeout: 10000,
    });

    socketConnection.on('connect', () => {
      console.log('Connected to signaling server');
      
      // Join session
      socketConnection.emit('join', {
        userId,
        userType,
        sessionId
      });
      
      setSocket(socketConnection);
    });

    socketConnection.on('disconnect', () => {
      console.log('Disconnected from signaling server');
    });

    socketConnection.on('connect_error', (error) => {
      console.error('Connection error:', error);
      onError('Failed to connect to signaling server. Make sure the server is running.');
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [sessionId, userId, userType]);

  // Initialize WebRTC when socket connects
  useEffect(() => {
    if (!socket) return;

    const initializeWebRTC = async () => {
      try {
        const webrtcManager = new WebRTCManager(
          // On remote stream
          (stream: MediaStream) => {
            console.log('Remote stream received');
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
            }
            setRemoteUserConnected(true);
          },
          // On data channel message (chat)
          (message: string) => {
            const chatMessage = JSON.parse(message);
            setChatMessages(prev => [...prev, chatMessage]);
          },
          // On connection state change
          (state: RTCPeerConnectionState) => {
            console.log('Connection state:', state);
            setConnectionState(state);
            
            if (state === 'failed' || state === 'disconnected') {
              onError('Connection lost');
            }
          }
        );

        // Initialize connection (client initiates)
        await webrtcManager.initializeConnection(userType === 'client');

        // Display local video
        const localStream = webrtcManager.getLocalStream();
        if (localStream && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        setWebrtc(webrtcManager);

        // Set up WebRTC signaling through Socket.IO
        setupWebRTCSignaling(socket, webrtcManager);

        // If client, create and send offer
        if (userType === 'client') {
          const offer = await webrtcManager.createOffer();
          socket.emit('webrtc-offer', { sessionId, offer });
        }

      } catch (error) {
        console.error('WebRTC initialization error:', error);
        onError('Could not access camera/microphone');
      }
    };

    initializeWebRTC();
  }, [socket, userType, sessionId]);

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStartTime.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const setupWebRTCSignaling = (socket: Socket, webrtcManager: WebRTCManager) => {
    // Handle WebRTC offer
    socket.on('webrtc-offer', async ({ offer }) => {
      console.log('Received WebRTC offer');
      try {
        const answer = await webrtcManager.createAnswer(offer);
        socket.emit('webrtc-answer', { sessionId, answer });
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    });

    // Handle WebRTC answer
    socket.on('webrtc-answer', async ({ answer }) => {
      console.log('Received WebRTC answer');
      try {
        await webrtcManager.handleAnswer(answer);
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    });

    // Handle ICE candidates
    socket.on('webrtc-ice-candidate', async ({ candidate }) => {
      console.log('Received ICE candidate');
      try {
        await webrtcManager.handleIceCandidate(candidate);
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    });

    // Handle chat messages
    socket.on('chat-message', (chatMessage) => {
      setChatMessages(prev => [...prev, chatMessage]);
    });

    // Handle user joined/left
    socket.on('user-joined', ({ userType: joinedUserType }) => {
      console.log(`${joinedUserType} joined the session`);
    });

    socket.on('user-left', ({ userType: leftUserType }) => {
      console.log(`${leftUserType} left the session`);
      setRemoteUserConnected(false);
    });

    socket.on('session-ended', () => {
      onSessionEnd();
    });
  };

  const toggleVideo = () => {
    if (webrtc) {
      webrtc.toggleVideo();
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (webrtc) {
      webrtc.toggleAudio();
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const sendChatMessage = () => {
    if (chatInput.trim() && socket) {
      const message = {
        message: chatInput.trim(),
        senderType: userType,
        timestamp: new Date().toISOString()
      };

      // Send via Socket.IO
      socket.emit('chat-message', {
        sessionId,
        ...message
      });

      // Add to local messages
      setChatMessages(prev => [...prev, message]);
      setChatInput('');
    }
  };

  const endSession = async () => {
    // Prevent multiple calls
    if (isEndingSession) {
      console.log('❌ Session is already ending, ignoring duplicate call');
      return;
    }

    setIsEndingSession(true);
    console.log('🔄 Starting session end process...');
    
    const endTime = new Date().toISOString();
    const sessionDurationSeconds = Math.floor((Date.now() - sessionStartTime.current) / 1000);
    
    // Only record session if we're the interpreter (to avoid duplicate records)
    if (userType === 'interpreter' && sessionDurationSeconds > 5) { // Only record sessions longer than 5 seconds
      try {
        console.log('🔄 Recording session to database...');
        
        const sessionData = {
          sessionId,
          clientName: userNames.clientName || 'Unknown Client',
          language: language || 'Unknown Language',
          sessionType: 'VRI', // Video Remote Interpreting
          duration: sessionDurationSeconds,
          startTime: new Date(sessionStartTime.current).toISOString(),
          endTime: endTime
        };
        
        const response = await fetch('/api/interpreter/sessions/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important for authentication cookies
          body: JSON.stringify(sessionData)
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log('✅ Session recorded successfully:', result.data);
            console.log('📊 Duration:', result.data.duration, 'minutes');
            console.log('💰 Earnings:', '$' + result.data.earnings);
          } else {
            console.error('❌ Failed to record session:', result.error);
          }
        } else {
          console.error('❌ HTTP error recording session:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('❌ Error recording session:', error);
        // Don't block session ending if recording fails
      }
    }
    
    // Continue with normal session ending
    try {
      if (socket) {
        socket.emit('end-session', { sessionId });
      }
      
      if (webrtc) {
        webrtc.endCall();
      }
      
      console.log('✅ Session ended successfully');
      onSessionEnd();
    } catch (error) {
      console.error('❌ Error during session cleanup:', error);
      onSessionEnd(); // Still call onSessionEnd even if cleanup fails
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge 
              variant={connectionState === 'connected' ? 'default' : 'destructive'}
            >
              {connectionState === 'connected' ? 'Connected' : connectionState}
            </Badge>
            <div className="text-sm">
              <span className="text-gray-400">Duration:</span> {formatTime(sessionDuration)}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-400">
              {userType === 'client' ? userNames.interpreterName : userNames.clientName}
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div className="flex-1 relative bg-gray-800">
          {/* Remote Video (Main) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Local Video (Picture-in-Picture) */}
          <Card className="absolute top-4 right-4 w-48 h-36 bg-gray-700 border-gray-600 overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </Card>

          {/* Waiting Message */}
          {!remoteUserConnected && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-12 h-12 text-gray-500" />
                </div>
                <p className="text-gray-400">
                  Waiting for {userType === 'client' ? 'interpreter' : 'client'} to join...
                </p>
              </div>
            </div>
          )}
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
            variant="secondary"
            size="lg"
            onClick={() => setChatOpen(!chatOpen)}
            className="rounded-full w-14 h-14"
          >
            <MessageSquare className="w-6 h-6" />
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={endSession}
            disabled={isEndingSession}
            className="rounded-full w-14 h-14"
          >
            {isEndingSession ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PhoneOff className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Chat Sidebar */}
      {chatOpen && (
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold">Chat</h3>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-xs ${
                  msg.senderType === userType
                    ? 'bg-blue-600 ml-auto'
                    : 'bg-gray-700'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type a message..."
                className="bg-gray-700 border-gray-600"
              />
              <Button onClick={sendChatMessage} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
