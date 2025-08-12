// Free Socket.IO Signaling Server
// Run with: node server/signaling.js
// No external costs - runs on your own server

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for your Next.js app
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://your-domain.com"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Store active sessions and users
const sessions = new Map(); // sessionId -> { client, interpreter, status, persistent }
const users = new Map(); // socketId -> { userId, userType, sessionId }
const interpreterSockets = new Map(); // interpreterId -> socketId
const pendingRequests = new Map(); // requestId -> { clientId, language, requestedAt, sessionId }
const persistentRooms = new Map(); // sessionId -> { participants, lastActivity, roomState }

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    activeSessions: sessions.size,
    connectedUsers: users.size 
  });
});

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
        persistent: true, // Mark as persistent to prevent auto-cleanup
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

  // Session control - EXPLICIT SESSION END ONLY
  socket.on('end-session', ({ sessionId, userType }) => {
    console.log(`Session ${sessionId} explicitly ended by ${userType}`);
    
    const session = sessions.get(sessionId);
    const roomState = persistentRooms.get(sessionId);
    
    if (session) {
      session.status = 'ended';
      session.endedAt = new Date();
      session.endedBy = userType;
      session.persistent = false; // Mark as non-persistent for cleanup
    }
    
    // Clean up persistent room state
    if (roomState) {
      roomState.roomState = 'ended';
      roomState.reconnectionAllowed = false;
      persistentRooms.delete(sessionId);
    }
    
    // Notify all participants (including the one who ended it)
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

  // Interpreter registration (when they come online)
  socket.on('register-interpreter', ({ interpreterId, languages }) => {
    console.log(`Interpreter ${interpreterId} registered with languages: ${languages.join(', ')}`);
    interpreterSockets.set(interpreterId, socket.id);
    
    // Store interpreter info in socket user data
    const userData = users.get(socket.id) || {};
    userData.interpreterId = interpreterId;
    userData.languages = languages;
    users.set(socket.id, userData);
  });

  // Client requests interpreter for specific language
  socket.on('request-interpreter', ({ clientId, clientName, language, urgency = 'normal' }) => {
    console.log(`Client ${clientId} requesting ${language} interpreter`);
    
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store the request
    pendingRequests.set(requestId, {
      clientId,
      clientName,
      language,
      urgency,
      requestedAt: new Date(),
      sessionId,
      clientSocketId: socket.id
    });
    
    // Find all available interpreters for this language
    const availableInterpreters = [];
    for (const [socketId, userData] of users.entries()) {
      if (userData.languages && userData.languages.includes(language) && userData.interpreterId) {
        availableInterpreters.push({
          socketId,
          interpreterId: userData.interpreterId,
          languages: userData.languages
        });
      }
    }
    
    console.log(`Found ${availableInterpreters.length} interpreters for ${language}`);
    
    if (availableInterpreters.length === 0) {
      socket.emit('no-interpreters-available', {
        language,
        message: `No interpreters available for ${language} right now`
      });
      return;
    }
    
    // Send call request to all available interpreters
    availableInterpreters.forEach(({ socketId, interpreterId }) => {
      io.to(socketId).emit('incoming-call-request', {
        requestId,
        clientId,
        clientName,
        language,
        urgency,
        sessionId,
        expiresAt: new Date(Date.now() + 30000) // 30 seconds to respond
      });
    });
    
    // Notify client that request was sent
    socket.emit('request-sent', {
      requestId,
      sessionId,
      interpretersNotified: availableInterpreters.length,
      message: `Request sent to ${availableInterpreters.length} interpreters`
    });
    
    // Auto-expire request after 30 seconds
    setTimeout(() => {
      if (pendingRequests.has(requestId)) {
        pendingRequests.delete(requestId);
        socket.emit('request-expired', {
          requestId,
          message: 'Request expired - no interpreter accepted'
        });
        
        // Notify interpreters that request expired
        availableInterpreters.forEach(({ socketId }) => {
          io.to(socketId).emit('call-request-expired', { requestId });
        });
      }
    }, 30000);
  });
  
  // Interpreter accepts call request
  socket.on('accept-call-request', ({ requestId, interpreterId, interpreterName }) => {
    console.log(`Interpreter ${interpreterId} accepting request ${requestId}`);
    
    const request = pendingRequests.get(requestId);
    if (!request) {
      socket.emit('request-no-longer-available', {
        message: 'This request is no longer available'
      });
      return;
    }
    
    // Remove from pending requests
    pendingRequests.delete(requestId);
    
    // Create session
    sessions.set(request.sessionId, {
      client: request.clientSocketId,
      interpreter: socket.id,
      status: 'connecting',
      language: request.language,
      clientId: request.clientId,
      interpreterId,
      createdAt: new Date()
    });
    
    // Notify client that interpreter accepted
    io.to(request.clientSocketId).emit('interpreter-accepted', {
      requestId,
      sessionId: request.sessionId,
      interpreterId,
      interpreterName,
      language: request.language
    });
    
    // Notify accepting interpreter
    socket.emit('call-accepted', {
      requestId,
      sessionId: request.sessionId,
      clientId: request.clientId,
      clientName: request.clientName,
      language: request.language
    });
    
    // Notify other interpreters that call was taken
    for (const [socketId, userData] of users.entries()) {
      if (userData.languages && userData.languages.includes(request.language) && 
          userData.interpreterId && socketId !== socket.id) {
        io.to(socketId).emit('call-request-taken', {
          requestId,
          takenBy: interpreterId,
          message: 'This call was accepted by another interpreter'
        });
      }
    }
  });
  
  // Interpreter declines call request
  socket.on('decline-call-request', ({ requestId, interpreterId }) => {
    console.log(`Interpreter ${interpreterId} declined request ${requestId}`);
    
    socket.emit('call-declined', {
      requestId,
      message: 'You declined the call request'
    });
  });

  // Interpreter availability updates
  socket.on('update-availability', ({ userId, isAvailable }) => {
    console.log(`Interpreter ${userId} availability: ${isAvailable}`);
    
    // Broadcast to all clients looking for interpreters
    socket.broadcast.emit('interpreter-availability-changed', {
      interpreterId: userId,
      isAvailable
    });
  });

  // Handle disconnect - MAINTAIN PERSISTENT ROOMS
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    const user = users.get(socket.id);
    if (user) {
      const { sessionId, userType, userId } = user;
      
      console.log(`🔄 User ${userType} (${userId}) disconnected from session ${sessionId} - maintaining room`);
      
      // Update session to handle temporary disconnections
      const session = sessions.get(sessionId);
      const roomState = persistentRooms.get(sessionId);
      
      if (session && roomState && session.persistent) {
        // Mark participant as temporarily disconnected but keep room alive
        if (userType === 'client') {
          session.client = null;
          roomState.participants.client = null;
        }
        if (userType === 'interpreter') {
          session.interpreter = null;
          roomState.participants.interpreter = null;
        }
        
        // Update session status but don't end it
        session.status = 'waiting-for-reconnection';
        session.lastActivity = new Date();
        roomState.lastActivity = new Date();
        
        // Notify remaining participants about temporary disconnection
        socket.to(sessionId).emit('participant-disconnected', {
          disconnectedUser: userType,
          userId,
          message: `${userType} temporarily disconnected - room remains active`,
          roomState: 'waiting-for-reconnection',
          reconnectionTimeout: 300000, // 5 minutes to reconnect
          sessionId
        });
        
        console.log(`⏳ Session ${sessionId} waiting for ${userType} to reconnect (room preserved)`);
        
        // Set a longer timeout for actual session cleanup (5 minutes instead of immediate)
        setTimeout(() => {
          const currentSession = sessions.get(sessionId);
          const currentRoomState = persistentRooms.get(sessionId);
          
          // Only end session if user hasn't reconnected after 5 minutes
          if (currentSession && currentRoomState && 
              (userType === 'client' ? !currentSession.client : !currentSession.interpreter)) {
            
            console.log(`⏰ Session ${sessionId} timeout - ${userType} did not reconnect within 5 minutes`);
            
            // Now actually end the session
            currentSession.status = 'ended';
            currentSession.endedAt = new Date();
            currentSession.endedBy = 'timeout-disconnect';
            
            // Clean up room state
            persistentRooms.delete(sessionId);
            
            // Notify remaining participants
            io.to(sessionId).emit('session-ended', {
              endedBy: 'timeout',
              disconnectedUser: userType,
              message: `Session ended - ${userType} did not reconnect within 5 minutes`,
              reason: 'reconnection-timeout'
            });
            
            console.log(`❌ Session ${sessionId} finally ended due to reconnection timeout`);
          }
        }, 300000); // 5 minutes timeout
        
      } else {
        // For non-persistent sessions, handle as before
        console.log(`❌ Non-persistent session ${sessionId} ended immediately`);
        
        if (session) {
          session.status = 'ended';
          session.endedAt = new Date();
          session.endedBy = 'disconnect';
          
          io.to(sessionId).emit('session-ended', {
            endedBy: 'disconnect',
            disconnectedUser: userType,
            message: `Session ended - ${userType} disconnected`
          });
        }
      }
      
      users.delete(socket.id);
    }
  });

  // Connection error handling
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Cleanup old sessions every hour
setInterval(() => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  for (const [sessionId, session] of sessions.entries()) {
    if (session.status === 'ended' || session.createdAt < oneHourAgo) {
      sessions.delete(sessionId);
      console.log(`Cleaned up old session: ${sessionId}`);
    }
  }
}, 60 * 60 * 1000); // Every hour

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Signaling server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

module.exports = { app, server, io };
