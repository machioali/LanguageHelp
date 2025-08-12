'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { useInterpreterCalls } from '@/hooks/useCallRequests';
import InterpreterRoom from '@/components/InterpreterRoom';
import { usePhoneRinging } from '@/hooks/usePhoneRinging';
import { IncomingCallModal } from '@/components/IncomingCallModal';
import { 
  Video, 
  Calendar, 
  Clock, 
  User, 
  Settings, 
  FileText, 
  MessageSquare, 
  Globe, 
  Users, 
  TrendingUp, 
  Award, 
  Star, 
  Phone,
  Activity,
  CircleDot,
  BarChart3,
  DollarSign,
  Bell,
  Coffee,
  Home,
  CheckCircle,
  PhoneCall,
  PhoneIncoming,
  PhoneOff,
  LogOut,
  Zap,
  Target,
  AlertCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Timer,
  Pause,
  Play,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface InterpreterProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  hourlyRate?: number;
  bio?: string;
  experience?: number;
  status: string;
  isVerified: boolean;
  availability?: string;
  languages: {
    languageCode: string;
    languageName: string;
    proficiency: string;
    isNative: boolean;
  }[];
  specializations: string[];
  certifications: any[];
}

interface InterpreterData {
  interpreter: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  profile: InterpreterProfile;
  credentials: {
    isFirstLogin: boolean;
    lastLoginAt?: Date;
  };
  stats: {
    today: { sessions: number; hours: number; earnings: number };
    thisWeek: { sessions: number; hours: number; earnings: number };
    thisMonth: { sessions: number; hours: number; earnings: number };
    rating: number;
    totalSessions: number;
    completionRate: number;
  };
}

interface CallRequest {
  id: string;
  type: 'VRI' | 'OPI';
  language: string;
  client: string;
  priority: 'normal' | 'urgent' | 'emergency';
  estimatedDuration: string;
  timestamp: Date;
}

interface ActiveSession {
  id: string;
  type: 'VRI' | 'OPI';
  client: string;
  language: string;
  startTime: Date;
  duration: string;
}

interface SessionReport {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  type: 'VRI' | 'OPI';
  language: string;
  client: string;
  status: 'Completed' | 'Cancelled' | 'No-Show';
  rating?: number;
  earnings: string;
  notes?: string;
  cancellationReason?: string;
}

