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
    { te
