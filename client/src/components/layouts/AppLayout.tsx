import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { ApiStatusIndicator } from "@/components/ApiStatusIndicator";
import { AiChatBubble } from "@/components/chat/AiChatBubble";
import ErrorBoundary from "@/components/common/ErrorBoundary";
interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="min-h-screen bg-background">
        <ErrorBoundary level="critical">
          <Navigation />
          <main>
            <ErrorBoundary level="page">
              {children}
            </ErrorBoundary>
          </main>
          <ApiStatusIndicator />
          <AiChatBubble />
        </ErrorBoundary>
      </div>
    </TooltipProvider>
  );
};
