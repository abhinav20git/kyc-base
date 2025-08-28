import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { Amplify } from "aws-amplify";
import { Allow_Guest_Access, API_BASE, AWS_REGION, ComparisonResult, Identity_Pool_Id, LivenessResult } from "@/utils/constants";
import axios from "axios";
import './new.css';
import { useKYCVerificationContext } from "@/context/CurrentStepContext";
import { useNavigate } from "react-router-dom";

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
  const {kycVerificationData, setKycVerificationData} = useKYCVerificationContext()
  const [message, setMessage] = useState("Loading...");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isAmplifyReady, setIsAmplifyReady] = useState(false);
  const [isLoading, setIsLoading] = useState({state: false, label: ""});
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
    setIsLoading({state:true, label: 'Initializing liveness checking session...'});
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
      setKycVerificationData({...kycVerificationData, livenessResult: null})
    } catch (e){
      console.log(e)
      setError("Failed to start liveness session.");
    } finally {
      setIsLoading({label:'', state: false});
    }
  };

  const checkResult = async () => {
    console.log("entered")
    if (!sessionId) return;
    setIsLoading({state:true, label: 'Checking liveness result...'});
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
      // setResult(data.data);
      setKycVerificationData({...kycVerificationData, livenessResult: data.data})
    } catch (e){
      console.log("entered loading 1", e)
      setError("Failed to fetch result.");
    } finally {
      setIsLoading({state:false, label: ''});
    }
  };

  useEffect(() => {
    if (kycVerificationData.livenessResult && kycVerificationData.livenessResult.Confidence >= 75) {
      console.log("confidence",kycVerificationData.faceData?.confidence)
      compareFaces();
    }
  }, [kycVerificationData.livenessResult]);

  const compareFaces = async () => {
    const livenessImage = kycVerificationData.livenessResult?.ReferenceImage?.S3Object || kycVerificationData.livenessResult?.ReferenceImage?.Bytes;
    if (!livenessImage || !idPhoto) {
      setError("Need both liveness result and Id Photo");
      return;
    }
    setIsLoading({state:true, label: 'Comparing facial data...'});
    try {
      const response = await fetch(idPhoto);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('image', blob);
      if (kycVerificationData.livenessResult?.ReferenceImage?.S3Object) {
        formData.append('s3Bucket', kycVerificationData.livenessResult.ReferenceImage.S3Object.Bucket);
        formData.append('s3Key', kycVerificationData.livenessResult.ReferenceImage.S3Object.Name);
      } else {
        formData.append('livenessImageBytes', kycVerificationData.livenessResult.ReferenceImage.Bytes);
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
      // setComparisonResult(data.data);
      setKycVerificationData({...kycVerificationData, faceData: data.data})
      console.log(data.data, "res")
      toast({
        title: data.data.isMatch ? "✅ Match Found" : "❌ No Match",
        description: data.data.isMatch
          ? "Your live photo matches your ID."
          : `Similarity: ${data.data.confidence}% (Threshold: ${data.data.threshold}%)`
      });
    } catch (err) {
      toast({ title: "Error", description: err.message || "Something went wrong" });
    } finally {
      setIsLoading({state:false, label: ''});
    }
  };

  useEffect(() => {
    if (!kycVerificationData.livenessResult?.SessionId) {
      startLiveness();
    }
  }, [kycVerificationData.livenessResult]);

  return (
    <Card className="max-w-lg w-full mx-auto p-6 space-y-4 flex flex-col items-center justify-center text-center">

      {/* {(!sessionId || !isAmplifyReady) && <Loader label="Initializing Face Liveness Session..." />} */}

      {sessionId && isAmplifyReady && !kycVerificationData.livenessResult && (
        <div className="w-full flex flex-col items-center gap-3 overflow-hidden">
          <p className="text-sm text-gray-500">Please position your face in the frame</p>
          <FaceLivenessDetector
            sessionId={sessionId}
            region={AWS_REGION}
            onAnalysisComplete={checkResult}
            onError={() => setError("Face detection failed. Try again with better lighting.")}
          />
        </div>
      )}

      {/* Liveness result */}
      {kycVerificationData.livenessResult && (
        <div className="w-full space-y-3">
          <p className="font-medium">
            Liveness Status:{" "}
            <span className={kycVerificationData.livenessResult.Confidence >= 75 ? "text-green-600" : "text-red-600"}>
              {kycVerificationData.livenessResult.Confidence >= 75 ? "Verified Human" : "Spoofing Suspected"}
            </span>
          </p>

          {(kycVerificationData.livenessResult.Confidence < 75 || !kycVerificationData.faceData?.isMatch) && (
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

      {isLoading.state && <Loader label={isLoading.label} />}

      {kycVerificationData.faceData && (
        <div className={`p-3 rounded-md ${kycVerificationData.faceData.isMatch ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          <h4 className="font-semibold">
            {kycVerificationData.faceData.isMatch ? "✅ MATCH VERIFIED" : "❌ NO MATCH"}
          </h4>
          <p className="text-sm">Similarity: {Math.round(kycVerificationData.faceData.confidence)}%</p>
          <p className="text-sm">Threshold: {kycVerificationData.faceData.threshold}%</p>
        </div>
      )}
      {
        kycVerificationData.faceData?.isMatch && <button onClick={()=>navigate('/video-kyc')}  className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm">Move to Video KYC</button>
      }
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
