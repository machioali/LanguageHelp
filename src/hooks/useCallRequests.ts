'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// Types
export interface CallRequest {
  requestId: string;
  clientId: string;
  clientName: string;
  language: string;
  urgency: 'low' | 'normal' | 'high';
  sessionType: 'VRI' | 'OPI';
  sessionId: string;
  expiresAt: Date;
  timeLeft: number;
  interpretersNotified?: number;
  acceptedBy?: {
    interpreterId: string;
    interpreterName: string;
  };
  status: 'pending' | 'accepted' | 'expired' | 'no-interpreters' | 'taken';
  requestedAt: Date;
}

export interface ClientCallHook {
  socket: Socket | null;
  isConnected: boolean;
  currentRequest: CallRequest | null;
  requestInterpreter: (language: string, urgency: 'low' | 'normal' | 'high', sessionType: 'VRI' | 'OPI') => void;
  cancelRequest: () => void;
}

export interface InterpreterCallHook {
  socket: Socket | null;
  isConnected: boolean;
  incomingRequests: CallRequest[];
  acceptCall: (requestId: string) => void;
  declineCall: (requestId: string) => void;
  registerInterpreter: (interpreterId: string, languages: string[], availability?: 'available' | 'busy' | 'break' | 'offline') => void;
  updateAvailability: (availability: 'available' | 'busy' | 'break' | 'offline') => void;
}

const SIGNALING_SERVER_URL = 'http://localhost:3001';

