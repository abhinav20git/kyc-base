// Interface for face match response
export interface FaceMatchResponse {
  id: string;
  matchConfidence: number;
  livenessScore: number;
  status: 'MATCH_SUCCESS' | 'MATCH_FAILED' | 'LIVENESS_FAILED' | 'PROCESSING_ERROR';
  timestamp: string;
  selfieImageId: string;
  idImageId: string;
  fraudFlags: {
    spoofingDetected: boolean;
    lowQuality: boolean;
    multipleFaces: boolean;
    noFaceDetected: boolean;
  };
  metadata: {
    cameraInfo: string;
    userAgent: string;
    resolution: string;
    lighting: 'GOOD' | 'POOR' | 'ACCEPTABLE';
  };
}

// Interface for liveness detection challenge
export interface LivenessChallenge {
  type: 'BLINK' | 'SMILE' | 'HEAD_NOD' | 'HEAD_SHAKE';
  instruction: string;
  duration: number; // in seconds
  completed: boolean;
}

// Interface for camera constraints and settings
export interface CameraSettings {
  width: number;
  height: number;
  facingMode: 'user' | 'environment';
  frameRate: number;
}

// Interface for face detection result
export interface FaceDetection {
  detected: boolean;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  landmarks?: {
    leftEye: { x: number; y: number };
    rightEye: { x: number; y: number };
    nose: { x: number; y: number };
    mouth: { x: number; y: number };
  };
}

// Interface for selfie capture request
export interface SelfieCapture {
  imageData: string; // base64 encoded
  timestamp: string;
  cameraSettings: CameraSettings;
  livenessResults: LivenessChallenge[];
}

// Interface for face verification request
export interface FaceVerificationRequest {
  selfieCapture: SelfieCapture;
  idImageId: string; // From previous KYC step
  userId: string;
}

// Interface for camera access error
export interface CameraError {
  type: 'PERMISSION_DENIED' | 'DEVICE_NOT_FOUND' | 'CONSTRAINT_NOT_SATISFIED' | 'UNKNOWN_ERROR';
  message: string;
  code?: string;
}