import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Flame,
  Clock,
  Star,
  Eye,
  Search,
  Filter,
  Plus,
  Hash,
  Brain,
  Zap,
  Target,
  Image as ImageIcon,
  Camera,
  Smile,
  BarChart3,
  Users,
  Bookmark,
  ChevronDown,
  Sparkles,
  DollarSign,
  MessageSquare,
  Heart,
  Repeat2,
  Bell,
  Settings,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PostCard, type PostCardData } from "./social/PostCard";

// Enhanced Post Wall Types
export interface PostFilter {
  sentiment?: "Bullish" | "Bearish" | "Neutral" | "All";
  postType?: "Insight" | "Prediction" | "Chart" | "Meme" | "Question" | "All";
  ticker?: string;
  timeframe?: "1h" | "24h" | "week" | "month" | "all";
}

export interface PostComposerData {
  content: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  postType: "Insight" | "Prediction" | "Chart" | "Meme" | "Question";
  tickers: string[];
  tags: string[];
  mediaUrls: string[];
}

interface SentimentPostWallProps {
  onNavigateToProfile?: (userId: string) => void;
  initialFilter?: PostFilter;
}

// Mock enhanced data for StockTwits/Reddit style feed
const mockEnhancedPosts: PostCardData[] = [
  {
    id: "1",
    user: {
      id: "user1",
      username: "WolfOfAI",
      handle: "@wolfofai",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
      verified: true,
      premium: true,
      credibilityScore: 97,
      topPercentage: 1,
    },
    timestamp: "15m ago",
    content: "🔥 MASSIVE breakout alert! $NVDA just smashed through $180 resistance with INSANE volume. This AI revolution is just getting started. 🚀 My PT: $220 by EOY. The institutions are loading up BIG TIME! 📈💎 #AIRevolution #TechBull",
    tickers: [
      { symbol: "NVDA", price: 182.75, change: 9.25, changePercent: 5.33 }
    ],
    sentiment: "Bullish",
    tags: ["AI Revolution", "Breakout", "Volume Alert"],
    categories: ["AI", "Technical Analysis", "Momentum"],
    engagement: { likes: 347, comments: 89, reposts: 156, saves: 234, views: 4567 },
    isFollowing: false,
    alertsEnabled: false,
    isLiked: false,
    isSaved: false,
    isReposted: false,
    isTrending: true,
  },
  {
    id: "2",
    user: {
      id: "user2",
      username: "CryptoSage",
      handle: "@cryptosage",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=faces",
      verified: true,
      premium: false,
      credibilityScore: 91,
      topPercentage: 3,
    },
    timestamp: "32m ago",
    content: "⚠️ CAUTION: $BTC showing bearish divergence on 4H chart. RSI overbought + declining volume = potential pullback to $91.5k support. Not FUD, just being realistic. Risk management is key! 🧠 Set your stops! 🛡️",
    tickers: [
      { symbol: "BTC", price: 94150, change: -1250, changePercent: -1.31 }
    ],
    sentiment: "Bearish",
    tags: ["Technical Analysis", "Risk Management", "Support Levels"],
    categories: ["Crypto", "Technical Analysis", "Risk Management"],
    engagement: { likes: 203, comments: 67, reposts: 45, saves: 178, views: 2890 },
    isFollowing: true,
    alertsEnabled: true,
    isLiked: true,
    isSaved: true,
    isReposted: false,
    needsReview: false,
  },
  {
    id: "3",
    user: {
      id: "user3",
      username: "QuantKing",
      handle: "@quantking",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
      verified: true,
      premium: true,
      credibilityScore: 94,
      topPercentage: 1,
    },
    timestamp: "1h ago",
    content: "📊 MEGA THREAD: Why $TSLA is setting up for the BIGGEST short squeeze of 2024 🚀\n\n1️⃣ Short interest at ATH (32% of float)\n2️⃣ FSD Beta showing INCREDIBLE progress\n3️⃣ China sales recovering faster than expected\n4️⃣ Energy business about to EXPLODE\n\nThis could be EPIC! 🔥⚡",
    tickers: [
      { symbol: "TSLA", price: 248.50, change: 15.75, changePercent: 6.77 }
    ],
    sentiment: "Bullish",
    tags: ["Short Squeeze", "FSD", "China Recovery", "Thread"],
    categories: ["EV", "Technical Analysis", "Fundamental"],
    engagement: { likes: 892, comments: 234, reposts: 445, saves: 567, views: 8934 },
    isFollowing: false,
    alertsEnabled: false,
    isLiked: false,
    isSaved: false,
    isReposted: false,
    isTrending: true,
    isPinned: false,
  },
  {
    id: "4",
    user: {
      id: "user4",
      username: "MacroMaven",
      handle: "@macromaven",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
      verified: true,
      premium: true,
      credibilityScore: 89,
      topPercentage: 5,
    },
    timestamp: "2h ago",
    content: "🧊 Fed pivot narrative is DEAD. Powell's latest comments + sticky inflation = rates staying higher for longer. This changes EVERYTHING for growth stocks. $QQQ could retest $350 support. Defensive positioning recommended. 🛡️📉",
    tickers: [
      { symbol: "QQQ", price: 378.95, change: -6.23, changePercent: -1.62 },
      { symbol: "SPY", price: 445.21, change: -3.45, changePercent: -0.77 }
    ],
    sentiment: "Bearish",
    tags: ["Fed Policy", "Macro", "Defensive"],
    categories: ["Macro", "Market Analysis", "Fed Policy"],
    engagement: { likes: 445, comments: 123, reposts: 89, saves: 234, views: 3456 },
    isFollowing: true,
    alertsEnabled: false,
    isLiked: false,
    isSaved: true,
    isReposted: false,
  },
  {
    id: "5",
    user: {
      id: "user5",
      username: "DegenerateGambler",
      handle: "@degengambler",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
      verified: false,
      premium: false,
      credibilityScore: 67,
    },
    timestamp: "3h ago",
    content: "😂 YOLO UPDATE: Turned $500 into $15k with $GME 0DTE calls this morning 🚀💎🙌 \n\nNow gonna lose it all on $PLTR puts because why not? 🤡 This is financial advice (it's not) 📈📉💸\n\n#YOLO #DiamondHands #ToTheMoon",
    tickers: [
      { symbol: "GME", price: 23.45, change: 4.67, changePercent: 24.86 },
      { symbol: "PLTR", price: 18.23, change: -0.89, changePercent: -4.66 }
    ],
    sentiment: "Neutral",
    tags: ["YOLO", "0DTE", "Meme"],
    categories: ["Meme", "Options", "YOLO"],
    engagement: { likes: 1234, comments: 456, reposts: 234, saves: 67, views: 5678 },
    isFollowing: false,
    alertsEnabled: false,
    isLiked: true,
    isSaved: false,
    isReposted: false,
  }
];

