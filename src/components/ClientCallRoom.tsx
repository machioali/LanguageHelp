'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { WebRTCManager } from '@/lib/webrtc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Send, 
  Star, Crown, Shield, Sparkles, Clock, Globe, Award, Heart,
  Volume2, VolumeX, Maximize, Minimize, Settings, Download,
  Camera, CameraOff, Monitor, Smartphone, Headphones, Zap,
  Coffee, ThumbsUp, Gift, Diamond, Palette, Sun, Moon,
  FileText, Upload, Pause, Play, RotateCcw, Wifi, Signal,
  Users, Bookmark, Share2, Circle, StopCircle, MoreHorizontal,
  Languages, Lightbulb, AlertCircle, CheckCircle2, X, RefreshCw,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { JitsiDebugInfo } from '@/components/JitsiDebugInfo';
import CallRoomDebugger from '@/components/CallRoomDebugger';

interface ClientCallRoomProps {
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

interface SessionMetrics {
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  latency: number;
  packetLoss: number;
  bitrate: number;
}

export default function ClientCallRoom({
  sessionId,
  userId,
  userType,
  userNames,
  language,
  onSessionEnd,
  onError
}: ClientCallRoomProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [webrtc, setWebrtc] = useState<WebRTCManager | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{message: string, senderType: string, timestamp: string, isSystemMessage?: boolean}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [remoteUserConnected, setRemoteUserConnected] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics>({
    quality: 'excellent',
    latency: 45,
    packetLoss: 0.1,
    bitrate: 1200
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<'luxury' | 'professional' | 'warm'>('luxury');
  const [volume, setVolume] = useState(80);
  const [showInterpreterInfo, setShowInterpreterInfo] = useState(true);
  
  // Enhanced features
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('chat');
  const [isRecording, setIsRecording] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [bookmarks, setBookmarks] = useState<{time: number, note: string}[]>([]);
  const [documents, setDocuments] = useState<{name: string, url: string}[]>([]);
  const [translationMode, setTranslationMode] = useState(false);
  const [sessionRating, setSessionRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'excellent' | 'good' | 'fair' | 'poor'>('excellent');
  const [audioLevels, setAudioLevels] = useState({ local: 0, remote: 0 });
  const [showTooltips, setShowTooltips] = useState(true);
  
  // Persistent room connection state
  const [connectionStatus, setConnectionStatus] = useState('connected'); // connected, disconnected, reconnecting
  const [waitingForParticipant, setWaitingForParticipant] = useState<string | null>(null);
  const [roomMessage, setRoomMessage] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const sessionStartTime = useRef(Date.now());
  
  // Video integration options
  const [JitsiVideoSession, setJitsiVideoSession] = useState<any>(null);
  const [SimpleVideoCall, setSimpleVideoCall] = useState<any>(null);
  const [isJitsiLoading, setIsJitsiLoading] = useState(true);
  const [useJitsiInsteadOfWebRTC, setUseJitsiInsteadOfWebRTC] = useState(true);
  const [useSimpleVideoCall, setUseSimpleVideoCall] = useState(false); // Fallback for auth issues
  
  // Generate room name from session ID - MUST match interpreter room name
  // Use useMemo to prevent recalculation on every render
  const jitsiRoomName = useMemo(() => {
    const cleanSessionId = sessionId.startsWith('session_') ? sessionId.replace('session_', '') : sessionId;
    return `languagehelp-session-${cleanSessionId}`;
  }, [sessionId]);
  
  const clientDisplayName = useMemo(() => {
    return userNames.clientName || 'Client';
  }, [userNames.clientName]);
  
  // Debug logging for room coordination - only log once when room name changes
  useEffect(() => {
    console.log('🎯 ClientCallRoom Room Coordination:', {
      sessionId,
      jitsiRoomName,
      clientDisplayName,
      userNames,
      language,
      timestamp: new Date().toISOString()
    });
  }, [sessionId, jitsiRoomName, clientDisplayName]); // Only log when these values actually change
  
  // Listen for persistent room events
  useEffect(() => {
    const handleSessionResumed = (event: any) => {
      const { message } = event.detail;
      console.log('🔄 Client session resumed in ClientCallRoom:', message);
      setConnectionStatus('connected');
      setWaitingForParticipant(null);
      setRoomMessage(null);
      toast.success('✅ Session resumed - both participants reconnected');
    };
    
    const handleWaitingForParticipant = (event: any) => {
      const { message, missingParticipant } = event.detail;
      console.log('⏳ Client waiting for participant in ClientCallRoom:', message);
      setWaitingForParticipant(missingParticipant);
      setRoomMessage(message);
      toast('⏳ Interpreter temporarily disconnected - maintaining session', { duration: 5000 });
    };
    
    const handleParticipantDisconnected = (event: any) => {
      const { disconnectedUser, message, reconnectionTimeout } = event.detail;
      console.log('🔄 Participant disconnected in ClientCallRoom:', message);
      setWaitingForParticipant(disconnectedUser);
      setRoomMessage(message);
      
      const timeoutMinutes = Math.floor(reconnectionTimeout / 60000);
      toast(`🔄 ${disconnectedUser} disconnected - waiting ${timeoutMinutes} minutes for reconnection`, { 
        duration: 8000 
      });
    };
    
    // Add event listeners
    window.addEventListener('session-resumed', handleSessionResumed);
    window.addEventListener('waiting-for-participant', handleWaitingForParticipant);
    window.addEventListener('participant-disconnected', handleParticipantDisconnected);
    
    // Cleanup
    return () => {
      window.removeEventListener('session-resumed', handleSessionResumed);
      window.removeEventListener('waiting-for-participant', handleWaitingForParticipant);
      window.removeEventListener('participant-disconnected', handleParticipantDisconnected);
    };
  }, []);
  
  useEffect(() => {
    // Dynamically import Jitsi component
    import('@/components/JitsiVideoSession').then((module) => {
      setJitsiVideoSession(() => module.default);
      setIsJitsiLoading(false);
    }).catch((error) => {
      console.error('Failed to load Jitsi component:', error);
      setIsJitsiLoading(false);
      setUseJitsiInsteadOfWebRTC(false); // Fallback to WebRTC
    });
  }, []);

  // Theme configurations
  const themes = {
    luxury: {
      bg: 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900',
      cardBg: 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-purple-500/20',
      accent: 'text-purple-400',
      button: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
      headerBg: 'bg-gradient-to-r from-slate-900/95 to-purple-900/30 backdrop-blur-xl border-b border-purple-500/20'
    },
    professional: {
      bg: 'bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900',
      cardBg: 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-blue-500/20',
      accent: 'text-blue-400',
      button: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
      headerBg: 'bg-gradient-to-r from-slate-900/95 to-blue-900/30 backdrop-blur-xl border-b border-blue-500/20'
    },
    warm: {
      bg: 'bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900',
      cardBg: 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-amber-500/20',
      accent: 'text-amber-400',
      button: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700',
      headerBg: 'bg-gradient-to-r from-slate-900/95 to-amber-900/30 backdrop-blur-xl border-b border-amber-500/20'
    }
  };

  const currentTheme = themes[theme];

  // Initialize Socket.IO connection
  useEffect(() => {
    const socketConnection = io('http://localhost:3001', {
      transports: ['websocket'],
      timeout: 10000,
    });

    socketConnection.on('connect', () => {
      console.log('🎯 Connected to premium signaling server');
      
      // Welcome message for clients
      if (userType === 'client') {
        toast.success('✨ Welcome to your premium interpretation session!', {
          duration: 4000,
          icon: '🌟'
        });
      }
      
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
      onError('Failed to connect to signaling server. Please try again.');
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [sessionId, userId, userType]);

  // Initialize WebRTC when socket connects - STABLE DEPENDENCIES
  useEffect(() => {
    if (!socket) return;

    const initializeWebRTC = async () => {
      try {
        const webrtcManager = new WebRTCManager(
          // On remote stream
          (stream: MediaStream) => {
            console.log('🎥 Remote stream received - connecting you to your interpreter');
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
            }
            setRemoteUserConnected(true);
            
            // Special client notification
            if (userType === 'client') {
              toast.success(`🤝 Connected to your ${language} interpreter!`, {
                duration: 3000
              });
              
              // Add welcome chat message
              setChatMessages(prev => [...prev, {
                message: `Welcome! I'm your certified ${language} interpreter. How may I assist you today?`,
                senderType: 'interpreter',
                timestamp: new Date().toISOString(),
                isSystemMessage: true
              }]);
            }
          },
          // On data channel message (chat)
          (message: string) => {
            const chatMessage = JSON.parse(message);
            setChatMessages(prev => [...prev, chatMessage]);
            
            // Show chat notification for clients
            if (userType === 'client' && chatMessage.senderType === 'interpreter') {
              toast('💬 Message from your interpreter', {
                duration: 2000,
                icon: '📨'
              });
            }
          },
          // On connection state change
          (state: RTCPeerConnectionState) => {
            console.log('Connection state:', state);
            setConnectionState(state);

            // Mark remote user as connected as soon as the peer connection is connected,
            // even if the remote track event arrives slightly later. This prevents the UI
            // from being stuck on the "Connecting..." overlay.
            if (state === 'connected') {
              setRemoteUserConnected(true);
            }
            
            if (state === 'connected' && userType === 'client') {
              toast.success('🎉 Premium connection established!', {
                duration: 2000
              });
            }
            
            if (state === 'failed') {
              console.log('🚨 WebRTC connection failed');
              toast.error('Connection failed. Session will end shortly.', {
                duration: 4000,
                icon: '🚨'
              });
              
              // Auto-end session after connection failure
              setTimeout(() => {
                console.log('🔄 Auto-ending session due to WebRTC connection failure');
                endSession();
              }, 3000);
            }
            
            if (state === 'disconnected') {
              console.log('🔌 WebRTC connection disconnected');
              setRemoteUserConnected(false);
              
              toast('Connection interrupted. Attempting to reconnect...', {
                duration: 4000,
                icon: '🔄'
              });
              
              // Give some time for reconnection, then end session
              setTimeout(() => {
                if (connectionState === 'disconnected' || connectionState === 'failed') {
                  console.log('🔄 Auto-ending session due to prolonged disconnection');
                  endSession();
                }
              }, 8000); // Give 8 seconds for potential reconnection
            }
            
            if (state === 'closed') {
              console.log('🚪 WebRTC connection closed');
              setRemoteUserConnected(false);
              
              // Connection was intentionally closed, likely ending session
              toast('Connection closed', {
                duration: 2000,
                icon: 'ℹ️'
              });
            }
          }
        );

        await webrtcManager.initializeConnection(userType === 'client');

        const localStream = webrtcManager.getLocalStream();
        if (localStream && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        setWebrtc(webrtcManager);
        setupWebRTCSignaling(socket, webrtcManager);

        // Only client creates initial offer, interpreter waits to respond
        if (userType === 'client') {
          console.log('🎯 Client creating WebRTC offer');
          const offer = await webrtcManager.createOffer();
          socket.emit('webrtc-offer', { sessionId, offer });
        } else {
          console.log('🎯 Interpreter ready to receive WebRTC offer');
        }

      } catch (error) {
        console.error('WebRTC initialization error:', error);
        onError('Could not access camera/microphone');
      }
    };

    initializeWebRTC();
  }, [socket]); // FIXED: Removed changing dependencies that cause restarts

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStartTime.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate connection quality metrics (in real app, get from WebRTC stats) - OPTIMIZED
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionMetrics(prev => {
        // Only update if values actually changed significantly to prevent unnecessary renders
        const newQuality = Math.random() > 0.8 ? 'good' : 'excellent';
        const newLatency = 40 + Math.random() * 20;
        if (prev.quality !== newQuality || Math.abs(prev.latency - newLatency) > 5) {
          return {
            quality: newQuality,
            latency: newLatency,
            packetLoss: Math.random() * 0.5,
            bitrate: 1100 + Math.random() * 200
          };
        }
        return prev; // Don't trigger re-render if no significant change
      });
    }, 10000); // Reduced frequency from 5s to 10s
    return () => clearInterval(interval);
  }, []);

  const setupWebRTCSignaling = (socket: Socket, webrtcManager: WebRTCManager) => {
    socket.on('webrtc-offer', async ({ offer }) => {
      console.log('Received WebRTC offer');
      try {
        const answer = await webrtcManager.createAnswer(offer);
        socket.emit('webrtc-answer', { sessionId, answer });
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    });

    socket.on('webrtc-answer', async ({ answer }) => {
      console.log('Received WebRTC answer');
      try {
        await webrtcManager.handleAnswer(answer);
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    });

    socket.on('webrtc-ice-candidate', async ({ candidate }) => {
      try {
        await webrtcManager.handleIceCandidate(candidate);
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    });

    socket.on('chat-message', (chatMessage) => {
      setChatMessages(prev => [...prev, chatMessage]);
    });

    socket.on('user-joined', ({ userType: joinedUserType }) => {
      console.log(`${joinedUserType} joined the session`);
    });

    socket.on('user-left', ({ userType: leftUserType }) => {
      console.log(`${leftUserType} left the session`);
      setRemoteUserConnected(false);
      
      // Auto-disconnect when the other party leaves
      if (userType === 'client') {
        toast.error('📞 Your interpreter has disconnected', {
          duration: 4000,
          icon: '😔'
        });
      } else {
        toast.error('📞 Client has disconnected', {
          duration: 4000,
          icon: '😔'
        });
      }
      
      // Automatically end session after 3 seconds
      setTimeout(() => {
        console.log('🔄 Auto-ending session due to disconnect');
        endSession();
      }, 3000);
    });

    socket.on('session-ended', ({ endedBy, disconnectedUser }) => {
      console.log(`Session ended by ${endedBy}`);
      
      if (endedBy === 'disconnect') {
        // Handle disconnection scenarios
        if (disconnectedUser && disconnectedUser !== userType) {
          if (userType === 'client') {
            toast.error('😔 Your interpreter disconnected. Session ended.', {
              duration: 5000,
              icon: '📞'
            });
          } else {
            toast.error('😔 Client disconnected. Session ended.', {
              duration: 5000,
              icon: '📞'
            });
          }
        }
      } else if (endedBy && endedBy !== userType) {
        // Handle intentional session ending
        if (userType === 'client') {
          toast.success('🎉 Session completed by your interpreter');
        } else {
          toast.success('🎉 Session completed by client');
        }
      }
      
      onSessionEnd();
    });
    
    // Handle socket disconnection
    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      toast.error('Connection lost. Attempting to reconnect...', {
        duration: 5000,
        icon: '🔌'
      });
      
      setRemoteUserConnected(false);
      
      // Try to reconnect after 2 seconds
      setTimeout(() => {
        if (!socket.connected) {
          console.log('🔄 Auto-ending session due to connection loss');
          endSession();
        }
      }, 5000); // Give 5 seconds for reconnection
    });
  };

  const toggleVideo = () => {
    if (webrtc) {
      webrtc.toggleVideo();
      setIsVideoEnabled(!isVideoEnabled);
      toast.success(isVideoEnabled ? '📹 Camera turned off' : '📹 Camera turned on');
    }
  };

  const toggleAudio = () => {
    if (webrtc) {
      webrtc.toggleAudio();
      setIsAudioEnabled(!isAudioEnabled);
      toast.success(isAudioEnabled ? '🔇 Microphone muted' : '🎤 Microphone unmuted');
    }
  };

  const sendChatMessage = () => {
    if (chatInput.trim() && socket) {
      const message = {
        message: chatInput.trim(),
        senderType: userType,
        timestamp: new Date().toISOString()
      };

      socket.emit('chat-message', {
        sessionId,
        ...message
      });

      setChatMessages(prev => [...prev, message]);
      setChatInput('');
    }
  };

  const endSession = async () => {
    if (isEndingSession) return;

    setIsEndingSession(true);
    
    // Special client experience
    if (userType === 'client') {
      toast.success('📞 Thank you for using LanguageHelp Premium!', {
        duration: 3000,
        icon: '✨'
      });
    }
    
    const endTime = new Date().toISOString();
    const sessionDurationSeconds = Math.floor((Date.now() - sessionStartTime.current) / 1000);
    
    try {
      // Signal end to other participants FIRST
      if (socket) {
        socket.emit('end-session', { sessionId, userType });
      }
      
      // Clean up WebRTC connection
      if (webrtc) {
        webrtc.endCall();
      }
      
      // Record session in database if client (do this after signaling)
      if (userType === 'client') {
        console.log('🎯 Recording client session:', {
          sessionId,
          duration: sessionDurationSeconds,
          language,
          startTime: sessionStartTime.current
        });
        
        try {
          const sessionData = {
            sessionId,
            clientName: userNames.clientName || 'Anonymous Client',
            interpreterName: userNames.interpreterName || 'Professional Interpreter',
            language: language || 'Unknown',
            sessionType: 'VRI', // Video call
            duration: sessionDurationSeconds,
            startTime: new Date(sessionStartTime.current).toISOString(),
            endTime: endTime,
            rating: sessionRating || 0
          };
          
          const response = await fetch('/api/client/sessions/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(sessionData)
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log('✅ Client session recorded successfully:', result);
          } else {
            console.error('❌ Failed to record client session:', response.status);
          }
        } catch (error) {
          console.error('💥 Error recording client session:', error);
        }
      }
      
      // Short delay to ensure cleanup completes, then call onSessionEnd
      setTimeout(() => {
        console.log('✅ Premium session ended successfully - redirecting to dashboard');
        onSessionEnd();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error during session cleanup:', error);
      // Even if there's an error, we should still end the session
      setTimeout(() => {
        onSessionEnd();
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className={cn("h-screen text-white flex transition-all duration-500", currentTheme.bg)}>
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Premium Header */}
        <div className={cn("p-6 flex items-center justify-between", currentTheme.headerBg)}>
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
              <div className={cn(
                "w-3 h-3 rounded-full",
                connectionState === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              )} />
              <span className="text-sm font-medium">
                {waitingForParticipant ? (
                  <span className="text-yellow-400">
                    Waiting for {waitingForParticipant}...
                  </span>
                ) : connectionState === 'connected' ? 'Premium Connection Active' : 'Connecting...'}
              </span>
            </div>
            
            {/* Room Message */}
            {roomMessage && (
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-yellow-400 max-w-64 truncate">
                  {roomMessage}
                </span>
              </div>
            )}

            {/* Quality Indicator */}
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className={cn("text-sm font-medium", getQualityColor(sessionMetrics.quality))}>
                {sessionMetrics.quality.toUpperCase()} Quality
              </span>
            </div>
          </div>
          
          {/* Session Info */}
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-gray-300">Session Duration</div>
              <div className="text-lg font-mono font-semibold">{formatTime(sessionDuration)}</div>
            </div>
            
            {showInterpreterInfo && remoteUserConnected && (
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10 ring-2 ring-purple-400">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white font-semibold">
                    {userNames.interpreterName?.charAt(0) || 'I'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">{userNames.interpreterName || 'Your Interpreter'}</div>
                  <div className="text-xs text-gray-300 flex items-center">
                    <Award className="w-3 h-3 mr-1" />
                    Certified • {language} Expert
                  </div>
                </div>
              </div>
            )}

            {/* Theme Switcher */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'luxury' ? 'professional' : theme === 'professional' ? 'warm' : 'luxury')}
                className="w-8 h-8 p-0"
              >
                <Palette className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div className="flex-1 relative">
          {/* Primary: Use Jitsi for reliable connection */}
          {useJitsiInsteadOfWebRTC && JitsiVideoSession ? (
            <div className="w-full h-full relative">
              <JitsiVideoSession
                roomName={jitsiRoomName}
                displayName={clientDisplayName}
                userRole="client"
                onCallStart={() => {
                  console.log('🎯 Client Jitsi session started:', { roomName: jitsiRoomName, displayName: clientDisplayName });
                  toast.success('🎉 Connected to your interpreter!');
                  setRemoteUserConnected(true);
                }}
                onCallEnd={() => {
                  console.log('🎯 Client Jitsi session ended:', { roomName: jitsiRoomName });
                  endSession();
                }}
                onError={(error: any) => {
                  console.error('🚨 Client Jitsi error:', error);
                  toast.error('Connection failed. Please try again.');
                  onError(error);
                }}
              />
              
              {/* Debug Info */}
              <JitsiDebugInfo
                roomName={jitsiRoomName}
                displayName={clientDisplayName}
                userRole="client"
                sessionId={sessionId}
                userNames={userNames}
              />
              
              {/* Premium Overlay Effects - Only show if not loading */}
              {!isJitsiLoading && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-br-full" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-indigo-500/10 to-transparent rounded-tl-full" />
                </div>
              )}
            </div>
          ) : useSimpleVideoCall && SimpleVideoCall ? (
            /* Fallback: Use SimpleVideoCall if available */
            <SimpleVideoCall
              sessionId={sessionId}
              userId={userId}
              userType={userType}
              userNames={userNames}
              language={language}
              onSessionEnd={onSessionEnd}
              onError={onError}
            />
          ) : (
            /* Final fallback to WebRTC */
            <div className="w-full h-full relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Premium Overlay Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-br-full" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-indigo-500/10 to-transparent rounded-tl-full" />
              </div>

              {/* Local Video (Picture-in-Picture) - Only for WebRTC fallback */}
              <Card className={cn("absolute top-6 right-6 w-64 h-48 overflow-hidden", currentTheme.cardBg)}>
                <div className="relative w-full h-full">
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
                  
                  {/* You label for client */}
                  <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs font-medium">
                    You
                  </div>
                </div>
              </Card>
            </div>
          )}

            {/* Quality Metrics */}
            <Card className={cn("absolute top-6 left-6 p-4", currentTheme.cardBg)}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-medium">Connection Quality</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Latency:</span>
                    <span className="text-green-400">{sessionMetrics.latency.toFixed(0)}ms</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Quality:</span>
                    <span className={getQualityColor(sessionMetrics.quality)}>
                      {sessionMetrics.quality}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

        </div>

        {/* Premium Controls */}
        <div className={cn("p-8 flex items-center justify-between", currentTheme.headerBg)}>
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border-white/20 text-white"
            >
              <MoreHorizontal className="w-4 h-4" />
              <span>Tools</span>
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setChatOpen(!chatOpen)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border-white/20 text-white"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
              {chatMessages.length > 0 && (
                <Badge className="ml-1 bg-red-500 text-white text-xs px-1">
                  {chatMessages.length}
                </Badge>
              )}
            </Button>
            
            <Button
              variant={isRecording ? 'destructive' : 'secondary'}
              size="sm"
              onClick={() => {
                setIsRecording(!isRecording);
                toast.success(isRecording ? '⏹️ Recording stopped' : '🔴 Recording started');
              }}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border-white/20 text-white"
            >
              {isRecording ? <StopCircle className="w-4 h-4 text-red-400" /> : <Circle className="w-4 h-4 text-white" />}
              <span>{isRecording ? 'Stop' : 'Record'}</span>
            </Button>

            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-gray-300" />
              <div className="w-24">
                <Progress value={volume} className="h-2" />
              </div>
              <span className="text-xs text-gray-300">{volume}%</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Button
              variant={isAudioEnabled ? 'default' : 'destructive'}
              size="lg"
              onClick={toggleAudio}
              className={cn(
                "rounded-full w-16 h-16 font-semibold shadow-lg transition-all duration-200",
                isAudioEnabled 
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white" 
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              )}
            >
              {isAudioEnabled ? <Mic className="w-7 h-7" /> : <MicOff className="w-7 h-7" />}
            </Button>

            <Button
              variant={isVideoEnabled ? 'default' : 'destructive'}
              size="lg"
              onClick={toggleVideo}
              className={cn(
                "rounded-full w-16 h-16 font-semibold shadow-lg transition-all duration-200",
                isVideoEnabled 
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white" 
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              )}
            >
              {isVideoEnabled ? <Video className="w-7 h-7" /> : <VideoOff className="w-7 h-7" />}
            </Button>

            <Button
              variant="destructive"
              size="lg"
              onClick={endSession}
              disabled={isEndingSession}
              className="rounded-full w-16 h-16 text-white font-semibold shadow-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              {isEndingSession ? (
                <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <PhoneOff className="w-7 h-7" />
              )}
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Chat Sidebar */}
      {chatOpen && (
        <div className={cn("w-96 border-l flex flex-col", currentTheme.cardBg, "border-purple-500/20")}>
          <div className="p-6 border-b border-purple-500/20">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-purple-400" />
                Premium Chat
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChatOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </Button>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[calc(100vh-200px)]">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg max-w-xs transition-all duration-200",
                  msg.senderType === userType
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 ml-auto shadow-lg"
                    : msg.isSystemMessage
                    ? "bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-500/20"
                    : "bg-slate-700/50 border border-slate-600/50"
                )}
              >
                <p className="text-sm leading-relaxed">{msg.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                  {msg.senderType === 'interpreter' && !msg.isSystemMessage && (
                    <ThumbsUp className="w-3 h-3 text-green-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-purple-500/20">
            <div className="flex space-x-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type your message..."
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400"
              />
              <Button 
                onClick={sendChatMessage} 
                size="sm"
                className={cn("px-4", currentTheme.button)}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center space-x-2 mt-3">
              <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white">
                👍 Thank you
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white">
                🔄 Repeat please
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white">
                ⏸️ Pause
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced Tools Sidebar */}
      {sidebarOpen && (
        <div className={cn("w-96 border-l flex flex-col", currentTheme.cardBg, "border-purple-500/20")}>
          <div className="p-6 border-b border-purple-500/20">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-400" />
                Premium Tools
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
                <TabsTrigger value="docs" className="text-xs">Docs</TabsTrigger>
                <TabsTrigger value="tools" className="text-xs">Tools</TabsTrigger>
                <TabsTrigger value="stats" className="text-xs">Stats</TabsTrigger>
              </TabsList>
              
              {/* Session Notes Tab */}
              <TabsContent value="notes" className="flex-1 p-4 space-y-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Session Notes
                      </h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const bookmark = {
                            time: sessionDuration,
                            note: `Bookmark at ${formatTime(sessionDuration)}`
                          };
                          setBookmarks(prev => [...prev, bookmark]);
                          toast.success('📌 Bookmark added');
                        }}
                      >
                        <Bookmark className="w-3 h-3" />
                      </Button>
                    </div>
                    <Textarea
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      placeholder="Take notes during your session..."
                      className="min-h-[120px] bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  {/* Bookmarks */}
                  <div>
                    <h5 className="text-sm font-semibold mb-2 flex items-center">
                      <Bookmark className="w-4 h-4 mr-2 text-yellow-400" />
                      Bookmarks ({bookmarks.length})
                    </h5>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {bookmarks.map((bookmark, index) => (
                        <div key={index} className="p-2 bg-slate-700/30 rounded text-xs flex items-center justify-between">
                          <div>
                            <div className="font-medium">{formatTime(bookmark.time)}</div>
                            <div className="text-gray-400">{bookmark.note}</div>
                          </div>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Play className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      {bookmarks.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-4">No bookmarks yet</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      className={cn("w-full", currentTheme.button)}
                      onClick={() => {
                        navigator.clipboard.writeText(sessionNotes);
                        toast.success('📋 Notes copied to clipboard');
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Notes
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Documents Tab */}
              <TabsContent value="docs" className="flex-1 p-4 space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Shared Documents
                    </h4>
                    <Button
                      size="sm"
                      className={cn("w-full", currentTheme.button)}
                      onClick={() => {
                        // Simulate file upload
                        const newDoc = {
                          name: `Document_${documents.length + 1}.pdf`,
                          url: '#'
                        };
                        setDocuments(prev => [...prev, newDoc]);
                        toast.success('📄 Document uploaded');
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {documents.map((doc, index) => (
                      <div key={index} className="p-3 bg-slate-700/30 rounded flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <div>
                            <div className="text-sm font-medium">{doc.name}</div>
                            <div className="text-xs text-gray-400">Shared document</div>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    {documents.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">No documents shared yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              {/* Tools Tab */}
              <TabsContent value="tools" className="flex-1 p-4 space-y-4">
                <div className="space-y-4">
                  {/* Translation Mode */}
                  <div className="p-3 bg-slate-700/30 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-semibold flex items-center">
                        <Languages className="w-4 h-4 mr-2 text-blue-400" />
                        Live Translation
                      </h5>
                      <Button
                        size="sm"
                        variant={translationMode ? 'default' : 'ghost'}
                        onClick={() => {
                          setTranslationMode(!translationMode);
                          toast.success(translationMode ? '🔄 Translation disabled' : '🌐 Translation enabled');
                        }}
                      >
                        {translationMode ? 'ON' : 'OFF'}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">Auto-translate interpreter speech</p>
                  </div>
                  
                  {/* Audio Controls */}
                  <div className="p-3 bg-slate-700/30 rounded">
                    <h5 className="text-sm font-semibold mb-3 flex items-center">
                      <Volume2 className="w-4 h-4 mr-2 text-green-400" />
                      Audio Settings
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Volume</span>
                          <span>{volume}%</span>
                        </div>
                        <Slider
                          value={[volume]}
                          onValueChange={(value) => setVolume(value[0])}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="ghost" className="text-xs">
                          <Headphones className="w-3 h-3 mr-1" />
                          Test Audio
                        </Button>
                        <Button size="sm" variant="ghost" className="text-xs">
                          <Settings className="w-3 h-3 mr-1" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Session Recording */}
                  <div className="p-3 bg-slate-700/30 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-semibold flex items-center">
                        {isRecording ? (
                          <StopCircle className="w-4 h-4 mr-2 text-red-400 animate-pulse" />
                        ) : (
                          <Circle className="w-4 h-4 mr-2 text-gray-400" />
                        )}
                        Session Recording
                      </h5>
                      <Badge variant={isRecording ? 'destructive' : 'secondary'}>
                        {isRecording ? 'REC' : 'OFF'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      {isRecording ? 'Recording in progress...' : 'Start recording for future reference'}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant={isRecording ? 'destructive' : 'default'}
                        onClick={() => {
                          setIsRecording(!isRecording);
                          toast.success(isRecording ? '⏹️ Recording stopped' : '🔴 Recording started');
                        }}
                        className="text-xs"
                      >
                        {isRecording ? 'Stop' : 'Start'}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs" disabled={!isRecording}>
                        <Pause className="w-3 h-3 mr-1" />
                        Pause
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Stats Tab */}
              <TabsContent value="stats" className="flex-1 p-4 space-y-4">
                <div className="space-y-4">
                  {/* Session Metrics */}
                  <div className="p-3 bg-slate-700/30 rounded">
                    <h5 className="text-sm font-semibold mb-3 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-blue-400" />
                      Connection Stats
                    </h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Latency:</span>
                        <span className={getQualityColor(sessionMetrics.quality)}>
                          {sessionMetrics.latency.toFixed(0)}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality:</span>
                        <span className={getQualityColor(sessionMetrics.quality)}>
                          {sessionMetrics.quality}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bitrate:</span>
                        <span className="text-green-400">{sessionMetrics.bitrate.toFixed(0)} kbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Packet Loss:</span>
                        <span className="text-green-400">{sessionMetrics.packetLoss.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Session Info */}
                  <div className="p-3 bg-slate-700/30 rounded">
                    <h5 className="text-sm font-semibold mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-purple-400" />
                      Session Info
                    </h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="text-purple-400 font-mono">{formatTime(sessionDuration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Language:</span>
                        <span className="text-blue-400">{language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Session Type:</span>
                        <span className="text-green-400">Premium VRI</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Connection:</span>
                        <span className={connectionState === 'connected' ? 'text-green-400' : 'text-yellow-400'}>
                          {connectionState}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Network Status */}
                  <div className="p-3 bg-slate-700/30 rounded">
                    <h5 className="text-sm font-semibold mb-3 flex items-center">
                      <Wifi className="w-4 h-4 mr-2 text-green-400" />
                      Network Status
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Network Quality:</span>
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          networkStatus === 'excellent' ? 'border-green-400 text-green-400' :
                          networkStatus === 'good' ? 'border-blue-400 text-blue-400' :
                          networkStatus === 'fair' ? 'border-yellow-400 text-yellow-400' :
                          'border-red-400 text-red-400'
                        )}>
                          {networkStatus.toUpperCase()}
                        </Badge>
                      </div>
                      <Progress 
                        value={
                          networkStatus === 'excellent' ? 100 :
                          networkStatus === 'good' ? 75 :
                          networkStatus === 'fair' ? 50 : 25
                        } 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-purple-500/20 space-y-2">
            <Button
              size="sm"
              variant="ghost"
              className="w-full text-xs text-gray-400 hover:text-white"
              onClick={() => setShowTooltips(!showTooltips)}
            >
              <Lightbulb className="w-3 h-3 mr-2" />
              {showTooltips ? 'Hide' : 'Show'} Tooltips
            </Button>
          </div>
        </div>
      )}
      
      {/* Debug Tool - Remove in production */}
      <CallRoomDebugger
        sessionId={sessionId}
        roomName={jitsiRoomName}
        userRole={userType}
        displayName={clientDisplayName}
        userNames={userNames}
        language={language}
      />
    </div>
  );
}
