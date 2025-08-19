import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, Camera, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadedFile } from '@/utils/constants';

export type DocumentType = 'pan' | 'aadhaar' | 'passport';

interface DocumentUploadProps {
  documentType: DocumentType;
  onFileUpload: (file: File, type: DocumentType) => void;
  uploadedFile?: UploadedFile;
  isProcessing?: boolean;
  isSuccess?: boolean;
}

const documentTypeLabels = {
  pan: 'PAN Card',
  aadhaar: 'Aadhaar Card',
  passport: 'Passport'
};

export function DocumentUpload({
  documentType,
  onFileUpload,
  uploadedFile,
  isProcessing,
  isSuccess,
}: DocumentUploadProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0], documentType);
    }
  }, [onFileUpload, documentType]);

  const startCamera = async (e) => {
    e.stopPropagation()
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      setStream(mediaStream);
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  useEffect(() => {
    if (showCamera && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [showCamera])

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    console.log(videoRef.current, canvasRef.current)
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `${documentType}-capture.jpg`, { type: 'image/jpeg' });
            onFileUpload(file, documentType);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const getStatusIcon = () => {
    if (isSuccess) return <CheckCircle className="w-8 h-8 text-success" />;
    if (isProcessing) return <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />;
    if (uploadedFile) return <FileText className="w-8 h-8 text-primary" />;
    return <Upload className="w-8 h-8 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (isSuccess) return 'Document processed successfully';
    if (isProcessing) return 'Processing...';
    if (uploadedFile) return uploadedFile.file?.name;
    return `Drop your ${documentTypeLabels[documentType]} here or click to browse`;
  };
  return (
    <Card className="relative overflow-hidden">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center p-8 border-2 border-dashed cursor-pointer transition-all duration-200",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          isSuccess && "border-success bg-success/5",
          isProcessing && "pointer-events-none"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-4 text-center">
          {getStatusIcon()}

          <div className="space-y-2">
            <h3 className="font-semibold text-card-foreground">
              {documentTypeLabels[documentType]}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {getStatusText()}
            </p>
          </div>

          {!uploadedFile.file && !isProcessing && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary">PNG</Badge>
                <Badge variant="secondary">JPG</Badge>
                <Badge variant="secondary">JPEG</Badge>
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={startCamera}
                  className="flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Take Photo
                </Button>
              </div>
            </div>
          )}
          {/* Image */}
          {
            uploadedFile.file?.type.startsWith('image/') && !isProcessing && isSuccess && (
              <div>
                <img src={uploadedFile.preview} alt="" />
              </div>
            )
          }
          {
            uploadedFile.file?.type == 'application/pdf' && !isProcessing && isSuccess && (
              <iframe
                src={uploadedFile.preview}
                className="w-full h-64"
                title="PDF Preview"
              ></iframe>
            )
          }
          {uploadedFile.file && !isProcessing && !isSuccess && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Change File
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={startCamera}
                className="flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Retake
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative bg-background rounded-lg overflow-hidden max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Capture {documentTypeLabels[documentType]}</h3>
              <Button variant="ghost" size="sm" onClick={stopCamera}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover"
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </div>

            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Position your {documentTypeLabels[documentType]} clearly in the frame
              </p>
              <Button onClick={capturePhoto} className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Capture Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}