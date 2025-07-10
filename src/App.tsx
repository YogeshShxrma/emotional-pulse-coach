
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import TherapistDashboard from "./pages/TherapistDashboard";
import EmotionScanPage from "./pages/EmotionScanPage";
import ChatBotPage from "./pages/ChatBotPage";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import SessionsPage from "./pages/SessionsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import DailyCheckInPage from "./pages/DailyCheckInPage";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Redirect based on user role
  if (profile?.role === 'therapist') {
    return (
      <Routes>
        <Route path="/therapist" element={<TherapistDashboard />} />
        <Route path="*" element={<Navigate to="/therapist" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route element={<Layout />}>
        <Route path="/scan" element={<EmotionScanPage />} />
        <Route path="/chat" element={<ChatBotPage />} />
        <Route path="/mood" element={<MoodTrackerPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/daily-check-in" element={<DailyCheckInPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
