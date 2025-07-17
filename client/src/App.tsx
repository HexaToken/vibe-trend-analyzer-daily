import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { SentimentDashboard } from "@/components/SentimentDashboard";
import { Analytics } from "@/components/Analytics";
import { HistoricalData } from "@/components/HistoricalData";
import { Community } from "@/components/Community";
import { Settings } from "@/components/Settings";
import { UserProfile } from "@/components/profile/UserProfile";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DatabaseDemo } from "@/components/DatabaseDemo";
import { SocialPlatform } from "@/components/social/SocialPlatform";

import { ApiStatusIndicator } from "@/components/ApiStatusIndicator";
import { CryptoDashboard } from "@/components/crypto/CryptoDashboard";

import { NLPSentimentDemo } from "@/components/NLPSentimentDemo";
import { AiChatBubble } from "@/components/chat/AiChatBubble";
import { AlphaVantageDemo } from "@/components/AlphaVantageDemo";

const queryClient = new QueryClient();

const App = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "sentiment":
        return <SentimentDashboard />;
      case "analytics":
        return <Analytics />;
      case "history":
        return <HistoricalData />;
      case "community":
        return <Community />;
      case "profile":
        return (
          <ProtectedRoute
            fallbackTitle="Profile Access Required"
            fallbackDescription="Please sign in to view and manage your profile."
          >
            <UserProfile />
          </ProtectedRoute>
        );
      case "settings":
        return <Settings />;
      case "database":
        return <DatabaseDemo />;
      case "social":
        return <SocialPlatform />;
      case "crypto":
        return <CryptoDashboard />;
      case "nlp":
        return <NLPSentimentDemo />;
      case "alphavantage":
        return <AlphaVantageDemo />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen bg-background">
            <Navigation
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
            <main>{renderContent()}</main>
            <ApiStatusIndicator />
            <AiChatBubble />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
