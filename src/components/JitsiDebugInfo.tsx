'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface JitsiDebugInfoProps {
  roomName: string;
  displayName: string;
  userRole: 'client' | 'interpreter';
  sessionId: string;
  userNames: {
    clientName?: string;
    interpreterName?: string;
  };
}

export function JitsiDebugInfo({
  roomName,
  displayName,
  userRole,
  sessionId,
  userNames
}: JitsiDebugInfoProps) {
  const [showDebug, setShowDebug] = useState(false);

  const debugInfo = {
    'Session ID': sessionId,
    'Room Name': `languagehelp-${roomName}`,
    'Display Name': displayName,
    'User Role': userRole,
    'Client Name': userNames.clientName || 'Not set',
    'Interpreter Name': userNames.interpreterName || 'Not set',
    'Full Room URL': `https://meet.jit.si/languagehelp-${roomName}`,
    'Expected Room': `session-${sessionId}`,
    'Generated Room': roomName
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    });
  };

  if (!showDebug) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 left-4 z-50 bg-black/50 text-white hover:bg-black/70"
      >
        <Eye className="h-4 w-4 mr-2" />
        Debug
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-80 bg-black/90 text-white border-gray-600">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          Jitsi Debug Info
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDebug(false)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <EyeOff className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {Object.entries(debugInfo).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between text-xs">
            <span className="text-gray-300 font-medium">{key}:</span>
            <div className="flex items-center gap-1">
              <span className="text-white font-mono max-w-32 truncate" title={value}>
                {value}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(value)}
                className="h-4 w-4 p-0 text-gray-400 hover:text-white"
              >
                <Copy className="h-2 w-2" />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t border-gray-600">
          <div className="flex items-center gap-2">
            <Badge variant={userRole === 'client' ? 'default' : 'secondary'} className="text-xs">
              {userRole.toUpperCase()}
            </Badge>
            <span className="text-xs text-gray-400">
              Room: ...{roomName.slice(-8)}
            </span>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(`https://meet.jit.si/languagehelp-${roomName}`)}
          className="w-full text-xs bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          Copy Room URL
        </Button>
      </CardContent>
    </Card>
  );
}
