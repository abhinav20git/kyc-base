import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import KycVerification from "./pages/KycVerification";
import { KYCWorkflow } from "./pages/KYC Workflow/KYCWorkflow";
import NotFound from "./pages/NotFound";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "./components/ProtectedRoute"; // import the wrapper


import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { UserContextProvider } from "./context/UserContext";
import Profile from "./components/Profile";
import { useToast } from "./hooks/use-toast";
import KYCWebRTCSystem from "./components/Video-Kyc/KycWebRtcService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserContextProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={< KYCWorkflow />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile/>} />
                <Route
                  path="/kyc-verification"
                  element={
                    <ProtectedRoute>
                      <KycVerification />
                    </ProtectedRoute>
                  }
                />
                <Route path="/video-kyc" element={<KYCWebRTCSystem/>}/>
                {/* <Route path="/face-capture" element={<FaceCapture />} /> */}
                {/* <Route path="*" element={<NotFound />} /> */}
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </UserContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
