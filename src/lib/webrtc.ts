// Free WebRTC Implementation - No third-party services required
export class WebRTCManager {
  private localConnection: RTCPeerConnection | null = null;
  private remoteConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private dataChannel: RTCDataChannel | null = null;
  
  // Free STUN servers (Google's public STUN servers)
  private readonly iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun.stunprotocol.org:3478' },
    { urls: 'stun:stun.softjoys.com' }
  ];

  constructor(
    private onRemoteStream: (stream: MediaStream) => void,
    private onDataChannelMessage: (message: string) => void,
    private onConnectionStateChange: (state: RTCPeerConnectionState) => void
  ) {}

  async initializeConnection(isInitiator: boolean = false): Promise<void> {
    try {
      // Create peer connection
      this.localConnection = new RTCPeerConnection({
        iceServers: this.iceServers
      });

      // Set up event listeners
      this.setupConnectionEventListeners();

      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Add local stream to connection
      this.localStream.getTracks().forEach(track => {
        if (this.localConnection) {
          this.localConnection.addTrack(track, this.localStream!);
        }
      });

      // Create data channel for chat (only initiator creates it)
      if (isInitiator) {
        this.createDataChannel();
      }

    } catch (error) {
      console.error('Failed to initialize WebRTC connection:', error);
      throw new Error('Could not access camera/microphone');
    }
  }

  private setupConnectionEventListeners(): void {
    if (!this.localConnection) return;

    // Handle remote stream
    this.localConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      this.onRemoteStream(remoteStream);
    };

    // Handle connection state changes
    this.localConnection.onconnectionstatechange = () => {
      if (this.localConnection) {
        this.onConnectionStateChange(this.localConnection.connectionState);
      }
    };

    // Handle incoming data channel
    this.localConnection.ondatachannel = (event) => {
      const channel = event.channel;
      channel.onmessage = (event) => {
        this.onDataChannelMessage(event.data);
      };
    };

    // Handle ICE candidates (you'll need to exchange these via your signaling server)
    this.localConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send this candidate to the remote peer via your signaling mechanism
        this.onIceCandidate(event.candidate);
      }
    };
  }

  private createDataChannel(): void {
    if (!this.localConnection) return;

    this.dataChannel = this.localConnection.createDataChannel('chat', {
      ordered: true
    });

    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
    };

    this.dataChannel.onmessage = (event) => {
      this.onDataChannelMessage(event.data);
    };
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.localConnection) throw new Error('Connection not initialized');

    const offer = await this.localConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });

    await this.localConnection.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.localConnection) throw new Error('Connection not initialized');

    await this.localConnection.setRemoteDescription(offer);
    
    const answer = await this.localConnection.createAnswer();
    await this.localConnection.setLocalDescription(answer);
    
    return answer;
  }

  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.localConnection) throw new Error('Connection not initialized');
    
    await this.localConnection.setRemoteDescription(answer);
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.localConnection) throw new Error('Connection not initialized');
    
    await this.localConnection.addIceCandidate(candidate);
  }

  sendMessage(message: string): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(message);
    }
  }

  toggleVideo(): void {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  }

  toggleAudio(): void {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  }

  async startScreenShare(): Promise<void> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1920, height: 1080 },
        audio: true // Include system audio
      });

      // Replace video track with screen share
      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = this.localConnection?.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender && videoTrack) {
        await sender.replaceTrack(videoTrack);
      }

      // Handle screen share ending
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

    } catch (error) {
      console.error('Failed to start screen sharing:', error);
      throw new Error('Could not start screen sharing');
    }
  }

  async stopScreenShare(): Promise<void> {
    try {
      // Get camera stream again
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false // Don't replace audio
      });

      const videoTrack = cameraStream.getVideoTracks()[0];
      const sender = this.localConnection?.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender && videoTrack) {
        await sender.replaceTrack(videoTrack);
      }

    } catch (error) {
      console.error('Failed to stop screen sharing:', error);
    }
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  endCall(): void {
    // Stop all tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    // Close data channel
    if (this.dataChannel) {
      this.dataChannel.close();
    }

    // Close peer connection
    if (this.localConnection) {
      this.localConnection.close();
    }

    // Reset properties
    this.localConnection = null;
    this.localStream = null;
    this.dataChannel = null;
  }

  // This method would be called when ICE candidates are generated
  private onIceCandidate(candidate: RTCIceCandidate): void {
    // You need to implement signaling here
    // For now, we'll use the browser's localStorage as a simple signaling mechanism
    // In a real app, you'd send this via WebSocket or Socket.IO
    console.log('ICE Candidate generated:', candidate);
    
    // Simple localStorage signaling (for demo only)
    this.sendSignalingMessage('ice-candidate', candidate);
  }

  // Simple signaling using localStorage (replace with proper signaling server)
  private sendSignalingMessage(type: string, data: any): void {
    const message = {
      type,
      data,
      timestamp: Date.now()
    };
    
    localStorage.setItem('webrtc-signal-out', JSON.stringify(message));
    
    // Dispatch custom event for other windows to pick up
    window.dispatchEvent(new CustomEvent('webrtc-signal', { detail: message }));
  }

  // Listen for signaling messages (localStorage approach)
  startSignalingListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === 'webrtc-signal-out' && event.newValue) {
        const message = JSON.parse(event.newValue);
        this.handleSignalingMessage(message);
      }
    });

    // Also listen for custom events in same window
    window.addEventListener('webrtc-signal', (event: any) => {
      this.handleSignalingMessage(event.detail);
    });
  }

  private handleSignalingMessage(message: any): void {
    switch (message.type) {
      case 'ice-candidate':
        this.handleIceCandidate(message.data);
        break;
      case 'offer':
        this.handleOffer(message.data);
        break;
      case 'answer':
        this.handleAnswer(message.data);
        break;
    }
  }

  private async handleOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    const answer = await this.createAnswer(offer);
    this.sendSignalingMessage('answer', answer);
  }
}
