'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import ClientWaitingRoom from './ClientWaitingRoom';
import InterpreterCallRoom from './InterpreterCallRoom';
import toast from 'react-hot-toast';

interface CallFlowManagerProps {
  // For client flow
  clientId?: string;
  clientName?: string;
  requestLanguage?: string;
  requestUrgency?: 'low' | 'normal' | 'high';
  requestSessionType?: 'VRI' | 'OPI';
  
  // For interpreter flow  
  interpreterId?: string;
  interpreterName?: string;
  callRequest?: {
    sessionId: string;
    clientName: string;
    language: string;
    urgency: 'low' | 'normal' | 'high';
    sessionType: 'VRI' | 'OPI';
    specialInstructions?: string;
  };
  
  // Common props
  userType: 'client' | 'interpreter';
  onBack: () => void;
}

interface SessionState {
  sessionId: string | null;
  isActive: boolean;
  clientInfo: {
    name: string;
    language: string;
    urgency: 'low' | 'normal' | 'high';
    sessionType: 'VRI' | 'OPI';
    specialInstructions?: string;
  } | null;
  interpreterInfo: {
    name: string;
    id: string;
  } | null;
}

export default function CallFlowManager({
  clientId,
  clientName,
  requestLanguage,
  requestUrgency,
  requestSessionType,
  interpreterId,
  interpreterName,
  callRequest,
  userType,
  onBack
}: CallFlowManagerProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>({
    sessionId: null,
    isActive: false,
    clientInfo: null,
    interpreterInfo: null
  });

  // Initialize socket connection
  useEffect(() => {
    const socketConnection = io('http://localhost:3001', {
      transports: ['websocket'],
      timeout: 10000,
    });

    socketConnection.on('connect', () => {
      console.log(`${userType} connected to call flow manager`);
      setSocket(socketConnection);

      // If interpreter, immediately start session with accepted call
      if (userType === 'interpreter' && callRequest) {
        setSessionState({
          sessionId: callRequest.sessionId,
          isActive: true,
          clientInfo: {
            name: callRequest.clientName,
            language: callRequest.language,
            urgency: callRequest.urgency,
            sessionType: callRequest.sessionType,
            specialInstructions: callRequest.specialInstructions
          },
          interpreterInfo: {
            name: interpreterName || 'Professional Interpreter',
            id: interpreterId || ''
          }
        });
        
        toast.success('🎯 Connected to client session!');
      }
      
      // If client, start the waiting process
      if (userType === 'client' && clientId) {
        // Send interpreter request
        socketConnection.emit('request-interpreter', {
          clientId,
          clientName,
          language: requestLanguage,
          urgency: requestUrgency,
          sessionType: requestSessionType
        });
      }
    });

    // Handle interpreter acceptance (for clients)
    socketConnection.on('interpreter-accepted', ({ 
      sessionId, interpreterId, interpreterName: acceptedInterpreterName, language 
    }) => {
      console.log(`Interpreter ${acceptedInterpreterName} accepted the call`);
      
      setSessionState({
        sessionId,
        isActive: true,
        clientInfo: {
          name: clientName || 'Client',
          language: requestLanguage || language,
          urgency: requestUrgency || 'normal',
          sessionType: requestSessionType || 'VRI',
        },
        interpreterInfo: {
          name: acceptedInterpreterName,
          id: interpreterId
        }
      });
      
      toast.success('🎉 Interpreter found! Starting your session...');
    });

    // Handle session events
    socketConnection.on('session-ended', () => {
      console.log('Session ended');
      setSessionState({
        sessionId: null,
        isActive: false,
        clientInfo: null,
        interpreterInfo: null
      });
      
      toast.success('Session completed successfully');
      // Auto-redirect back after short delay
      setTimeout(() => {
        onBack();
      }, 2000);
    });

    socketConnection.on('disconnect', () => {
      console.log('Disconnected from call flow manager');
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [userType, clientId, clientName, requestLanguage, requestUrgency, requestSessionType, interpreterId, interpreterName, callRequest, onBack]);

  const handleCancelRequest = () => {
    if (socket) {
      socket.emit('cancel-request', { clientId });
    }
    onBack();
  };

  const handleSessionEnd = () => {
    if (socket && sessionState.sessionId) {
      socket.emit('end-session', { 
        sessionId: sessionState.sessionId,
        userType 
      });
    }
    
    setSessionState({
      sessionId: null,
      isActive: false,
      clientInfo: null,
      interpreterInfo: null
    });
    
    onBack();
  };

  // Client flow: Show waiting room until interpreter connects, then show video room (handled in ClientWaitingRoom)
  if (userType === 'client') {
    if (!sessionState.isActive) {
      return (
        <ClientWaitingRoom
          sessionId={sessionState.sessionId || 'temp'}
          clientId={clientId || ''}
          clientName={clientName || 'Client'}
          language={requestLanguage || 'English'}
          urgency={requestUrgency || 'normal'}
          sessionType={requestSessionType || 'VRI'}
          onCancelRequest={handleCancelRequest}
          onSessionEnd={handleSessionEnd}
        />
      );
    }
  }

  // Interpreter flow: Direct to call room
  if (userType === 'interpreter' && sessionState.isActive && sessionState.clientInfo) {
    return (
      <InterpreterCallRoom
        sessionId={sessionState.sessionId || ''}
        interpreterId={interpreterId || ''}
        interpreterName={interpreterName || 'Professional Interpreter'}
        clientInfo={sessionState.clientInfo}
        onSessionEnd={handleSessionEnd}
      />
    );
  }

  // Fallback loading state
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">
          {userType === 'client' ? 'Setting up your session...' : 'Connecting to client...'}
        </p>
      </div>
    </div>
  );
}
