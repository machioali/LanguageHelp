'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Languages, 
  Star, 
  Shield, 
  User, 
  PhoneOff,
  MessageSquare,
  FileText,
  Bookmark,
  Save,
  Copy,
  Download,
  Zap,
  Crown,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Mic,
  Settings,
  BarChart3,
  Globe,
  Award,
  Target,
  BookOpen,
  ClipboardList,
  Users,
  Timer,
  Volume2,
  Headphones
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import JitsiVideoSession from '@/components/JitsiVideoSession';
import CallRoomDebugger from '@/components/CallRoomDebugger';

interface InterpreterCallRoomProps {
  sessionId: string;
  interpreterId: string;
  interpreterName: string;
  clientInfo: {
    name: string;
    language: string;
    urgency: 'low' | 'normal' | 'high';
    sessionType: 'VRI' | 'OPI';
    specialInstructions?: string;
  };
  onSessionEnd: () => void;
}

interface SessionNotes {
  terminology: Array<{ term: string; translation: string; context?: string }>;
  sessionNotes: string;
  privateNotes: string;
  clientQuestions: string[];
  bookmarks: Array<{ time: number; note: string }>;
}

export default function InterpreterCallRoom({
  sessionId,
  interpreterId,
  interpreterName,
  clientInfo,
  onSessionEnd
}: InterpreterCallRoomProps) {
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionNotes, setSessionNotes] = useState<SessionNotes>({
    terminology: [],
    sessionNotes: '',
    privateNotes: '',
    clientQuestions: [
      'What is your name?',
      'Where are you from?', 
      'Can you describe your symptoms?',
      'Do you have insurance?',
      'What medications are you taking?'
    ],
    bookmarks: []
  });
  
  const [currentTab, setCurrentTab] = useState('session');
  const [newTerm, setNewTerm] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const sessionStartTime = useRef(Date.now());

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStartTime.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getUrgencyInfo = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return {
          color: 'border-red-500 bg-red-50 text-red-800',
          icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
          label: 'HIGH PRIORITY'
        };
      case 'normal':
        return {
          color: 'border-blue-500 bg-blue-50 text-blue-800',
          icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
          label: 'STANDARD'
        };
      case 'low':
        return {
          color: 'border-green-500 bg-green-50 text-green-800', 
          icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
          label: 'LOW PRIORITY'
        };
      default:
        return {
          color: 'border-gray-500 bg-gray-50 text-gray-800',
          icon: <CheckCircle2 className="w-4 h-4 text-gray-600" />,
          label: 'STANDARD'
        };
    }
  };

  const addTerminology = () => {
    if (newTerm && newTranslation) {
      setSessionNotes(prev => ({
        ...prev,
        terminology: [...prev.terminology, {
          term: newTerm,
          translation: newTranslation,
          context: 'Session context'
        }]
      }));
      setNewTerm('');
      setNewTranslation('');
      toast.success('Terminology added');
    }
  };

  const addClientQuestion = () => {
    if (newQuestion.trim()) {
      setSessionNotes(prev => ({
        ...prev,
        clientQuestions: [...prev.clientQuestions, newQuestion.trim()]
      }));
      setNewQuestion('');
      toast.success('Question added');
    }
  };

  const addBookmark = () => {
    const bookmark = {
      time: sessionDuration,
      note: `Important moment at ${formatDuration(sessionDuration)}`
    };
    setSessionNotes(prev => ({
      ...prev,
      bookmarks: [...prev.bookmarks, bookmark]
    }));
    toast.success('Bookmark added');
  };

  const saveNotes = async () => {
    setIsSaving(true);
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Session notes saved');
  };

  const copyQuestionToClipboard = (question: string) => {
    navigator.clipboard.writeText(question);
    toast.success('Question copied');
  };

  const urgencyInfo = getUrgencyInfo(clientInfo.urgency);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white flex">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Interpreter Header */}
        <div className="bg-gradient-to-r from-slate-900/95 to-purple-900/30 backdrop-blur-xl border-b border-purple-500/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-purple-400" />
                <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold px-3 py-1">
                  INTERPRETER SESSION
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={cn("w-3 h-3 rounded-full", isConnected ? 'bg-green-400 animate-pulse' : 'bg-yellow-400')} />
                <span className="text-sm font-medium">
                  {isConnected ? 'Connected to Client' : 'Connecting...'}
                </span>
              </div>

              {/* Urgency Badge */}
              <Badge className={cn("flex items-center space-x-1 font-semibold", urgencyInfo.color)}>
                {urgencyInfo.icon}
                <span>{urgencyInfo.label}</span>
              </Badge>
            </div>

            <div className="flex items-center space-x-6">
              {/* Session Timer */}
              <div className="text-right">
                <div className="text-sm text-gray-300">Session Duration</div>
                <div className="text-lg font-mono font-semibold">{formatDuration(sessionDuration)}</div>
              </div>

              {/* Client Info */}
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10 ring-2 ring-purple-400">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">
                    {clientInfo.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">{clientInfo.name}</div>
                  <div className="text-xs text-gray-300 flex items-center">
                    <Globe className="w-3 h-3 mr-1" />
                    {clientInfo.language} • {clientInfo.sessionType}
                  </div>
                </div>
              </div>

              <Button
                variant="destructive"
                onClick={onSessionEnd}
                className="bg-red-500 hover:bg-red-600"
              >
                <PhoneOff className="w-4 h-4 mr-2" />
                End Session
              </Button>
            </div>
          </div>
        </div>

        {/* Jitsi Video Container */}
        <div className="flex-1">
          <JitsiVideoSession
            roomName={`languagehelp-session-${sessionId.startsWith('session_') ? sessionId.replace('session_', '') : sessionId}`}
            displayName={interpreterName}
            userRole="interpreter"
            onCallStart={() => {
              setIsConnected(true);
              console.log('🎯 Interpreter connected to room:', `languagehelp-session-${sessionId}`);
              toast.success('🎯 Connected to client successfully!');
            }}
            onCallEnd={onSessionEnd}
            onError={(error) => {
              console.error('🚨 Interpreter Jitsi error:', error);
              toast.error('Connection failed. Please try again.');
            }}
          />
        </div>
      </div>

      {/* Professional Tools Sidebar */}
      <div className="w-96 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-l border-purple-500/20 flex flex-col">
        <div className="p-6 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-400" />
              Professional Tools
            </h3>
            <Button
              size="sm"
              onClick={saveNotes}
              disabled={isSaving}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSaving ? <Save className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 mx-6 mt-4">
              <TabsTrigger value="session" className="text-xs">Session</TabsTrigger>
              <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
              <TabsTrigger value="terms" className="text-xs">Terms</TabsTrigger>
              <TabsTrigger value="tools" className="text-xs">Tools</TabsTrigger>
            </TabsList>

            {/* Session Tab */}
            <TabsContent value="session" className="flex-1 p-6 space-y-4 overflow-y-auto">
              {/* Client Information */}
              <Card className="p-4 bg-slate-700/30 border-slate-600/50">
                <h4 className="font-semibold text-purple-400 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Client Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="font-medium">{clientInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Language:</span>
                    <Badge variant="outline">{clientInfo.language}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <Badge variant="outline">{clientInfo.sessionType}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Priority:</span>
                    <Badge className={cn("text-xs", urgencyInfo.color)}>
                      {clientInfo.urgency.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                {clientInfo.specialInstructions && (
                  <div className="mt-3 p-2 bg-slate-600/30 rounded text-xs">
                    <div className="text-gray-400 mb-1">Special Instructions:</div>
                    <div className="text-gray-300">{clientInfo.specialInstructions}</div>
                  </div>
                )}
              </Card>

              {/* Quick Client Questions */}
              <Card className="p-4 bg-slate-700/30 border-slate-600/50">
                <h4 className="font-semibold text-purple-400 mb-3 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Quick Questions
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {sessionNotes.clientQuestions.map((question, index) => (
                    <div 
                      key={index} 
                      className="p-2 bg-slate-600/30 rounded cursor-pointer hover:bg-slate-600/50 transition-colors group flex justify-between items-center"
                      onClick={() => copyQuestionToClipboard(question)}
                    >
                      <span className="text-xs text-gray-300">{question}</span>
                      <Copy className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Session Stats */}
              <Card className="p-4 bg-slate-700/30 border-slate-600/50">
                <h4 className="font-semibold text-purple-400 mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Session Stats
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="font-mono text-purple-400">{formatDuration(sessionDuration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Terms Added:</span>
                    <span className="text-green-400">{sessionNotes.terminology.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bookmarks:</span>
                    <span className="text-blue-400">{sessionNotes.bookmarks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Connection:</span>
                    <span className={isConnected ? "text-green-400" : "text-yellow-400"}>
                      {isConnected ? 'Stable' : 'Connecting'}
                    </span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-purple-400">Session Notes</label>
                    <Button size="sm" onClick={addBookmark} variant="ghost" className="h-6 px-2 text-xs">
                      <Bookmark className="w-3 h-3 mr-1" />
                      Bookmark
                    </Button>
                  </div>
                  <Textarea
                    value={sessionNotes.sessionNotes}
                    onChange={(e) => setSessionNotes(prev => ({ ...prev, sessionNotes: e.target.value }))}
                    placeholder="Document important points, client needs, context..."
                    className="min-h-[120px] bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-purple-400 mb-2 block">Private Notes</label>
                  <Textarea
                    value={sessionNotes.privateNotes}
                    onChange={(e) => setSessionNotes(prev => ({ ...prev, privateNotes: e.target.value }))}
                    placeholder="Private interpreter notes (not shared with client)..."
                    className="min-h-[80px] bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400"
                  />
                </div>

                {/* Bookmarks */}
                {sessionNotes.bookmarks.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-purple-400 mb-2">Session Bookmarks</h5>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {sessionNotes.bookmarks.map((bookmark, index) => (
                        <div key={index} className="p-2 bg-slate-700/30 rounded text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-blue-400">{formatDuration(bookmark.time)}</span>
                            <span className="text-gray-400">{bookmark.note}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Terminology Tab */}
            <TabsContent value="terms" className="flex-1 p-6 space-y-4 overflow-y-auto">
              {/* Add New Term */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-purple-400">Add Terminology</h4>
                <div className="space-y-2">
                  <Input
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                    placeholder="Source term..."
                    className="bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 text-sm"
                  />
                  <Input
                    value={newTranslation}
                    onChange={(e) => setNewTranslation(e.target.value)}
                    placeholder="Translation..."
                    className="bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 text-sm"
                  />
                  <Button onClick={addTerminology} size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                    Add Term
                  </Button>
                </div>
              </div>

              {/* Terminology List */}
              <div>
                <h4 className="text-sm font-medium text-purple-400 mb-2">Session Terminology</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sessionNotes.terminology.map((term, index) => (
                    <div key={index} className="p-3 bg-slate-700/30 border-slate-600/50 rounded">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{term.term}</div>
                          <div className="text-sm text-purple-300">{term.translation}</div>
                          {term.context && (
                            <div className="text-xs text-gray-400 mt-1">{term.context}</div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigator.clipboard.writeText(`${term.term} → ${term.translation}`)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {sessionNotes.terminology.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No terminology added yet
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="flex-1 p-6 space-y-4 overflow-y-auto">
              {/* Add Question */}
              <Card className="p-4 bg-slate-700/30 border-slate-600/50">
                <h4 className="font-semibold text-purple-400 mb-3 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Client Question
                </h4>
                <div className="space-y-2">
                  <Input
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="New question for client..."
                    className="bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 text-sm"
                  />
                  <Button onClick={addClientQuestion} size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                    Add Question
                  </Button>
                </div>
              </Card>

              {/* Export Options */}
              <Card className="p-4 bg-slate-700/30 border-slate-600/50">
                <h4 className="font-semibold text-purple-400 mb-3 flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export Session
                </h4>
                <div className="space-y-2">
                  <Button size="sm" variant="ghost" className="w-full justify-start text-xs">
                    <FileText className="w-3 h-3 mr-2" />
                    Export Notes (PDF)
                  </Button>
                  <Button size="sm" variant="ghost" className="w-full justify-start text-xs">
                    <BookOpen className="w-3 h-3 mr-2" />
                    Export Terminology
                  </Button>
                  <Button size="sm" variant="ghost" className="w-full justify-start text-xs">
                    <ClipboardList className="w-3 h-3 mr-2" />
                    Session Report
                  </Button>
                </div>
              </Card>

              {/* Audio Controls */}
              <Card className="p-4 bg-slate-700/30 border-slate-600/50">
                <h4 className="font-semibold text-purple-400 mb-3 flex items-center">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Audio Tools
                </h4>
                <div className="space-y-2">
                  <Button size="sm" variant="ghost" className="w-full justify-start text-xs">
                    <Headphones className="w-3 h-3 mr-2" />
                    Audio Test
                  </Button>
                  <Button size="sm" variant="ghost" className="w-full justify-start text-xs">
                    <Settings className="w-3 h-3 mr-2" />
                    Audio Settings
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Debug Tool - Remove in production */}
      <CallRoomDebugger
        sessionId={sessionId}
        roomName={`languagehelp-session-${sessionId.startsWith('session_') ? sessionId.replace('session_', '') : sessionId}`}
        userRole="interpreter"
        displayName={interpreterName}
        userNames={{
          clientName: clientInfo.name,
          interpreterName: interpreterName
        }}
        language={clientInfo.language}
      />
    </div>
  );
}
