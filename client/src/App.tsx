import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { MoodThemeProvider, useMoodTheme } from "@/contexts/MoodThemeContext";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { SentimentDashboard } from "@/components/SentimentDashboard";
import { Analytics } from "@/components/Analytics";
import { HistoricalData } from "@/components/HistoricalData";
import { CommunityRooms } from "@/components/social/CommunityRooms";
import { Watchlist } from "@/components/Watchlist";
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
import { MoodGptWidget } from "@/components/chat/MoodGptWidget";
import { FinnhubDemo } from "@/components/FinnhubDemo";
import { StockSentimentScoring } from "@/components/StockSentimentScoring";
import { AiSentimentExplainer } from "@/components/AiSentimentExplainer";
import { YFinanceDemo } from "@/components/YFinanceDemo";
import { MoodThemeDemo } from "@/components/MoodThemeDemo";
import DynamicThemeSelectorDemo from "@/components/DynamicThemeSelectorDemo";

import { BuilderFinanceDemo } from "@/components/BuilderFinanceDemo";
import { FuturisticHomepage } from "@/components/FuturisticHomepage";
import SettingsPage from "@/components/user/SettingsPage";
import ViewProfilePage from "@/components/user/ViewProfilePage";
import MoorMeterMembershipPage from "@/components/membership/MoorMeterMembershipPage";
import MembershipPageSummary from "@/components/examples/MembershipPageSummary";
import { ModerationDemo } from "@/components/ModerationDemo";
import { BadgeSystemDemo } from "@/components/BadgeSystemDemo";
import { SpaceSwitcherWidget } from "@/components/community/SpaceSwitcherWidget";
import { PrivateRoomsContainer } from "@/components/privateRooms/PrivateRoomsContainer";
import { ChatInterface } from "@/components/moorMeter/ChatInterface";
import { ModerationTestingDashboard } from "@/components/testing/ModerationTestingDashboard";
import { PluginMarketplacePage } from "@/components/PluginMarketplacePage";
import { DeveloperSubmissionPage } from "@/components/plugins/DeveloperSubmissionPage";
import { CredibilityAnalyticsDashboard } from "@/components/credibility/CredibilityAnalyticsDashboard";
import { Footer } from "@/components/Footer";

const queryClient = new QueryClient();

const AppContent = () => {
  const [activeSection, setActiveSection] = useState("futuristic-home");
  const { bodyGradient } = useMoodTheme();

  const renderContent = () => {
    switch (activeSection) {
      case "sentiment":
        return <BuilderDemo />;
      case "analytics":
        return <Analytics />;
      // Removed "history" route - HistoricalData component retained for potential reuse
            case "community":
        return <CommunityRooms />;
      case "space":
        return <SpaceSwitcherWidget />;
      case "rooms":
        return <PrivateRoomsContainer />;
      case "chat":
        return <ChatInterface />;
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
        return (
          <ProtectedRoute
            fallbackTitle="Settings Access Required"
            fallbackDescription="Please sign in to access your settings."
          >
            <SettingsPage onNavigate={setActiveSection} />
          </ProtectedRoute>
        );
      case "user-settings":
        return (
          <ProtectedRoute
            fallbackTitle="Settings Access Required"
            fallbackDescription="Please sign in to access your settings."
          >
            <SettingsPage onNavigate={setActiveSection} />
          </ProtectedRoute>
        );
      case "user-profile":
        return (
          <ProtectedRoute
            fallbackTitle="Profile Access Required"
            fallbackDescription="Please sign in to view your profile."
          >
            <ViewProfilePage />
          </ProtectedRoute>
        );
      case "database":
        return <DatabaseDemo />;
      case "social":
        return <SocialPlatform />;
      // Removed "crypto" route - CryptoDashboard component retained, crypto features moved to Finance section
      case "nlp":
        return <NLPSentimentDemo />;
      case "spacy-nlp":
        return <SpacyNLPDemo />;
      case "finnhub":
        return <FinnhubDemo />;
      // Removed "sentiment-scoring" route - StockSentimentScoring component retained for backend sentiment utilities
      case "ai-analysis":
        return <AiSentimentExplainer />;
            case "yfinance":
        return <YFinanceDemo />;
      case "theme-demo":
        return <DynamicThemeSelectorDemo />;
      case "membership":
        return <MoorMeterMembershipPage />;
      case "membership-demo":
        return <MembershipPageSummary />;
      case "moderation":
        return <ModerationDemo onNavigate={setActiveSection} />;
      case "moderation-testing":
        return <ModerationTestingDashboard />;
      case "badges":
        return <BadgeSystemDemo />;
            // Removed "builder-finance" route - BuilderFinanceDemo component retained for Builder.io integration examples
      case "futuristic-home":
        return <FuturisticHomepage onNavigate={setActiveSection} />;
      case "moorMeter":
        return <MoorMeterDashboard />;
      case "plugins":
        return <PluginMarketplacePage onNavigate={setActiveSection} />;
      case "plugin-submission":
        return <DeveloperSubmissionPage onNavigate={setActiveSection} />;
      case "credibility-analytics":
        return <CredibilityAnalyticsDashboard />;

      default:
        return <FuturisticHomepage onNavigate={setActiveSection} />;
    }
  };

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className={`min-h-screen ${bodyGradient} transition-all duration-500`}>
        <Navigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main>{renderContent()}</main>
        <Footer onNavigate={setActiveSection} />
        <ApiStatusIndicator />
        <MoodGptWidget />
      </div>
    </TooltipProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MoodThemeProvider>
          <AppContent />
        </MoodThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
