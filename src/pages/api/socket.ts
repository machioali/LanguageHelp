import { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { Server as ServerIO } from 'socket.io';
import { Socket } from 'net';

// Store active sessions and users (using in-memory for simplicity)
// In production, consider using Redis or a database
const sessions = new Map();
const users = new Map();
const interpreterSockets = new Map();
const pendingRequests = new Map();
const persistentRooms = new Map();

interface NextApiResponseServerIO extends NextApiResponse {
  socket: Socket & {
    server: NetServer & {
      io: ServerIO;
    };
  };
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket.IO already running');
    res.end();
    return;
  }

  console.log('Initializing Socket.IO server...');

  const io = new ServerIO(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins with their details
    socket.on('join', ({ userId, userType, sessionId }) => {
      console.log(`User ${userId} (${userType}) joining session ${sessionId}`);
      
      users.set(socket.id, { userId, userType, sessionId });
      socket.join(sessionId);
      
      // Initialize or update session with persistent room support
      if (!sessions.has(sessionId)) {
        sessions.set(sessionId, {
          client: userType === 'client' ? socket.id : null,
          interpreter: userType === 'interpreter' ? socket.id : null,
          status: 'waiting',
          persistent: true,
          createdAt: new Date(),
          lastActivity: new Date()
        });
        
        // Initialize persistent room state
        persistentRooms.set(sessionId, {
          participants: { client: null, interpreter: null },
          lastActivity: new Date(),
          roomState: 'active',
          reconnectionAllowed: true
        });
      } else {
        const session = sessions.get(sessionId);
        const roomState = persistentRooms.get(sessionId);
        
        // Update socket references for reconnections
        if (userType === 'client') {
          session.client = socket.id;
          if (roomState) roomState.participants.client = socket.id;
        }
        if (userType === 'interpreter') {
          session.interpreter = socket.id;
          if (roomState) roomState.participants.interpreter = socket.id;
        }
        
        // Update activity timestamps
        session.lastActivity = new Date();
        if (roomState) roomState.lastActivity = new Date();
        
        // If both users are connected, continue/resume session
        if (session.client && session.interpreter) {
          session.status = 'active';
          console.log(`✅ Session ${sessionId} resumed - both participants reconnected`);
          io.to(sessionId).emit('session-resumed', {
            message: 'Both participants reconnected, session resumed',
            sessionId,
            participants: { client: !!session.client, interpreter: !!session.interpreter }
          });
        } else {
          console.log(`⏳ Session ${sessionId} waiting for ${!session.client ? 'client' : 'interpreter'} to reconnect`);
          io.to(sessionId).emit('waiting-for-participant', {
            message: `Waiting for ${!session.client ? 'client' : 'interpreter'} to reconnect`,
            missingParticipant: !session.client ? 'client' : 'interpreter'
          });
        }
      }

      // Notify room about participant joining/rejoining
      socket.to(sessionId).emit('user-joined', { 
        userId, 
        userType, 
        isReconnection: sessions.get(sessionId)?.lastActivity < new Date(Date.now() - 10000)
      });
    });

    // WebRTC Signaling Messages
    socket.on('webrtc-offer', ({ sessionId, offer }) => {
      console.log(`WebRTC offer for session ${sessionId}`);
      socket.to(sessionId).emit('webrtc-offer', { offer });
    });

    socket.on('webrtc-answer', ({ sessionId, answer }) => {
      console.log(`WebRTC answer for session ${sessionId}`);
      socket.to(sessionId).emit('webrtc-answer', { answer });
    });

    socket.on('webrtc-ice-candidate', ({ sessionId, candidate }) => {
      console.log(`ICE candidate for session ${sessionId}`);
      socket.to(sessionId).emit('webrtc-ice-candidate', { candidate });
    });

    // Chat messages
    socket.on('chat-message', ({ sessionId, message, senderType }) => {
      console.log(`Chat message in session ${sessionId}: ${message}`);
      socket.to(sessionId).emit('chat-message', {
        message,
        senderType,
        timestamp: new Date().toISOString()
      });
    });

    // Session control
    socket.on('end-session', ({ sessionId, userType }) => {
      console.log(`Session ${sessionId} explicitly ended by ${userType}`);
      
      const session = sessions.get(sessionId);
      const roomState = persistentRooms.get(sessionId);
      
      if (session) {
        session.status = 'ended';
        session.endedAt = new Date();
        session.endedBy = userType;
        session.persistent = false;
      }
      
      // Clean up persistent room state
      if (roomState) {
        roomState.roomState = 'ended';
        roomState.reconnectionAllowed = false;
        persistentRooms.delete(sessionId);
      }
      
      // Notify all participants
      io.to(sessionId).emit('session-ended', {
        endedBy: userType,
        message: `Session explicitly ended by ${userType}`,
        reason: 'user-initiated'
      });
      
      console.log(`✅ Session ${sessionId} explicitly ended and cleaned up`);
      
      // Clean up session references
      if (session) {
        session.client = null;
        session.interpreter = null;
      }
    });

    // Interpreter registration
    socket.on('register-interpreter', ({ interpreterId, languages }) => {
      console.log(`Interpreter ${interpreterId} registered with languages: ${languages.join(', ')}`);
      interpreterSockets.set(interpreterId, socket.id);
      
      const userData = users.get(socket.id) || {};
      userData.interpreterId = interpreterId;
      userData.languages = languages;
      users.set(socket.id, userData);
    });

    // Client requests interpreter
    socket.on('request-interpreter', ({ clientId, clientName, language, urgency = 'normal' }) => {
      console.log(`Client ${clientId} requesting ${language} interpreter`);
      
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      pendingRequests.set(requestId, {
        clientId,
        clientName,
        language,
        urgency,
        requestedAt: new Date(),
        sessionId,
        status: 'pending'
      });

      // Find available interpreters for this language
      const availableInterpreters = [];
      for (const [interpreterId, socketId] of interpreterSockets) {
        const userData = users.get(socketId);
        if (userData && userData.languages && userData.languages.includes(language)) {
          availableInterpreters.push(interpreterId);
        }
      }

      if (availableInterpreters.length > 0) {
        // Notify available interpreters
        availableInterpreters.forEach(interpreterId => {
          const interpreterSocketId = interpreterSockets.get(interpreterId);
          if (interpreterSocketId) {
            io.to(interpreterSocketId).emit('new-request', {
              requestId,
              clientName,
              language,
              urgency,
              sessionId
            });
          }
        });

        socket.emit('request-sent', {
          message: `Request sent to ${availableInterpreters.length} available interpreters`,
          requestId,
          sessionId,
          availableInterpreters: availableInterpreters.length
        });
      } else {
        socket.emit('no-interpreters', {
          message: `No interpreters available for ${language}`,
          requestId
        });
      }
    });

    // Interpreter accepts request
    socket.on('accept-request', ({ requestId, interpreterId }) => {
      const request = pendingRequests.get(requestId);
      if (request && request.status === 'pending') {
        request.status = 'accepted';
        request.acceptedBy = interpreterId;
        request.acceptedAt = new Date();

        // Notify the client
        const clientSocketId = Array.from(users.entries())
          .find(([, userData]) => userData.userId === request.clientId)?.[0];
        
        if (clientSocketId) {
          io.to(clientSocketId).emit('request-accepted', {
            requestId,
            interpreterId,
            sessionId: request.sessionId,
            message: 'Your request has been accepted! Connecting...'
          });
        }

        // Initialize session
        sessions.set(request.sessionId, {
          client: clientSocketId,
          interpreter: socket.id,
          status: 'matched',
          persistent: true,
          createdAt: new Date(),
          lastActivity: new Date()
        });

        console.log(`✅ Request ${requestId} accepted by interpreter ${interpreterId}`);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const userData = users.get(socket.id);
      if (userData) {
        console.log(`User ${userData.userId} disconnected from session ${userData.sessionId}`);
        
        // Don't immediately end session - mark as disconnected for potential reconnection
        const session = sessions.get(userData.sessionId);
        if (session && session.persistent) {
          if (userData.userType === 'client') {
            session.client = null;
          } else if (userData.userType === 'interpreter') {
            session.interpreter = null;
          }
          session.lastActivity = new Date();
          
          // Notify the remaining participant
          socket.to(userData.sessionId).emit('participant-disconnected', {
            userType: userData.userType,
            message: `${userData.userType} disconnected. Waiting for reconnection...`,
            allowReconnection: true
          });
        }

        // Clean up interpreter registration
        if (userData.interpreterId) {
          interpreterSockets.delete(userData.interpreterId);
        }
      }
      
      users.delete(socket.id);
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  console.log('Socket.IO server initialized');
  res.end();
};

export default SocketHandler;
