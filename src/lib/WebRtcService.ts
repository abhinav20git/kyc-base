
import { io } from 'socket.io-client';

const BACKEND_URL = 'https://kcx21158-3001.inc1.devtunnels.ms';

class WebRTCService {
  isInitiator: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  socket: any;
  room: string | null;
  callbacks: { [key: string]: any };
  user: any;
  reconnectAttempts: any;
  maxReconnectAttempts: string | 3;
  isReconnecting: boolean;
  
  constructor() {
    this.isInitiator = false;
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
    this.socket = null;
    this.room = null;
    this.callbacks = {};
    this.user = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.isReconnecting = false;
  }

  async initialize(room, user, isCustomer = true) {
    this.room = room;
    this.user = user;
    this.isInitiator = !isCustomer; 
    this.reconnectAttempts = 0;
    try {
      await this.connectToSignalingServer();
      await this.getUserMedia();
      this.createPeerConnection();
      
   
      this.socket.emit('join-session', {
        sessionId: room,
        user: this.user
      });

      return Promise.resolve();
    } catch (error) {
      console.error('WebRTC initialization failed:', error);
      throw error;
    }
  }

  async connectToSignalingServer() {
    return new Promise((resolve, reject) => {
      try {
        // Try to connect to actual sockio server
        if (typeof io !== 'undefined') {
          this.socket = io(BACKEND_URL, {
            transports: ['websocket', 'polling']
          });
        } else {
          // Fallback: simulate socket for demo
          console.warn('Socket.IO not available, using simulation');
          this.socket = this.createMockSocket();
        }
        
        this.socket.on('connect', () => {
          console.log('Connected to signaling server');
          this.callbacks.onServerConnected?.(true);
          this.setupSignalingHandlers();
          this.reconnectAttempts = 0;
          resolve(undefined);
        });

        this.socket.on('connect_error', (error) => {
          console.warn('Socket connection failed, using simulation:', error);
          this.socket = this.createMockSocket();
          this.setupSignalingHandlers();
          this.callbacks.onServerConnected?.(false);
          resolve(undefined);
        });

        this.socket.on('disconnect', () => {
          console.log('Disconnected from signaling server');
          this.callbacks.onServerConnected?.(false);
          if (!this.isReconnecting && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnection();
          }
        });

      } catch (error) {
        console.error('Failed to connect to signaling server:', error);
        reject(error);
      }
    });
  }

