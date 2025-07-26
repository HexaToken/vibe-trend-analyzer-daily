import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import BasicScreener from "./BasicScreener";
import AdvancedStockScreener from "./AdvancedStockScreener";
import StrategyProfiler from "./StrategyProfiler";

interface StockScreenerProps {
  className?: string;
}

export const StockScreener: React.FC<StockScreenerProps> = ({ className }) => {
  const { themeMode } = useMoodTheme();
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className={cn(
      "min-h-screen",
      themeMode === 'light'
        ? 'bg-[#F5F7FA]'
        : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
      className
    )}>
      {/* Ambient Background Effects - Only in Dark Mode */}
      {themeMode !== 'light' && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Strategy Profiler Banner */}
        <StrategyProfiler placement="screener" className="mb-8" />
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h1 className={cn(
              "text-5xl font-bold",
              themeMode === 'light'
                ? 'text-[#1E1E1E]'
                : 'bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent'
            )}>
              Stock Screener
            </h1>
          </div>
          <p className={cn(
            "text-xl max-w-3xl mx-auto mb-8",
            themeMode === 'light' ? 'text-[#666]' : 'text-slate-300'
          )}>
            Discover investment opportunities with AI-powered screening tools
          </p>
          
          {/* Status Badges */}
          <div className="flex items-center justify-center gap-4">
            <Badge className={themeMode === 'light'
              ? 'bg-[#E8F5E9] text-[#4CAF50] border-[#4CAF50]/30 rounded-full px-3 py-1'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }>
              <TrendingUp className="w-3 h-3 mr-1" />
              Live Market Data
            </Badge>
            <Badge className={themeMode === 'light'
              ? 'bg-[#E8EAF6] text-[#3F51B5] border-[#3F51B5]/30 rounded-full px-3 py-1'
              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            }>
              <Filter className="w-3 h-3 mr-1" />
              Smart Filters
            </Badge>
          </div>
        </div>

        {/* Stock Screener Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={cn(
            "grid w-full grid-cols-2 mb-8",
            themeMode === 'light'
              ? 'bg-white border border-gray-200 rounded-xl p-1'
              : 'bg-slate-800/50 backdrop-blur-sm border-slate-700/50'
          )}>
            <TabsTrigger 
              value="basic"
              className={cn(
                "relative py-3 px-6 rounded-lg font-medium transition-all duration-200",
                activeTab === "basic"
                  ? themeMode === 'light'
                    ? 'bg-[#3F51B5] text-white shadow-md'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg'
                  : themeMode === 'light'
                    ? 'text-[#666] hover:text-[#3F51B5] hover:bg-[#F5F5F5]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              )}
            >
              Basic Screener
            </TabsTrigger>
            <TabsTrigger 
              value="advanced"
              className={cn(
                "relative py-3 px-6 rounded-lg font-medium transition-all duration-200",
                activeTab === "advanced"
                  ? themeMode === 'light'
                    ? 'bg-[#3F51B5] text-white shadow-md'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg'
                  : themeMode === 'light'
                    ? 'text-[#666] hover:text-[#3F51B5] hover:bg-[#F5F5F5]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              )}
            >
              Advanced Screener
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6">
            <BasicScreener />
          </TabsContent>

          <TabsContent value="advanced" className="mt-6">
            <AdvancedStockScreener />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StockScreener;
