import { DocumentType } from "@/components/DocumentUpload";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "admin" | "user";
  profileImage?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UploadedFile = {
  file: File | null;
  type: DocumentType | null;
  preview: string | null;
}

// API Configuration
export const API_BASE = "https://981372dd1a73.ngrok-free.app/api/v1";

// Auth Routes
export const AUTH_REGISTER = `${API_BASE}/users/register`;
export const AUTH_LOGIN = `${API_BASE}/users/login`;
export const AUTH_LOGOUT = `${API_BASE}/users/logout`;
export const AUTH_REFRESH_TOKEN = `${API_BASE}/users/refresh-token`;

// User Profile & KYC
export const USER_PROFILE = `${API_BASE}/user/profile`;
export const USER_UPDATE_PROFILE = `${API_BASE}/user/profile`; // PUT
export const USER_KYC_STATUS = `${API_BASE}/user/kyc-status`;

// Document Upload & Verification
export const KYC_UPLOAD_ID = `${API_BASE}/kyc/upload-id`;
export const KYC_UPLOAD_ADDRESS_PROOF = `${API_BASE}/kyc/upload-address-proof`;
export const KYC_UPLOAD_SELFIE = `${API_BASE}/kyc/upload-selfie`;
export const KYC_GET_DOCUMENTS = `${API_BASE}/kyc/documents`;
export const KYC_DELETE_DOCUMENT = (id) => `${API_BASE}/kyc/document/${id}`;

// KYC Verification Process
export const KYC_START = `${API_BASE}/kyc/start`;
export const KYC_STATUS = `${API_BASE}/kyc/status`;
export const KYC_SUBMIT = `${API_BASE}/kyc/submit`;

// Admin Routes
export const ADMIN_KYC_PENDING = `${API_BASE}/admin/kyc-pending`;
export const ADMIN_KYC_DETAILS = (userId) => `${API_BASE}/admin/kyc/${userId}`;
export const ADMIN_KYC_APPROVE = (userId) => `${API_BASE}/admin/kyc/${userId}/approve`;
export const ADMIN_KYC_REJECT = (userId) => `${API_BASE}/admin/kyc/${userId}/reject`;

// Misc
export const SYSTEM_HEALTH = `${API_BASE}/system/health`;

// Token Storage Keys
export const TOKEN_STORAGE_KEY = "token";
export const REFRESH_TOKEN_STORAGE_KEY = "refreshToken";
export const USER_STORAGE_KEY = "user";

// API Response Types
export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// AWS rekognition
// Identity Pool ID

export const AWS_REGION = "ap-south-1"
export const Identity_Pool_Id = `${AWS_REGION}:5fa68ef7-5ba0-451d-8e61-b23e42480eba`;
export const Allow_Guest_Access = true

export interface LivenessResult {
  SessionId: string;
  Status: string;
  Confidence?: number;
  ReferenceImage?: {
    BoundingBox?: any;
    S3Object?: {
      Bucket: string;
      Name: string;
    };
    Bytes: string
  };
}

export interface ComparisonResult {
  isMatch: boolean;
  confidence: number;
  faceMatches: number;
  threshold: number;
}