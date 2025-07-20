import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
  Bookmark,
  Share2,
  ThumbsUp,
  ThumbsDown,
  ArrowUp,
  ArrowDown,
  DollarSign,
  TrendingUpIcon,
  AlertCircle,
  Clock,
  LineChart,
  PieChart,
  Filter,
  SortAsc,
  Lightbulb,
  Twitter,
  Linkedin,
  Github,
  Mail,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

// Import existing components
import { TopStocksWidget } from "./moorMeter/TopStocksWidget";
import { NewsWidget } from "./moorMeter/NewsWidget";
import { MoodTrendChart } from "./moorMeter/MoodTrendChart";
import { TrendingTopicsWidget } from "./moorMeter/TrendingTopicsWidget";
import { PersonalMoodCard } from "./moorMeter/PersonalMoodCard";
import { WatchlistWidget } from "./moorMeter/WatchlistWidget";
import { AIInsightWidget } from "./moorMeter/AIInsightWidget";
import { CommunityWidget } from "./moorMeter/CommunityWidget";

// Import data hooks
import { useStockSentiment } from "../hooks/useStockSentiment";
import { useCombinedBusinessNews } from "../hooks/useCombinedBusinessNews";
import { useCryptoListings } from "../hooks/useCoinMarketCap";
import { formatCurrency, cn } from "../lib/utils";

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
  change24h: number;
  discussion_count: number;
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

interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  sentiment: number;
  source: string;
  timestamp: Date;
  relevanceScore: number;
  tickers: string[];
}

// Hero Section Component
const HeroSection: React.FC<{ moodScore: MoodScore }> = ({ moodScore }) => {
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
    if (score >= 70) return "from-green-400 via-green-500 to-emerald-600";
    if (score >= 50) return "from-yellow-400 via-orange-400 to-orange-500";
    return "from-red-400 via-red-500 to-red-600";
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

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MoorMeter
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Real-time market sentiment analysis powered by AI
          </p>

          <div className="flex flex-col items-center mb-12">
            <div className="text-lg text-blue-200 mb-4">Today's Market Mood</div>
            
            <div className="relative">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <div className="text-6xl md:text-7xl mb-2 animate-pulse">
                    {getMoodEmoji(moodScore.overall)}
                  </div>
                  <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${getMoodColor(moodScore.overall)} bg-clip-text text-transparent`}>
                    {moodScore.overall}
                  </div>
                  <div className="text-sm text-blue-200 font-medium">
                    {getMoodLabel(moodScore.overall)}
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full animate-ping delay-1000"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BarChart3 className="w-6 h-6 text-blue-400 mr-2" />
                  <span className="text-white font-semibold">Stocks</span>
                </div>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                  40%
                </Badge>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {moodScore.stocks}
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-blue-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${moodScore.stocks}%` }}
                ></div>
              </div>
              <div className="text-sm text-blue-200 mt-2">Market Performance</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Globe className="w-6 h-6 text-purple-400 mr-2" />
                  <span className="text-white font-semibold">News</span>
                </div>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                  30%
                </Badge>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {moodScore.news}
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-purple-400 h-2 rounded-full transition-all duration-1000 delay-200"
                  style={{ width: `${moodScore.news}%` }}
                ></div>
              </div>
              <div className="text-sm text-purple-200 mt-2">Headlines Sentiment</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-pink-400 mr-2" />
                  <span className="text-white font-semibold">Social</span>
                </div>
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-400/30">
                  30%
                </Badge>
              </div>
              <div className="text-3xl font-bold text-pink-400 mb-2">
                {moodScore.social}
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-pink-400 h-2 rounded-full transition-all duration-1000 delay-400"
                  style={{ width: `${moodScore.social}%` }}
                ></div>
              </div>
              <div className="text-sm text-pink-200 mt-2">Forum Chatter</div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Brain className="w-5 h-5 mr-2" />
              Explore Dashboard
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl">
              <TrendingUp className="w-5 h-5 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Trending Topics Widget
