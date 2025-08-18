import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CameraCaptureProps {
  onCapture: (file: File, preview: string) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsReady(true);
      } catch (err) {
        console.error("Camera access denied:", err);
        onCancel();
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, [onCancel]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
          const preview = URL.createObjectURL(file);
          onCapture(file, preview);
        }
      }, "image/jpeg");
    }
  };

  return (
    <Card className="max-w-md mx-auto p-6 space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <video ref={videoRef} autoPlay playsInline className="rounded-lg w-full" />
        <canvas ref={canvasRef} className="hidden" />
        {isReady && (
          <div className="flex space-x-4">
            <Button onClick={handleCapture}>📸 Capture</Button>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        )}
      </div>
    </Card>
  );
}
