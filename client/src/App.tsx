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

// Individual component lazy imports
const Settings = React.lazy(() => import("@/components/Settings").then(module => ({ default: (module as any).Settings || module.default })));
const UserProfile = React.lazy(() => import("@/components/profile/UserProfile").then(module => ({ default: (module as any).UserProfile || module.default })));
const DatabaseDemo = React.lazy(() => import("@/components/DatabaseDemo").then(module => ({ default: (module as any).DatabaseDemo || module.default })));
const BuilderDemo = React.lazy(() => import("@/components/BuilderDemo").then(module => ({ default: (module as any).BuilderDemo || module.default })));
const NLPSentimentDemo = React.lazy(() => import("@/components/NLPSentimentDemo").then(module => ({ default: (module as any).NLPSentimentDemo || module.default })));
const SpacyNLPDemo = React.lazy(() => import("@/components/SpacyNLPDemo").then(module => ({ default: (module as any).SpacyNLPDemo || module.default })));
const AiSentimentExplainer = React.lazy(() => import("@/components/AiSentimentExplainer").then(module => ({ default: (module as any).AiSentimentExplainer || module.default })));
const ProtectedRoute = React.lazy(() => import("@/components/auth/ProtectedRoute").then(module => ({ default: (module as any).ProtectedRoute || module.default })));

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
        return (
          <Suspense fallback={<Loading size="lg" text="Loading Builder demo..." />}>
            <BuilderDemo />
          </Suspense>
        );

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
          <Suspense fallback={<Loading size="lg" text="Loading profile..." />}>
            <ProtectedRoute
              fallbackTitle="Profile Access Required"
              fallbackDescription="Please sign in to view and manage your profile."
            >
              <UserProfile />
            </ProtectedRoute>
          </Suspense>
        );
      case "settings":
        return (
          <Suspense fallback={<Loading size="lg" text="Loading settings..." />}>
            <Settings />
          </Suspense>
        );
      case "database":
        return (
          <Suspense fallback={<Loading size="lg" text="Loading database demo..." />}>
            <DatabaseDemo />
          </Suspense>
        );
      case "nlp":
        return (
          <Suspense fallback={<Loading size="lg" text="Loading NLP demo..." />}>
            <NLPSentimentDemo />
          </Suspense>
        );
      case "spacy-nlp":
        return (
          <Suspense fallback={<Loading size="lg" text="Loading Spacy NLP..." />}>
            <SpacyNLPDemo />
          </Suspense>
        );
      case "ai-analysis":
        return (
          <Suspense fallback={<Loading size="lg" text="Loading AI analysis..." />}>
            <AiSentimentExplainer />
          </Suspense>
        );

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
