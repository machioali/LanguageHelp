#!/usr/bin/env node

// Free Communication System Setup Script
// Run with: node setup-free-system.js

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up FREE LanguageHelp Communication System...\n');

// Create data directory and sample data
const setupDataFiles = () => {
  console.log('📁 Creating data directory and sample files...');
  
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Sample interpreters data
  const interpreters = [
    {
      id: 'interpreter_001',
      name: 'Maria Garcia',
      email: 'maria@example.com',
      languages: ['en', 'es', 'fr'],
      specializations: ['Medical', 'Legal'],
      rating: 4.8,
      status: 'available',
      hourlyRate: 50,
      bio: 'Certified medical interpreter with 5+ years experience'
    },
    {
      id: 'interpreter_002', 
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      languages: ['en', 'ar', 'fr'],
      specializations: ['Business', 'Technical'],
      rating: 4.9,
      status: 'available',
      hourlyRate: 60,
      bio: 'Business interpreter specializing in technical translations'
    },
    {
      id: 'interpreter_003',
      name: 'Li Wei',
      email: 'li.wei@example.com',
      languages: ['en', 'zh', 'ja'],
      specializations: ['Business', 'Legal'],
      rating: 4.7,
      status: 'available',
      hourlyRate: 55,
      bio: 'Legal interpreter for East Asian languages'
    }
  ];

  // Write sample data files
  fs.writeFileSync(
    path.join(dataDir, 'interpreters.json'),
    JSON.stringify(interpreters, null, 2)
  );

  fs.writeFileSync(
    path.join(dataDir, 'bookings.json'),
    JSON.stringify([], null, 2)
  );

  fs.writeFileSync(
    path.join(dataDir, 'notifications.json'),
    JSON.stringify([], null, 2)
  );

  console.log('✅ Sample data files created');
};

// Create server package.json if needed
const setupServerDependencies = () => {
  console.log('📦 Setting up server dependencies...');
  
  const serverDir = path.join(process.cwd(), 'server');
  if (!fs.existsSync(serverDir)) {
    fs.mkdirSync(serverDir, { recursive: true });
  }

  const packageJsonPath = path.join(serverDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    const packageJson = {
      name: 'languagehelp-signaling-server',
      version: '1.0.0',
      description: 'Free WebRTC signaling server for LanguageHelp',
      main: 'signaling.js',
      scripts: {
        start: 'node signaling.js',
        dev: 'nodemon signaling.js'
      },
      dependencies: {
        express: '^4.18.2',
        'socket.io': '^4.7.2',
        cors: '^2.8.5'
      },
      devDependencies: {
        nodemon: '^3.0.1'
      }
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Server package.json created');
  }
};

// Create demo page
const createDemoPage = () => {
  console.log('📄 Creating free demo page...');
  
  const demoPageContent = `'use client';

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
}`;

  const demoPath = path.join(process.cwd(), 'src/app/free-demo/page.tsx');
  fs.mkdirSync(path.dirname(demoPath), { recursive: true });
  fs.writeFileSync(demoPath, demoPageContent);
  console.log('✅ Free demo page created at /free-demo');
};

// Create README for free system
const createReadme = () => {
  console.log('📋 Creating setup documentation...');
  
  const readmeContent = `# 🆓 FREE LanguageHelp Communication System

## Zero-Cost Setup Complete! 

### What's Included (100% Free):
- ✅ WebRTC Peer-to-Peer Video/Audio Calling
- ✅ Real-time Chat Integration  
- ✅ Socket.IO Signaling Server
- ✅ JSON File-Based Data Storage
- ✅ In-App Notifications
- ✅ Session Management
- ✅ Console-Based Email Simulation

### Quick Start:

#### 1. Install Dependencies
\`\`\`bash
# Install Socket.IO for client
npm install socket.io-client

# Install server dependencies
cd server
npm install
\`\`\`

#### 2. Start the Signaling Server
\`\`\`bash
cd server
npm start
# Server runs on http://localhost:3001
\`\`\`

#### 3. Start Your Next.js App
\`\`\`bash
npm run dev
# App runs on http://localhost:3000
\`\`\`

#### 4. Test the System
Visit: http://localhost:3000/free-demo

### How It Works:

1. **Client Requests**: Uses JSON file storage (no database)
2. **Notifications**: Console logs (instead of email/SMS)
3. **Video Calls**: WebRTC peer-to-peer (no Agora/Twilio)
4. **Signaling**: Self-hosted Socket.IO server
5. **Data**: Local JSON files in \`/data\` folder

### File Structure:
\`\`\`
project/
├── data/                    # JSON data storage
│   ├── bookings.json
│   ├── interpreters.json
│   └── notifications.json
├── server/                  # Free signaling server
│   ├── signaling.js
│   └── package.json
├── src/lib/webrtc.ts       # WebRTC implementation
├── src/components/free-video-session.tsx
└── src/app/free-demo/      # Test page
\`\`\`

### Production Considerations:

**For Production Use:**
- Replace JSON files with SQLite (still free)
- Use a cloud signaling server (Railway/Render free tier)
- Implement proper email (using Nodemailer with Gmail SMTP)
- Add user authentication
- Implement proper error handling

**Scaling Options:**
- Upgrade to PostgreSQL (free on Supabase)
- Add Redis for real-time features (free tier available)
- Use WebSocket clustering for multiple servers

### Cost Comparison:

| Feature | Paid Solution | Free Solution |
|---------|--------------|---------------|
| Video Calling | Agora ($4/1000min) | WebRTC (Free) |
| Database | Supabase Pro ($25/mo) | JSON/SQLite (Free) |
| Email | Resend ($1/1000) | Console logs (Free) |
| Phone | Twilio ($0.013/min) | Not included |
| Total Monthly | ~$50-100+ | $0 |

### Limitations of Free System:
- No phone call support
- No session recording
- No automatic email notifications  
- Basic data storage (JSON files)
- Manual interpreter notification
- Requires self-hosting signaling server

### Upgrade Path:
When ready to scale, you can gradually upgrade:
1. Add SQLite database
2. Implement email notifications
3. Add phone support
4. Move to cloud database
5. Add session recording

This free system is perfect for:
- ✅ MVP/Prototype development
- ✅ Testing the concept
- ✅ Small-scale operations
- ✅ Learning WebRTC technology
`;

  fs.writeFileSync('FREE-SYSTEM-README.md', readmeContent);
  console.log('✅ Documentation created: FREE-SYSTEM-README.md');
};

// Run setup
const runSetup = async () => {
  try {
    setupDataFiles();
    setupServerDependencies();
    createDemoPage();
    createReadme();
    
    console.log('\n🎉 FREE Communication System Setup Complete!\n');
    
    console.log('📋 Next Steps:');
    console.log('1. Install dependencies: npm install socket.io-client');
    console.log('2. Start signaling server: cd server && npm install && npm start');  
    console.log('3. Start Next.js app: npm run dev');
    console.log('4. Test at: http://localhost:3000/free-demo');
    console.log('');
    console.log('📖 Read FREE-SYSTEM-README.md for complete instructions');
    console.log('');
    console.log('💡 This system costs $0 to run and includes:');
    console.log('   ✅ Video/Audio calling (WebRTC)');
    console.log('   ✅ Real-time chat');
    console.log('   ✅ Session management');
    console.log('   ✅ Booking system');
    console.log('');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
};

runSetup();
