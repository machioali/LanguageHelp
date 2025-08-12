'use client';

import { useState } from 'react';
import FreeVideoSession from '@/components/free-video-session';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function FreeDemoPage() {
  const [inSession, setInSession] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [userId, setUserId] = useState('');
  const [userType, setUserType] = useState<'client' | 'interpreter'>('client');
  const [userName, setUserName] = useState('');

  const startSession = () => {
    if (sessionId && userId && userName) {
      setInSession(true);
    }
  };

  const endSession = () => {
    setInSession(false);
  };

  if (inSession) {
    return (
      <FreeVideoSession
        sessionId={sessionId}
        userId={userId}
        userType={userType}
        userNames={{
          clientName: userType === 'client' ? userName : 'Other User',
          interpreterName: userType === 'interpreter' ? userName : 'Other User'
        }}
        onSessionEnd={endSession}
        onError={(error) => {
          console.error('Session error:', error);
          alert(error);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🆓 Free Video Session Demo</CardTitle>
          <p className="text-sm text-gray-600">
            Test the free WebRTC communication system
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">User Type</label>
            <div className="flex space-x-2">
              <Button
                variant={userType === 'client' ? 'default' : 'outline'}
                onClick={() => setUserType('client')}
                className="flex-1"
              >
                Client
              </Button>
              <Button
                variant={userType === 'interpreter' ? 'default' : 'outline'}
                onClick={() => setUserType('interpreter')}
                className="flex-1"
              >
                Interpreter
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Session ID</label>
            <Input
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="e.g., test-session-123"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">User ID</label>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g., user-001"
            />
          </div>
          
          <Button 
            onClick={startSession} 
            className="w-full"
            disabled={!sessionId || !userId || !userName}
          >
            Start Free Video Session
          </Button>
          
          <div className="text-xs text-gray-500 mt-4">
            <p><strong>Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Make sure signaling server is running: <code>cd server && npm start</code></li>
              <li>Open two browser windows/tabs</li>
              <li>Use same Session ID but different User IDs</li>
              <li>Choose different User Types (one client, one interpreter)</li>
              <li>Click "Start Free Video Session" in both windows</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}