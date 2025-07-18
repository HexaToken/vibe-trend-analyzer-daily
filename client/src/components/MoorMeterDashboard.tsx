import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Brain,
  Heart,
  Eye,
  Zap,
  Globe,
  MessageCircle,
  BarChart3,
  Star,
  Flame,
  Users,
  Calendar,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw,
  Target,
  Activity,
} from "lucide-react";
import { useStockSentiment } from "../hooks/useStockSentiment";
import { useCombinedBusinessNews } from "../hooks/useCombinedBusinessNews";
import { useCryptoListings } from "../hooks/useCoinMarketCap";
import { TopStocksWidget } from "./moorMeter/TopStocksWidget";
import { NewsWidget } from "./moorMeter/NewsWidget";
import { MoodTrendChart } from "./moorMeter/MoodTrendChart";
import { TrendingTopicsWidget } from "./moorMeter/TrendingTopicsWidget";
import { PersonalMoodCard } from "./moorMeter/PersonalMoodCard";
import { WatchlistWidget } from "./moorMeter/WatchlistWidget";
import { AIInsightWidget } from "./moorMeter/AIInsightWidget";
import { CommunityWidget } from "./moorMeter/CommunityWidget";
import { MoodScoreHero } from "./builder/MoodScoreHero";
import { TopStocksModule } from "./builder/TopStocksModule";
import { formatCurrency, cn } from "../lib/utils";

// Types for our mood data
interface MoodScore {
  overall: number;
  stocks: number;
  news: number;
  social: number;
  timestamp: Date;
}

interface TrendingTopic {
  term: string;
  sentiment: number;
  volume: number;
  source: "reddit" | "twitter" | "discord";
}

interface StockMood {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sentiment: number;
  volume: number;
}

interface CommunityMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  sentiment: number;
  timestamp: Date;
  likes: number;
  platform: "reddit" | "twitter" | "discord";
}

export const MoorMeterDashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "1D" | "7D" | "30D"
  >("7D");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");

  // Hooks for real data
  const { data: stockSentiment, loading: stockLoading } = useStockSentiment();
  const { articles: newsArticles, loading: newsLoading } =
    useCombinedBusinessNews();
  const { tickers: cryptoData, loading: cryptoLoading } = useCryptoListings(10);

  // Calculate overall mood score
  const calculateMoodScore = (): MoodScore => {
    let stocksScore = stockSentiment?.score || 50;
    let newsScore = 45 + Math.random() * 20; // Mock for now
    let socialScore = 55 + Math.random() * 15; // Mock for now

    // Weight the scores: Stocks 40%, News 30%, Social 30%
    const overall = Math.round(
      stocksScore * 0.4 + newsScore * 0.3 + socialScore * 0.3,
    );

    return {
      overall,
      stocks: stocksScore,
      news: newsScore,
      social: socialScore,
      timestamp: new Date(),
    };
  };

  const [moodScore, setMoodScore] = useState<MoodScore>(calculateMoodScore());

  // Update mood score periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMoodScore(calculateMoodScore());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [stockSentiment]);

  // Get mood emoji and color
  const getMoodEmoji = (score: number) => {
    if (score >= 80) return "🚀";
    if (score >= 70) return "�����";
    if (score >= 60) return "😊";
    if (score >= 50) return "😐";
    if (score >= 40) return "😕";
    if (score >= 30) return "😢";
    return "😱";
  };

  const getMoodColor = (score: number) => {
    if (score >= 70) return "from-green-400 to-emerald-600";
    if (score >= 50) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-red-600";
  };

  const getMoodLabel = (score: number) => {
    if (score >= 80) return "Euphoric";
    if (score >= 70) return "Bullish";
    if (score >= 60) return "Optimistic";
    if (score >= 50) return "Neutral";
    if (score >= 40) return "Cautious";
    if (score >= 30) return "Bearish";
    return "Panic";
  };

  // Mock data for trending topics
  const trendingTopics: TrendingTopic[] = [
    { term: "AI Revolution", sentiment: 85, volume: 12500, source: "reddit" },
    { term: "Fed Meeting", sentiment: 35, volume: 8900, source: "twitter" },
    { term: "Crypto Rally", sentiment: 78, volume: 15600, source: "discord" },
    { term: "Tech Earnings", sentiment: 65, volume: 7200, source: "reddit" },
    {
      term: "Market Volatility",
      sentiment: 42,
      volume: 5800,
      source: "twitter",
    },
  ];

  // Mock community messages
  const communityMessages: CommunityMessage[] = [
    {
      id: "1",
      user: "TechBull2024",
      avatar: "/api/placeholder/32/32",
      message:
        "AI stocks are absolutely crushing it today! $NVDA to the moon 🚀",
      sentiment: 90,
      timestamp: new Date(Date.now() - 300000),
      likes: 47,
      platform: "reddit",
    },
    {
      id: "2",
      user: "MarketGuru",
      avatar: "/api/placeholder/32/32",
      message:
        "Fed uncertainty is creating some interesting opportunities in financials",
      sentiment: 25,
      timestamp: new Date(Date.now() - 900000),
      likes: 23,
      platform: "twitter",
    },
    {
      id: "3",
      user: "CryptoWhale",
      avatar: "/api/placeholder/32/32",
      message: "BTC breaking resistance levels, bullish momentum building",
      sentiment: 82,
      timestamp: new Date(Date.now() - 1200000),
      likes: 156,
      platform: "discord",
    },
  ];

  // Mock historical mood data for the chart
  const historicalMood = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(
      Date.now() - (6 - i) * 24 * 60 * 60 * 1000,
    ).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: 45 + Math.random() * 30,
    stocks: 40 + Math.random() * 35,
    news: 35 + Math.random() * 40,
    social: 50 + Math.random() * 25,
  }));

  // Navigation items
  const navItems = [
    { label: "Home", href: "#" },
    { label: "Market Mood", href: "#market" },
    { label: "Watchlist", href: "#watchlist" },
    { label: "Community", href: "#community" },
  ];

  // Function to render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Market Mood":
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Real-time analysis of market mood and stock performance
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TopStocksModule
                title="Top Performing Stocks"
                maxStocks={5}
                showSentiment={true}
              />
              <TopStocksModule
                title="Trending Stocks"
                maxStocks={5}
                showSentiment={false}
              />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">
                🧱 Builder.io Components
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                These components are designed as modular Builder.io blocks that
                can be drag-and-dropped in the Builder.io visual editor.
              </p>
            </div>
          </div>
        );

      case "Watchlist":
        return (
          <div className="space-y-8">
            {/* Watchlist Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  📋 Your Watchlist
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Track your favorite assets with real-time sentiment analysis
                </p>
              </div>

              {/* Add to Watchlist */}
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search ticker..."
                    className="pl-10 w-48"
                  />
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  + Add to Watchlist
                </Button>
              </div>
            </div>

            {/* Watchlist Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AAPL Card */}
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-lg transition-all duration-300">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        AAPL
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Apple Inc.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold text-gray-900 dark:text-white">
                        $195.32
                      </div>
                      <div className="flex items-center text-green-600 text-sm">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +2.47%
                      </div>
                    </div>
                  </div>

                  {/* Sentiment Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        😊 Sentiment Score
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        78
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Mini Sparkline Placeholder */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-1 h-8">
                      {Array.from({ length: 20 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-green-400 w-1 rounded-sm opacity-60"
                          style={{ height: `${Math.random() * 24 + 8}px` }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        <strong>AI Insight:</strong> Sentiment rising due to
                        strong Q4 earnings and positive guidance for 2024.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* TSLA Card */}
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 hover:shadow-lg transition-all duration-300">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        TSLA
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tesla Inc.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold text-gray-900 dark:text-white">
                        $248.87
                      </div>
                      <div className="flex items-center text-red-600 text-sm">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        -1.23%
                      </div>
                    </div>
                  </div>

                  {/* Sentiment Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        😕 Sentiment Score
                      </span>
                      <span className="text-lg font-bold text-orange-600">
                        42
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500"
                        style={{ width: "42%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Mini Sparkline Placeholder */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-1 h-8">
                      {Array.from({ length: 20 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-red-400 w-1 rounded-sm opacity-60"
                          style={{ height: `${Math.random() * 20 + 6}px` }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Activity className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        <strong>AI Insight:</strong> Mixed sentiment due to
                        production concerns, but innovation pipeline remains
                        strong.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* NVDA Card */}
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 hover:shadow-lg transition-all duration-300">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        NVDA
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        NVIDIA Corp.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold text-gray-900 dark:text-white">
                        $785.92
                      </div>
                      <div className="flex items-center text-green-600 text-sm">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +5.67%
                      </div>
                    </div>
                  </div>

                  {/* Sentiment Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        🚀 Sentiment Score
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        92
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Mini Sparkline Placeholder */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-1 h-8">
                      {Array.from({ length: 20 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-emerald-400 w-1 rounded-sm opacity-60"
                          style={{ height: `${Math.random() * 32 + 12}px` }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Target className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        <strong>AI Insight:</strong> Extremely bullish sentiment
                        driven by AI boom and datacenter demand surge.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* BTC Card */}
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 hover:shadow-lg transition-all duration-300">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        BTC
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Bitcoin
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold text-gray-900 dark:text-white">
                        $43,287
                      </div>
                      <div className="flex items-center text-green-600 text-sm">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +3.21%
                      </div>
                    </div>
                  </div>

                  {/* Sentiment Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        😊 Sentiment Score
                      </span>
                      <span className="text-lg font-bold text-orange-600">
                        65
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Mini Sparkline Placeholder */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-1 h-8">
                      {Array.from({ length: 20 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-orange-400 w-1 rounded-sm opacity-60"
                          style={{ height: `${Math.random() * 28 + 8}px` }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Flame className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        <strong>AI Insight:</strong> Moderate optimism with ETF
                        approval hopes and institutional adoption trends.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Builder.io Integration Note */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100">
                🧱 Builder.io Integration Ready
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                This Watchlist module is designed as modular Builder.io
                components with the following features:
              </p>
              <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Drag-and-drop asset cards
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Dynamic sentiment scoring with color-coded gradients
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Real-time price integration ready
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  AI insight components with custom logic
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Responsive grid layout for mobile/desktop
                </li>
              </ul>
              <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>API Integration:</strong> Connect to{" "}
                  <code>GET /user/watchlist</code> and{" "}
                  <code>GET /sentiment?ticker=XYZ</code> for live data
                </p>
              </div>
            </div>
          </div>
        );

      case "Home":
      default:
        return (
          <>
            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content Area */}
              <div className="lg:col-span-3 space-y-6">
                {/* Top Stocks Widget */}
                <TopStocksWidget stockLoading={stockLoading} />

                {/* News Feed Widget */}
                <NewsWidget articles={newsArticles} loading={newsLoading} />

                {/* Mood Trend Chart */}
                <MoodTrendChart
                  data={historicalMood}
                  timeframe={selectedTimeframe}
                  setTimeframe={setSelectedTimeframe}
                />

                {/* Trending Topics */}
                <TrendingTopicsWidget topics={trendingTopics} />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Personal Mood Score */}
                <PersonalMoodCard />

                {/* Watchlist Manager */}
                <WatchlistWidget />

                {/* AI Insight */}
                <AIInsightWidget moodScore={moodScore} />

                {/* Community Feed */}
                <CommunityWidget messages={communityMessages} />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md ${darkMode ? "bg-gray-900/80 border-gray-700" : "bg-white/80 border-gray-200"} border-b`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                    MoorMeter
                  </h1>
                  <div className="text-xs text-gray-500">
                    Real-time Market Sentiment
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                v2.0
              </Badge>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant={activeTab === item.label ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(item.label)}
                  className={
                    activeTab === item.label
                      ? "bg-gradient-to-r from-blue-500 to-purple-600"
                      : ""
                  }
                >
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search stocks, news, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="hidden sm:inline-flex"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              <div className="relative">
                <Button variant="ghost" size="sm">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/api/placeholder/32/32" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
          >
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant={activeTab === item.label ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab(item.label);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  {item.label}
                </Button>
              ))}
              <div className="pt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
          <div
            className={
              'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-20'
            }
          ></div>

          <div className="relative px-8 py-12">
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center space-x-4 mb-4">
                  <div className="text-6xl animate-bounce">
                    {getMoodEmoji(moodScore.overall)}
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-white mb-2">
                      {moodScore.overall}
                    </div>
                    <div className="text-xl text-blue-200">
                      {getMoodLabel(moodScore.overall)}
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-white mb-2">
                  Today's Market Mood
                </h2>
                <p className="text-blue-200 max-w-2xl mx-auto">
                  Real-time sentiment analysis powered by AI, aggregating market
                  data, news sentiment, and social media buzz
                </p>
              </div>

              {/* Mood Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-blue-300" />
                      <span className="text-white font-medium">Stocks</span>
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {Math.round(moodScore.stocks)}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${getMoodColor(moodScore.stocks)}`}
                      style={{ width: `${moodScore.stocks}%` }}
                    ></div>
                  </div>
                  <div className="text-blue-200 text-sm mt-2">40% weight</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-purple-300" />
                      <span className="text-white font-medium">News</span>
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {Math.round(moodScore.news)}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${getMoodColor(moodScore.news)}`}
                      style={{ width: `${moodScore.news}%` }}
                    ></div>
                  </div>
                  <div className="text-purple-200 text-sm mt-2">30% weight</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5 text-indigo-300" />
                      <span className="text-white font-medium">Social</span>
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {Math.round(moodScore.social)}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${getMoodColor(moodScore.social)}`}
                      style={{ width: `${moodScore.social}%` }}
                    ></div>
                  </div>
                  <div className="text-indigo-200 text-sm mt-2">30% weight</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </main>

      {/* Footer */}
      <footer
        className={`mt-16 border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  MoorMeter
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Advanced sentiment analysis for the modern trader. Real-time
                market mood tracking powered by AI.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Globe className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Users className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Reddit
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © 2024 MoorMeter. All rights reserved.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
                Market data delayed by 15 minutes
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MoorMeterDashboard;
