import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  BellRing,
  Users,
  Star,
  Trophy,
  Target,
  Calendar,
  MapPin,
  Globe,
  CheckCircle,
  Award,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  UserPlus,
  MessageCircle,
  Heart,
  Pin,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  MoreHorizontal
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { User, UserPost } from "@/types/user";

interface TraderProfileProps {
  userId?: string;
  isCurrentUser?: boolean;
}

interface TradeHistoryItem {
  id: string;
  ticker: string;
  entryPrice: number;
  exitPrice?: number;
  pnlPercentage?: number;
  notes: string;
  date: Date;
  status: 'open' | 'closed';
  assetType: 'stock' | 'crypto' | 'options';
}

interface SentimentCall {
  id: string;
  ticker: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  note: string;
  timestamp: Date;
  accuracy?: 'correct' | 'incorrect' | 'pending';
}

interface PortfolioHolding {
  ticker: string;
  percentage: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  value: number;
}

export const TraderProfile = ({ userId, isCurrentUser = false }: TraderProfileProps) => {
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [tradeFilter, setTradeFilter] = useState("all");
  
  // Mock data - in real app, fetch based on userId
  const traderUser: User = {
    id: userId || "trader-123",
    email: "trader@example.com",
    username: "cryptowolf",
    firstName: "Alex",
    lastName: "Thompson", 
    avatar: "/placeholder.svg",
    bio: "Professional trader with 8+ years experience in crypto and tech stocks. Focus on momentum trading and sentiment analysis.",
    location: "New York, NY",
    website: "https://cryptowolf.trading",
    isVerified: true,
    isPremium: true,
    createdAt: new Date("2021-03-15"),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    preferences: {} as any,
    stats: {
      id: "1",
      userId: "trader-123",
      totalLogins: 245,
      totalPredictions: 186,
      accurateePredictions: 152,
      accuracyRate: 81.7,
      currentStreak: 12,
      longestStreak: 28,
      totalPointsEarned: 8450,
      badgesEarned: ["top_trader", "accuracy_master", "streak_king"],
      lastPredictionAt: new Date(),
      updatedAt: new Date()
    }
  };

  const mockPosts: UserPost[] = [
    {
      id: "1",
      userId: traderUser.id,
      title: "NVDA Looking Strong",
      content: "NVDA showing incredible momentum with AI sector rally. Volume spike confirms institutional buying. Target $145 by end of week. 🚀",
      type: "prediction",
      tags: ["NVDA", "AI", "bullish"],
      likes: 24,
      comments: 8,
      shares: 5,
      isPublic: true,
      isPinned: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    {
      id: "2", 
      userId: traderUser.id,
      title: "Market Sentiment Analysis",
      content: "Fear & Greed index at 72. Market getting overheated. Expecting a pullback in tech names. Taking profits on AAPL and MSFT positions.",
      type: "insight",
      tags: ["market", "sentiment", "bearish"],
      likes: 31,
      comments: 12,
      shares: 8,
      isPublic: true,
      isPinned: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      updatedAt: new Date()
    }
  ];

  const mockTrades: TradeHistoryItem[] = [
    {
      id: "1",
      ticker: "NVDA",
      entryPrice: 128.50,
      exitPrice: 142.30,
      pnlPercentage: 10.74,
      notes: "AI rally momentum play",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'closed',
      assetType: 'stock'
    },
    {
      id: "2",
      ticker: "BTC",
      entryPrice: 43200,
      exitPrice: 45800,
      pnlPercentage: 6.02,
      notes: "ETF approval momentum",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'closed',
      assetType: 'crypto'
    },
    {
      id: "3",
      ticker: "TSLA",
      entryPrice: 242.00,
      notes: "Oversold bounce play",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'open',
      assetType: 'stock'
    }
  ];

  const mockSentimentCalls: SentimentCall[] = [
    {
      id: "1",
      ticker: "AAPL",
      sentiment: "bullish",
      confidence: 85,
      note: "iPhone 15 sales exceeding expectations",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      accuracy: "correct"
    },
    {
      id: "2", 
      ticker: "AMZN",
      sentiment: "bearish",
      confidence: 72,
      note: "AWS growth concerns in Q4",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      accuracy: "pending"
    },
    {
      id: "3",
      ticker: "META",
      sentiment: "neutral",
      confidence: 60,
      note: "Mixed signals on VR adoption",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      accuracy: "incorrect"
    }
  ];

  const mockPortfolio: PortfolioHolding[] = [
    { ticker: "NVDA", percentage: 25, sentiment: "bullish", value: 12500 },
    { ticker: "BTC", percentage: 20, sentiment: "bullish", value: 10000 },
    { ticker: "AAPL", percentage: 15, sentiment: "neutral", value: 7500 },
    { ticker: "TSLA", percentage: 15, sentiment: "bearish", value: 7500 },
    { ticker: "MSFT", percentage: 10, sentiment: "bullish", value: 5000 },
    { ticker: "Cash", percentage: 15, sentiment: "neutral", value: 7500 }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'bearish': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="h-4 w-4" />;
      case 'bearish': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getAccuracyBadge = (accuracy?: string) => {
    switch (accuracy) {
      case 'correct': return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">✓ Correct</Badge>;
      case 'incorrect': return <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">✗ Incorrect</Badge>;
      default: return <Badge variant="secondary">⏳ Pending</Badge>;
    }
  };

  const winRate = mockTrades.filter(t => t.status === 'closed' && (t.pnlPercentage || 0) > 0).length / 
                   mockTrades.filter(t => t.status === 'closed').length * 100;
  const avgGain = mockTrades.filter(t => t.status === 'closed').reduce((acc, t) => acc + (t.pnlPercentage || 0), 0) /
                  mockTrades.filter(t => t.status === 'closed').length;

  // Interaction handlers
  const handleFollow = (userId: string) => {
    console.log(`Following user: ${userId}`);
    setIsFollowing(true);
  };

  const handleUnfollow = (userId: string) => {
    console.log(`Unfollowing user: ${userId}`);
    setIsFollowing(false);
    setAlertsEnabled(false); // Disable alerts when unfollowing
  };

  const handleToggleAlerts = (userId: string, enabled: boolean) => {
    console.log(`${enabled ? 'Enabling' : 'Disabling'} alerts for user: ${userId}`);
    setAlertsEnabled(enabled);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header Section */}
      <Card className="border-2">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="w-32 h-32 border-4 border-primary/20">
                <AvatarImage src={traderUser.avatar} alt={traderUser.username} />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                  {traderUser.firstName?.[0]}{traderUser.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-3 text-center sm:text-left">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold flex items-center gap-2 justify-center sm:justify-start">
                    {traderUser.firstName} {traderUser.lastName}
                    {traderUser.isVerified && (
                      <CheckCircle className="h-6 w-6 text-blue-500" />
                    )}
                  </h1>
                  <p className="text-xl text-muted-foreground">@{traderUser.username}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {traderUser.isVerified && (
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Educator
                    </Badge>
                  )}
                  {traderUser.isPremium && (
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                      <Award className="h-3 w-3 mr-1" />
                      Premium Trader
                    </Badge>
                  )}
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    <Trophy className="h-3 w-3 mr-1" />
                    Top 1% Credibility
                  </Badge>
                </div>
              </div>
            </div>

            {/* Bio and Details */}
            <div className="flex-1 space-y-4">
              <p className="text-foreground text-lg leading-relaxed">{traderUser.bio}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {traderUser.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{traderUser.location}</span>
                  </div>
                )}
                {traderUser.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <a href={traderUser.website} target="_blank" rel="noopener noreferrer" 
                       className="hover:text-primary transition-colors">
                      {traderUser.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {traderUser.createdAt.toLocaleDateString('en-US', { 
                    year: 'numeric', month: 'long' 
                  })}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isCurrentUser && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-6 ${isFollowing ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'}`}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className="px-6"
                >
                  {alertsEnabled ? <BellRing className="h-4 w-4 mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
                  {alertsEnabled ? 'Alerts On' : 'Get Alerts'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="posts" className="text-sm font-medium">Posts</TabsTrigger>
              <TabsTrigger value="trades" className="text-sm font-medium">Trade History</TabsTrigger>
              <TabsTrigger value="sentiment" className="text-sm font-medium">Sentiment Calls</TabsTrigger>
              <TabsTrigger value="portfolio" className="text-sm font-medium">Portfolio</TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-4">
              {mockPosts.map((post) => (
                <Card key={post.id} className={`${post.isPinned ? 'border-primary border-2' : ''}`}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={traderUser.avatar} />
                            <AvatarFallback>
                              {traderUser.firstName?.[0]}{traderUser.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold flex items-center gap-2">
                              @{traderUser.username}
                              {post.isPinned && <Pin className="h-4 w-4 text-primary" />}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {post.createdAt.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{post.type}</Badge>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                        <p className="text-foreground">{post.content}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-6 pt-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <ArrowUpCircle className="h-4 w-4 mr-1" />
                          {post.shares}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Trade History Tab */}
            <TabsContent value="trades" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-green-600">{winRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-blue-600">+{avgGain.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Avg Gain</div>
                  </Card>
                </div>
                <Select value={tradeFilter} onValueChange={setTradeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Trades</SelectItem>
                    <SelectItem value="stock">Stocks</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="options">Options</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Trade History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTrades
                      .filter(trade => tradeFilter === 'all' || trade.assetType === tradeFilter)
                      .map((trade) => (
                      <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="uppercase">{trade.ticker}</Badge>
                          <div>
                            <p className="font-medium">${trade.entryPrice.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">Entry</p>
                          </div>
                          {trade.exitPrice && (
                            <div>
                              <p className="font-medium">${trade.exitPrice.toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">Exit</p>
                            </div>
                          )}
                          {trade.pnlPercentage && (
                            <Badge className={trade.pnlPercentage > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                              {trade.pnlPercentage > 0 ? '+' : ''}{trade.pnlPercentage.toFixed(1)}%
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{trade.notes}</p>
                          <p className="text-xs text-muted-foreground">{trade.date.toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sentiment Calls Tab */}
            <TabsContent value="sentiment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sentiment Calls</CardTitle>
                  <CardDescription>AI-powered sentiment predictions with accuracy tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSentimentCalls.map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="uppercase font-mono">{call.ticker}</Badge>
                          <div className="flex items-center gap-2">
                            <Badge className={getSentimentColor(call.sentiment)}>
                              {getSentimentIcon(call.sentiment)}
                              <span className="ml-1 capitalize">{call.sentiment}</span>
                            </Badge>
                            <span className="text-sm text-muted-foreground">{call.confidence}% confidence</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{call.note}</p>
                            <p className="text-xs text-muted-foreground">{call.timestamp.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getAccuracyBadge(call.accuracy)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-4">
              {traderUser.isPremium ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Portfolio Allocation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockPortfolio.map((holding) => (
                          <div key={holding.ticker} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-medium w-16">{holding.ticker}</span>
                              <Badge className={getSentimentColor(holding.sentiment)} variant="outline">
                                {getSentimentIcon(holding.sentiment)}
                                <span className="ml-1 capitalize">{holding.sentiment}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-medium">{holding.percentage}%</p>
                                <p className="text-sm text-muted-foreground">${holding.value.toLocaleString()}</p>
                              </div>
                              <div className="w-20">
                                <Progress value={holding.percentage} className="h-2" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Holdings by Sentiment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {mockPortfolio.slice(0, 5).map((holding) => (
                          <div key={holding.ticker} className="p-3 border rounded-lg text-center">
                            <div className="font-mono font-bold">{holding.ticker}</div>
                            <Badge className={getSentimentColor(holding.sentiment)} variant="outline">
                              {getSentimentIcon(holding.sentiment)}
                              <span className="ml-1 capitalize">{holding.sentiment}</span>
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
                    <p className="text-muted-foreground mb-4">
                      Portfolio insights are available for Premium users only.
                    </p>
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-500">
                      Upgrade to Premium
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{traderUser.stats.accuracyRate}%</div>
                  <div className="text-xs text-muted-foreground">Accuracy Rate</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{traderUser.stats.currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Current Streak</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Followers</span>
                  <span className="font-semibold">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Following</span>
                  <span className="font-semibold">312</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Predictions</span>
                  <span className="font-semibold">{traderUser.stats.totalPredictions}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Tier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-lg px-4 py-2">
                  Premium Trader
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Access to advanced analytics, portfolio insights, and priority support
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Top Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Top 1% Trader</div>
                    <div className="text-xs text-muted-foreground">Accuracy ranking</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">100+ Accurate Calls</div>
                    <div className="text-xs text-muted-foreground">Prediction master</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">28-Day Streak</div>
                    <div className="text-xs text-muted-foreground">Consistency king</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Connect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  Trading Blog
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Discord Community
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Refer Friends
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
