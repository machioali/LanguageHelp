'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  MessageSquare, 
  Send,
  Clock,
  Languages,
  FileText,
  Star,
  AlertCircle,
  CheckCircle,
  User,
  Volume2,
  VolumeOff,
  Settings,
  Save,
  Calendar,
  Globe,
  Timer,
  Users,
  BookOpen,
  ClipboardList,
  Eye,
  EyeOff,
  Loader2,
  NotebookPen,
  Zap,
  Play,
  Copy,
  Plus,
  Minus,
  HelpCircle,
  Lightbulb,
  Target,
  ArrowRight,
  Headphones,
  Camera,
  Maximize2,
  Minimize2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { JitsiDebugInfo } from '@/components/JitsiDebugInfo';

interface InterpreterRoomProps {
  sessionId: string;
  userId: string;
  userType: 'client' | 'interpreter';
  userNames: {
    clientName?: string;
    interpreterName?: string;
  };
  language: string;
  sessionType: 'VRI' | 'OPI';
  sessionDetails: {
    sourceLanguage: string;
    targetLanguage: string;
    urgency: 'low' | 'normal' | 'high';
    specialInstructions?: string;
  };
  onSessionEnd: () => void;
  onError: (error: string) => void;
}

export default function InterpreterRoom({
  sessionId,
  userId,
  userType,
  userNames,
  language,
  sessionType,
  sessionDetails,
  onSessionEnd,
  onError
}: InterpreterRoomProps) {
  // Session notes and documentation
  const [sessionNotes, setSessionNotes] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');
  const [terminology, setTerminology] = useState('');
  const [newTerm, setNewTerm] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [terminologyList, setTerminologyList] = useState<Array<{term: string, translation: string, context?: string}>>([]);
  const [sessionStartTime] = useState(new Date());
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [showPrivateNotes, setShowPrivateNotes] = useState(false);
  const [sessionRating, setSessionRating] = useState(0);
  const [clientInfo, setClientInfo] = useState({
    name: userNames.clientName || 'Unknown Client',
    organization: 'Not specified',
    contact: 'Not provided'
  });

  // Video and communication state
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [callQuality, setCallQuality] = useState('Good');
  const [currentTab, setCurrentTab] = useState('session');
  
  // Persistent room connection state
  const [connectionStatus, setConnectionStatus] = useState('connected'); // connected, disconnected, reconnecting
  const [waitingForParticipant, setWaitingForParticipant] = useState<string | null>(null);
  const [roomMessage, setRoomMessage] = useState<string | null>(null);
  
  // Client questions management
  const [clientQuestions, setClientQuestions] = useState<string[]>([
    'What is your name?',
    'Where are you from?',
    'What is your date of birth?',
    'Can you describe your symptoms?',
    'How long have you been experiencing this?',
    'Do you have any allergies?',
    'What medications are you currently taking?',
    'Do you have insurance?',
    'Who is your emergency contact?',
    'Have you been here before?'
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  // Timer for session duration
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const duration = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
      setSessionDuration(duration);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);
  
  // Listen for persistent room events
  useEffect(() => {
    const handleSessionResumed = (event: any) => {
      const { message } = event.detail;
      console.log('🔄 Session resumed in InterpreterRoom:', message);
      setConnectionStatus('connected');
      setWaitingForParticipant(null);
      setRoomMessage(null);
      toast.success('✅ Session resumed - both participants reconnected');
    };
    
    const handleWaitingForParticipant = (event: any) => {
      const { message, missingParticipant } = event.detail;
      console.log('⏳ Waiting for participant in InterpreterRoom:', message);
      setWaitingForParticipant(missingParticipant);
      setRoomMessage(message);
      toast('⏳ Waiting for participant to reconnect...', { duration: 5000 });
    };
    
    const handleParticipantDisconnected = (event: any) => {
      const { disconnectedUser, message, reconnectionTimeout } = event.detail;
      console.log('🔄 Participant disconnected in InterpreterRoom:', message);
      setWaitingForParticipant(disconnectedUser);
      setRoomMessage(message);
      
      const timeoutMinutes = Math.floor(reconnectionTimeout / 60000);
      toast(`🔄 ${disconnectedUser} disconnected - waiting ${timeoutMinutes} minutes for reconnection`, { 
        duration: 8000 
      });
    };
    
    // Add event listeners
    window.addEventListener('session-resumed', handleSessionResumed);
    window.addEventListener('waiting-for-participant', handleWaitingForParticipant);
    window.addEventListener('participant-disconnected', handleParticipantDisconnected);
    
    // Cleanup
    return () => {
      window.removeEventListener('session-resumed', handleSessionResumed);
      window.removeEventListener('waiting-for-participant', handleWaitingForParticipant);
      window.removeEventListener('participant-disconnected', handleParticipantDisconnected);
    };
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

  // Import Jitsi component (dynamically imported)
  const [JitsiVideoSession, setJitsiVideoSession] = useState<any>(null);
  const [isJitsiLoading, setIsJitsiLoading] = useState(true);

  useEffect(() => {
    // Dynamically import Jitsi component
    import('@/components/JitsiVideoSession').then((module) => {
      setJitsiVideoSession(() => module.default);
      setIsJitsiLoading(false);
    }).catch((error) => {
      console.error('Failed to load Jitsi component:', error);
      setIsJitsiLoading(false);
    });
  }, []);

  // Generate room name from session ID - MUST match client room name
  const jitsiRoomName = `session-${sessionId}`;
  const interpreterDisplayName = userNames.interpreterName || 'Professional Interpreter';
  
  // Debug logging for room coordination
  console.log('🎯 InterpreterRoom:', {
    sessionId,
    jitsiRoomName,
    interpreterDisplayName,
    userNames
  });
  
  // Video controls - now for Jitsi integration
  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // Jitsi handles video controls internally
  };
  
  const handleToggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // Jitsi handles audio controls internally
  };
  
  const handleToggleFullscreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  
  // Client questions management
  const addClientQuestion = () => {
    if (newQuestion.trim()) {
      setClientQuestions(prev => [...prev, newQuestion.trim()]);
      setNewQuestion('');
      toast.success('Question added');
    }
  };

  const removeClientQuestion = (index: number) => {
    setClientQuestions(prev => prev.filter((_, i) => i !== index));
    toast.success('Question removed');
  };
  
  // Copy text to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  // Add new terminology
  const addTerminology = () => {
    if (newTerm.trim() && newTranslation.trim()) {
      setTerminologyList(prev => [
        ...prev,
        {
          term: newTerm.trim(),
          translation: newTranslation.trim(),
          context: sessionDetails.sourceLanguage
        }
      ]);
      setNewTerm('');
      setNewTranslation('');
      toast.success('Term added to glossary');
    }
  };

  // Save session notes
  const saveNotes = async () => {
    if (!sessionNotes.trim() && !privateNotes.trim() && !terminology.trim() && terminologyList.length === 0) {
      toast.error('No notes to save');
      return;
    }

    setIsSavingNotes(true);
    try {
      const notesData = {
        sessionId,
        sessionNotes: sessionNotes.trim(),
        privateNotes: privateNotes.trim(),
        terminology: terminology.trim(),
        terminologyList: terminologyList,
        rating: sessionRating,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/interpreter/session-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(notesData)
      });

      if (response.ok) {
        setNotesSaved(true);
        toast.success('Session notes saved successfully!');
        setTimeout(() => setNotesSaved(false), 3000);
      } else {
        throw new Error('Failed to save notes');
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Handle session end with notes auto-save and database recording
  const handleSessionEnd = async () => {
    // Auto-save notes if there are any
    if ((sessionNotes.trim() || privateNotes.trim() || terminology.trim() || terminologyList.length > 0) && !notesSaved) {
      try {
        await saveNotes();
      } catch (error) {
        console.error('Failed to auto-save notes on session end:', error);
      }
    }

    // Record the completed session in the database
    try {
      const sessionEndTime = new Date();
      const sessionData = {
        sessionId,
        clientName: clientInfo.name,
        language: sessionDetails.sourceLanguage === 'English' ? sessionDetails.targetLanguage : sessionDetails.sourceLanguage,
        sessionType: sessionType, // VRI or OPI
        duration: sessionDuration, // in seconds
        startTime: sessionStartTime.toISOString(),
        endTime: sessionEndTime.toISOString()
      };

      console.log('🎯 Recording completed session:', sessionData);
      
      const response = await fetch('/api/interpreter/sessions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(sessionData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Session recorded successfully:', result);
        toast.success(`Session completed! Earned $${result.data?.earnings || '0.00'} for ${Math.ceil(sessionDuration / 60)} minutes`);
      } else {
        const error = await response.text();
        console.error('❌ Failed to record session:', error);
        toast.error('Session ended but failed to record in database');
      }
    } catch (error) {
      console.error('💥 Error recording session:', error);
      toast.error('Session ended but failed to save to database');
    }

    // End the UI session
    onSessionEnd();
  };

  return (
    <div className="h-screen bg-background flex">
      {/* Left Column - Video & Communication (25%) */}
      <div className="w-1/4 bg-gray-900 flex flex-col text-white border-r border-gray-700">
        {/* Session Info */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <Badge 
              className={`${
                sessionDetails.urgency === 'high' ? 'bg-red-500 animate-pulse' : 
                sessionDetails.urgency === 'normal' ? 'bg-blue-500' : 'bg-green-500'
              } text-white`}
            >
              {sessionDetails.urgency.toUpperCase()}
            </Badge>
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              <span className="font-mono text-sm">{formatDuration(sessionDuration)}</span>
            </div>
          </div>
          
          {/* Connection Status Indicator */}
          {waitingForParticipant && (
            <div className="mt-2 p-2 bg-yellow-900/50 border border-yellow-600 rounded text-xs">
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-yellow-400" />
                <span className="text-yellow-200">
                  Waiting for {waitingForParticipant} to reconnect...
                </span>
              </div>
            </div>
          )}
          
          <div className="mt-2 space-y-1 text-xs text-gray-300">
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>{sessionDetails.sourceLanguage} ↔ {sessionDetails.targetLanguage}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{clientInfo.name}</span>
            </div>
          </div>
        </div>
        
        {/* Jitsi Video Display */}
        <div className="flex-1 relative bg-gray-800">
          {isJitsiLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 text-white animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-400">Loading video...</p>
              </div>
            </div>
          ) : JitsiVideoSession ? (
            <div className="h-full w-full relative">
              <JitsiVideoSession
                roomName={jitsiRoomName}
                displayName={interpreterDisplayName}
                userRole="interpreter"
                isPersistent={true}
                reconnectionSupported={true}
                onCallStart={() => {
                  console.log('🎯 Jitsi session started for interpreter');
                  setConnectionStatus('connected');
                  toast.success('Video session connected!');
                }}
                onCallEnd={() => {
                  console.log('🎯 Jitsi session ended for interpreter');
                  if (!waitingForParticipant) {
                    handleSessionEnd();
                  }
                }}
                onConnectionStatusChanged={(status: string) => {
                  setConnectionStatus(status);
                  if (status === 'disconnected') {
                    toast('🔄 Connection lost - attempting to reconnect...', { duration: 3000 });
                  } else if (status === 'reconnected') {
                    toast.success('✅ Reconnected successfully!');
                  }
                }}
              />
              
              {/* Debug Info */}
              <JitsiDebugInfo
                roomName={jitsiRoomName}
                displayName={interpreterDisplayName}
                userRole="interpreter"
                sessionId={sessionId}
                userNames={{
                  clientName: clientInfo.name,
                  interpreterName: interpreterDisplayName
                }}
              />
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Failed to load video</p>
                <p className="text-xs text-gray-500">Please refresh the page</p>
              </div>
            </div>
          )}
          
          {/* Connection Quality - Only show if not using Jitsi */}
          {!JitsiVideoSession && (
            <div className="absolute bottom-4 left-4 bg-gray-900/80 rounded-full px-3 py-1 text-xs flex items-center">
              <div className={`h-2 w-2 rounded-full mr-2 ${
                callQuality === 'Good' ? 'bg-green-500' : 
                callQuality === 'Fair' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span>{callQuality}</span>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="bg-gray-800 p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
                onClick={handleToggleAudio}
              >
                {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>
              
              <button 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
                onClick={handleToggleVideo}
              >
                {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button 
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                onClick={handleToggleFullscreen}
              >
                {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              
              <button 
                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
                onClick={handleSessionEnd}
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-3 text-center">
            <span className="text-xs text-gray-400">{sessionType} Session • {formatDuration(sessionDuration)}</span>
          </div>
        </div>
      </div>

      {/* Middle Column - Instructions & Client Questions (40%) */}
      <div className="w-2/5 border-r border-border flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-blue-900">Interpreter Guide</h2>
            <Badge variant="outline" className="font-medium border-blue-200 text-blue-700">
              {sessionType} • {sessionDetails.sourceLanguage}/{sessionDetails.targetLanguage}
            </Badge>
          </div>
        </div>
        
        {/* Custom Tab Interface */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-border px-4 bg-muted/30">
            <div className="flex space-x-1">
              <button 
                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  currentTab === 'session' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setCurrentTab('session')}
              >
                <MessageSquare className="h-4 w-4 inline mr-2" />
                Session Scripts
              </button>
              <button 
                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  currentTab === 'questions' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setCurrentTab('questions')}
              >
                <HelpCircle className="h-4 w-4 inline mr-2" />
                Client Questions
              </button>
              <button 
                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  currentTab === 'best-practices' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setCurrentTab('best-practices')}
              >
                <Target className="h-4 w-4 inline mr-2" />
                Best Practices
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                
                {/* Session Scripts Tab */}
                {currentTab === 'session' && (
                  <div className="space-y-6">
                    {/* Opening Script */}
                    <Card className="border-blue-200 bg-blue-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-blue-900">
                          <Play className="h-5 w-5" />
                          Opening Script
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
                          <p className="text-sm leading-relaxed text-blue-900">
                            "Hello, my name is <strong>{userNames.interpreterName}</strong>. I am your certified {sessionDetails.targetLanguage} interpreter for today's session. I will be interpreting everything that is said during this conversation."
                          </p>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => copyToClipboard(`Hello, my name is ${userNames.interpreterName}. I am your certified ${sessionDetails.targetLanguage} interpreter for today's session. I will be interpreting everything that is said during this conversation.`)}
                            className="mt-2 h-7 px-2 text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
                          <p className="text-sm leading-relaxed text-blue-900">
                            "Please speak clearly and pause between sentences to ensure accurate interpretation. If you need me to repeat anything or have questions, please let me know."
                          </p>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => copyToClipboard("Please speak clearly and pause between sentences to ensure accurate interpretation. If you need me to repeat anything or have questions, please let me know.")}
                            className="mt-2 h-7 px-2 text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* During Session */}
                    <Card className="border-yellow-200 bg-yellow-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-yellow-900">
                          <MessageSquare className="h-5 w-5" />
                          During Session
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          "Excuse me, could you please repeat that more slowly?",
                          "I need clarification on that term. Could you explain what you mean?",
                          "Please pause to allow me to interpret completely.",
                          "Could you speak one at a time to ensure accuracy?",
                          "I'm having difficulty hearing. Could you speak a bit louder?",
                          "This term doesn't translate directly. Let me explain the concept."
                        ].map((script, index) => (
                          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-yellow-100">
                            <p className="text-sm leading-relaxed text-yellow-900">"{script}"</p>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => copyToClipboard(script)}
                              className="mt-2 h-7 px-2 text-xs"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Closing Script */}
                    <Card className="border-green-200 bg-green-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-green-900">
                          <CheckCircle className="h-5 w-5" />
                          Closing Script
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-green-100">
                          <p className="text-sm leading-relaxed text-green-900">
                            "Before we conclude, is there anything else that needs to be interpreted? If not, this concludes our interpretation session. Thank you for using our professional interpretation services."
                          </p>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => copyToClipboard("Before we conclude, is there anything else that needs to be interpreted? If not, this concludes our interpretation session. Thank you for using our professional interpretation services.")}
                            className="mt-2 h-7 px-2 text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Client Questions Tab */}
                {currentTab === 'questions' && (
                  <div className="space-y-6">
                    {/* Add New Question */}
                    <Card className="border-purple-200 bg-purple-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-purple-900">
                          <Plus className="h-5 w-5" />
                          Add Custom Question
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Enter a question clients might ask..."
                            className="text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && addClientQuestion()}
                          />
                          <Button onClick={addClientQuestion} disabled={!newQuestion.trim()}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Common Client Questions */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <HelpCircle className="h-5 w-5 text-primary" />
                          Common Client Questions
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Click any question to copy it to your clipboard
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          {clientQuestions.map((question, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border hover:bg-muted/70 cursor-pointer group transition-colors"
                              onClick={() => copyToClipboard(question)}
                            >
                              <span className="text-sm flex-1">{question}</span>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(question);
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeClientQuestion(index);
                                  }}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Best Practices Tab */}
                {currentTab === 'best-practices' && (
                  <div className="space-y-6">
                    <Card className="border-emerald-200 bg-emerald-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-emerald-900">
                          <CheckCircle className="h-5 w-5" />
                          Professional Standards
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { icon: CheckCircle, text: "Always interpret in first person ('I' instead of 'He/She says')", type: "success" },
                          { icon: CheckCircle, text: "Ask for clarification when you don't understand something", type: "success" },
                          { icon: CheckCircle, text: "Maintain strict confidentiality and professional neutrality", type: "success" },
                          { icon: CheckCircle, text: "Signal when you need repetition or slower speech", type: "success" },
                          { icon: AlertCircle, text: "Never add, omit, or change the meaning of what is said", type: "warning" },
                          { icon: AlertCircle, text: "Don't provide personal opinions or advice", type: "warning" },
                          { icon: AlertCircle, text: "Inform both parties immediately if technical issues occur", type: "warning" }
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <item.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              item.type === 'success' ? 'text-emerald-600' : 'text-amber-600'
                            }`} />
                            <span className="text-sm leading-relaxed">{item.text}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Emergency Procedures */}
                    <Card className="border-red-200 bg-red-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-red-900">
                          <AlertCircle className="h-5 w-5" />
                          Emergency Procedures
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          "If connection issues occur: 'I'm experiencing technical difficulties, please hold on.'",
                          "For reconnection: 'I'm back online. Can both parties confirm you can hear me?'",
                          "If audio is unclear: 'I need to inform both parties of an audio quality issue.'",
                          "For emergency situations: Follow your organization's emergency protocol immediately."
                        ].map((procedure, index) => (
                          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-red-100">
                            <p className="text-sm leading-relaxed text-red-900">{procedure}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}

              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Right Column - Notes & Terminology (35%) */}
      <div className="w-1/3 bg-background flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Session Notes</h2>
            {sessionDetails.specialInstructions && (
              <Badge variant="destructive" className="text-xs">
                Special Instructions
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Client: {clientInfo.name} • Duration: {formatDuration(sessionDuration)}
          </div>
        </div>

        {/* Notes Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-6">
              
              {/* Special Instructions */}
              {sessionDetails.specialInstructions && (
                <Card className="border-amber-200 bg-amber-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-amber-900">
                      <AlertCircle className="h-4 w-4" />
                      Special Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-amber-900 leading-relaxed">
                      {sessionDetails.specialInstructions}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Session Notes */}
              <div>
                <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4" />
                  Session Notes
                </Label>
                <Textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Document key points, decisions, important information from this session..."
                  className="min-h-[120px] text-sm resize-none"
                />
              </div>

              {/* Private Notes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Private Notes
                  </Label>
                  <Button
                    onClick={() => setShowPrivateNotes(!showPrivateNotes)}
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                  >
                    {showPrivateNotes ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
                
                {showPrivateNotes ? (
                  <Textarea
                    value={privateNotes}
                    onChange={(e) => setPrivateNotes(e.target.value)}
                    placeholder="Personal notes for your reference only..."
                    className="min-h-[100px] text-sm resize-none"
                  />
                ) : (
                  <div className="bg-muted/50 border border-dashed rounded-md p-4 text-center">
                    <p className="text-xs text-muted-foreground italic">
                      Click the eye icon to view/edit private notes
                    </p>
                  </div>
                )}
              </div>

              {/* Terminology Management */}
              <div>
                <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4" />
                  Terminology
                </Label>
                
                {/* Add New Term */}
                <div className="bg-muted/50 rounded-lg p-4 mb-4 space-y-2">
                  <div className="grid grid-cols-1 gap-2">
                    <Input
                      value={newTerm}
                      onChange={(e) => setNewTerm(e.target.value)}
                      placeholder="Term in source language"
                      className="text-sm"
                    />
                    <Input
                      value={newTranslation}
                      onChange={(e) => setNewTranslation(e.target.value)}
                      placeholder="Translation"
                      className="text-sm"
                    />
                    <Button
                      onClick={addTerminology}
                      size="sm"
                      disabled={!newTerm.trim() || !newTranslation.trim()}
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      Add Term
                    </Button>
                  </div>
                </div>

                {/* Terminology List */}
                {terminologyList.length > 0 ? (
                  <div className="space-y-2">
                    {terminologyList.map((item, index) => (
                      <div key={index} className="bg-white border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.term}</p>
                            <p className="text-sm text-muted-foreground">{item.translation}</p>
                            {item.context && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {item.context}
                              </Badge>
                            )}
                          </div>
                          <Button
                            onClick={() => {
                              setTerminologyList(prev => prev.filter((_, i) => i !== index));
                              toast.success('Term removed');
                            }}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted/30 border border-dashed rounded-md p-6 text-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No terms added yet</p>
                    <p className="text-xs text-muted-foreground">Add terminology as you encounter new terms</p>
                  </div>
                )}
              </div>

              {/* Session Rating */}
              <div>
                <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4" />
                  Rate This Session
                </Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSessionRating(star)}
                      className={`p-1 rounded hover:bg-muted/50 transition-colors ${
                        star <= sessionRating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${star <= sessionRating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                  {sessionRating > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {sessionRating}/5 stars
                    </span>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Save Button Footer */}
        <div className="p-4 border-t border-border bg-muted/20">
          <Button
            onClick={saveNotes}
            disabled={isSavingNotes}
            size="sm"
            className="w-full"
            variant={notesSaved ? "default" : "outline"}
          >
            {isSavingNotes ? (
              <><Loader2 className="h-3 w-3 mr-2 animate-spin" />Saving...</>
            ) : notesSaved ? (
              <><CheckCircle className="h-3 w-3 mr-2" />Saved!</>
            ) : (
              <><Save className="h-3 w-3 mr-2" />Save Notes</>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Notes auto-save when session ends
          </p>
        </div>
      </div>
    </div>
  );
}