  async attemptReconnection() {
    if (this.isReconnecting) return;
    
    this.isReconnecting = true;
    this.reconnectAttempts++;
    
    console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    this.callbacks.onConnectionStateChange?.('reconnecting');

    try {
  
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }

   
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reinitialize
      await this.connectToSignalingServer();
      this.createPeerConnection();
      
      // Rejoin session
      this.socket.emit('rejoin-session', {
        sessionId: this.room,
        user: this.user
      });

    } catch (error) {
      console.error('Reconnection failed:', error);
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => this.attemptReconnection(), 5000);
      } else {
        this.callbacks.onConnectionStateChange?.('failed');
      }
    } finally {
      this.isReconnecting = false;
    }
  }

  createMockSocket() {
    const mockSocket: any = {
      connected: true,
      emit: (event, data) => {
        console.log('Mock socket emit:', event, data);
        

        if (event === 'join-session'  || event === 'rejoin-session') {
          setTimeout(() => {
            this.simulateUserJoined();
          }, 1000);
        } else if (event === 'webrtc-signal') {
          setTimeout(() => {
            this.simulateSignalResponse(data.signal);
          }, 500);
        }
      },
      on: (event, handler) => {
        console.log('Mock socket on:', event);
        mockSocket[`_${event}`] = handler;
      },
      disconnect: () => {
        console.log('Mock socket disconnected');
        mockSocket.connected = false;
      }
    };

    // Simulate connection
    setTimeout(() => {
      if (typeof mockSocket._connect === 'function') mockSocket._connect();
    }, 100);

    return mockSocket;
  }

  simulateUserJoined() {
    const remoteUser = {
      userId: this.user.role === 'customer' ? 'agent-demo' : 'customer-demo',
      name: this.user.role === 'customer' ? 'Demo Agent' : 'Demo Customer',
      role: this.user.role === 'customer' ? 'agent' : 'customer'
    };

    if (this.socket['_user-joined']) {
      this.socket['_user-joined']({
        user: remoteUser,
        timestamp: new Date().toISOString()
      });
    }

    // Start WebRTC negotiation
    if (this.isInitiator) {
      setTimeout(() => this.createOffer(), 1000);
    }
  }

  simulateSignalResponse(signal) {
    if (signal.type === 'offer' && !this.isInitiator) {
      // Customer receives offer, creates answer
      setTimeout(() => {
        this.createAnswer(signal);
        // Customer also simulates remote stream after creating answer
        setTimeout(() => {
          this.callbacks.onConnectionStateChange?.('connected');
          this.simulateRemoteStream();
        }, 1000);
      }, 500);
    } else if (signal.type === 'answer' && this.isInitiator) {
      // Agent receives answer
      this.peerConnection?.setRemoteDescription(signal);
      setTimeout(() => {
        this.callbacks.onConnectionStateChange?.('connected');
        this.simulateRemoteStream();
      }, 1000);
    }
  }

  simulateRemoteStream() {
  navigator.mediaDevices.getUserMedia({
    video: { width: 320, height: 240 },
    audio: true  
  }).then(stream => {

    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 320;
    canvas.height = 240;
    
    const drawFrame = () => {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();
      requestAnimationFrame(drawFrame);
    };
    
    video.onplaying = () => drawFrame();
    
    // Get manipulated video stream
    const videoStream = canvas.captureStream(30);
    
    // Create combined stream with original audio
    const mockStream = new MediaStream();
    
    // Add manipulated video
    videoStream.getVideoTracks().forEach(track => {
      mockStream.addTrack(track);
    });
 
    stream.getAudioTracks().forEach(track => {
      mockStream.addTrack(track);
    });
    
    this.remoteStream = mockStream;
    this.callbacks.onRemoteStream?.(mockStream);
    
    
    
  }).catch(console.error);
}
  
  
  setupSignalingHandlers() {
  this.socket.on('user-joined', (data) => {
    console.log('User joined:', data.user);
    this.callbacks.onUserJoined?.(data.user);
    
    // Start WebRTC negotiation if we're the initiator
    if (this.isInitiator) {
      setTimeout(() => this.createOffer(), 1000);
    }
  });

  
  this.socket.on('user-rejoined', (data) => {
    console.log('User rejoined:', data.user);
    this.callbacks.onUserJoined?.(data.user);
    
  
    if (this.peerConnection) {
      this.peerConnection.close();
      this.createPeerConnection();
    }
  });

  this.socket.on('user-left', (data) => {
    console.log('User left:', data.userId);
    this.callbacks.onUserLeft?.(data.userId);
  });

  this.socket.on('webrtc-signal', async (data) => {
    console.log('Received WebRTC signal:', data.signal.type);
    await this.handleSignalingMessage(data.signal);
  });

  this.socket.on('recording-status-update', (data) => {
    this.callbacks.onRecordingStatusUpdate?.(data);
  });

  this.socket.on('verification-completed', (data) => {
    this.callbacks.onVerificationCompleted?.(data);
  });
}
async handleSignalingMessage(signal) {
    try {
      if (!this.peerConnection) {
        console.warn('No peer connection available, recreating...');
        this.createPeerConnection();
      }
      if (signal.type === 'offer') {
        await this.peerConnection.setRemoteDescription(signal);
        await this.createAnswer();
      } else if (signal.type === 'answer') {
        await this.peerConnection.setRemoteDescription(signal);
      } else if (signal.type === 'ice-candidate') {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }
    } catch (error) {
      console.error('Error handling signaling message:', error);
      // Attempt to recover
      if (error.name === 'InvalidStateError') {
        console.log('Attempting to recover from invalid state...');
        this.createPeerConnection();
      }
    }
  }

  async createOffer() {
    try {
      if (!this.peerConnection) {
        this.createPeerConnection();
      }
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      this.sendSignalingMessage({
        type: 'offer',
        sdp: offer.sdp
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  async createAnswer(offerSignal = null) {
    try {
      if (!this.peerConnection) {
        this.createPeerConnection();
      }
      if (offerSignal) {
        await this.peerConnection.setRemoteDescription(offerSignal);
      }
      
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      
      this.sendSignalingMessage({
        type: 'answer',
        sdp: answer.sdp
      });
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  }

async getUserMedia() {
  try {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100,
        channelCount: 2,    
      }
    });

    console.log('Local stream created with tracks:', 
      this.localStream.getTracks().map(track => 
        `${track.kind}: ${track.enabled} (${track.readyState})`
      )
    );

    this.callbacks.onLocalStream?.(this.localStream);
  } catch (error) {
    console.error('Error accessing media devices:', error);
    // Try with simpler constraints
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      console.log('Fallback stream created');
      this.callbacks.onLocalStream?.(this.localStream);
    } catch (fallbackError) {
      console.error('Fallback media access failed:', fallbackError);
      throw fallbackError;
    }
  }
}
  createPeerConnection() {
  const config = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  if (this.peerConnection) {
    this.peerConnection.close();
  }

  this.peerConnection = new RTCPeerConnection(config);


  if (this.localStream) {
    this.localStream.getTracks().forEach(track => {
      console.log('Adding local track:', track.kind, track.enabled);
      this.peerConnection.addTrack(track, this.localStream);
    });
  }

  
  this.peerConnection.ontrack = (event) => {
    console.log('Received remote track:', event.track.kind, event.track.enabled);
    
    if (!this.remoteStream) {
      this.remoteStream = new MediaStream();
      this.callbacks.onRemoteStream?.(this.remoteStream);
    }
    

    this.remoteStream.addTrack(event.track);
    
    this.callbacks.onRemoteStream?.(this.remoteStream);
  };

  // Rest of the method remains the same...
  this.peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      this.sendSignalingMessage({
        type: 'ice-candidate',
        candidate: event.candidate
      });
    }
  };

  this.peerConnection.onconnectionstatechange = () => {
    const state = this.peerConnection.connectionState;
    console.log('Connection state changed:', state);
    this.callbacks.onConnectionStateChange?.(state);
  };

  this.peerConnection.oniceconnectionstatechange = () => {
    const state = this.peerConnection.iceConnectionState;
    console.log('ICE connection state changed:', state);
    
    if (state === 'connected' || state === 'completed') {
      this.callbacks.onConnectionStateChange?.('connected');
    } else if (state === 'failed' || state === 'disconnected') {
      this.callbacks.onConnectionStateChange?.('failed');
      setTimeout(() => {
        if (this.peerConnection && this.peerConnection.connectionState === 'failed') {
          this.restartIce();
        }
      }, 2000);
    }
  };
}

  async restartIce() {
    try {
      console.log('Restarting ICE...');
      if (this.isInitiator) {
        const offer = await this.peerConnection.createOffer({ iceRestart: true });
        await this.peerConnection.setLocalDescription(offer);
        this.sendSignalingMessage({
          type: 'offer',
          sdp: offer.sdp
        });
      }
    } catch (error) {
      console.error('ICE restart failed:', error);
    }
  }

  sendSignalingMessage(signal) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('webrtc-signal', {
        sessionId: this.room,
        signal,
        from: this.user.userId
      });
    }
  }

  toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  notifyRecordingStatus(isRecording) {
    if (this.socket) {
      this.socket.emit('recording-status', {
        sessionId: this.room,
        isRecording,
        userId: this.user.userId
      });
    }
  }

  on(event, callback) {
    this.callbacks[event] = callback;
  }

  disconnect() {
    this.isReconnecting = false;
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
      this.remoteStream = null;
    }
    
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    if (this.socket) {
      this.socket.emit('leave-session', {
        sessionId: this.room,
        userId: this.user.userId
      });
      this.socket.disconnect();
      this.socket = null;
    }
    this.callbacks = {};
  }
}

export default WebRTCService;