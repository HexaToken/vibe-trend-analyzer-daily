import React, { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Loading } from "@/components/common/Loading";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { useNavigation, useAppStore } from "@/stores/useAppStore";

// Feature-based lazy imports
import DashboardFeature from "@/components/features/dashboard/DashboardFeature";
import SocialFeature from "@/components/features/social/SocialFeature";
import TradingFeature from "@/components/features/trading/TradingFeature";

// Individual component imports (non-lazy for now to avoid TypeScript issues)
import { Settings } from "@/components/Settings";
import { UserProfile } from "@/components/profile/UserProfile";
import { DatabaseDemo } from "@/components/DatabaseDemo";
import { BuilderDemo } from "@/components/BuilderDemo";
import { NLPSentimentDemo } from "@/components/NLPSentimentDemo";
import { SpacyNLPDemo } from "@/components/SpacyNLPDemo";
import { AiSentimentExplainer } from "@/components/AiSentimentExplainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (gcTime replaces cacheTime in v5)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const { activeSection } = useNavigation();
  const { setIsInitializing, updatePerformanceMetrics } = useAppStore();

  // Track app initialization
  useEffect(() => {
    const startTime = performance.now();
    setIsInitializing(false);
    
    const endTime = performance.now();
    updatePerformanceMetrics({
      lastRenderTime: endTime - startTime,
      componentMountCount: 1,
    });
    }, []); // Empty dependency array - this should only run once on mount

  const renderContent = () => {
    switch (activeSection) {
      // Dashboard variants
      case "moorMeter":
        return <DashboardFeature variant="moorMeter" />;
      case "analytics":
        return <DashboardFeature variant="analytics" />;
      case "history":
        return <DashboardFeature variant="historical" />;
      case "sentiment":
                return <BuilderDemo />;

      // Social features
      case "community":
        return <SocialFeature variant="community" />;
      case "social":
        return <SocialFeature variant="platform" />;
      case "channels":
        return <SocialFeature variant="channels" />;

      // Trading features
      case "crypto":
        return <TradingFeature variant="crypto" />;
      case "finnhub":
        return <TradingFeature variant="finnhub" />;
      case "yfinance":
        return <TradingFeature variant="yfinance" />;
      case "sentiment-scoring":
        return <TradingFeature variant="sentiment-scoring" />;

      // Individual features
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
      case "nlp":
                return <NLPSentimentDemo />;
      case "spacy-nlp":
                return <SpacyNLPDemo />;
      case "ai-analysis":
                return <AiSentimentExplainer />;

      default:
        return <DashboardFeature variant="moorMeter" />;
    }
  };

  return (
    <AppLayout>
      <ErrorBoundary level="page">
        {renderContent()}
      </ErrorBoundary>
    </AppLayout>
  );
};

const App = () => {
  return (
    <ErrorBoundary level="critical">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