const EnhancedTrendingTopics: React.FC<{ topics: TrendingTopic[] }> = ({ topics }) => {
  const getSourceIcon = (source: TrendingTopic["source"]) => {
    switch (source) {
      case "reddit": return "🔴";
      case "twitter": return "🐦";
      case "discord": return "💬";
      default: return "📱";
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 5) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (change < -5) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <ArrowUp className="w-4 h-4 text-yellow-500 rotate-90" />;
  };

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-800 dark:via-gray-800 dark:to-orange-900/20">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-6 h-6" />
            <span>Trending Topics</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Hot
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <div key={topic.term} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-500 dark:text-gray-400">
                    #{index + 1}
                  </span>
                  <span className="text-lg">{getSourceIcon(topic.source)}</span>
                </div>
                
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {topic.term}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {topic.volume.toLocaleString()} discussions • {topic.discussion_count} comments
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">24h Change</div>
                  <div className="flex items-center">
                    {getTrendIcon(topic.change24h)}
                    <span className={`text-sm font-medium ml-1 ${
                      topic.change24h > 5 ? "text-green-600" :
                      topic.change24h < -5 ? "text-red-600" : "text-yellow-600"
                    }`}>
                      {topic.change24h > 0 ? "+" : ""}{topic.change24h.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sentiment</div>
                  <div className="flex items-center">
                    <div className="w-12 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          topic.sentiment >= 70 ? "bg-green-500" :
                          topic.sentiment >= 50 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${topic.sentiment}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{Math.round(topic.sentiment)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" className="w-full">
            <ExternalLink className="w-4 h-4 mr-2" />
            View All Trending Topics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Community Reactions Widget
const CommunityReactions: React.FC<{ messages: CommunityMessage[] }> = ({ messages }) => {
  const [filter, setFilter] = useState<"all" | "positive" | "negative">("all");
  
  const filteredMessages = useMemo(() => {
    switch (filter) {
      case "positive":
        return messages.filter(m => m.sentiment >= 60);
      case "negative":
        return messages.filter(m => m.sentiment <= 40);
      default:
        return messages;
    }
  }, [messages, filter]);

  const getPlatformIcon = (platform: CommunityMessage["platform"]) => {
    switch (platform) {
      case "reddit": return "🔴";
      case "twitter": return "🐦";
      case "discord": return "💬";
      default: return "📱";
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return "text-green-600 dark:text-green-400";
    if (sentiment >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-indigo-900/20">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6" />
            <span>Community Reactions</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Live
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Filter className="w-4 h-4 mr-1" />
                  {filter === "all" ? "All" : filter === "positive" ? "Positive" : "Negative"}
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  All Reactions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("positive")}>
                  Positive Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("negative")}>
                  Negative Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {filteredMessages.map((message) => (
            <div key={message.id} className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10 border-2 border-gray-200 dark:border-gray-600">
                  <AvatarImage src={message.avatar} alt={message.user} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                    {message.user.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {message.user}
                    </span>
                    <span className="text-lg">{getPlatformIcon(message.platform)}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                    {message.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">{message.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Sentiment:</span>
                      <span className={`text-xs font-medium ${getSentimentColor(message.sentiment)}`}>
                        {Math.round(message.sentiment)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t">
          <Button variant="outline" className="w-full">
            <MessageSquare className="w-4 h-4 mr-2" />
            Join the Discussion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Sidebar Component
const EnhancedSidebar: React.FC<{ moodScore: MoodScore }> = ({ moodScore }) => {
  const personalizedScore = Math.round(moodScore.overall * 0.85);
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-800 dark:to-blue-900/20">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Your Mood Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {personalizedScore}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Based on your watchlist
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${personalizedScore}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <WatchlistWidget />

      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-800 dark:via-gray-800 dark:to-green-900/20">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>AI Insight</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Today
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <div className="mb-3">
              📊 <span className="font-semibold">Market Analysis:</span> Technology sector showing strong momentum with AI-related stocks leading gains. 
              Federal Reserve sentiment remains neutral, suggesting stable interest rate environment.
            </div>
            <div>
              🎯 <span className="font-semibold">Recommendation:</span> Consider diversifying into emerging tech sectors while maintaining defensive positions.
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4">
            <Brain className="w-4 h-4 mr-2" />
            Get Detailed Analysis
          </Button>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="w-5 h-5" />
            <span>Quick Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Traders</span>
              <span className="font-semibold">12,847</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Messages Today</span>
              <span className="font-semibold">45,293</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sentiment Accuracy</span>
              <span className="font-semibold text-green-600">94.2%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-blue-400 mr-2" />
              <h3 className="text-xl font-bold">MoorMeter</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Real-time market sentiment analysis powered by AI. Track market mood, 
              analyze trends, and make informed decisions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400">
            © 2024 MoorMeter. All rights reserved.
          </div>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main HomePage Component
export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1D" | "7D" | "30D">("7D");

  const { data: stockSentiment, loading: stockLoading } = useStockSentiment();
  const { articles: newsArticles, loading: newsLoading } = useCombinedBusinessNews();

    const calculateMoodScore = useCallback((): MoodScore => {
    let stocksScore = stockSentiment?.score || 50;
    let newsScore = 45 + Math.random() * 20;
    let socialScore = 55 + Math.random() * 15;

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

    const [moodScore, setMoodScore] = useState<MoodScore>(() => calculateMoodScore());

        // Periodic updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMoodScore(calculateMoodScore());
    }, 30000);

    return () => clearInterval(interval);
  }, [calculateMoodScore]);

  const trendingTopics: TrendingTopic[] = [
    { term: "AI Revolution", sentiment: 85, volume: 12500, source: "reddit", change24h: 12.5, discussion_count: 1247 },
    { term: "Fed Meeting", sentiment: 35, volume: 8900, source: "twitter", change24h: -8.2, discussion_count: 892 },
    { term: "Crypto Rally", sentiment: 78, volume: 15600, source: "discord", change24h: 15.7, discussion_count: 2156 },
    { term: "Tech Earnings", sentiment: 65, volume: 7200, source: "reddit", change24h: 3.4, discussion_count: 567 },
    { term: "Market Volatility", sentiment: 42, volume: 5800, source: "twitter", change24h: -2.1, discussion_count: 423 },
  ];

  const communityMessages: CommunityMessage[] = [
    {
      id: "1",
      user: "TechBull2024",
      avatar: "/api/placeholder/32/32",
      message: "AI stocks are absolutely crushing it today! $NVDA to the moon 🚀",
      sentiment: 90,
      timestamp: new Date(Date.now() - 300000),
      likes: 47,
      platform: "reddit",
    },
    {
      id: "2",
      user: "MarketGuru",
      avatar: "/api/placeholder/32/32",
      message: "Fed uncertainty is creating some interesting opportunities in financials",
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

  const historicalMood = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => ({
      date: new Date(
        Date.now() - (6 - i) * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: 45 + Math.random() * 30,
      stocks: 40 + Math.random() * 35,
      news: 35 + Math.random() * 40,
      social: 50 + Math.random() * 25,
    })), []
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroSection moodScore={moodScore} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <TopStocksWidget stockLoading={stockLoading} />
            <NewsWidget articles={newsArticles} loading={newsLoading} />
            <MoodTrendChart
              data={historicalMood}
              timeframe={selectedTimeframe}
              setTimeframe={setSelectedTimeframe}
            />
            <EnhancedTrendingTopics topics={trendingTopics} />
            <CommunityReactions messages={communityMessages} />
          </div>

          <div className="lg:col-span-1">
            <EnhancedSidebar moodScore={moodScore} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
