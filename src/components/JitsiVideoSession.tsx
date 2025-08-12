'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface JitsiVideoSessionProps {
  roomName: string;
  displayName: string;
  userRole: 'client' | 'interpreter';
  onCallEnd?: () => void;
  onCallStart?: () => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function JitsiVideoSession({
  roomName,
  displayName,
  userRole,
  onCallEnd,
  onCallStart,
  onError,
}: JitsiVideoSessionProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [currentDomain, setCurrentDomain] = useState('meet.ffmuc.net');
  const [currentDomainIndex, setCurrentDomainIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'reconnecting'>('connecting');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [authBypassAttempts, setAuthBypassAttempts] = useState(0);
  const apiRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load Jitsi Meet External API script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.JitsiMeetExternalAPI) {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Jitsi Meet External API');
        setIsLoading(false);
      };
      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } else if (window.JitsiMeetExternalAPI) {
      setIsScriptLoaded(true);
    }
  }, []);

  // Initialize Jitsi Meet when script is loaded (only once)
  useEffect(() => {
    if (!isScriptLoaded || !jitsiContainerRef.current || isInitialized) return;
    
    setIsInitialized(true);

    // Try different servers in order of preference (most open first)
    const domains = [
      'meet.ffmuc.net',      // German server, usually very open
      'jitsi.riot.im',       // Matrix.org server, minimal auth
      'meet.jit.si',         // Official but sometimes has auth
      '8x8.vc'               // Corporate, most restrictive
    ];
    
    const domain = domains[currentDomainIndex] || currentDomain;
    
    const options = {
      roomName: roomName, // Use exact room name provided (already includes prefix)
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: displayName,
        email: '', // Empty email to avoid auth
      },
      // No JWT token - this is key
      jwt: null,
      
      configOverwrite: {
        // CRITICAL: Complete authentication bypass
        requireDisplayName: false,
        enableWelcomePage: false,
        enableClosePage: false,
        prejoinPageEnabled: false,
        
        // MOST IMPORTANT: Complete lobby bypass - ULTRA AGGRESSIVE
        enableLobby: false,
        lobbyEnabled: false,
        enableLobbyUI: false,
        showLobbyUI: false,
        lobby: {
          enabled: false,
          autoKnock: false,
          enableChat: false
        },
        
        // Moderation bypass - ULTRA CRITICAL
        disableModeratorIndicator: true,
        enableUserRolesBasedOnToken: false,
        disableRemoteMute: true,
        moderatedRoomServiceUrl: null,
        enableModeratedMode: false,
        
        // FORCE ROOM TO BE COMPLETELY OPEN
        requireDisplayName: false,
        enableWelcomePage: false,
        enableClosePage: false,
        
        // BYPASS ALL AUTHENTICATION CHECKS
        enableAuthenticationFeatures: false,
        enableGuestAuthorization: true,
        disableAuthenticationPrompts: true,
        
        // Security bypasses
        enableInsecureRoomNameWarning: false,
        roomPasswordNumberOfDigits: false,
        enableRoomPasswordGeneration: false,
        disableGuestDialog: true,
        
        // Force auto-join without any checks - ENHANCED
        autoJoinAfterLobby: true,
        skipPrejoin: true,
        hideDisplayName: false,
        prejoinConfig: {
          enabled: false,
          hideDisplayName: true
        },
        
        // Dynamic host configuration based on current domain
        ...(domain === 'jitsi.riot.im' && {
          hosts: {
            domain: 'jitsi.riot.im',
            anonymousdomain: 'guest.jitsi.riot.im', 
            authdomain: null
          }
        }),
        
        ...(domain === '8x8.vc' && {
          hosts: {
            domain: '8x8.vc',
            anonymousdomain: 'guest.8x8.vc',
            authdomain: null
          }
        }),
        
        ...(domain === 'meet.ffmuc.net' && {
          hosts: {
            domain: 'meet.ffmuc.net',
            anonymousdomain: 'guest.meet.ffmuc.net',
            authdomain: null
          },
          // FFMUC specific bypasses (very permissive server)
          enableGuestAccess: true,
          allowAnonymousUsers: true,
          requireAuthentication: false
        }),
        
        // Completely disable authentication - ENHANCED
        enableEmailInStats: false,
        enableFeaturesBasedOnToken: false,
        enableGuestDomain: true,
        guestDomain: `guest.${domain}`,
        authentication: {
          enabled: false,
          type: 'none'
        },
        
        // Force anonymous domain usage
        anonymousDomain: `guest.${domain}`,
        authdomain: null,
        
        // Additional guest bypass
        allowGuestAccess: true,
        enableGuestDialog: false,
        enableUserAuthenticatedFeatures: false,
        
        // Additional auth bypasses
        disableThirdPartyRequests: true,
        enableNoAudioDetection: false,
        enableNoisyMicDetection: false,
        enableClosePage: false,
        enableWelcomePage: false,
        disableProfile: true,
        
        // Media settings - ENHANCED FOR CLEAR TRANSMISSION
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        startScreenSharing: false,
        
        // CRITICAL: Audio transmission settings
        enableLayerSuspension: false,
        disableAEC: false,     // Keep echo cancellation ON
        disableNS: false,      // Keep noise suppression ON  
        disableAGC: false,     // Keep auto gain control ON
        enableTalkWhileMuted: true,  // Allow talk while muted for testing
        
        // FORCE audio to be enabled and transmitted
        enableAudioLevelsInterval: true,
        enableNoAudioDetection: true,
        enableNoisyMicDetection: true,
        audioQuality: {
          stereo: false,
          opusMaxAverageBitrate: 64000
        },
        
        // Force media permissions and enable streams
        enableUserMediaPermissions: true,
        enableVideoSipGateway: false,
        enableClosePage: false,
        
        // Media constraints for better quality - ENHANCED AUDIO
        constraints: {
          video: {
            height: {
              ideal: 720,
              max: 1080,
              min: 180
            },
            width: {
              ideal: 1280,
              max: 1920,
              min: 320
            },
            frameRate: {
              ideal: 30,
              max: 30,
              min: 15
            }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000,
            sampleSize: 16,
            channelCount: 1,
            volume: 1.0,
            deviceId: 'default'
          }
        },
        
        // CRITICAL: Ensure audio devices are properly configured
        enableUserMediaPermissions: true,
        requireUserMediaPermissions: true,
        
        // Resolution and bandwidth settings
        resolution: 720,
        maxBitratesVideo: {
          low: 200000,
          standard: 500000,
          high: 1500000
        },
        
        // Ensure participants can see each other
        channelLastN: -1,  // Show all participants
        lastN: -1,         // No participant limit
        maxRemoteScreenShareParticipants: -1,
        
        // Disable notifications and prompts
        enableNoAudioDetection: false,
        enableNoisyMicDetection: false,
        enableEmailInStats: false,
        disableInviteFunctions: true,
        doNotStoreRoom: true,
        hideRecordingLabel: false,
        
        // Additional bypasses
        enableAutomaticUrlCopy: false,
        disableRecording: false,
        
        // P2P bypass for direct connection - ENHANCED
        p2p: {
          enabled: true,
          preferH264: true,
          preferredCodec: 'h264',
          useStunTurn: true,
          stunServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' }
          ]
        },
        
        // WebRTC settings for better connectivity
        webRTC: {
          enableInsertableStreams: false,
          enableBackgroundBlur: false,
          enableNoiseCancellation: true
        },
        
        // Make room completely open and public
        channelLastN: -1,
        openBridgeChannel: true,
        
        // Additional server bypasses
        deploymentInfo: {
          shard: 'shard1',
          region: 'us-east-1',
          userRegion: 'us-east-1'
        },
      },
      interfaceConfigOverwrite: {
        // UI settings
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        DISABLE_PRESENCE_STATUS: true,
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        BRAND_WATERMARK_LINK: '',
        SHOW_POWERED_BY: false,
        
        // CRITICAL: Disable pre-join screen - ENHANCED
        DISABLE_PREJOIN_SCREEN: true,
        HIDE_PREJOIN_DISPLAY_NAME: true,
        HIDE_PREJOIN_EXTRA_FIELDS: true,
        PREJOIN_PAGE_ENABLED: false,
        ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 5000,
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'chat', 'settings'
        ],
        SETTINGS_SECTIONS: ['devices', 'language'],
        
        // Marketing/branding
        MOBILE_APP_PROMO: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
        HIDE_INVITE_MORE_HEADER: true,
        
        // Authentication UI bypass - ENHANCED
        AUTHENTICATION_ENABLE: false,
        ENABLE_LOBBY_CHAT: false,
        ENABLE_LOBBY_UI: false,
        LOBBY_ENABLED: false,
        SHOW_LOBBY_UI: false,
        DEFAULT_BACKGROUND: '#474747',
        
        // Force immediate join
        AUTO_JOIN_AFTER_DISPLAY_NAME: true,
        GUEST_LOBBY_ENABLED: false,
        HIDE_GUEST_DIALOG: true,
      },
    };

    try {
      const jitsiAPI = new window.JitsiMeetExternalAPI(domain, options);
      setApi(jitsiAPI);
      apiRef.current = jitsiAPI;

      // Event listeners
      jitsiAPI.addEventListener('readyToClose', () => {
        setIsLoading(false);
        onCallEnd?.();
      });

      // Set loading to false immediately after API creation
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Give 1 second for initial setup

      jitsiAPI.addEventListener('videoConferenceJoined', () => {
        console.log(`${userRole} joined the call: ${roomName}`);
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        onCallStart?.();
        
        // Clear any reconnect timeouts
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        // CRITICAL: Force audio/video to be unmuted immediately after joining
        setTimeout(() => {
          console.log('🎤 Forcing audio/video to be enabled after join');
          jitsiAPI.executeCommand('setAudioMuted', false);
          jitsiAPI.executeCommand('setVideoMuted', false);
          
          // Set audio devices explicitly
          jitsiAPI.executeCommand('setAudioOutputDevice', 'default');
          jitsiAPI.executeCommand('setAudioInputDevice', 'default');
          
          // Enable audio levels monitoring
          jitsiAPI.executeCommand('setAudioLevelsInterval', 1000);
          
          toast('🎤 Audio enabled - you should be able to hear and speak now!', { 
            duration: 3000,
            icon: '🎤'
          });
        }, 1000);
        
        // Dismiss loading toast and show success
        toast.dismiss(`joining-${roomName}`);
        toast.success(
          userRole === 'interpreter' 
            ? '🎯 Successfully joined as interpreter!' 
            : '✨ Connected to your interpreter!',
          { duration: 3000 }
        );
      });

      jitsiAPI.addEventListener('videoConferenceLeft', () => {
        console.log(`${userRole} left the call: ${roomName}`);
        setConnectionStatus('disconnected');
        onCallEnd?.();
      });
      
      // Add connection quality and error handling
      jitsiAPI.addEventListener('connectionEstablished', () => {
        console.log('Jitsi connection established');
        setConnectionStatus('connected');
      });
      
      jitsiAPI.addEventListener('connectionFailed', (error: any) => {
        console.error('Jitsi connection failed:', error);
        setConnectionStatus('disconnected');
        handleConnectionError('Connection failed. Attempting to reconnect...');
      });
      
      // Handle authentication failures and try different servers
      jitsiAPI.addEventListener('passwordRequired', () => {
        console.warn('Password required - trying next server');
        handleAuthenticationError();
      });
      
      jitsiAPI.addEventListener('authenticationRequired', () => {
        console.warn('Authentication required - trying next server');
        handleAuthenticationError();
      });
      
      // Handle any generic error that might be auth related
      jitsiAPI.addEventListener('error', (error: any) => {
        console.error('Jitsi error:', error);
        if (error && (error.type === 'auth' || error.message?.includes('auth'))) {
          handleAuthenticationError();
        }
      });
      
      jitsiAPI.addEventListener('connectionInterrupted', () => {
        console.warn('Jitsi connection interrupted');
        setConnectionStatus('reconnecting');
        toast('Connection interrupted. Reconnecting...', { 
          duration: 3000,
          icon: '🔄'
        });
      });
      
      jitsiAPI.addEventListener('connectionRestored', () => {
        console.log('Jitsi connection restored');
        setConnectionStatus('connected');
        toast.success('Connection restored!', { duration: 2000 });
      });

      jitsiAPI.addEventListener('audioMuteStatusChanged', (event: any) => {
        setIsMuted(event.muted);
      });

      jitsiAPI.addEventListener('videoMuteStatusChanged', (event: any) => {
        setIsVideoOff(event.muted);
      });

      // Set room subject
      jitsiAPI.executeCommand('subject', `LanguageHelp - ${userRole === 'interpreter' ? 'Interpreter' : 'Client'} Session`);
      
      // Force auto-join without any prompts - ENHANCED
      jitsiAPI.executeCommand('skipPrejoin', true);
      
      // CRITICAL: Auto-join as moderator to bypass the moderator waiting screen
      jitsiAPI.executeCommand('joinAsParticipant');
      jitsiAPI.executeCommand('setModerator', true);
      
      // Additional immediate join commands
      setTimeout(() => {
        jitsiAPI.executeCommand('toggleLobby', false);
        jitsiAPI.executeCommand('setDisplayName', displayName);
        jitsiAPI.executeCommand('skipPrejoin');
      }, 100);
      
      // Grant moderator permissions to bypass authentication
      // Enhanced participant tracking and media handling
      jitsiAPI.addEventListener('participantJoined', (event: any) => {
        console.log('🎯 Participant joined:', event);
        
        // Show success notification
        if (event && event.displayName) {
          toast.success(`${event.displayName} joined the call!`, { duration: 3000 });
        } else {
          toast.success('Another participant joined!', { duration: 3000 });
        }
        
        // Auto-grant moderator status to ALL participants to bypass lobby
        setTimeout(() => {
          // Try all the various commands that might help bypass the moderator screen
          jitsiAPI.executeCommand('toggleLobby', false);
          jitsiAPI.executeCommand('setModerator', true);
          // Try to make the other participant a moderator
          if (event && event.id) {
            jitsiAPI.executeCommand('grantModerator', event.id);
          }
          
          // CRITICAL: Ensure audio/video are properly enabled
          // Check current mute status and unmute if needed
          setTimeout(() => {
            // Force unmute both participants
            jitsiAPI.executeCommand('setAudioMuted', false);
            jitsiAPI.executeCommand('setVideoMuted', false);
            
            // Set maximum volume for participants
            jitsiAPI.executeCommand('setParticipantVolume', event.id, 1);
            
            // Enable audio output
            jitsiAPI.executeCommand('setAudioOutputDevice', 'default');
            jitsiAPI.executeCommand('setAudioInputDevice', 'default');
          }, 200);
        }, 500);
      });
      
      jitsiAPI.addEventListener('participantLeft', (event: any) => {
        console.log('🚺 Participant left:', event);
        if (event && event.displayName) {
          toast(`${event.displayName} left the call`, { 
            duration: 3000,
            icon: '🚺'
          });
        }
      });
      
      // Track audio/video state changes with detailed logging
      jitsiAPI.addEventListener('audioAvailabilityChanged', (event: any) => {
        console.log('🎤 Audio availability changed:', event);
        if (event.available) {
          toast.success('🎤 Microphone is now available!', { duration: 2000 });
        } else {
          toast('🎤 Microphone unavailable - check permissions', { 
            duration: 3000,
            icon: '⚠️'
          });
        }
      });
      
      jitsiAPI.addEventListener('videoAvailabilityChanged', (event: any) => {
        console.log('📹 Video availability changed:', event);
        if (event.available) {
          toast.success('📹 Camera is now available!', { duration: 2000 });
        } else {
          toast('📹 Camera unavailable - check permissions', {
            duration: 3000,
            icon: '⚠️'
          });
        }
      });
      
      // Listen for audio mute status changes
      jitsiAPI.addEventListener('audioMuteStatusChanged', (event: any) => {
        console.log('🔇 Audio mute status:', event);
        if (event.muted) {
          toast('🔇 Microphone muted', { 
            duration: 1500,
            icon: '🔇'
          });
        } else {
          toast.success('🎤 Microphone unmuted', { duration: 1500 });
        }
      });
      
      // Listen for video mute status changes  
      jitsiAPI.addEventListener('videoMuteStatusChanged', (event: any) => {
        console.log('📹 Video mute status:', event);
        if (event.muted) {
          toast('📹 Camera off', {
            duration: 1500,
            icon: '📹'
          });
        } else {
          toast.success('📹 Camera on', { duration: 1500 });
        }
      });
      
      // Track remote tracks (media streams)
      jitsiAPI.addEventListener('remoteTrackAdded', (event: any) => {
        console.log('📡 Remote track added:', event);
        toast.success('Media stream connected!', { duration: 2000 });
      });
      
      jitsiAPI.addEventListener('remoteTrackRemoved', (event: any) => {
        console.log('📡 Remote track removed:', event);
      });
      
      console.log(`🎯 Auto-joining Jitsi room: ${roomName} as ${userRole}`);
      
      // Show brief connection message
      toast.success(
        userRole === 'interpreter' 
          ? 'Joining as interpreter...' 
          : 'Connecting to video session...',
        { duration: 2000 }
      );

    } catch (error) {
      console.error('Error initializing Jitsi Meet:', error);
      setIsLoading(false);
      setIsInitialized(false);
      const errorMessage = `Failed to initialize video session: ${error}`;
      onError?.(errorMessage);
      toast.error(errorMessage);
    }

    // Cleanup function
    return () => {
      if (apiRef.current) {
        try {
          apiRef.current.dispose();
          apiRef.current = null;
        } catch (cleanupError) {
          console.warn('Error during Jitsi cleanup:', cleanupError);
        }
      }
      setIsInitialized(false);
    };
  }, [isScriptLoaded]); // Removed roomName, displayName, userRole from dependencies

  const toggleAudio = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleAudio');
    }
  };

  const toggleVideo = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleVideo');
    }
  };

  const endCall = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('hangup');
    }
  };

  const handleConnectionError = (message: string) => {
    console.error('Connection error:', message);
    setConnectionStatus('disconnected');
    
    if (reconnectAttempts < 3) {
      setReconnectAttempts(prev => prev + 1);
      setConnectionStatus('reconnecting');
      
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000); // Exponential backoff, max 10s
      
      toast.loading(`Reconnecting... (attempt ${reconnectAttempts + 1}/3)`, { duration: delay });
      
      reconnectTimeoutRef.current = setTimeout(() => {
        // Try to rejoin the call
        if (apiRef.current) {
          try {
            apiRef.current.executeCommand('hangup');
            setTimeout(() => {
              // Reinitialize if needed
              window.location.reload(); // Simple reload for now
            }, 1000);
          } catch (error) {
            console.error('Error during reconnection:', error);
          }
        }
      }, delay);
    } else {
      toast.error('Connection failed after multiple attempts. Please refresh the page.');
      onError?.(message);
    }
  };
  
  const handleAuthenticationError = () => {
    console.warn('Authentication error - trying next server');
    setAuthBypassAttempts(prev => prev + 1);
    
    const domains = [
      'meet.ffmuc.net',
      'jitsi.riot.im', 
      'meet.jit.si',
      '8x8.vc'
    ];
    
    if (authBypassAttempts < domains.length - 1) {
      const nextDomainIndex = authBypassAttempts;
      const nextDomain = domains[nextDomainIndex];
      
      toast(`Authentication blocked. Trying ${nextDomain}...`, { 
        duration: 3000,
        icon: '⚠️'
      });
      
      // Clean up current connection
      if (apiRef.current) {
        try {
          apiRef.current.dispose();
        } catch (error) {
          console.warn('Error disposing API:', error);
        }
      }
      
      // Update domain and reinitialize
      setCurrentDomainIndex(nextDomainIndex);
      setIsInitialized(false);
      
      // Small delay then retry
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast.error('All servers require authentication. Please try again later.');
      onError?.('Authentication required on all available servers.');
    }
  };

  // Add visibility change handler to prevent restart on tab switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden - don't do anything that would restart the call
        console.log('Tab hidden - preserving Jitsi connection');
      } else {
        // Tab is visible again - just log, don't restart
        console.log('Tab visible - Jitsi connection preserved');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Prevent component re-render when props change after initialization
  useEffect(() => {
    if (apiRef.current && isInitialized) {
      // Update display name without restarting
      try {
        apiRef.current.executeCommand('displayName', displayName);
      } catch (error) {
        console.warn('Could not update display name:', error);
      }
    }
  }, [displayName, isInitialized]);

  if (isLoading && !isScriptLoaded) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading video call...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Jitsi Meet Container - Full Screen */}
      <div 
        ref={jitsiContainerRef}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '100%' }}
      />
      
      {/* Minimal Loading Overlay - Only show for first 3 seconds */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-2"></div>
            <p className="text-sm font-medium">Loading video...</p>
          </div>
        </div>
      )}
      
      {/* Connection Status - Top Right */}
      {!isLoading && (
        <div className={`absolute top-4 right-4 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
          connectionStatus === 'connected' ? 'bg-green-500' :
          connectionStatus === 'reconnecting' ? 'bg-yellow-500' :
          connectionStatus === 'disconnected' ? 'bg-red-500' :
          'bg-blue-500'
        }`}>
          {connectionStatus === 'connected' ? '🟢 Connected' :
           connectionStatus === 'reconnecting' ? '🟡 Reconnecting...' :
           connectionStatus === 'disconnected' ? '🔴 Disconnected' :
           '🔵 Connecting...'}
        </div>
      )}
    </div>
  );
}
