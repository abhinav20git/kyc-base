import React, { useState } from "react";
import { Camera, CheckCircle } from "lucide-react";

export const FaceCapture: React.FC<{ onCapture: () => void }> = ({ onCapture }) => {
  const [captured, setCaptured] = useState(false);

  const handleCapture = () => {
    // Simulate capturing image from camera
    setCaptured(true);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-foreground mb-6">Live Face Capture</h2>

      {/* Camera Preview Box */}
      <div className="w-[450px] h-[300px] bg-gray-100 rounded-2xl shadow-2xl flex items-center justify-center border-4 border-gray-300">
        {!captured ? (
          <span className="text-gray-500 text-lg">Camera Preview</span>
        ) : (
          <span className="text-green-600 font-semibold text-lg">Face Captured!</span>
        )}
      </div>

      {/* Action Buttons */}
      {!captured ? (
        <button
          onClick={handleCapture}
          className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 
                     hover:from-indigo-600 hover:to-purple-700 transition flex items-center 
                     justify-center shadow-lg text-white font-semibold"
        >
          <Camera className="w-5 h-5 mr-2" />
          Capture Face
        </button>
      ) : (
        <button
          onClick={onCapture}
          className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 
                     hover:from-green-600 hover:to-emerald-700 transition flex items-center 
                     justify-center shadow-lg text-white font-semibold"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Verify & Complete
        </button>
      )}
    </div>
  );
};

export default FaceCapture;
