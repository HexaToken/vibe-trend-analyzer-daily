import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
    Search,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Bell,
  Settings,
  Brain,
  Moon,
  Plus,
  Flame,
  Newspaper,
  ChevronDown,
  MessageSquare,
  Users
} from 'lucide-react';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import { cn } from '../lib/utils';
import { WatchlistContainerBlock } from './watchlist/WatchlistContainerBlock';
import { ChatInterface } from './moorMeter/ChatInterface';
import { SpaceSwitcherWidget } from './community/SpaceSwitcherWidget';
import { PrivateRoomsContainer } from './privateRooms/PrivateRoomsContainer';
import { SentimentHeatMap } from './moorMeter/SentimentHeatMap';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface MoodScore {
  overall: number;
  stocks: number;
  news: number;
  social: number;
  timestamp: Date;
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  trendData: number[];
}

interface TrendingTopic {
  topic: string;
  label: string;
  mentions: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  icon: string;
}

export const FuturisticHomepage: React.FC = () => {
  const { setMoodScore } = useMoodTheme();
    const [searchFocused, setSearchFocused] = useState(false);
                                        const [activeSection, setActiveSection] = useState<'home' | 'market-mood' | 'watchlist' | 'news-feed' | 'community' | 'chat' | 'space' | 'rooms' | 'tool'>('home');
      const [activeToolSubtab, setActiveToolSubtab] = useState("Market");
    const [activeMarketSubtab, setActiveMarketSubtab] = useState("Tools");
  const [activeToolsSubtab, setActiveToolsSubtab] = useState("HeatMap");
  
  // Core mood data
  const [moodScore] = useState<MoodScore>({
    overall: 72,
    stocks: 68,
    news: 75,
    social: 74,
    timestamp: new Date()
  });

  // Top 10 Movers data with logos and sentiment
  const [topMovers] = useState<StockData[]>([
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.28, change: 23.45, changePercent: 2.76, sentiment: 'bullish', trendData: [870, 872, 878, 875] },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: -8.22, changePercent: -3.21, sentiment: 'bearish', trendData: [245, 247, 250, 248] },
    { symbol: 'AAPL', name: 'Apple Inc', price: 190.64, change: 4.12, changePercent: 2.21, sentiment: 'bullish', trendData: [192, 191, 189, 190] },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 139.69, change: -2.87, changePercent: -2.02, sentiment: 'bearish', trendData: [142, 140, 138, 139] },
    { symbol: 'MSFT', name: 'Microsoft Corp', price: 378.85, change: 7.44, changePercent: 2.00, sentiment: 'bullish', trendData: [375, 377, 380, 378] },
    { symbol: 'AMZN', name: 'Amazon.com Inc', price: 155.74, change: -3.12, changePercent: -1.96, sentiment: 'bearish', trendData: [158, 156, 154, 155] }
  ]);

  const [trendingTopics] = useState<TrendingTopic[]>([
    { topic: '$NVDA', label: 'Hype', mentions: '2,847', sentiment: 'bullish', icon: '🚀' },
    { topic: '$TSLA', label: 'Panic', mentions: '1,923', sentiment: 'bearish', icon: '📉' },
    { topic: 'AI Revolution', label: 'Hype', mentions: '4,512', sentiment: 'bullish', icon: '🤖' },
    { topic: 'Fed Meeting', label: 'Neutral', mentions: '3,674', sentiment: 'neutral', icon: '🏛️' },
    { topic: '$BTC', label: 'Hype', mentions: '5,291', sentiment: 'bullish', icon: '₿' },
    { topic: 'Inflation Data', label: 'Neutral', mentions: '2,183', sentiment: 'neutral', icon: '📊' }
  ]);

  const [moodTrendData] = useState([
    { day: 'Mon', score: 58 },
    { day: 'Tue', score: 62 },
    { day: 'Wed', score: 55 },
    { day: 'Thu', score: 68 },
    { day: 'Fri', score: 72 },
    { day: 'Sat', score: 69 },
    { day: 'Sun', score: 72 }
  ]);

    const [smartNews] = useState([
    {
      headline: "Tech stocks rally as investors eye AI-driven growth",
      summary: "Major tech players saw gains amid optimism around AI earnings reports and continued innovation in artificial intelligence sectors.",
      sentiment: 'bullish' as const,
      source: "MarketWatch",
      timestamp: "2h ago"
    },
    {
      headline: "Federal Reserve signals pause in rate hikes",
      summary: "Fed commentary suggests a wait-and-see approach to further rate adjustments as officials monitor economic data.",
      sentiment: 'neutral' as const,
      source: "Reuters",
      timestamp: "4h ago"
    },
    {
      headline: "Tesla drops as deliveries fall short of analyst expectations",
      summary: "TSLA shares fell after quarterly delivery data missed estimates, raising concerns about electric vehicle demand.",
      sentiment: 'bearish' as const,
      source: "CNBC",
      timestamp: "1h ago"
    },
    {
      headline: "Consumer confidence rebounds in July",
      summary: "The latest index shows stronger than expected consumer sentiment, indicating economic resilience despite inflation concerns.",
      sentiment: 'bullish' as const,
      source: "Bloomberg",
      timestamp: "3h ago"
    },
    {
      headline: "China's economic data triggers global market caution",
      summary: "Weak export numbers from China created uncertainty across markets as investors assess global trade implications.",
      sentiment: 'bearish' as const,
      source: "Financial Times",
      timestamp: "5h ago"
    }
  ]);

  const [aiInsight] = useState({
    title: "Today's AI Market Insight",
    content: "Today's sentiment is driven by strong AI earnings momentum, with tech stocks leading the rally. The Fed's dovish stance is providing additional tailwinds for growth sectors.",
    confidence: 87,
    keyDrivers: ['AI Earnings', 'Fed Policy', 'Tech Rally']
  });

  const [userWatchlist] = useState([
    { symbol: 'NVDA', change: 2.76, mood: 'bullish' },
    { symbol: 'AAPL', change: 2.21, mood: 'bullish' },
    { symbol: 'GOOGL', change: -2.02, mood: 'bearish' }
  ]);

  // Update mood context
  useEffect(() => {
    setMoodScore(moodScore);
  }, [moodScore, setMoodScore]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-emerald-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-amber-400';
    }
  };

    const getSentimentBadge = (sentiment: string) => {
    const colors = {
      bullish: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      bearish: 'bg-red-500/20 text-red-400 border-red-500/30',
      neutral: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    };
    return colors[sentiment as keyof typeof colors];
  };

  // Dynamic sentiment-based mood scoring
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

  const getSentimentLabel = (sentiment: 'positive' | 'neutral' | 'negative'): string => {
    switch (sentiment) {
      case 'positive': return 'Market is Positive';
      case 'neutral': return 'Market is Neutral';
      case 'negative': return 'Market is Negative';
    }
  };

  const currentSentiment = getMoodSentiment(moodScore.overall);

  const getTrendingBadge = (label: string) => {
    switch (label) {
      case 'Hype': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Panic': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-violet-500/8 to-indigo-500/8 rounded-full blur-3xl animate-pulse delay-2000" />
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-500/6 to-teal-500/6 rounded-full blur-3xl animate-pulse delay-3000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-purple-500/20 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  MoorMeter
                </h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-6">
                                {['Home', 'Market Mood', 'Watchlist', 'News Feed'].map((item, index) => (
                                    <button
                    key={item}
                    onClick={() => {
                      const sectionKey = item.toLowerCase().replace(' ', '-') as typeof activeSection;
                      setActiveSection(sectionKey);
                    }}
                    className={cn(
                      "text-sm font-medium transition-all duration-300 relative group",
                                            activeSection === item.toLowerCase().replace(' ', '-') 
                        ? "text-pink-400" 
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    {item}
                    {                      activeSection === item.toLowerCase().replace(' ', '-') && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full" />
                    )}
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                                ))}

                {/* Community Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "text-sm font-medium transition-all duration-300 relative group flex items-center gap-1",
                                                                        activeSection === 'community' || activeSection === 'chat' || activeSection === 'space' || activeSection === 'rooms'
                          ? "text-pink-400"
                          : "text-gray-400 hover:text-white"
                      )}
                    >
                      Community
                      <ChevronDown className="w-3 h-3" />
                                                                  {(activeSection === 'community' || activeSection === 'chat' || activeSection === 'space' || activeSection === 'rooms') && (
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full" />
                      )}
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-black/90 backdrop-blur-xl border-purple-500/30 text-white"
                  >
                                        <DropdownMenuItem
                      onClick={() => setActiveSection('community')}
                      className="hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Community Forum
                    </DropdownMenuItem>
                                        <DropdownMenuItem
                      onClick={() => setActiveSection('space')}
                      className="hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Space
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setActiveSection('rooms')}
                      className="hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Rooms
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setActiveSection('chat')}
                      className="hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                </DropdownMenu>

                                {/* Market Tab */}
                <button
                  onClick={() => setActiveSection('market')}
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group",
                    activeSection === 'market'
                      ? "text-pink-400"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  Market
                  {activeSection === 'market' && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full" />
                  )}
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </nav>
            </div>

            {/* Search and Controls */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={cn(
                  "relative transition-all duration-300",
                  searchFocused ? "w-80" : "w-64"
                )}>
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search tickers or keywords..."
                    className={cn(
                      "pl-12 pr-4 py-3 bg-black/30 border-purple-500/30 rounded-xl text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm",
                      "focus:bg-black/50 focus:border-pink-400/50 focus:ring-0 focus:outline-none",
                      searchFocused && "shadow-lg shadow-pink-500/10"
                    )}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  {searchFocused && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-pulse" />
                  )}
                </div>
              </div>

              <Button variant="ghost" size="sm" className="relative p-3 hover:bg-purple-500/10 rounded-xl group">
                <Bell className="w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-pink-500 text-white text-xs flex items-center justify-center animate-pulse">
                  3
                </Badge>
              </Button>

              <Button variant="ghost" size="sm" className="p-3 hover:bg-purple-500/10 rounded-xl">
                <Moon className="w-5 h-5 text-gray-300 hover:text-purple-400 transition-colors" />
              </Button>

              <Avatar className="w-10 h-10 ring-2 ring-purple-500/30">
                <AvatarFallback className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm">
                  JD
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

            {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

                                        {activeSection === 'watchlist' ? (
          <WatchlistContainerBlock />
        ) : activeSection === 'chat' ? (
          <ChatInterface />
        ) : activeSection === 'space' ? (
          <SpaceSwitcherWidget />
        ) : activeSection === 'rooms' ? (
          <PrivateRoomsContainer />
                        ) : activeSection === 'market' ? (
          <div className="space-y-6">
            {/* Market Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                📈 Market
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Comprehensive market analysis, tools, and insights
              </p>
            </div>

            {/* Market Subtabs */}
            <div className="max-w-7xl mx-auto">
              <Tabs value={activeMarketSubtab} onValueChange={setActiveMarketSubtab}>
                <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-xl border border-purple-500/20">
                  <TabsTrigger
                    value="Tools"
                    className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white text-gray-400"
                  >
                    📊 Tools
                  </TabsTrigger>
                  <TabsTrigger
                    value="Overview"
                    className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white text-gray-400"
                  >
                    📋 Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="News"
                    className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white text-gray-400"
                  >
                    📰 News
                  </TabsTrigger>
                  <TabsTrigger
                    value="Insights"
                    className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white text-gray-400"
                  >
                    🧠 Insights
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="Tools" className="mt-6">
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        📊 Advanced Market Analysis Tools
                      </h2>
                      <p className="text-gray-400">
                        Professional tools for market analysis and visualization
                      </p>
                    </div>

                    {/* Tools Sub-subtabs */}
                    <Tabs value={activeToolsSubtab} onValueChange={setActiveToolsSubtab}>
                      <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-xl border border-gray-700/50">
                        <TabsTrigger
                          value="HeatMap"
                          className="data-[state=active]:bg-gray-700/50 data-[state=active]:text-white text-gray-400"
                        >
                          📊 Heat Map
                        </TabsTrigger>
                        <TabsTrigger
                          value="Analytics"
                          className="data-[state=active]:bg-gray-700/50 data-[state=active]:text-white text-gray-400"
                        >
                          📈 Analytics
                        </TabsTrigger>
                        <TabsTrigger
                          value="Scanner"
                          className="data-[state=active]:bg-gray-700/50 data-[state=active]:text-white text-gray-400"
                        >
                          🔍 Scanner
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="HeatMap" className="mt-6">
                        <div className="space-y-6">
                          <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                              📊 Market Heat Map
                            </h3>
                            <p className="text-gray-400">
                              Visualize real-time sentiment movements across different stocks and timeframes
                            </p>
                          </div>

                          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
                            <SentimentHeatMap />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="Analytics" className="mt-6">
                        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
                          <div className="text-center space-y-4">
                            <div className="text-6xl mb-4">📈</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h3>
                            <p className="text-gray-400 mb-4">
                              Comprehensive market analysis and trend insights coming soon.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Technical Indicators</Badge>
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Trend Analysis</Badge>
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Volume Patterns</Badge>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="Scanner" className="mt-6">
                        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
                          <div className="text-center space-y-4">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Market Scanner</h3>
                            <p className="text-gray-400 mb-4">
                              Real-time stock and crypto scanner with custom filters and alerts.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">Price Alerts</Badge>
                              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">Volume Spikes</Badge>
                              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">Breakout Detection</Badge>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>

                <TabsContent value="Overview" className="mt-6">
                  <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
                    <div className="text-center space-y-4">
                      <div className="text-6xl mb-4">📋</div>
                      <h3 className="text-2xl font-bold text-white mb-2">Market Overview</h3>
                      <p className="text-gray-400 mb-4">
                        Real-time market summary, indices, and key metrics.
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Indices</Badge>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Sectors</Badge>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Top Movers</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="News" className="mt-6">
                  <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
                    <div className="text-center space-y-4">
                      <div className="text-6xl mb-4">📰</div>
                      <h3 className="text-2xl font-bold text-white mb-2">Market News</h3>
                      <p className="text-gray-400 mb-4">
                        Latest market news, earnings reports, and financial updates.
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Breaking News</Badge>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Earnings</Badge>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Economic Data</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="Insights" className="mt-6">
                  <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
                    <div className="text-center space-y-4">
                      <div className="text-6xl mb-4">🧠</div>
                      <h3 className="text-2xl font-bold text-white mb-2">AI Market Insights</h3>
                      <p className="text-gray-400 mb-4">
                        AI-powered market analysis, predictions, and trading insights.
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">AI Analysis</Badge>
                        <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">Predictions</Badge>
                        <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">Sentiment</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : (
          <>
        
        {/* Hero Mood Score Section */}
        <div className="text-center mb-16">
          {/* Large Mood Score with Animated Character */}
          <div className="relative inline-block mb-8">
            <div className="w-96 h-96 rounded-full relative">
                            {/* Animated gradient ring - rotates around the content */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getSentimentGradient(currentSentiment)} p-2 animate-spin-slow`}>
                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-sm" />
              </div>

              {/* Fixed content container - does not rotate */}
              <div className="absolute inset-2 flex items-center justify-center">
                <div className="text-center">
                  {/* Mood Emoji - Fixed in place */}
                  <div className="text-6xl mb-4 animate-bounce">
                    {getSentimentEmoji(currentSentiment)}
                  </div>
                  {/* Score */}
                  <div className="text-9xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    {moodScore.overall}
                  </div>
                  {/* Dynamic Label */}
                  <div className="text-2xl font-bold text-white mb-1">
                    {getSentimentLabel(currentSentiment)}
                  </div>
                  <div className="text-sm text-purple-300 uppercase tracking-wider">
                    AI SENTIMENT SCORE
                  </div>
                </div>
              </div>
              
                            {/* Multiple pulse rings with sentiment-based colors */}
              <div className={`absolute inset-0 rounded-full border-2 animate-ping ${
                currentSentiment === 'positive' ? 'border-emerald-400/40' :
                currentSentiment === 'neutral' ? 'border-gray-400/40' :
                'border-red-400/40'
              }`} />
              <div className={`absolute inset-2 rounded-full border animate-ping delay-75 ${
                currentSentiment === 'positive' ? 'border-green-400/30' :
                currentSentiment === 'neutral' ? 'border-slate-400/30' :
                'border-rose-400/30'
              }`} />
              <div className={`absolute inset-4 rounded-full border animate-ping delay-150 ${
                currentSentiment === 'positive' ? 'border-cyan-400/20' :
                currentSentiment === 'neutral' ? 'border-purple-400/20' :
                'border-purple-400/20'
              }`} />
            </div>
          </div>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed">
            Today's sentiment analysis powered by AI across stocks, news, and social media
          </p>
          
          {/* Sentiment Source Breakdown */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-6">Sentiment Source Breakdown</h3>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Stocks', value: moodScore.stocks, percentage: '40%', color: 'from-pink-500 to-rose-500', icon: '📈' },
                { label: 'News', value: moodScore.news, percentage: '30%', color: 'from-purple-500 to-violet-500', icon: '📰' },
                { label: 'Forums', value: moodScore.social, percentage: '30%', color: 'from-cyan-500 to-blue-500', icon: '💬' }
              ].map((item) => (
                <div key={item.label} className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <div className="text-3xl font-bold text-white mb-2">{item.value}</div>
                  <div className="text-gray-300 font-medium mb-1">{item.label}</div>
                  <div className="text-sm text-gray-400 mb-3">{item.percentage} weight</div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Top 10 Movers Widget */}
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader className="border-b border-purple-500/20">
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  Top 10 Movers Today
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {topMovers.map((stock, index) => (
                    <div key={stock.symbol} className="bg-gradient-to-br from-black/60 to-purple-900/20 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{stock.symbol[0]}</span>
                        </div>
                        <Badge className={getSentimentBadge(stock.sentiment)}>
                          {stock.sentiment}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-white mb-1">{stock.symbol}</div>
                      <div className="text-sm text-gray-400 mb-2">{stock.name}</div>
                      <div className="text-xl font-bold text-white mb-1">${stock.price}</div>
                      <div className={cn(
                        "flex items-center gap-1 text-sm font-medium",
                        stock.change >= 0 ? "text-emerald-400" : "text-red-400"
                      )}>
                        {stock.change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
                        </Card>

            {/* Smart News Feed */}
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader className="border-b border-purple-500/20">
                <CardTitle className="text-white flex items-center gap-2">
                  <Newspaper className="w-6 h-6 text-cyan-400" />
                  Smart News Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {smartNews.map((news, index) => (
                    <div key={index} className="bg-gradient-to-br from-black/60 to-purple-900/20 rounded-xl p-5 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                            {news.headline}
                          </h3>
                          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                            {news.summary}
                          </p>
                        </div>
                        <Badge className={cn(
                          "ml-4 flex-shrink-0",
                          news.sentiment === 'bullish' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          news.sentiment === 'bearish' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        )}>
                          {news.sentiment === 'bullish' ? '🟢 Bullish' :
                           news.sentiment === 'bearish' ? '🔴 Bearish' :
                           '🟡 Neutral'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium">{news.source}</span>
                        <span>{news.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 7-Day Mood Trend Chart */}
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader className="border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-cyan-400" />
                    7-Day Mood Trend
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-500/10">7D</Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-purple-500/10">30D</Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-purple-500/10">90D</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64 flex items-end justify-between gap-4">
                  {moodTrendData.map((day, index) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center group">
                      <div 
                        className="w-full bg-gradient-to-t from-cyan-500/60 to-purple-500/80 rounded-t transition-all duration-500 hover:from-cyan-500/80 hover:to-purple-500/100 relative"
                        style={{ height: `${day.score * 2.8}px` }}
                      >
                        {/* Hover popup */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          <div className="font-medium">{day.day}</div>
                          <div>Score: {day.score}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">{day.day}</div>
                      <div className="text-xs text-white">{day.score}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Forum Topics */}
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader className="border-b border-purple-500/20">
                                <CardTitle className="text-white flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-400" />
                  Trending Forum Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="bg-gradient-to-br from-black/60 to-purple-900/20 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{topic.icon}</span>
                        <Badge className={getTrendingBadge(topic.label)}>
                          {topic.label}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-white mb-1">{topic.topic}</div>
                      <div className="text-sm text-gray-400">{topic.mentions} mentions</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Your Mood Score Card */}
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader className="border-b border-purple-500/20">
                <CardTitle className="text-white text-sm">Your Mood Score</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    +64
                  </div>
                  <div className="text-emerald-400 text-sm mb-4">Based on your watchlist</div>
                  <div className="space-y-2 mb-4">
                    {userWatchlist.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{item.symbol}</span>
                        <span className={cn(
                          "font-medium",
                          item.change >= 0 ? "text-emerald-400" : "text-red-400"
                        )}>
                          {item.change >= 0 ? '+' : ''}{item.change}%
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-300 border border-purple-500/30">
                    <Plus className="w-4 h-4 mr-2" />
                    Add/Remove Ticker
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Insight Module */}
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader className="border-b border-purple-500/20">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  {aiInsight.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {aiInsight.content}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">Confidence</span>
                  <span className="text-sm font-bold text-cyan-400">{aiInsight.confidence}%</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiInsight.keyDrivers.map((driver, index) => (
                    <Badge key={index} className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                      {driver}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Footer Status */}
            <div className="text-center">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                Mood Score API: ✅ Live
              </Badge>
            </div>
                    </div>
        </div>
          </>
        )}
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