export default function InterpreterDashboardPage() {
  const router = useRouter();
  const [interpreterData, setInterpreterData] = useState<InterpreterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStatus, setCurrentStatus] = useState<'available' | 'busy' | 'break' | 'offline'>('available');
  const [incomingCalls, setIncomingCalls] = useState<CallRequest[]>([]);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [autoAccept, setAutoAccept] = useState(false);
  const [recentSessions, setRecentSessions] = useState<SessionReport[]>([]);
  const [loadingRecentSessions, setLoadingRecentSessions] = useState(true);
  const [inSession, setInSession] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [creatingData, setCreatingData] = useState(false);
  const [earningsDialogOpen, setEarningsDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [performanceDialogOpen, setPerformanceDialogOpen] = useState(false);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [loadingUpcomingSessions, setLoadingUpcomingSessions] = useState(false);
  
  // Initialize real-time call system
  const interpreterId = interpreterData?.interpreter?.id || 'demo-interpreter';
  const interpreterName = interpreterData ? `${interpreterData.profile.firstName} ${interpreterData.profile.lastName}` : 'Anonymous Interpreter';
  const { socket, isConnected, incomingRequests, acceptCall, declineCall, registerInterpreter, updateAvailability } = useInterpreterCalls(interpreterId, interpreterName);
  
  // Initialize phone ringing functionality
  const { isRinging, incomingCall, startRinging, stopRinging } = usePhoneRinging();
  const [isRingMuted, setIsRingMuted] = useState(false);

  // Handle auto accept toggle with toast notification
  const handleAutoAcceptToggle = (checked: boolean) => {
    setAutoAccept(checked);
    toast.success(
      checked ? '✅ Auto Accept enabled' : '❌ Auto Accept disabled'
    );
  };

  // Fetch interpreter data on component mount
  useEffect(() => {
    const fetchInterpreterData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/interpreter/profile', {
          method: 'GET',
          credentials: 'include', // Include cookies for auth
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to sign-in if not authenticated
            router.push('/auth/interpreter-signin');
            return;
          }
          throw new Error(data.error || 'Failed to fetch profile');
        }

        if (data.success) {
          setInterpreterData(data);
        } else {
          throw new Error('Failed to load interpreter data');
        }
      } catch (error: any) {
        console.error('Error fetching interpreter data:', error);
        setError(error.message || 'Failed to load interpreter data');
      } finally {
        setLoading(false);
      }
    };

    fetchInterpreterData();
  }, [router]);

  // Fetch recent sessions
  useEffect(() => {
    const fetchRecentSessions = async () => {
      if (!interpreterData) return; // Wait for interpreter data to load first
      
      try {
        setLoadingRecentSessions(true);
        const response = await fetch('/api/interpreter/sessions?dateRange=last7days&status=Completed', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          // Take only the first 3 recent completed sessions for dashboard
          setRecentSessions(result.data.reports.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching recent sessions:', error);
        // Keep empty array on error so dashboard still works
        setRecentSessions([]);
      } finally {
        setLoadingRecentSessions(false);
      }
    };

    fetchRecentSessions();
  }, [interpreterData]); // Depend on interpreterData so it runs after profile loads
  
  // Register interpreter with signaling server and update availability status
  useEffect(() => {
    if (interpreterData && isConnected) {
      const languages = interpreterData.profile.languages.map(lang => lang.languageName);
      
      if (currentStatus === 'available') {
        console.log('🔌 Registering interpreter as AVAILABLE with languages:', languages);
        registerInterpreter(interpreterId, languages, 'available');
      } else {
        console.log(`🔌 Updating interpreter status to: ${currentStatus}`);
        // Update availability but keep registration for potential status changes
        updateAvailability(currentStatus);
      }
    }
  }, [interpreterData, currentStatus, isConnected, interpreterId, registerInterpreter, updateAvailability]);
  
  // Listen for video session start events and persistent room events
  useEffect(() => {
    const handleStartVideoSession = (event: any) => {
      const sessionInfo = event.detail;
      console.log('🟢 Starting video session with persistent room support:', sessionInfo);
      setSessionData(sessionInfo);
      setInSession(true);
      
      // Update status for persistent sessions
      if (sessionInfo.isPersistent) {
        setCurrentStatus('busy');
        toast.success('✅ Joined persistent room - reconnections supported');
      }
    };
    
    const handleSessionResumed = (event: any) => {
      const { message, sessionId } = event.detail;
      console.log('🔄 Session resumed on dashboard:', message);
      toast.success('✅ Session resumed - both participants back online');
    };
    
    const handleWaitingForParticipant = (event: any) => {
      const { message, missingParticipant } = event.detail;
      console.log('⏳ Waiting for participant on dashboard:', message);
      toast('⏳ Client temporarily disconnected - maintaining session', { 
        duration: 5000,
        icon: '🔄'
      });
    };
    
    const handleParticipantDisconnected = (event: any) => {
      const { disconnectedUser, message, reconnectionTimeout } = event.detail;
      console.log('🔄 Participant disconnected on dashboard:', message);
      
      const timeoutMinutes = Math.floor(reconnectionTimeout / 60000);
      toast(`🔄 ${disconnectedUser} disconnected - room active for ${timeoutMinutes} more minutes`, { 
        duration: 8000 
      });
    };

    // Add all event listeners
    window.addEventListener('start-video-session', handleStartVideoSession);
    window.addEventListener('session-resumed', handleSessionResumed);
    window.addEventListener('waiting-for-participant', handleWaitingForParticipant);
    window.addEventListener('participant-disconnected', handleParticipantDisconnected);

    return () => {
      window.removeEventListener('start-video-session', handleStartVideoSession);
      window.removeEventListener('session-resumed', handleSessionResumed);
      window.removeEventListener('waiting-for-participant', handleWaitingForParticipant);
      window.removeEventListener('participant-disconnected', handleParticipantDisconnected);
    };
  }, []);

  // Show status change notifications only (availability update handled above)
  useEffect(() => {
    if (interpreterData && isConnected) {
      const statusMessages = {
        available: '🟢 You are now available for calls',
        busy: '🔴 Status set to busy - calls will be declined',
        break: '🟡 On break - calls will be paused',
        offline: '⚫ Offline - you won\'t receive any calls'
      };
      
      toast.success(statusMessages[currentStatus]);
    }
  }, [currentStatus, interpreterData, isConnected]);

  // Handle incoming calls with ringing (only when available)
  useEffect(() => {
    if (incomingRequests.length > 0) {
      if (currentStatus !== 'available') {
        // Immediately decline all calls if not available
        console.log(`❌ Auto-declining calls because status is: ${currentStatus}`);
        incomingRequests.forEach(request => {
          declineCall(request.requestId);
        });
        stopRinging();
        toast.error(`Call declined - You are currently ${currentStatus}`);
      } else if (!autoAccept && !isRinging) {
        // Start ringing for available interpreter
        const latestRequest = incomingRequests[0];
        startRinging(latestRequest);
      }
    } else if (incomingRequests.length === 0 && isRinging) {
      stopRinging();
    }
  }, [incomingRequests, currentStatus, autoAccept, isRinging, startRinging, stopRinging, declineCall]);

  // Auto-accept calls if enabled
  useEffect(() => {
    if (autoAccept && incomingRequests.length > 0 && currentStatus === 'available') {
      const latestRequest = incomingRequests[0];
      acceptCall(latestRequest.requestId);
      stopRinging();
      
      // AUTOMATICALLY change status to busy when auto-accepting a call
      setCurrentStatus('busy');
      
      toast.success(`Auto-accepted call from ${latestRequest.clientName} - Status changed to Busy`);
    }
  }, [incomingRequests, autoAccept, currentStatus, acceptCall, stopRinging]);

  // Use real data from the API or fallback to demo data
  const sessionStats = interpreterData?.stats || {
    today: { sessions: 0, hours: 0, earnings: 0 },
    thisWeek: { sessions: 0, hours: 0, earnings: 0 },
    thisMonth: { sessions: 0, hours: 0, earnings: 0 },
    rating: 0,
    totalSessions: 0,
    completionRate: 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-500';
      case 'busy': return 'text-red-500';
      case 'break': return 'text-yellow-500';
      case 'offline': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'break': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'border-red-500 bg-red-50';
      case 'urgent': return 'border-orange-500 bg-orange-50';
      case 'normal': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const endSession = () => {
    if (activeSession) {
      setActiveSession(null);
      setCurrentStatus('available');
    }
  };

  const startSession = (sessionId: string) => {
    console.log(`Starting session ${sessionId}`);
    // TODO: Implement session starting logic when you have upcoming sessions data
    toast.success('Session starting feature will be implemented with upcoming sessions API');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading your interpreter dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
              <p className="text-red-600 font-medium">Error loading dashboard</p>
              <p className="text-muted-foreground">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show dashboard if data is loaded
  if (!interpreterData) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto" />
              <p className="text-yellow-600 font-medium">No interpreter data found</p>
              <p className="text-muted-foreground">Please try signing in again</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { interpreter, profile, stats } = interpreterData;
  const displayName = `${profile.firstName} ${profile.lastName}`;
  const interpreterIdDisplay = `INT-${profile.id.slice(-6).toUpperCase()}`;

  const onSessionEnd = () => {
    setInSession(false);
    setSessionData(null);
    
    // AUTOMATICALLY change status back to available when session ends
    setCurrentStatus('available');
    
    // Show notification about status change
    toast.success('📞 Session ended - Status changed back to Available');
  };

  // Call action handlers
  const handleAcceptCall = (requestId?: string) => {
    const callToAccept = requestId ? 
      incomingRequests.find(r => r.requestId === requestId) : 
      (incomingCall || incomingRequests[0]);
    
    if (callToAccept) {
      // Accept the call
      acceptCall(callToAccept.requestId);
      stopRinging();
      
      // AUTOMATICALLY change status to busy when accepting a call
      setCurrentStatus('busy');
      
      toast.success(`Accepted call from ${callToAccept.clientName} - Status changed to Busy`);
    }
  };

  const handleDeclineCall = (requestId?: string) => {
    const callToDecline = requestId ? 
      incomingRequests.find(r => r.requestId === requestId) : 
      (incomingCall || incomingRequests[0]);
    
    if (callToDecline) {
      declineCall(callToDecline.requestId);
      stopRinging();
      toast('Call declined', { icon: '📞' });
    }
  };

  const handleMuteRing = () => {
    setIsRingMuted(!isRingMuted);
    // The ringing hook will handle the mute logic
  };

  // Handle creating sample data for testing
  const handleCreateSampleData = async () => {
    try {
      setCreatingData(true);
      const response = await fetch('/api/interpreter/sample-sessions', {
        method: 'POST',
        credentials: 'include',
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        toast.success(`✅ Created ${result.data.created} sample sessions!`);
        // Refresh the page to show updated stats
        window.location.reload();
      } else {
        throw new Error(result.error || 'Failed to create sample data');
      }
    } catch (error: any) {
      console.error('Error creating sample data:', error);
      toast.error(`❌ ${error.message || 'Failed to create sample data'}`);
    } finally {
      setCreatingData(false);
    }
  };

  // Show video session if active
  if (inSession && sessionData) {
    return (
      <InterpreterRoom
        sessionId={sessionData.sessionId}
        userId={sessionData.userId}
        userType={sessionData.userType}
        userNames={sessionData.userNames}
        language={sessionData.language || 'Unknown'}
        sessionType={sessionData.sessionType || 'VRI'}
        sessionDetails={{
          sourceLanguage: sessionData.language || 'Unknown',
          targetLanguage: 'English', // Default target language
          urgency: 'normal',
          specialInstructions: sessionData.specialInstructions
        }}
        onSessionEnd={onSessionEnd}
        onError={(error) => {
          console.error('Session error:', error);
          alert(error);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background ${getStatusBgColor(currentStatus)}`}></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile.firstName}!</h1>
              <p className="text-muted-foreground">Interpreter Dashboard • ID: {interpreterIdDisplay}</p>
              <div className="flex items-center gap-2 mt-1">
                <CircleDot className={`h-4 w-4 ${getStatusColor(currentStatus)}`} />
                <span className="text-sm font-medium capitalize">{currentStatus}</span>
                <Badge 
                  variant={profile.status === 'ACTIVE' ? 'default' : 'secondary'}
                  className={`ml-2 ${profile.status === 'ACTIVE' ? 'bg-green-600' : ''}`}
                >
                  {profile.status}
                </Badge>
                {profile.isVerified && (
                  <Badge variant="outline" className="ml-1">
                    ✓ Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/interpreter-portal/myaccount" className="flex items-center">
                <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
                Account
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="border-2">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 md:p-3 rounded-full">
                  <Calendar className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold">{stats.today.sessions}</p>
                  <p className="text-xs text-muted-foreground">Today's Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 md:p-3 rounded-full">
                  <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold">${stats.thisMonth.earnings || 0}</p>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 md:p-3 rounded-full">
                  <Star className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold">{stats.rating || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 md:p-3 rounded-full">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold">{stats.completionRate || 0}%</p>
                  <p className="text-xs text-muted-foreground">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Status Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Status Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={currentStatus === 'available' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentStatus('available')}
                    className={`flex items-center justify-center ${currentStatus === 'available' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  >
                    <CircleDot className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>Available</span>
                  </Button>
                  <Button 
                    variant={currentStatus === 'break' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentStatus('break')}
                    className={`flex items-center justify-center ${currentStatus === 'break' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
                  >
                    <Coffee className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>Break</span>
                  </Button>
                  <Button 
                    variant={currentStatus === 'busy' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentStatus('busy')}
                    className={`flex items-center justify-center ${currentStatus === 'busy' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                  >
                    <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>Busy</span>
                  </Button>
                  <Button 
                    variant={currentStatus === 'offline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentStatus('offline')}
                    className={`flex items-center justify-center ${currentStatus === 'offline' ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
                  >
                    <Home className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>Offline</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">({sessionStats.rating})</span>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Sessions:</span>
                    <span className="font-medium">{sessionStats.totalSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">This Week:</span>
                    <span className="font-medium">{sessionStats.thisWeek.sessions} sessions</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weekly Earnings:</span>
                    <span className="font-medium text-green-600">${sessionStats.thisWeek.earnings}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/interpreter-portal/myaccount" className="flex items-center justify-center">
                      <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Auto Accept</span>
                  <Switch 
                    checked={autoAccept} 
                    onCheckedChange={handleAutoAcceptToggle}
                    disabled={currentStatus !== 'available'}
                  />
                </div>
                {currentStatus !== 'available' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Set status to "Available" to enable auto accept
                  </p>
                )}
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/interpreter-portal/reports" className="flex items-center justify-start">
                    <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                    Session Reports
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/interpreter-portal/analytics" className="flex items-center justify-start">
                    <BarChart3 className="h-4 w-4 mr-2 flex-shrink-0" />
                    Analytics
                  </Link>
                </Button>
                {/* Sample Data Creation for Testing */}
                {sessionStats.totalSessions === 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">For Testing:</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full justify-start text-xs" 
                      onClick={handleCreateSampleData}
                      disabled={creatingData}
                    >
                      {creatingData ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Target className="h-3 w-3 mr-2 flex-shrink-0" />
                          Create Sample Data
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Connection Status */}
            {interpreterData && (
              <Card className={`border-2 ${isConnected ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CircleDot className={`h-4 w-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
                    <span className="text-sm font-medium">
                      {isConnected ? 'Connected to call system' : 'Disconnected from call system'}
                    </span>
                    {currentStatus === 'available' && isConnected && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Ready for calls
                      </Badge>
                    )}
                  </div>
                  {!isConnected && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Reconnecting... You may not receive calls while disconnected.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Upcoming Sessions
                    </CardTitle>
                    <CardDescription>Your scheduled interpretation sessions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No upcoming sessions scheduled</p>
                  <p className="text-sm text-muted-foreground">New sessions will appear here when clients book you</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Completed Sessions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Recent Sessions
                    </CardTitle>
                    <CardDescription>Your latest completed sessions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/interpreter-portal/reports" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                      View All
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingRecentSessions ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading recent sessions...</p>
                  </div>
                ) : recentSessions.length > 0 ? (
                  <div className="space-y-4">
                    {recentSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border bg-green-50/30">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{session.client}</p>
                            <p className="text-sm text-muted-foreground">
                              {session.language} • {session.duration} • {new Date(session.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">{session.earnings}</p>
                          <div className="flex items-center gap-1">
                            {session.rating ? [...Array(session.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            )) : (
                              <span className="text-xs text-muted-foreground">No rating</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No recent sessions found</p>
                    <p className="text-sm text-muted-foreground">Completed sessions will appear here after you finish your first interpretation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Full-Screen Incoming Call Modal */}
      <IncomingCallModal
        isVisible={isRinging && !!incomingCall}
        callRequest={incomingCall}
        timeLeft={incomingCall?.timeLeft || 0}
        onAccept={() => handleAcceptCall()}
        onDecline={() => handleDeclineCall()}
        onMute={handleMuteRing}
        isMuted={isRingMuted}
      />
    </div>
  );
}
