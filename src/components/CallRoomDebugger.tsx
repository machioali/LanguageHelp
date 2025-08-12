'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bug, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CallRoomDebuggerProps {
  sessionId: string;
  roomName: string;
  userRole: 'client' | 'interpreter';
  displayName: string;
  userNames?: {
    clientName?: string;
    interpreterName?: string;
  };
  language?: string;
}

interface DebugEntry {
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  data?: any;
}

export default function CallRoomDebugger({
  sessionId,
  roomName,
  userRole,
  displayName,
  userNames,
  language
}: CallRoomDebuggerProps) {
  const [debugEntries, setDebugEntries] = useState<DebugEntry[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const addDebugEntry = (type: DebugEntry['type'], message: string, data?: any) => {
    const entry: DebugEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      data
    };
    
    setDebugEntries(prev => [...prev.slice(-9), entry]); // Keep last 10 entries
    console.log(`🐛 [${type.toUpperCase()}] ${message}`, data);
  };

  useEffect(() => {
    addDebugEntry('info', 'CallRoomDebugger initialized', {
      sessionId,
      roomName,
      userRole,
      displayName,
      userNames,
      language,
      timestamp: new Date().toISOString()
    });

    // Monitor for room connection events
    const handleBeforeUnload = () => {
      addDebugEntry('warning', 'User leaving page - session may disconnect');
    };

    const handleVisibilityChange = () => {
      addDebugEntry('info', `Tab visibility changed: ${document.hidden ? 'hidden' : 'visible'}`);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sessionId, roomName, userRole]);

  // Check for potential room name conflicts
  useEffect(() => {
    if (!roomName.includes('languagehelp-session-')) {
      addDebugEntry('error', 'Room name missing proper prefix', { roomName });
    } else {
      addDebugEntry('success', 'Room name format looks correct', { roomName });
    }

    if (!sessionId) {
      addDebugEntry('error', 'Session ID is missing or empty');
    }

    if (!displayName || displayName === 'Client' || displayName === 'Interpreter') {
      addDebugEntry('warning', 'Generic display name may cause confusion', { displayName });
    }
  }, [roomName, sessionId, displayName]);

  const getIconForType = (type: DebugEntry['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'error':
        return <XCircle className="w-3 h-3 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-3 h-3 text-yellow-500" />;
      default:
        return <Bug className="w-3 h-3 text-blue-500" />;
    }
  };

  const copyDebugInfo = () => {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      sessionInfo: {
        sessionId,
        roomName,
        userRole,
        displayName,
        userNames,
        language
      },
      debugEntries: debugEntries.slice(-5), // Last 5 entries
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer
      }
    };

    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    toast.success('Debug info copied to clipboard');
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsVisible(true)}
          className="bg-black/80 text-white border-purple-500/50 hover:bg-black/90"
        >
          <Bug className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-black/90 text-white border-purple-500/50 backdrop-blur-xl max-w-md">
        {/* Header */}
        <div className="p-3 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bug className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">Room Debug</span>
              <Badge variant="outline" className="text-xs">
                {userRole}
              </Badge>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
              >
                ✕
              </Button>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="p-3 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-gray-400">Session:</span>
              <div className="font-mono text-purple-300 break-all">{sessionId}</div>
            </div>
            <div>
              <span className="text-gray-400">Room:</span>
              <div className="font-mono text-blue-300 break-all">{roomName}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Display Name:</span>
            <span className="text-green-300 font-medium">{displayName}</span>
          </div>

          {language && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Language:</span>
              <span className="text-yellow-300">{language}</span>
            </div>
          )}
        </div>

        {/* Debug Log */}
        {isExpanded && (
          <div className="p-3 border-t border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-400">Debug Log</span>
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyDebugInfo}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDebugEntries([])}
                  className="h-6 w-6 p-0"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {debugEntries.slice(-5).map((entry, index) => (
                <div key={index} className="text-xs p-1 rounded bg-slate-800/50">
                  <div className="flex items-center space-x-1">
                    {getIconForType(entry.type)}
                    <span className="text-gray-400 font-mono">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-gray-200 ml-4">{entry.message}</div>
                  {entry.data && (
                    <div className="text-gray-500 ml-4 font-mono text-[10px]">
                      {JSON.stringify(entry.data).substring(0, 50)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="p-2 border-t border-purple-500/20 flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              addDebugEntry('info', 'Manual room check triggered', {
                expectedRoom: `languagehelp-session-${sessionId}`,
                actualRoom: roomName,
                match: roomName === `languagehelp-session-${sessionId}`
              });
            }}
            className="text-xs h-6"
          >
            Check Room
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={copyDebugInfo}
            className="text-xs h-6"
          >
            Copy Info
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Export a context provider for easy access
export const useCallRoomDebugger = (
  sessionId: string,
  roomName: string,
  userRole: 'client' | 'interpreter',
  displayName: string
) => {
  const log = (type: 'info' | 'success' | 'warning' | 'error', message: string, data?: any) => {
    console.log(`🐛 [${type.toUpperCase()}] CallRoom ${userRole}: ${message}`, {
      sessionId,
      roomName,
      displayName,
      timestamp: new Date().toISOString(),
      ...data
    });
  };

  return { log };
};