const popularTickers = ["NVDA", "TSLA", "AAPL", "MSFT", "GOOGL", "AMZN", "META", "BTC", "ETH", "SPY", "QQQ"];

export const SentimentPostWall = ({ onNavigateToProfile, initialFilter }: SentimentPostWallProps) => {
  const [activeTab, setActiveTab] = useState<"hot" | "new" | "top" | "watchlist" | "ai-picks">("hot");
  const [posts, setPosts] = useState<PostCardData[]>(mockEnhancedPosts);
  const [filter, setFilter] = useState<PostFilter>(initialFilter || {});
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Post Composer State
  const [composerData, setComposerData] = useState<PostComposerData>({
    content: "",
    sentiment: "Neutral",
    postType: "Insight",
    tickers: [],
    tags: [],
    mediaUrls: [],
  });
  const [showComposer, setShowComposer] = useState(false);

  // Auto-refresh feed
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      if (Math.random() > 0.7) {
        setPosts(current => [...current].sort(() => Math.random() - 0.5));
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPosts([...mockEnhancedPosts].sort(() => Math.random() - 0.5));
    setIsRefreshing(false);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "Bearish": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Zap className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish": return "bg-green-500 hover:bg-green-600";
      case "Bearish": return "bg-red-500 hover:bg-red-600";
      default: return "bg-yellow-500 hover:bg-yellow-600";
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "Insight": return <Brain className="h-4 w-4" />;
      case "Prediction": return <Target className="h-4 w-4" />;
      case "Chart": return <BarChart3 className="h-4 w-4" />;
      case "Meme": return <Smile className="h-4 w-4" />;
      case "Question": return <MessageSquare className="h-4 w-4" />;
      default: return <Hash className="h-4 w-4" />;
    }
  };

  const handleTickerInput = (input: string) => {
    // Auto-complete ticker symbols
    const tickerMatches = input.match(/\$([A-Z]+)/g);
    if (tickerMatches) {
      const newTickers = tickerMatches.map(match => match.substring(1));
      setComposerData(prev => ({
        ...prev,
        tickers: [...new Set([...prev.tickers, ...newTickers])]
      }));
    }
  };

  const handlePostSubmit = () => {
    // Simulate post creation
    const newPost: PostCardData = {
      id: Date.now().toString(),
      user: {
        id: "current-user",
        username: "You",
        handle: "@you",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
        verified: false,
        premium: true,
        credibilityScore: 85,
      },
      timestamp: "now",
      content: composerData.content,
      tickers: composerData.tickers.map(symbol => ({
        symbol,
        price: Math.random() * 1000,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 10,
      })),
      sentiment: composerData.sentiment,
      tags: composerData.tags,
      categories: [composerData.postType],
      engagement: { likes: 0, comments: 0, reposts: 0, saves: 0, views: 1 },
      isFollowing: false,
      alertsEnabled: false,
      isLiked: false,
      isSaved: false,
      isReposted: false,
    };

    setPosts(prev => [newPost, ...prev]);
    setComposerData({
      content: "",
      sentiment: "Neutral",
      postType: "Insight",
      tickers: [],
      tags: [],
      mediaUrls: [],
    });
    setShowComposer(false);
  };

  const filteredPosts = posts.filter(post => {
    if (searchQuery && !post.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !post.user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !post.tickers.some(t => t.symbol.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    if (filter.sentiment && filter.sentiment !== "All" && post.sentiment !== filter.sentiment) {
      return false;
    }
    
    if (filter.ticker && !post.tickers.some(t => t.symbol === filter.ticker)) {
      return false;
    }
    
    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (activeTab) {
      case "hot":
        return (b.engagement.likes + b.engagement.comments * 2 + b.engagement.reposts * 3) - 
               (a.engagement.likes + a.engagement.comments * 2 + a.engagement.reposts * 3);
      case "top":
        return b.engagement.likes - a.engagement.likes;
      case "new":
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      default:
        return 0;
    }
  });

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            engagement: { 
              ...post.engagement, 
              likes: post.isLiked ? post.engagement.likes - 1 : post.engagement.likes + 1 
            }
          }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    console.log(`Opening comments for post: ${postId}`);
  };

  const handleRepost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isReposted: !post.isReposted,
            engagement: { 
              ...post.engagement, 
              reposts: post.isReposted ? post.engagement.reposts - 1 : post.engagement.reposts + 1 
            }
          }
        : post
    ));
  };

  const handleSave = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const handleFollow = (userId: string) => {
    setPosts(prev => prev.map(post => 
      post.user.id === userId 
        ? { ...post, isFollowing: true }
        : post
    ));
  };

  const handleUnfollow = (userId: string) => {
    setPosts(prev => prev.map(post => 
      post.user.id === userId 
        ? { ...post, isFollowing: false }
        : post
    ));
  };

  const handleToggleAlerts = (userId: string) => {
    setPosts(prev => prev.map(post => 
      post.user.id === userId 
        ? { ...post, alertsEnabled: !post.alertsEnabled }
        : post
    ));
  };

  const handleUserClick = (userId: string) => {
    onNavigateToProfile?.(userId);
  };

  const handleTickerClick = (symbol: string) => {
    setFilter(prev => ({ ...prev, ticker: symbol }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Sentiment Feed 🚀
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Real-time trader sentiment, market insights, and community discussions
          </p>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-green-900/50 to-green-800/50 border-green-700/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">73%</div>
              <div className="text-sm text-green-300">Bullish Sentiment</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-900/50 to-red-800/50 border-red-700/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">18%</div>
              <div className="text-sm text-red-300">Bearish Sentiment</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-blue-700/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">2.4k</div>
              <div className="text-sm text-blue-300">Active Traders</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 border-purple-700/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">156</div>
              <div className="text-sm text-purple-300">Posts/Hour</div>
            </CardContent>
          </Card>
        </div>

        {/* Feed Controls */}
        <div className="sticky top-4 z-50 mb-6">
          <Card className="bg-slate-800/90 backdrop-blur-xl border-slate-700/50">
            <CardContent className="p-6">
              {/* Main Navigation Tabs */}
              <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  <TabsList className="grid grid-cols-5 bg-slate-700/50">
                    <TabsTrigger value="hot" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                      <Flame className="h-4 w-4" />
                      Hot
                    </TabsTrigger>
                    <TabsTrigger value="new" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      <Clock className="h-4 w-4" />
                      New
                    </TabsTrigger>
                    <TabsTrigger value="top" className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                      <Star className="h-4 w-4" />
                      Top
                    </TabsTrigger>
                    <TabsTrigger value="watchlist" className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white">
                      <Eye className="h-4 w-4" />
                      Watchlist
                    </TabsTrigger>
                    <TabsTrigger value="ai-picks" className="flex items-center gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                      <Brain className="h-4 w-4" />
                      AI Picks
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search posts, users, or tickers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Select value={filter.sentiment || "All"} onValueChange={(value) => setFilter(prev => ({ ...prev, sentiment: value as any }))}>
                      <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-slate-200">
                        <SelectValue placeholder="Sentiment" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="All">All Sentiment</SelectItem>
                        <SelectItem value="Bullish">🔥 Bullish</SelectItem>
                        <SelectItem value="Bearish">🧊 Bearish</SelectItem>
                        <SelectItem value="Neutral">😐 Neutral</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filter.ticker || "all-tickers"} onValueChange={(value) => setFilter(prev => ({ ...prev, ticker: value === "all-tickers" ? undefined : value }))}>
                      <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-slate-200">
                        <SelectValue placeholder="Ticker" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all-tickers">All Tickers</SelectItem>
                        {popularTickers.map(ticker => (
                          <SelectItem key={ticker} value={ticker}>${ticker}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Post Composer */}
        <Card className="mb-6 bg-slate-800/90 backdrop-blur-xl border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="ring-2 ring-purple-500/30">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">YU</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                {!showComposer ? (
                  <div
                    onClick={() => setShowComposer(true)}
                    className="w-full p-4 bg-slate-700/50 rounded-lg border border-slate-600 cursor-pointer hover:bg-slate-700/70 transition-colors"
                  >
                    <p className="text-slate-400">Share your market insights... Use $TICKER to mention stocks 📊</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Share your market insights... Use $TICKER to mention stocks 📊"
                      value={composerData.content}
                      onChange={(e) => {
                        setComposerData(prev => ({ ...prev, content: e.target.value }));
                        handleTickerInput(e.target.value);
                      }}
                      className="min-h-[120px] bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 text-lg resize-none"
                    />
                    
                    {/* Composer Controls */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Sentiment:</span>
                        <Button
                          variant={composerData.sentiment === "Bullish" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setComposerData(prev => ({ ...prev, sentiment: "Bullish" }))}
                          className={composerData.sentiment === "Bullish" ? getSentimentColor("Bullish") : "border-slate-600 text-slate-300"}
                        >
                          {getSentimentIcon("Bullish")}
                          Bullish
                        </Button>
                        <Button
                          variant={composerData.sentiment === "Bearish" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setComposerData(prev => ({ ...prev, sentiment: "Bearish" }))}
                          className={composerData.sentiment === "Bearish" ? getSentimentColor("Bearish") : "border-slate-600 text-slate-300"}
                        >
                          {getSentimentIcon("Bearish")}
                          Bearish
                        </Button>
                        <Button
                          variant={composerData.sentiment === "Neutral" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setComposerData(prev => ({ ...prev, sentiment: "Neutral" }))}
                          className={composerData.sentiment === "Neutral" ? getSentimentColor("Neutral") : "border-slate-600 text-slate-300"}
                        >
                          {getSentimentIcon("Neutral")}
                          Neutral
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Type:</span>
                        <Select value={composerData.postType} onValueChange={(value: any) => setComposerData(prev => ({ ...prev, postType: value }))}>
                          <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="Insight">🧠 Insight</SelectItem>
                            <SelectItem value="Prediction">🎯 Prediction</SelectItem>
                            <SelectItem value="Chart">📊 Chart</SelectItem>
                            <SelectItem value="Meme">😂 Meme</SelectItem>
                            <SelectItem value="Question">❓ Question</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Quick Ticker Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-slate-400">Quick tickers:</span>
                      {popularTickers.slice(0, 8).map((ticker) => (
                        <Button
                          key={ticker}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={() => setComposerData(prev => ({ 
                            ...prev, 
                            content: prev.content + `$${ticker} `,
                            tickers: [...new Set([...prev.tickers, ticker])]
                          }))}
                        >
                          ${ticker}
                        </Button>
                      ))}
                    </div>

                    {/* Submit Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">{composerData.content.length}/500</span>
                        {composerData.tickers.length > 0 && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-green-400">{composerData.tickers.join(", ")}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowComposer(false)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          Cancel
                        </Button>
                        <Button
                          disabled={!composerData.content.trim()}
                          onClick={handlePostSubmit}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Post Insight
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {sortedPosts.length > 0 ? (
            sortedPosts.map((post) => (
              <div key={post.id} className="transform transition-all duration-300 hover:scale-[1.01]">
                <PostCard
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onRepost={handleRepost}
                  onSave={handleSave}
                  onFollow={handleFollow}
                  onUnfollow={handleUnfollow}
                  onToggleAlerts={handleToggleAlerts}
                  onUserClick={handleUserClick}
                  onTickerClick={handleTickerClick}
                  showEngagementCounts={true}
                />
              </div>
            ))
          ) : (
            <Card className="bg-slate-800/90 backdrop-blur-xl border-slate-700/50">
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-slate-200">No posts found</h3>
                <p className="text-slate-400 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilter({});
                    setSearchQuery("");
                  }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Load More Posts
          </Button>
        </div>
      </div>
    </div>
  );
};
