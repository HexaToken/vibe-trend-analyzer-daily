import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingTicker } from "./TrendingTicker";
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
  Lock,
  MessageSquare,
  Hash,
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
import { LivePollsWidget } from "./stockChannel/LivePollsWidget";
import { AISummaryWidget } from "./stockChannel/AISummaryWidget";
import { TrendingTopicsWidget as EnhancedTrendingTopicsWidget } from "./stockChannel/TrendingTopicsWidget";

import { CommunityForum } from "./community/CommunityForum";
import { ChatInterface } from "./moorMeter/ChatInterface";
import { CryptoChannels } from "./social/CryptoChannels";
import { OffTopicLounge } from "./social/OffTopicLounge";
import { MoodScoreHero } from "./builder/MoodScoreHero";
import { TopStocksModule } from "./builder/TopStocksModule";
import { SentimentHeatMap } from "./moorMeter/SentimentHeatMap";
import { PrivateRoomsContainer } from "./privateRooms/PrivateRoomsContainer";
import { formatCurrency, cn } from "../lib/utils";
import { useMoodTheme } from "../contexts/MoodThemeContext";
import { MoodThemeToggle } from "./ui/mood-theme-toggle";

// Types
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
  const { setMoodScore, bodyGradient, isDynamicMode } = useMoodTheme();
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1D" | "7D" | "30D">("7D");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [activeToolsSubtab, setActiveToolsSubtab] = useState("HeatMap");
  const [activeCommunitySubtab, setActiveCommunitySubtab] = useState("Chat");
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"General" | "Crypto">("General");

  const [sentimentTimeframe, setSentimentTimeframe] = useState<"24h" | "7d" | "30d">("24h");
  const [sentimentViewMode, setSentimentViewMode] = useState<"absolute" | "net">("absolute");
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ ticker: string; time: string; data: any } | null>(null);

  const { data: stockSentiment, loading: stockLoading } = useStockSentiment();
  const { articles: newsArticles, loading: newsLoading } = useCombinedBusinessNews();
  const cryptoListingsResult = useCryptoListings(10);
  const { tickers: cryptoData = [], loading: cryptoLoading = false } = cryptoListingsResult || {};

  const moodScore: MoodScore = useMemo(() => {
    let stocksScore = stockSentiment?.score || 50;
    let newsScore = 65;
    let socialScore = 68;

    const overall = Math.round(
      stocksScore * 0.4 + newsScore * 0.3 + socialScore * 0.3
    );

    return {
      overall,
      stocks: stocksScore,
      news: newsScore,
      social: socialScore,
      timestamp: new Date(),
    };
  }, [stockSentiment?.score]);

    const [localMoodScore, setLocalMoodScore] = useState<MoodScore>(moodScore);

  const generateMockTrendData = () => {
    const data = [];
    const baseDate = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: 45 + Math.random() * 30,
        stocks: 40 + Math.random() * 40,
        news: 35 + Math.random() * 35,
        social: 50 + Math.random() * 30,
      });
    }

    return data;
  };

  useEffect(() => {
    setLocalMoodScore(moodScore);
    setMoodScore(moodScore);

    const interval = setInterval(() => {
      setLocalMoodScore(moodScore);
      setMoodScore(moodScore);
    }, 30000);

    return () => clearInterval(interval);
  }, [moodScore, setMoodScore]);

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

    const trendingTopics: TrendingTopic[] = [
    { term: "AI Revolution", sentiment: 85, volume: 12500, source: "reddit" },
    { term: "Fed Meeting", sentiment: 35, volume: 8900, source: "twitter" },
    { term: "Crypto Rally", sentiment: 78, volume: 15600, source: "discord" },
    { term: "Tech Earnings", sentiment: 65, volume: 11200, source: "reddit" },
  ];

  const communityMessages: CommunityMessage[] = [
    {
      id: "1",
      user: "TraderJoe",
      avatar: "/api/placeholder/32/32",
      message: "Market looking bullish after the latest data!",
      sentiment: 75,
      timestamp: new Date(Date.now() - 300000),
      likes: 12,
      platform: "reddit",
    },
    {
      id: "2",
      user: "CryptoQueen",
      avatar: "/api/placeholder/32/32",
      message: "Bitcoin breaking resistance levels 🚀",
      sentiment: 85,
      timestamp: new Date(Date.now() - 600000),
      likes: 25,
      platform: "twitter",
    },
  ];

  const renderMainContent = () => {
    switch (activeTab) {
      case "Home":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            <MoodScoreHero
                moodScore={localMoodScore}
                timeframe={selectedTimeframe}
                onTimeframeChange={setSelectedTimeframe}
              />
              <TopStocksModule />
              <NewsWidget articles={newsArticles} loading={newsLoading} />
            </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MoodTrendChart
                data={generateMockTrendData()}
                timeframe={selectedTimeframe}
                setTimeframe={setSelectedTimeframe}
              />
              <TrendingTopicsWidget topics={trendingTopics} />
            </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <PersonalMoodCard />
              <WatchlistWidget />
              <AIInsightWidget moodScore={localMoodScore} />
            </div>
          </div>
        );

      case "Tools":
        return (
          <div className="space-y-6">
            <Tabs value={activeToolsSubtab} onValueChange={setActiveToolsSubtab}>
              <TabsList>
                <TabsTrigger value="HeatMap">Heat Map</TabsTrigger>
                <TabsTrigger value="Watchlist">Watchlist</TabsTrigger>
                <TabsTrigger value="Analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="HeatMap">
                <SentimentHeatMap
                  timeframe={sentimentTimeframe}
                  onTimeframeChange={setSentimentTimeframe}
                  viewMode={sentimentViewMode}
                  onViewModeChange={setSentimentViewMode}
                  loading={heatmapLoading}
                  onLoadingChange={setHeatmapLoading}
                  hoveredCell={hoveredCell}
                  onHoveredCellChange={setHoveredCell}
                />
              </TabsContent>

              <TabsContent value="Watchlist">
                <WatchlistModule />
              </TabsContent>

              <TabsContent value="Analytics">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <LivePollsWidget />
                  <AISummaryWidget />
                  <EnhancedTrendingTopicsWidget />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case "Community":
        return (
          <div className="space-y-6">
            <Tabs value={activeCommunitySubtab} onValueChange={setActiveCommunitySubtab}>
                            <TabsList>
                                <TabsTrigger value="Chat">Live Chat</TabsTrigger>
                <TabsTrigger value="Rooms">Rooms</TabsTrigger>
                <TabsTrigger value="Space">Space</TabsTrigger>
                <TabsTrigger value="Forum">Forum</TabsTrigger>
              </TabsList>

              <TabsContent value="Chat">
                <ChatInterface />
              </TabsContent>

                            <TabsContent value="Rooms">
                <div className="space-y-6">
                  <CommunityRooms />
                  <CryptoChannels />
                  <OffTopicLounge />
                </div>
              </TabsContent>

                                          <TabsContent value="Space">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Hash className="h-5 w-5 text-purple-400" />
                        Space Central
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">🚀</div>
                        <h3 className="text-xl font-semibold mb-2">Welcome to Space Central</h3>
                        <p className="text-muted-foreground mb-4">
                          A dedicated space for community discussions and interactions.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          For the full Space experience with crypto channels and off-topic lounge,
                          visit the Futuristic Homepage → Community → Space.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

                            <TabsContent value="Forum">
                <CommunityForum />
              </TabsContent>
            </Tabs>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
            <p className="text-muted-foreground">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-all duration-300",
      isDynamicMode && bodyGradient ? bodyGradient : "bg-background"
    )}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MoorMeter
              </h1>
              <div className="absolute -top-1 -right-2">
                <Badge variant="secondary" className="text-xs">
                  v2.0
                </Badge>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-2xl">{getMoodEmoji(localMoodScore.overall)}</span>
              <div className="text-sm">
                <div className="font-semibold">{getMoodLabel(localMoodScore.overall)}</div>
                <div className="text-muted-foreground">{localMoodScore.overall}/100</div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks, news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48"
              />
            </div>
            <MoodThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className={cn(
          "mb-6 transition-all duration-300",
          mobileMenuOpen ? "block" : "hidden lg:block"
        )}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:flex">
              <TabsTrigger value="Home" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </TabsTrigger>
              <TabsTrigger value="Tools" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Tools</span>
              </TabsTrigger>
              <TabsTrigger value="Community" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Community</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content */}
        {renderMainContent()}
      </div>
    </div>
  );
};
