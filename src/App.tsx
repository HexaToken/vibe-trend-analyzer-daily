import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { SentimentDashboard } from "@/components/SentimentDashboard";
import { Analytics } from "@/components/Analytics";
import { HistoricalData } from "@/components/HistoricalData";
import { Community } from "@/components/Community";
import { Settings } from "@/components/Settings";

const queryClient = new QueryClient();

const App = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "analytics":
        return <Analytics />;
      case "history":
        return <HistoricalData />;
      case "community":
        return <Community />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background">
          <Navigation
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          <main>{renderContent()}</main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
