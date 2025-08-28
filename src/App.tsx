import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import KycVerification from "./pages/KycVerification";
import { KYCWorkflow } from "./pages/KYC Workflow/KYCWorkflow";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "./components/ProtectedRoute"; // import the wrapper


import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { UserContextProvider } from "./context/UserContext";
import Profile from "./components/Profile";
import { useToast } from "./hooks/use-toast";
import ComplianceDashboard from './components/ComplianceDashboard'
import KYCWebRTCSystem from "./components/Video-Kyc/KycWebRtcService";
import ChatbotWidget from "./components/ChatWidget";
import {KYCVerificationContextProvider } from "./context/CurrentStepContext";
import AI_Agent from "./components/AI-Agent";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserContextProvider>
        <KYCVerificationContextProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={< KYCWorkflow />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/kyc-agent" element={<AI_Agent />} />
                  
                <Route path="/compliance"

                 element= {<ProtectedRoute>
                  <ComplianceDashboard />
                 </ProtectedRoute>}
                 />
                  <Route
                    path="/kyc-verification"
                  
                    element={
                      <ProtectedRoute>
                        <KycVerification />
                     
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/video-kyc" element={<KYCWebRTCSystem />} />
                  {/* <Route path="/face-capture" element={<FaceCapture />} /> */}
                  {/* <Route path="*" element={<NotFound />} /> */}
                </Routes>
              </main>
            <ChatbotWidget/>
              <Footer />
            </div>
          </BrowserRouter>
        </KYCVerificationContextProvider>
      </UserContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
