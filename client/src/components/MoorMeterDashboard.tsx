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
import { WatchlistModule } from "./moorMeter/WatchlistModule";
import { AIInsightWidget } from "./moorMeter/AIInsightWidget";
import { CommunityWidget } from "./moorMeter/CommunityWidget";
import { CommunityRooms } from "./social/CommunityRooms";
import { MoodScoreHero } from "./builder/MoodScoreHero";
import { TopStocksModule } from "./builder/TopStocksModule";
import { SentimentHeatMap } from "./moorMeter/SentimentHeatMap";
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
  console.log("MoorMeterDashboard component rendering...");
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
  const cryptoListingsResult = useCryptoListings(10);
  const { tickers: cryptoData = [], loading: cryptoLoading = false } =
    cryptoListingsResult || {};

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
    if (score >= 70) return "😊";
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
    { label: "Home", key: "Home", href: "#" },
    { label: "Market Mood", key: "Market Mood", href: "#market" },
    { label: "Watchlist", key: "Watchlist", href: "#watchlist" },
    { label: "News", key: "News", href: "#news" },
    {
      label: "Tool",
      key: "Tool",
      href: "#tool",
      subtabs: [{ label: "Heat map", key: "HeatMap", icon: BarChart3 }],
    },
    { label: "Community", key: "Community", href: "#community" },
  ];

  // Tools dropdown items
  const toolsItems = [{ label: "Market HeatMap", value: "HeatMap" }];

  // Function to render content based on active tab
  const renderTabContent = () => {
    console.log("Rendering tab content for activeTab:", activeTab);
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
          <WatchlistModule
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
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
          </div>
        );

      case "Community":
        return (
          <div className="space-y-8">
            {/* Community Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  🧑‍🤝‍🧑 Community{" "}
                  {activeCommunitySubtab === "Room" ? "Rooms" : "Insights"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeCommunitySubtab === "Room"
                    ? "Join community rooms and chat with other traders in real-time."
                    : "Discuss trends, share your sentiment, and track what others are saying."}
                </p>
              </div>

              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder={
                      activeCommunitySubtab === "Room"
                        ? "Search rooms..."
                        : "Search keywords, tickers, or users..."
                    }
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>

            {/* Render content based on subtab */}
            {activeCommunitySubtab === "Room" ? (
              <CommunityRooms />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Community content would go here */}
                  <CommunityWidget messages={communityMessages} />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Trending Topics */}
                  <TrendingTopicsWidget topics={trendingTopics} />
                </div>
              </div>
            )}
          </div>
        );

      case "Tool":
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
            {activeToolsSubtab === "HeatMap" && <SentimentHeatMap />}
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
                  {(item.key === "Tool" || item.key === "Community") &&
                  item.subtabs ? (
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
                              if (item.key === "Tool") {
                                setActiveToolsSubtab(subtab.key);
                              } else if (item.key === "Community") {
                                setActiveCommunitySubtab(subtab.key);
                              }
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
                  {(item.key === "Tool" || item.key === "Community") &&
                  item.subtabs ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {item.label}
                      </div>
                      {item.subtabs?.map((subtab) => (
                        <button
                          key={subtab.key}
                          onClick={() => {
                            setActiveTab(item.key);
                            if (item.key === "Tool") {
                              setActiveToolsSubtab(subtab.key);
                            } else if (item.key === "Community") {
                              setActiveCommunitySubtab(subtab.key);
                            }
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
        <div className="px-4 py-6 sm:px-0">{renderTabContent()}</div>
      </main>
    </div>
  );
};

export default MoorMeterDashboard;
