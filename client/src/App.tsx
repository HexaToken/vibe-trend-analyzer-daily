import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { MoodThemeProvider } from "@/contexts/MoodThemeContext";
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
import { MoorMeterDashboard } from "@/components/MoorMeterDashboard";
import { BuilderDemo } from "@/components/BuilderDemo";

import { ApiStatusIndicator } from "@/components/ApiStatusIndicator";
import { CryptoDashboard } from "@/components/crypto/CryptoDashboard";

import { NLPSentimentDemo } from "@/components/NLPSentimentDemo";
import { SpacyNLPDemo } from "@/components/SpacyNLPDemo";
import { AiChatBubble } from "@/components/chat/AiChatBubble";
import { FinnhubDemo } from "@/components/FinnhubDemo";
import { StockSentimentScoring } from "@/components/StockSentimentScoring";
import { AiSentimentExplainer } from "@/components/AiSentimentExplainer";
import { YFinanceDemo } from "@/components/YFinanceDemo";
import { MoodThemeDemo } from "@/components/MoodThemeDemo";

import { BuilderFinanceDemo } from "@/components/BuilderFinanceDemo";
import { FuturisticHomepage } from "@/components/FuturisticHomepage";

const queryClient = new QueryClient();

const App = () => {
  const [activeSection, setActiveSection] = useState("moorMeter");

  const renderContent = () => {
    switch (activeSection) {
      case "sentiment":
        return <BuilderDemo />;
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
      case "spacy-nlp":
        return <SpacyNLPDemo />;
      case "finnhub":
        return <FinnhubDemo />;
      case "sentiment-scoring":
        return <StockSentimentScoring />;
      case "ai-analysis":
        return <AiSentimentExplainer />;
            case "yfinance":
        return <YFinanceDemo />;
            case "theme-demo":
        return <MoodThemeDemo />;
            
            case "builder-finance":
        return <BuilderFinanceDemo />;
      case "futuristic-home":
        return <FuturisticHomepage />;
      case "moorMeter":
        return <MoorMeterDashboard />;

      default:
        return <MoorMeterDashboard />;
    }
  };

    return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MoodThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className="min-h-screen bg-background transition-all duration-500">
              <Navigation
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
              <main>{renderContent()}</main>
              <ApiStatusIndicator />
              <AiChatBubble />
            </div>
          </TooltipProvider>
        </MoodThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
