// Interface for the raw OCR extraction response
export interface OcrExtractionResponse {
  id: string;
  documentType: 'PAN' | 'Aadhaar' | 'Passport';
  confidenceScore: number;
  extractedFields: {
    name: string;
    dateOfBirth: string; // ISO 8601 format: YYYY-MM-DD
    panNumber: string;
  };
  rawJsonResponse: string; // Stringified JSON for the "View Raw JSON" feature
  status: 'EXTRACTION_SUCCESS' | 'EXTRACTION_FAILURE';
}

// Interface for the payload to update corrected data
export interface UpdateKycDataPayload {
  name: string;
  dateOfBirth: string;
  panNumber: string;
}

// Interface for upload progress callback
export interface UploadProgressCallback {
  (progress: number): void;
}

// Interface for audit trail
export interface AuditTrail {
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

// Form validation schema types
export interface KycFormData {
  name: string;
  dateOfBirth: string;
  panNumber: string;
}