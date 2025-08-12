# Persistent Rooms & Call Restart Prevention

## Overview
This update implements persistent room functionality to prevent call restarts and maintain continuous sessions between clients and interpreters, even during network disconnections.

## Key Features Implemented

### 1. **Persistent Room State Management**
- **Server-side persistent room tracking** in `server/signaling.js`
- Rooms now remain active for 5 minutes after participant disconnection
- Automatic session resumption when both participants reconnect
- Room state preserved across temporary network issues

### 2. **Enhanced Signaling Server (`server/signaling.js`)**

#### Changes Made:
- Added `persistentRooms` Map to track room state independently of active connections
- Modified disconnect handler to preserve rooms instead of immediately ending sessions
- Sessions marked as `persistent: true` by default for call continuity
- 5-minute timeout window for participant reconnection before session termination
- Enhanced logging for better debugging of room state changes

#### Key Events Added:
- `session-resumed`: When both participants reconnect successfully
- `waiting-for-participant`: When one participant is temporarily disconnected
- `participant-disconnected`: Notification of temporary disconnection with timeout info

### 3. **Client-Side Improvements (`hooks/useCallRequests.ts`)**

#### Changes Made:
- Added support for persistent room events
- Enhanced session start events with `isPersistent` and `reconnectionSupport` flags
- Automatic event dispatching for room state changes
- Better error handling for temporary disconnections

#### New Event Listeners:
- `session-resumed`: Handle successful reconnections
- `waiting-for-participant`: Show waiting states during disconnections  
- `participant-disconnected`: Display disconnection notifications with timeouts

### 4. **InterpreterRoom Component Updates (`components/InterpreterRoom.tsx`)**

#### Changes Made:
- Added connection status indicators and notifications
- Real-time display of waiting states when participants are disconnected
- Enhanced Jitsi integration with persistent room support
- Automatic toast notifications for connection state changes
- Visual indicators showing reconnection progress

#### New UI Elements:
- Connection status badge in session header
- Waiting spinner when participant is disconnected
- Toast notifications for all connection state changes
- Enhanced debug logging for room coordination

### 5. **Interpreter Dashboard Updates**

#### Changes Made:
- Added handlers for all persistent room events
- Enhanced status notifications with proper messaging
- Automatic status management during persistent sessions
- Better integration with the call system for reconnections

## Technical Implementation Details

### Room Persistence Logic
```javascript
// When user disconnects, room is preserved
session.status = 'waiting-for-reconnection';
roomState.reconnectionAllowed = true;

// 5-minute timeout for reconnection
setTimeout(() => {
  // Only end if user hasn't reconnected
  if (!userReconnected) {
    endSession('reconnection-timeout');
  }
}, 300000); // 5 minutes
```

### Session Resumption
```javascript
// When both participants reconnect
session.status = 'active';
io.to(sessionId).emit('session-resumed', {
  message: 'Both participants reconnected, session resumed',
  sessionId,
  participants: { client: !!session.client, interpreter: !!session.interpreter }
});
```

## Benefits

### 1. **Improved User Experience**
- ✅ No call restarts due to temporary network issues
- ✅ Seamless reconnection for both clients and interpreters  
- ✅ Real-time status updates during disconnections
- ✅ 5-minute grace period for reconnections

### 2. **Enhanced Reliability**
- ✅ Sessions survive brief network interruptions
- ✅ Automatic room preservation and cleanup
- ✅ Better handling of mobile network switching
- ✅ Reduced session loss due to technical issues

### 3. **Professional Communication**
- ✅ Clear status indicators during disruptions
- ✅ Professional messaging about connection states
- ✅ Automatic notifications for all participants
- ✅ Transparent timeout information

## Configuration

### Server Configuration
The persistent room timeout can be adjusted in `server/signaling.js`:
```javascript
const RECONNECTION_TIMEOUT = 300000; // 5 minutes in milliseconds
```

### Client Configuration
Persistent room support is enabled by default for all new sessions. The feature can be toggled by modifying the `isPersistent` flag in session creation.

## Testing the Feature

### Test Scenarios:
1. **Network Disconnection**: Disconnect one participant's network and reconnect within 5 minutes
2. **Mobile Network Switch**: Switch from WiFi to mobile data during a call
3. **Browser Refresh**: Refresh browser tab and verify automatic rejoin
4. **Timeout Test**: Disconnect for more than 5 minutes to verify cleanup
5. **Both Participants**: Test disconnection scenarios for both client and interpreter

### Expected Behavior:
- Immediate notification of disconnection to remaining participant
- Waiting indicator with countdown/timeout information  
- Automatic session resumption when participant returns
- Clean session termination if timeout exceeded
- Proper status updates throughout the process

## Monitoring and Debugging

### Server Logs
Enhanced logging provides detailed information about:
- Room creation and persistence
- Participant disconnection/reconnection events
- Timeout handling and cleanup
- Session state transitions

### Console Output Examples:
```
🔄 User client (client123) disconnected from session session_abc - maintaining room
⏳ Session session_abc waiting for client to reconnect (room preserved)
✅ Session session_abc resumed - both participants reconnected
⏰ Session session_abc timeout - client did not reconnect within 5 minutes
```

## Future Enhancements

### Potential Improvements:
- [ ] Configurable timeout periods per session type
- [ ] Better mobile app integration for background reconnections
- [ ] Advanced room state persistence with database storage
- [ ] Real-time connection quality monitoring
- [ ] Automatic network quality adaptation

This implementation ensures that your call system now provides a robust, professional experience that maintains session continuity even during network disruptions, meeting your requirements for preventing call restarts and keeping participants in the same room.
