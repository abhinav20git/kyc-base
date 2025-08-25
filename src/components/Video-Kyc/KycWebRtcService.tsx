
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff,
  Shield,
  CheckCircle,
  User,
  Settings,
  Circle,
  Square,
  Users,
  Wifi,
  WifiOff
} from 'lucide-react';
import WebRTCService from '@/lib/WebRtcService';
import AgentChecklist from './AgentCheckList';



const BACKEND_URL = 'https://kcx21158-3001.inc1.devtunnels.ms';


const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (userId, role, name) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role, name })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        return data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      const mockUser = { userId, role, name };
      const mockToken = 'mock-token-' + Date.now();
      setUser(mockUser);
      setToken(mockToken);
      return { user: mockUser, token: mockToken };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return { user, token, login, logout };
};

const KYCWebRTCSystem = () => {
  const { user, token, login, logout } = useAuth();
  const [role, setRole] = useState('customer');
  const [sessionId, setSessionId] = useState('demo-session-1');
  const [userName, setUserName] = useState('');
  const [connectionState, setConnectionState] = useState('disconnected');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [checklistResults, setChecklistResults] = useState(null);
  const [remoteUser, setRemoteUser] = useState(null);
  const [isConnectedToServer, setIsConnectedToServer] = useState(false);
  const [isVideoKYCStarted, setIsVideoKYCStarted] = useState(false)

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const webrtcService = useRef(new WebRTCService());
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const checkAudioTracks = () => {
    const localVideo = localVideoRef.current;
    const remoteVideo = remoteVideoRef.current;
    
    if (localVideo && localVideo.srcObject) {
      const localAudio = localVideo.srcObject.getAudioTracks();
      console.log('Local audio tracks:', localAudio.length, 
        localAudio.map(t => ({ enabled: t.enabled, muted: t.muted })));
    }
    
    if (remoteVideo && remoteVideo.srcObject) {
      const remoteAudio = remoteVideo.srcObject.getAudioTracks();
      console.log('Remote audio tracks:', remoteAudio.length,
        remoteAudio.map(t => ({ enabled: t.enabled, muted: t.muted })));
    }
  };

  const debugButton = (
    <Button onClick={checkAudioTracks} size="sm" variant="outline">
      Check Audio
    </Button>
  );

  useEffect(() => {
    if (sessionStarted && user) {
      initializeWebRTC();
    }
    
    return () => {
      webrtcService.current.disconnect();
    };
  }, [sessionStarted, user]);

  const initializeWebRTC = async () => {
    try {
      setConnectionState('connecting');
      
      webrtcService.current.on('onLocalStream', (stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      });

      webrtcService.current.on('onRemoteStream', (stream) => {
        if (remoteVideoRef.current) {
          
          remoteVideoRef.current.srcObject = null;
          
          if (stream) {
            remoteVideoRef.current.srcObject = stream;
           
            remoteVideoRef.current.play().catch(console.error);
          }
        }
      });

      webrtcService.current.on('onConnectionStateChange', (state) => {
        setConnectionState(state);
      });

      webrtcService.current.on('onServerConnected', (connected) => {
        setIsConnectedToServer(connected);
      });

      webrtcService.current.on('onUserJoined', (joinedUser) => {
        console.log(joinedUser)
        setRemoteUser(joinedUser);
      });

      webrtcService.current.on('onUserLeft', (userId) => {
        if (remoteUser?.userId === userId) {
          setRemoteUser(null);
        }
      });

      webrtcService.current.on('onVerificationCompleted', (results) => {
        setVerificationComplete(true);
        setChecklistResults(results.checklist);
      });

      await webrtcService.current.initialize(
        sessionId,
        user,
        role === 'customer'
      );
      
    } catch (error) {
      console.error('Failed to initialize WebRTC:', error);
      setConnectionState('failed');
    }
  };

  const handleLogin = async () => {
    if (!userName.trim()) return;
    
    try {
      const userId = `${role}-${Date.now()}`;
      await login(userId, role, userName);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const startSession = async () => {
    if (!sessionId.trim()) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId })
      });
      
      if (response.ok || true) { // Allow demo to proceed even if backend unavailable
        setSessionStarted(true);
      }
    } catch (error) {
      console.error('Failed to start session:', error);
      // For demo, proceed anyway
      setSessionStarted(true);
    }
  };

  const endSession = () => {
    if (isRecording) {
      stopRecording();
    }
    webrtcService.current.disconnect();
    setSessionStarted(false);
    setConnectionState('disconnected');
    setRemoteUser(null);
    setVerificationComplete(false);
    setIsConnectedToServer(false);
    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const toggleVideo = () => {
    const newState = !isVideoEnabled;
    setIsVideoEnabled(newState);
    webrtcService.current.toggleVideo(newState);
  };

  const toggleAudio = () => {
    const newState = !isAudioEnabled;
    setIsAudioEnabled(newState);
    webrtcService.current.toggleAudio(newState);
  };

  const startRecording = async () => {
    try {
      const stream = localVideoRef.current?.srcObject;
      if (stream) {
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9'
        });
        recordedChunks.current = [];
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.current.push(event.data);
          }
        };
        
        mediaRecorderRef.current.start(1000);
        setIsRecording(true);
        
        webrtcService.current.notifyRecordingStatus(true);
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      webrtcService.current.notifyRecordingStatus(false);
      
      setTimeout(() => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kyc-session-${sessionId}-${Date.now()}.webm`;
        a.click();
      }, 1000);
    }
  };

  const handleChecklistSubmit = (results) => {
    setChecklistResults(results);
    setVerificationComplete(true);
  };

  const getConnectionStatusColor = () => {
    switch (connectionState) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionState) {
      case 'connected': return <Wifi className="h-4 w-4" />;
      case 'connecting': return <Settings className="h-4 w-4 animate-spin" />;
      case 'failed': return <WifiOff className="h-4 w-4" />;
      default: return <WifiOff className="h-4 w-4" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionState) {
      case 'reconnecting': return 'Reconnecting';
      default: return connectionState;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-6 w-6 mr-2 text-blue-600" />
              KYC Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Select Role</label>
              <div className="flex space-x-2">
                <Button
                  variant={role === 'customer' ? 'default' : 'outline'}
                  onClick={() => setRole('customer')}
                  className="flex-1"
                >
                  <User className="h-4 w-4 mr-2" />
                  Customer
                </Button>
                <Button
                  variant={role === 'agent' ? 'default' : 'outline'}
                  onClick={() => setRole('agent')}
                  className="flex-1"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Agent
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={handleLogin} 
              className="w-full"
              disabled={!userName.trim()}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if(!isVideoKYCStarted){
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">KYC Video Verification</h1>
              <p className="text-sm text-gray-600">
                {user.name} ({user.role}) {sessionStarted && `- Session: ${sessionId}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getConnectionStatusIcon()}
              <div className={`w-3 h-3 rounded-full ${getConnectionStatusColor()}`}></div>
              <span className="text-sm capitalize">{getConnectionStatusText()}</span>
            </div>
            
            {remoteUser && (
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                {remoteUser.name}
              </Badge>
            )}
            
            {role === 'agent' && isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                <Circle className="h-3 w-3 mr-1 fill-current" />
                Recording
              </Badge>
            )}
            
            <Button variant="ghost" onClick={logout} size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {!sessionStarted ? (
        <div className="max-w-md mx-auto mt-20 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Join KYC Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Session ID</label>
                <Input
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Enter session ID"
                />
              </div>
              
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Name:</strong> {user.name}</p>
              </div>
              
              <Button 
                onClick={startSession} 
                className="w-full"
                disabled={!sessionId.trim()}
              >
                <Video className="h-4 w-4 mr-2" />
                {role === 'agent' ? 'Start Session' : 'Join Session'}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      {role === 'customer' ? 'Agent' : 'Customer'} Video
                    </div>
                    {remoteUser && (
                      <Badge variant="outline">{remoteUser.name}</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {connectionState !== 'connected' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <div className="text-center text-white">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                          <p className="mb-2">
                            {connectionState === 'connecting' ? 'Connecting...' : 'Waiting for participant'}
                          </p>
                          <p className="text-sm text-gray-300">
                            {isConnectedToServer ? 'Connected to server' : 'Connecting to server'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Video className="h-5 w-5 mr-2" />
                      Your Video
                    </div>
                    <Badge variant="outline">{user.name}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {!isVideoEnabled && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <VideoOff className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={toggleVideo}
                  variant={isVideoEnabled ? "default" : "destructive"}
                  size="lg"
                >
                  {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
                
                <Button
                  onClick={toggleAudio}
                  variant={isAudioEnabled ? "default" : "destructive"}
                  size="lg"
                >
                  {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>

                {role === 'agent' && (
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    variant={isRecording ? "destructive" : "default"}
                    size="lg"
                    disabled={connectionState !== 'connected'}
                  >
                    {isRecording ? (
                      <>
                        <Square className="h-5 w-5 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Circle className="h-5 w-5 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                )}

                <Button onClick={endSession} variant="destructive" size="lg">
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Connection Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Server</span>
                    <Badge variant={isConnectedToServer ? "default" : "destructive"}>
                      {isConnectedToServer ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Peer Connection</span>
                    <Badge variant={connectionState === 'connected' ? "default" : "secondary"}>
                      {connectionState}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Participant</span>
                    <Badge variant={remoteUser ? "default" : "secondary"}>
                      {/* {remoteUser ? 'Joined' : 'Waiting'} */}
                   </Badge>
                  </div>
                </CardContent>
              </Card>

              {role === 'agent' && !verificationComplete && (
                <AgentChecklist
                  onSubmit={handleChecklistSubmit}
                  disabled={connectionState !== 'connected' || !remoteUser}
                  sessionId={sessionId}
                  token={token}
                />
              )}

              {verificationComplete && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      Verification Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {checklistResults?.map(item => (
                        <div key={item.id} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{item.item}</span>
                            <Badge variant={item.status ? "default" : "destructive"}>
                              {item.status ? "Pass" : "Fail"}
                            </Badge>
                          </div>
                          {item.notes && (
                            <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      ))}
                      
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Overall Result:</span>
                          <Badge 
                            variant={checklistResults?.every(item => item.status) ? "default" : "destructive"}
                            className="text-sm"
                          >
                            {checklistResults?.every(item => item.status) ? "APPROVED" : "REJECTED"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {role === 'customer' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <div className="space-y-2">
                      <p className="font-medium">Before starting:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Have your government-issued ID ready</li>
                        <li>• Ensure good lighting on your face</li>
                        <li>• Find a quiet location</li>
                        <li>• Check your camera and microphone</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium">During verification:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Follow the agent's instructions</li>
                        <li>• Speak clearly when requested</li>
                        <li>• Hold your ID document steady</li>
                        <li>• Look directly at the camera</li>
                      </ul>
                    </div>
                    
                    {verificationComplete && (
                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm font-medium text-blue-800">
                          ✓ Verification process completed
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          You will receive the results via email shortly.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Session Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Session ID:</span>
                    <span className="font-mono">{sessionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Role:</span>
                    <span className="capitalize">{user.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Video:</span>
                    <span className={isVideoEnabled ? 'text-green-600' : 'text-red-600'}>
                      {isVideoEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audio:</span>
                    <span className={isAudioEnabled ? 'text-green-600' : 'text-red-600'}>
                      {isAudioEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {role === 'agent' && (
                    <div className="flex justify-between">
                      <span>Recording:</span>
                      <span className={isRecording ? 'text-red-600' : 'text-gray-600'}>
                        {isRecording ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCWebRTCSystem;