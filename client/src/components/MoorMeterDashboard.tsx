import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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
  Flag,
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
import { SentimentHeatMap } from "./SentimentHeatMap";
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
  const [activeToolsSubtab, setActiveToolsSubtab] = useState("HeatMap");
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  // Sentiment Heatmap State
  const [sentimentTimeframe, setSentimentTimeframe] = useState<
    "24h" | "7d" | "30d"
  >("24h");
  const [sentimentViewMode, setSentimentViewMode] = useState<
    "absolute" | "net"
  >("absolute");
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    ticker: string;
    time: string;
    data: any;
  } | null>(null);

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

  // Sentiment Heatmap Mock Data
  const generateSentimentData = (timeframe: "24h" | "7d" | "30d") => {
    const watchlistTickers = [
      "AAPL",
      "MSFT",
      "GOOGL",
      "AMZN",
      "NVDA",
      "TSLA",
      "META",
      "JPM",
    ];

    const getTimePoints = () => {
      switch (timeframe) {
        case "24h":
          return Array.from({ length: 24 }, (_, i) => {
            const hour = new Date();
            hour.setHours(hour.getHours() - (23 - i));
            return hour.getHours() + ":00";
          });
        case "7d":
          return Array.from({ length: 7 }, (_, i) => {
            const day = new Date();
            day.setDate(day.getDate() - (6 - i));
            return day.toLocaleDateString("en-US", { weekday: "short" });
          });
        case "30d":
          return Array.from({ length: 30 }, (_, i) => {
            const day = new Date();
            day.setDate(day.getDate() - (29 - i));
            return day.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          });
      }
    };

    const timePoints = getTimePoints();

    return watchlistTickers.map((ticker) => ({
      ticker,
      data: timePoints.map((time) => {
        const bullishCount = Math.floor(Math.random() * 50) + 5;
        const bearishCount = Math.floor(Math.random() * 30) + 2;
        const netSentiment = bullishCount - bearishCount;
        const totalVolume = bullishCount + bearishCount;
        const intensity = Math.min(totalVolume / 50, 1); // Normalize to 0-1

        return {
          time,
          bullish: bullishCount,
          bearish: bearishCount,
          net: netSentiment,
          total: totalVolume,
          intensity,
          dominantSentiment:
            bullishCount > bearishCount ? "bullish" : "bearish",
          ratio: bullishCount / (bullishCount + bearishCount),
        };
      }),
    }));
  };

  const sentimentHeatmapData = generateSentimentData(sentimentTimeframe);

  // Export functions for heatmap
  const exportHeatmapAsPNG = () => {
    // Mock implementation - in real app would use html2canvas or similar
    console.log("Exporting heatmap as PNG...");
    const link = document.createElement("a");
    link.download = `sentiment-heatmap-${sentimentTimeframe}.png`;
    link.href =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    link.click();
  };

  const exportHeatmapAsCSV = () => {
    const headers = ["Ticker", "Time", "Bullish", "Bearish", "Net", "Total"];
    const rows = sentimentHeatmapData.flatMap((ticker) =>
      ticker.data.map((point) => [
        ticker.ticker,
        point.time,
        point.bullish,
        point.bearish,
        point.net,
        point.total,
      ]),
    );

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `sentiment-heatmap-${sentimentTimeframe}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportHeatmapAsJSON = () => {
    const jsonData = {
      timeframe: sentimentTimeframe,
      viewMode: sentimentViewMode,
      exportDate: new Date().toISOString(),
      data: sentimentHeatmapData,
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `sentiment-heatmap-${sentimentTimeframe}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Navigation items
  const navItems = [
    { label: "Home", href: "#" },
    { label: "Market Mood", href: "#market" },
    { label: "Watchlist", href: "#watchlist" },
    { label: "News", href: "#news" },
    { label: "Community", href: "#community" },
  ];

  // Tools dropdown items
  const toolsItems = [{ label: "Market HeatMap", value: "HeatMap" }];

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
                  ���� Your Watchlist
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

      case "News":
        return (
          <div className="space-y-8">
            {/* News Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  📰 Market News
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  AI-powered news with real-time sentiment analysis
                </p>
              </div>

              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search news, tickers, or topics..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Positive",
                "Neutral",
                "Negative",
                "Earnings",
                "Tech",
                "Economy",
              ].map((filter) => (
                <Button
                  key={filter}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  {filter}
                </Button>
              ))}
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced News Widget */}
              <div className="lg:col-span-2">
                <NewsWidget articles={newsArticles} loading={newsLoading} />
              </div>
            </div>

            {/* Builder.io Integration Note */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100">
                🧱 Builder.io News Feed Module
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                This News Feed module is designed as a modular Builder.io
                component with the following features:
              </p>
              <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Real-time news headlines with sentiment indicators
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  AI-powered news summaries and analysis
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Filterable by sentiment and category
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Responsive layout with search functionality
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Color-coded sentiment badges and mood emojis
                </li>
              </ul>
              <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>API Integration:</strong> Connect to{" "}
                  <code>GET /api/news/headlines</code> and{" "}
                  <code>GET /api/sentiment?article=XYZ</code> for live data
                </p>
              </div>
            </div>
          </div>
        );

      case "Community":
        return (
          <div className="space-y-8">
            {/* Community Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  🧑‍🤝‍🧑 Community Insights
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Discuss trends, share your sentiment, and track what others
                  are saying.
                </p>
              </div>

              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search keywords, tickers, or users..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>

            {/* Main Community Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Feed */}
              <div className="lg:col-span-3 space-y-6">
                {/* Post Composer */}
                <Card className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/api/placeholder/48/48" />
                      <AvatarFallback>YU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <textarea
                        placeholder="What's your market sentiment?"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />

                      {/* Post Options */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Ticker Tag */}
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Add ticker:
                            </span>
                            <Input
                              placeholder="$TSLA"
                              className="w-20 h-8 text-sm"
                            />
                          </div>

                          {/* Sentiment Emoji */}
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Sentiment:
                            </span>
                            <div className="flex space-x-1">
                              {["😃", "😐", "😢"].map((emoji, i) => (
                                <Button
                                  key={i}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  {emoji}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Category Tag */}
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Category:
                            </span>
                            <select className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800">
                              <option>#Tech</option>
                              <option>#Crypto</option>
                              <option>#Earnings</option>
                              <option>#Economy</option>
                            </select>
                          </div>
                        </div>

                        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Live Feed of Posts */}
                <div className="space-y-4">
                  {communityMessages.map((message) => (
                    <Card
                      key={message.id}
                      className="p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback>
                            {message.user.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          {/* Post Header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {message.user}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {message.platform}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {Math.floor(
                                  (Date.now() - message.timestamp.getTime()) /
                                    60000,
                                )}{" "}
                                min ago
                              </span>
                            </div>

                            {/* Sentiment Indicator */}
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  message.sentiment >= 70
                                    ? "default"
                                    : message.sentiment >= 40
                                      ? "secondary"
                                      : "destructive"
                                }
                                className="text-xs"
                              >
                                {message.sentiment >= 70
                                  ? "😃 Bullish"
                                  : message.sentiment >= 40
                                    ? "😐 Neutral"
                                    : "😢 Bearish"}
                              </Badge>
                            </div>
                          </div>

                          {/* Post Content */}
                          <p className="text-gray-900 dark:text-white mb-3">
                            {message.message}
                          </p>

                          {/* Post Actions */}
                          <div className="flex items-center space-x-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
                            >
                              <Heart className="w-4 h-4" />
                              <span>{message.likes}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center space-x-1 text-gray-500 hover:text-green-500"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Reply</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center space-x-1 text-gray-500 hover:text-purple-500"
                            >
                              <RefreshCw className="w-4 h-4" />
                              <span>Repost</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Flag className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Threaded Comments Section */}
                          <div className="mt-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                              <Input
                                placeholder="Write a reply..."
                                className="flex-1 h-8 text-sm"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 px-3 text-blue-500"
                              >
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Trending Topics */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    📈 Trending Tickers
                  </h3>
                  <div className="space-y-3">
                    {[
                      { ticker: "$NVDA", mentions: 1240, sentiment: 85 },
                      { ticker: "$TSLA", mentions: 890, sentiment: 42 },
                      { ticker: "$AAPL", mentions: 756, sentiment: 78 },
                      { ticker: "$BTC", mentions: 654, sentiment: 65 },
                      { ticker: "$SPY", mentions: 543, sentiment: 55 },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant="outline"
                            className="font-mono text-sm"
                          >
                            {item.ticker}
                          </Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.mentions} mentions
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.sentiment >= 70
                                ? "bg-green-500"
                                : item.sentiment >= 40
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                          <span className="text-sm font-medium">
                            {item.sentiment}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Daily Mood Poll */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                    🗳️ Daily Mood Poll
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    How do you feel about today's market?
                  </p>

                  <div className="space-y-3">
                    {[
                      { label: "😃 Bullish", votes: 45, color: "bg-green-500" },
                      {
                        label: "😐 Neutral",
                        votes: 32,
                        color: "bg-yellow-500",
                      },
                      { label: "😢 Bearish", votes: 23, color: "bg-red-500" },
                    ].map((option, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {option.label}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {option.votes}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${option.color}`}
                            style={{ width: `${option.votes}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    Cast Your Vote
                  </Button>
                </Card>

                {/* Community Stats */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-500" />
                    Community Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Active Users
                      </span>
                      <span className="font-semibold">2,847</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Posts Today
                      </span>
                      <span className="font-semibold">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Avg Sentiment
                      </span>
                      <Badge variant="default" className="bg-green-500">
                        Bullish 68%
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Builder.io Integration Note */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <h3 className="text-xl font-semibold mb-4 text-purple-900 dark:text-purple-100">
                ��� Builder.io Community Module
              </h3>
              <p className="text-purple-700 dark:text-purple-300 mb-4">
                This Community module is designed as modular Builder.io
                components with the following features:
              </p>
              <ul className="text-sm text-purple-600 dark:text-purple-400 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Real-time post feed with sentiment analysis
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Interactive post composer with ticker tagging
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Threaded comments and replies system
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Trending tickers with sentiment indicators
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Daily mood polling with visual results
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Moderation tools and reporting features
                </li>
              </ul>
              <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>API Integration:</strong> Connect to{" "}
                  <code>GET /api/community/posts</code>,{" "}
                  <code>POST /api/community/post</code>, and{" "}
                  <code>GET /api/community/trending</code> for live data
                </p>
              </div>
            </div>
          </div>
        );

      case "Tools":
        return (
          <div className="space-y-8">
            {/* Tools Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  🛠️{" "}
                  {activeToolsSubtab === "HeatMap"
                    ? "Market HeatMap"
                    : "Market Analysis Tools"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeToolsSubtab === "HeatMap"
                    ? "Interactive visual representation of market performance with real-time sentiment analysis"
                    : "Advanced analytical tools for market research and data visualization"}
                </p>
              </div>
            </div>

            {/* Tools Content */}
            {activeToolsSubtab === "HeatMap" && (
              <SentimentHeatMap onRefresh={() => setHeatmapLoading(true)} />
            )}
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

                {/* Watchlist */}
                <WatchlistWidget />

                {/* AI Insight */}
                <AIInsightWidget moodScore={moodScore} />

                {/* Community Feed */}
                <CommunityWidget posts={communityPosts} />
              </div>
            </div>
          </>
        );
        {
          [
            { symbol: "AAPL", change: 2.34, name: "Apple" },
            { symbol: "MSFT", change: 1.67, name: "Microsoft" },
            { symbol: "GOOGL", change: -0.89, name: "Alphabet" },
            { symbol: "AMZN", change: 3.12, name: "Amazon" },
            { symbol: "NVDA", change: 5.67, name: "NVIDIA" },
            { symbol: "TSLA", change: -2.45, name: "Tesla" },
            { symbol: "META", change: 1.23, name: "Meta" },
            { symbol: "BRK.B", change: 0.45, name: "Berkshire" },
            { symbol: "JPM", change: -1.12, name: "JPMorgan" },
            { symbol: "V", change: 0.78, name: "Visa" },
            { symbol: "JNJ", change: -0.34, name: "J&J" },
            { symbol: "WMT", change: 1.89, name: "Walmart" },
            { symbol: "PG", change: 0.56, name: "P&G" },
            { symbol: "UNH", change: 2.01, name: "UnitedHealth" },
            { symbol: "HD", change: -0.67, name: "Home Depot" },
            { symbol: "MA", change: 1.45, name: "Mastercard" },
            { symbol: "DIS", change: -1.78, name: "Disney" },
            { symbol: "BAC", change: 0.89, name: "Bank of America" },
          ].map((stock, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg cursor-pointer hover:opacity-80 transition-all duration-200 flex flex-col justify-between min-h-[80px] ${
                stock.change > 2
                  ? "bg-green-600 text-white"
                  : stock.change > 0
                    ? "bg-green-400 text-white"
                    : stock.change > -2
                      ? "bg-red-400 text-white"
                      : "bg-red-600 text-white"
              }`}
              style={{
                transform: `scale(${Math.min(1.2, Math.max(0.8, 1 + Math.abs(stock.change) / 10))})`,
              }}
            >
              <div className="font-bold text-xs">{stock.symbol}</div>
              <div className="text-xs opacity-90">{stock.name}</div>
              <div className="font-semibold text-sm">
                {stock.change > 0 ? "+" : ""}
                {stock.change}%
              </div>
            </div>
          ));
        }
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mr-2" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  MoorMeter
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <div key={item.key} className="relative">
                  {item.key === "Tools" ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                            activeTab === item.key
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          }`}
                        >
                          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                          {item.label}
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {item.subtabs?.map((subtab) => (
                          <DropdownMenuItem
                            key={subtab.key}
                            onClick={() => {
                              setActiveTab(item.key);
                              setActiveToolsSubtab(subtab.key);
                            }}
                            className="flex items-center cursor-pointer"
                          >
                            {subtab.icon && (
                              <subtab.icon className="w-4 h-4 mr-2" />
                            )}
                            {subtab.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <button
                      onClick={() => setActiveTab(item.key)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        activeTab === item.key
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      }`}
                    >
                      {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                      {item.label}
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 mr-2"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 dark:bg-gray-800">
              {navItems.map((item) => (
                <div key={item.key}>
                  {item.key === "Tools" ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Tools
                      </div>
                      {item.subtabs?.map((subtab) => (
                        <button
                          key={subtab.key}
                          onClick={() => {
                            setActiveTab(item.key);
                            setActiveToolsSubtab(subtab.key);
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center w-full px-6 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {subtab.icon && (
                            <subtab.icon className="w-4 h-4 mr-2" />
                          )}
                          {subtab.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveTab(item.key);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        activeTab === item.key
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                      }`}
                    >
                      {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">{renderContent()}</div>
      </main>
    </div>
  );
};

export default MoorMeterDashboard;