// Client hook for requesting interpreters
export function useClientCalls(clientId: string, clientName: string): ClientCallHook {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<CallRequest | null>(null);

  useEffect(() => {
    const socketConnection = io(SIGNALING_SERVER_URL, {
      transports: ['websocket'],
      timeout: 10000,
    });

    socketConnection.on('connect', () => {
      console.log('Client connected to signaling server');
      setIsConnected(true);
      setSocket(socketConnection);
    });

    socketConnection.on('disconnect', () => {
      console.log('Client disconnected from signaling server');
      setIsConnected(false);
    });

    socketConnection.on('connect_error', (error) => {
      console.error('Client connection error:', error);
      setIsConnected(false);
    });

    // Handle request responses
    socketConnection.on('request-sent', ({ requestId, sessionId, interpretersNotified, message }) => {
      console.log('Request sent:', message);
      if (currentRequest) {
        setCurrentRequest(prev => prev ? {
          ...prev,
          requestId,
          sessionId,
          interpretersNotified,
          status: 'pending'
        } : null);
      }
    });

    socketConnection.on('no-interpreters-available', ({ language, message }) => {
      console.log('No interpreters available:', message);
      setCurrentRequest(prev => prev ? { ...prev, status: 'no-interpreters' } : null);
    });

    socketConnection.on('interpreter-accepted', ({ 
      requestId, sessionId, interpreterId, interpreterName, language 
    }) => {
      console.log(`✅ Interpreter ${interpreterName} accepted the call - joining persistent room`);
      setCurrentRequest(prev => prev ? {
        ...prev,
        status: 'accepted',
        acceptedBy: { interpreterId, interpreterName },
        sessionId // Store session ID for reconnections
      } : null);

      // Trigger video session start with persistent room support
      window.dispatchEvent(new CustomEvent('start-video-session', {
        detail: {
          sessionId,
          userId: clientId,
          userType: 'client',
          language: language,
          sessionType: 'VRI', // Default to VRI
          userNames: {
            clientName,
            interpreterName
          },
          isPersistent: true, // Mark as persistent room
          reconnectionSupport: true
        }
      }));
    });

    // Handle session resumption after reconnection
    socketConnection.on('session-resumed', ({ message, sessionId, participants }) => {
      console.log('🔄 Session resumed:', message);
      // Dispatch event to notify components about session resumption
      window.dispatchEvent(new CustomEvent('session-resumed', {
        detail: { sessionId, participants, message }
      }));
    });

    // Handle waiting for participant reconnection
    socketConnection.on('waiting-for-participant', ({ message, missingParticipant }) => {
      console.log('⏳ Waiting for participant:', message);
      window.dispatchEvent(new CustomEvent('waiting-for-participant', {
        detail: { message, missingParticipant }
      }));
    });

    // Handle participant disconnection (but room remains active)
    socketConnection.on('participant-disconnected', ({ 
      disconnectedUser, message, roomState, reconnectionTimeout, sessionId 
    }) => {
      console.log('🔄 Participant temporarily disconnected:', message);
      window.dispatchEvent(new CustomEvent('participant-disconnected', {
        detail: { disconnectedUser, message, roomState, reconnectionTimeout, sessionId }
      }));
    });

    socketConnection.on('request-expired', ({ message }) => {
      console.log('Request expired:', message);
      setCurrentRequest(prev => prev ? { ...prev, status: 'expired' } : null);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [clientId]); // Remove clientName from deps to avoid reconnections

  const requestInterpreter = useCallback((language: string, urgency: 'low' | 'normal' | 'high', sessionType: 'VRI' | 'OPI') => {
    console.log('🔄 requestInterpreter called:', { language, urgency, sessionType, isConnected, hasSocket: !!socket });
    
    if (!socket || !isConnected) {
      console.error('❌ Socket not connected - socket:', !!socket, 'isConnected:', isConnected);
      alert('Connection to signaling server failed. Please refresh the page and try again.');
      return;
    }

    const newRequest: CallRequest = {
      requestId: '',
      clientId,
      clientName,
      language,
      urgency,
      sessionType,
      sessionId: '',
      expiresAt: new Date(Date.now() + 30000), // 30 seconds
      timeLeft: 30,
      status: 'pending',
      requestedAt: new Date()
    };

    console.log('📤 Setting current request and emitting:', newRequest);
    setCurrentRequest(newRequest);

    socket.emit('request-interpreter', {
      clientId,
      clientName,
      language,
      urgency,
      sessionType
    });
    
    console.log('✅ Request sent to server');
  }, [socket, isConnected, clientId, clientName]);

  const cancelRequest = useCallback(() => {
    setCurrentRequest(null);
  }, []);

  return {
    socket,
    isConnected,
    currentRequest,
    requestInterpreter,
    cancelRequest
  };
}

// Interpreter hook for receiving and accepting calls
export function useInterpreterCalls(interpreterId: string, interpreterName: string): InterpreterCallHook {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState<CallRequest[]>([]);
  const [registeredLanguages, setRegisteredLanguages] = useState<string[]>([]);
  const [currentAvailability, setCurrentAvailability] = useState<'available' | 'busy' | 'break' | 'offline'>('offline');
  const registeredLanguagesRef = useRef<string[]>([]);
  const availabilityRef = useRef<'available' | 'busy' | 'break' | 'offline'>('offline');

  useEffect(() => {
    const socketConnection = io(SIGNALING_SERVER_URL, {
      transports: ['websocket'],
      timeout: 10000,
    });

    socketConnection.on('connect', () => {
      console.log('Interpreter connected to signaling server');
      setIsConnected(true);
      setSocket(socketConnection);

      // Re-register if we have languages
      if (registeredLanguagesRef.current.length > 0) {
        socketConnection.emit('register-interpreter', {
          interpreterId,
          languages: registeredLanguagesRef.current
        });
      }
    });

    socketConnection.on('disconnect', () => {
      console.log('Interpreter disconnected from signaling server');
      setIsConnected(false);
    });

    socketConnection.on('connect_error', (error) => {
      console.error('Interpreter connection error:', error);
      setIsConnected(false);
    });

    // Handle incoming call requests
    socketConnection.on('incoming-call-request', (request) => {
      console.log('Incoming call request:', request);
      
      // Play notification sound if available
      try {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Could not play notification sound'));
      } catch (e) {}

      const callRequest: CallRequest = {
        ...request,
        expiresAt: new Date(request.expiresAt),
        timeLeft: 30, // 30 seconds initially
        status: 'pending',
        requestedAt: new Date()
      };

      setIncomingRequests(prev => [...prev, callRequest]);
    });

    // Handle call request events
    socketConnection.on('call-request-expired', ({ requestId }) => {
      console.log('Call request expired:', requestId);
      setIncomingRequests(prev => prev.filter(req => req.requestId !== requestId));
    });

    socketConnection.on('call-request-taken', ({ requestId, takenBy, message }) => {
      console.log('Call was taken by another interpreter:', message);
      setIncomingRequests(prev => prev.filter(req => req.requestId !== requestId));
    });

    socketConnection.on('call-accepted', ({ sessionId, clientId, clientName, language }) => {
      console.log('✅ Call accepted, starting persistent session');
      
      // Clear all requests
      setIncomingRequests([]);
      
      // Trigger video session start with persistent room support
      window.dispatchEvent(new CustomEvent('start-video-session', {
        detail: {
          sessionId,
          userId: interpreterId,
          userType: 'interpreter',
          language: language,
          sessionType: 'VRI', // Default to VRI
          userNames: {
            clientName,
            interpreterName
          },
          isPersistent: true, // Mark as persistent room
          reconnectionSupport: true
        }
      }));
    });

    // Handle session resumption for interpreters
    socketConnection.on('session-resumed', ({ message, sessionId, participants }) => {
      console.log('🔄 Interpreter session resumed:', message);
      window.dispatchEvent(new CustomEvent('session-resumed', {
        detail: { sessionId, participants, message, userType: 'interpreter' }
      }));
    });

    // Handle waiting for client reconnection
    socketConnection.on('waiting-for-participant', ({ message, missingParticipant }) => {
      console.log('⏳ Interpreter waiting for participant:', message);
      window.dispatchEvent(new CustomEvent('waiting-for-participant', {
        detail: { message, missingParticipant, userType: 'interpreter' }
      }));
    });

    // Handle participant disconnection for interpreters
    socketConnection.on('participant-disconnected', ({ 
      disconnectedUser, message, roomState, reconnectionTimeout, sessionId 
    }) => {
      console.log('🔄 Client temporarily disconnected from interpreter view:', message);
      window.dispatchEvent(new CustomEvent('participant-disconnected', {
        detail: { disconnectedUser, message, roomState, reconnectionTimeout, sessionId, userType: 'interpreter' }
      }));
    });

    socketConnection.on('request-no-longer-available', ({ message }) => {
      console.log('Request no longer available:', message);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [interpreterId]); // Remove interpreterName and registeredLanguages from deps to avoid reconnections

  // Timer for countdown on incoming requests
  useEffect(() => {
    const interval = setInterval(() => {
      setIncomingRequests(prev => 
        prev.map(request => {
          const timeLeft = Math.max(0, Math.floor((request.expiresAt.getTime() - Date.now()) / 1000));
          return { ...request, timeLeft };
        }).filter(request => request.timeLeft > 0)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const registerInterpreter = useCallback((interpreterId: string, languages: string[], availability: 'available' | 'busy' | 'break' | 'offline' = 'available') => {
    setRegisteredLanguages(languages);
    setCurrentAvailability(availability);
    registeredLanguagesRef.current = languages;
    availabilityRef.current = availability;
    
    if (socket && isConnected) {
      socket.emit('register-interpreter', {
        interpreterId,
        languages,
        availability
      });
    }
  }, [socket, isConnected]);

  const updateAvailability = useCallback((availability: 'available' | 'busy' | 'break' | 'offline') => {
    setCurrentAvailability(availability);
    availabilityRef.current = availability;
    
    if (socket && isConnected) {
      socket.emit('update-interpreter-availability', {
        interpreterId,
        availability
      });
    }

    // If interpreter goes offline or becomes unavailable, clear any incoming requests
    if (availability !== 'available') {
      setIncomingRequests([]);
    }
  }, [socket, isConnected, interpreterId]);

  const acceptCall = useCallback((requestId: string) => {
    if (!socket) return;

    socket.emit('accept-call-request', {
      requestId,
      interpreterId,
      interpreterName
    });

    // Remove this request from the list immediately
    setIncomingRequests(prev => prev.filter(req => req.requestId !== requestId));
  }, [socket, interpreterId, interpreterName]);

  const declineCall = useCallback((requestId: string) => {
    if (!socket) return;

    socket.emit('decline-call-request', {
      requestId,
      interpreterId
    });

    setIncomingRequests(prev => prev.filter(req => req.requestId !== requestId));
  }, [socket, interpreterId]);

  return {
    socket,
    isConnected,
    incomingRequests,
    acceptCall,
    declineCall,
    registerInterpreter,
    updateAvailability
  };
}
