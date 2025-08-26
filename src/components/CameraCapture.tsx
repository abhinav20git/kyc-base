import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { Amplify } from "aws-amplify";
import { Allow_Guest_Access, API_BASE, AWS_REGION, ComparisonResult, Identity_Pool_Id, LivenessResult } from "@/utils/constants";
import axios from "axios";
import './new.css'

const amplifyConfig = {
  Auth: {
    Cognito: {
      identityPoolId: Identity_Pool_Id,
      allowGuestAccess: Allow_Guest_Access,
    },
  },
};
Amplify.configure(amplifyConfig);

export function CameraCapture({ idPhoto }) {
  const [message, setMessage] = useState("Loading...");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [result, setResult] = useState<LivenessResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isAmplifyReady, setIsAmplifyReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // const API_BASE = "https://j4t7l04g-5000.inc1.devtunnels.ms";
  useEffect(() => {
    const initAmplify = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsAmplifyReady(true);
      } catch (err) {
        setError("Failed to initialize face detection.");
      }
    };
    initAmplify();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("❌ Backend connection failed"));
  }, [API_BASE]);

  const startLiveness = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/AI/start-liveness`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        credentials: "include"
      });
      console.log(res)
      const data = await res.json();
      console.log(data.data.SessionId)
      setSessionId(data.data.SessionId);
      setResult(null);
    } catch (e){
      console.log(e)
      setError("Failed to start liveness session.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkResult = async () => {
    console.log("entered")
    if (!sessionId) return;
    setIsLoading(true);
    console.log("entered loading")
    try {
      const res = await fetch(`${API_BASE}/AI/liveness-result/${sessionId}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });
      console.log(res);
      const data = await res.json();
      console.log("Check result server res - ", data.data)
      setResult(data.data);
    } catch (e){
      console.log("entered loading 1", e)
      setError("Failed to fetch result.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (result && result.Confidence >= 70) {
      compareFaces();
    }
  }, [result]);

  const compareFaces = async () => {
    const livenessImage = result?.ReferenceImage?.S3Object || result?.ReferenceImage?.Bytes;
    if (!livenessImage || !idPhoto) {
      setError("Need both liveness result and Id Photo");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', idPhoto);
      if (result?.ReferenceImage?.S3Object) {
        formData.append('s3Bucket', result.ReferenceImage.S3Object.Bucket);
        formData.append('s3Key', result.ReferenceImage.S3Object.Name);
      } else {
        formData.append('livenessImageBytes', result.ReferenceImage.Bytes);
      }
      const res = await axios.post(
        `${API_BASE}/AI/compare-faces`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      const data = res.data;
      setComparisonResult(data.data);
      console.log(data.data, "res")
      toast({
        title: data.isMatch ? "✅ Match Found" : "❌ No Match",
        description: data.isMatch
          ? "Your live photo matches your ID."
          : `Similarity: ${data.confidence}% (Threshold: ${data.threshold}%)`
      });
    } catch (err) {
      toast({ title: "Error", description: err.message || "Something went wrong" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionId) {
      startLiveness();
    }
  }, []);

  return (
    <Card className="max-w-lg w-full mx-auto p-6 space-y-4 flex flex-col items-center justify-center text-center">

      {(!sessionId || !isAmplifyReady) && <Loader label="Initializing Face Liveness Session..." />}

      {sessionId && isAmplifyReady && !result && (
        <div className="w-full flex flex-col items-center gap-3 overflow-hidden">
          <FaceLivenessDetector
            sessionId={sessionId}
            region={AWS_REGION}
            onAnalysisComplete={checkResult}
            onError={() => setError("Face detection failed. Try again with better lighting.")}
          />
          <p className="text-sm text-gray-500">Please position your face in the frame</p>
        </div>
      )}

      {/* Liveness result */}
      {result && (
        <div className="w-full space-y-3">
          <p className="font-medium">
            Liveness Status:{" "}
            <span className={result.Confidence >= 70 ? "text-green-600" : "text-red-600"}>
              {result.Confidence >= 70 ? "Verified Human" : "Spoofing Suspected"}
            </span>
          </p>

          {result.Confidence < 70 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Not correct? You can:</p>
              <div className="flex gap-3 justify-center">
                <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm">Report</button>
                <button onClick={startLiveness} className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm">Try Again</button>
              </div>
            </div>
          )}
        </div>
      )}

      {result && isLoading && <Loader label="Comparing your live photo with ID..." />}

      {comparisonResult && (
        <div className={`p-3 rounded-md ${comparisonResult.isMatch ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          <h4 className="font-semibold">
            {comparisonResult.isMatch ? "✅ MATCH VERIFIED" : "❌ NO MATCH"}
          </h4>
          <p className="text-sm">Similarity: {Math.round(comparisonResult.confidence)}%</p>
          <p className="text-sm">Threshold: {comparisonResult.threshold}%</p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </Card>
  );
}

function Loader({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="spinner w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></p>
      {label && <p className="text-sm text-gray-600">{label}</p>}
    </div>
  );
}
