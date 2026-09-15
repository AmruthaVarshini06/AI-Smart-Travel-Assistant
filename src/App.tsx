import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Standard Imports (no lazy loading)
import Index from "./pages/Index";
import Navigate from "./pages/Navigate";
import MyTrips from "./pages/MyTrips";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Explore from "./pages/Explore";
import AIAssistantPage from "./pages/AIAssistantPage";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* Added future flags to remove yellow console warnings */}
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          {/* ✨ PROFESSIONAL UPGRADE: The Moving Pastel Background Wrapper */}
          <div className="min-h-screen w-full bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#fffbeb] animate-gradient-x relative overflow-x-hidden overflow-y-auto">
            
            {/* Soft, floating decorative pastel blobs for a premium, immersive feel */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[80px] pointer-events-none animate-pulse" />
            <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-teal-200/30 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDelay: '4s' }} />
            <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-orange-200/30 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

            {/* The Actual App Content */}
            <div className="relative z-10">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Index />} />
                <Route path="/navigate" element={<Navigate />} />
                <Route path="/trips" element={<MyTrips />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/assistant" element={<AIAssistantPage />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>

          </div>
          {/* END PREMIUM BACKGROUND */}

        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;