import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Hash, 
  Settings, 
  BarChart3,
  RefreshCw,
  Info,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useMoodTheme } from '../contexts/MoodThemeContext';

// Import our new Market Mood components
import { FinanceMoodGauge } from './builder/FinanceMoodGauge';
import { FinanceMoodChart } from './builder/FinanceMoodChart';
import { FinanceNewsFeed } from './builder/FinanceNewsFeed';
import { AIInsightWidget } from './builder/AIInsightWidget';
import { SocialBuzzHeatmap } from './builder/SocialBuzzHeatmap';

import { MarketMoodControls } from './builder/MarketMoodControls';

interface MarketMoodPageProps {
  title?: string;
  subtitle?: string;
}

export const MarketMoodPage: React.FC<MarketMoodPageProps> = ({
  title = "Market Mood Dashboard",
  subtitle = "Real-time sentiment analysis powered by AI across stocks, news, and social media"
}) => {
  const { moodScore } = useMoodTheme();
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '7D' | '30D' | '90D'>('7D');
  const [activeSources, setActiveSources] = useState<string[]>(['stocks', 'news', 'social']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExplainingMood, setIsExplainingMood] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Auto-refresh timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDateRangeChange = (range: string) => {
    setActiveTimeframe(range as typeof activeTimeframe);
  };

  const handleSourceToggle = (sources: string[]) => {
    setActiveSources(sources);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleExplainMood = () => {
    setIsExplainingMood(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsExplainingMood(false);
    }, 3000);
  };

  const getMoodSentiment = (score: number): 'positive' | 'neutral' | 'negative' => {
    if (score >= 70) return 'positive';
    if (score >= 40) return 'neutral';
    return 'negative';
  };

  const getSentimentEmoji = (sentiment: 'positive' | 'neutral' | 'negative'): string => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'neutral': return '😐';
      case 'negative': return '😢';
    }
  };

  const getSentimentGradient = (sentiment: 'positive' | 'neutral' | 'negative'): string => {
    switch (sentiment) {
      case 'positive': return 'from-emerald-500 via-green-400 via-cyan-400 to-emerald-500';
      case 'neutral': return 'from-gray-400 via-slate-300 via-purple-300 to-gray-400';
      case 'negative': return 'from-red-500 via-rose-400 via-purple-500 to-red-500';
    }
  };

  const currentSentiment = getMoodSentiment(moodScore?.overall || 72);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-violet-500/8 to-indigo-500/8 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            {title}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            {subtitle}
          </p>
          
          {/* Status Bar */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Zap className="w-3 h-3 mr-1" />
              Real-time Data
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Brain className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <RefreshCw className="w-3 h-3 mr-1" />
              Updated {lastUpdated.toLocaleTimeString()}
            </Badge>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column - Mood Score Hero */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <FinanceMoodGauge
                title="Current Market Mood"
                subtitle="Multi-source sentiment analysis"
                showBreakdown={true}
                size="large"
              />
              
              {/* Quick Stats */}
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">{getSentimentEmoji(currentSentiment)}</div>
                  <div className="text-lg font-bold text-white mb-1">
                    {currentSentiment === 'positive' ? 'Bullish Market' :
                     currentSentiment === 'negative' ? 'Bearish Market' : 'Neutral Market'}
                  </div>
                  <div className="text-sm text-slate-400">
                    {activeSources.length}/3 data sources active
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Controls Section */}
            <MarketMoodControls
              title="Analysis Controls"
              showFilters={true}
              showExport={true}
              onDateRangeChange={handleDateRangeChange}
              onSourceToggle={handleSourceToggle}
              onSearch={handleSearch}
              onExplainMood={handleExplainMood}
            />

            {/* Mood Trend Chart */}
            <FinanceMoodChart
              title="Mood Trend Over Time"
              timeframe={activeTimeframe}
              height={300}
              showControls={true}
              showLegend={true}
            />

            {/* AI Market Insight - Full Width */}
            <AIInsightWidget
              title="AI Market Insight"
              refreshInterval={300000}
              showConfidence={true}
            />

            {/* Social Buzz Heatmap - Full Width */}
            <SocialBuzzHeatmap
              title="Social Media Buzz Heatmap"
              maxTopics={12}
              platforms="reddit,twitter,discord"
              autoRefresh={true}
            />

            {/* Smart News Feed */}
            <FinanceNewsFeed
              title="AI-Curated Market News"
              maxArticles={6}
              showSentiment={true}
              showSummary={true}
              autoRefresh={true}
              categories="finance,technology,economy"
            />

            {/* Additional Insights Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Market Summary */}
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="text-white text-sm">Market Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Bullish Signals</span>
                      <span className="text-emerald-400 font-bold">67%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Bearish Signals</span>
                      <span className="text-red-400 font-bold">23%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Neutral Signals</span>
                      <span className="text-amber-400 font-bold">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Volatility Index */}
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="text-white text-sm">Volatility Index</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-amber-400 mb-2">18.4</div>
                  <div className="text-sm text-slate-400 mb-3">VIX Level</div>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    Moderate
                  </Badge>
                </CardContent>
              </Card>

              {/* Data Quality */}
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="text-white text-sm">Data Quality</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">API Health</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        98%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Data Freshness</span>
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        Live
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Confidence</span>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        87%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="text-sm text-slate-400 mb-4">
            Market Mood data powered by advanced AI sentiment analysis
          </div>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              Stock API: Live
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Hash className="w-3 h-3 mr-1" />
              Social API: Live
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Brain className="w-3 h-3 mr-1" />
              AI Engine: Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MarketMoodPage;
