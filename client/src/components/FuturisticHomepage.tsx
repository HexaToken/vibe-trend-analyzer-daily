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
  ChevronRight,
  MessageSquare,
  Users,
  Menu,
  X
} from 'lucide-react';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import { cn } from '../lib/utils';
import { WatchlistContainerBlock } from './watchlist/WatchlistContainerBlock';
import { ChatInterface } from './moorMeter/ChatInterface';
import { SpaceSwitcherWidget } from './community/SpaceSwitcherWidget';
import { PrivateRoomsContainer } from './privateRooms/PrivateRoomsContainer';
import { SentimentHeatMap } from './moorMeter/SentimentHeatMap';
import { MoodTrendChart } from './moorMeter/MoodTrendChart';
import { SmartNewsFeed } from './SmartNewsFeed';
import { MarketMoodPage } from './MarketMoodPage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

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
                                                                                const [activeSection, setActiveSection] = useState<'home' | 'market-mood' | 'watchlist' | 'news-feed' | 'community' | 'chat' | 'space' | 'rooms' | 'tool' | 'market'>('home');
      const [activeToolSubtab, setActiveToolSubtab] = useState("Market");
    const [activeMarketSubtab, setActiveMarketSubtab] = useState("Tools");
  const [activeToolsSubtab, setActiveToolsSubtab] = useState("HeatMap");
  const [activeFinanceTab, setActiveFinanceTab] = useState("risk-analysis");
  const [selectedFinanceStock, setSelectedFinanceStock] = useState("AAPL");
  const [financeSearchQuery, setFinanceSearchQuery] = useState("");
  const [mobileFinanceOpen, setMobileFinanceOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1D" | "7D" | "30D">("7D");

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
    { date: 'Mon', score: 58, stocks: 55, news: 62, social: 57 },
    { date: 'Tue', score: 62, stocks: 58, news: 65, social: 63 },
    { date: 'Wed', score: 55, stocks: 52, news: 58, social: 55 },
    { date: 'Thu', score: 68, stocks: 65, news: 71, social: 68 },
    { date: 'Fri', score: 72, stocks: 68, news: 75, social: 74 },
    { date: 'Sat', score: 69, stocks: 66, news: 72, social: 70 },
    { date: 'Sun', score: 72, stocks: 69, news: 74, social: 73 }
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
                                                                                                {['Home', 'Market Mood', 'News Feed'].map((item, index) => (
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
                                        <span>
                      {item}
                    </span>
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

                {/* Finance Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "text-sm font-medium transition-all duration-300 relative group flex items-center gap-1",
                        activeSection === 'finance' || activeSection === 'market' || activeSection === 'watchlist'
                          ? "text-pink-400"
                          : "text-gray-400 hover:text-white"
                      )}
                    >
                      Finance
                      <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
                      {(activeSection === 'finance' || activeSection === 'market' || activeSection === 'watchlist') && (
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full" />
                      )}
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-black/95 backdrop-blur-xl border-green-500/30 text-white animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2"
                  >
                    <DropdownMenuItem
                      onClick={() => setActiveSection('finance')}
                      className="hover:bg-green-500/20 focus:bg-green-500/20 cursor-pointer transition-colors duration-200"
                    >
                      <span className="mr-2">💰</span>
                      Finance Hub
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setActiveSection('market')}
                      className="hover:bg-blue-500/20 focus:bg-blue-500/20 cursor-pointer transition-colors duration-200"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Market Analytics
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>


              </nav>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-3 hover:bg-purple-500/10 rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-300" />
              )}
            </Button>

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

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-purple-500/20 animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="space-y-2">
              {/* Regular Navigation Items */}
              {['Home', 'Market Mood', 'Watchlist', 'News Feed'].map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  onClick={() => {
                    const sectionKey = item.toLowerCase().replace(' ', '-') as typeof activeSection;
                    setActiveSection(sectionKey);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full justify-start text-left transition-colors duration-200",
                    activeSection === item.toLowerCase().replace(' ', '-')
                      ? "text-pink-400 bg-pink-500/10"
                      : "text-gray-300 hover:text-white hover:bg-purple-500/10"
                  )}
                >
                  {item}
                </Button>
              ))}

              {/* Finance Accordion */}
              <Collapsible open={mobileFinanceOpen} onOpenChange={setMobileFinanceOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between text-left transition-colors duration-200",
                      (activeSection === 'finance' || activeSection === 'market')
                        ? "text-pink-400 bg-pink-500/10"
                        : "text-gray-300 hover:text-white hover:bg-purple-500/10"
                    )}
                  >
                    Finance
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        mobileFinanceOpen && "rotate-90"
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="animate-in slide-in-from-top duration-200">
                  <div className="ml-4 space-y-1 mt-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setActiveSection('finance');
                        setMobileMenuOpen(false);
                        setMobileFinanceOpen(false);
                      }}
                      className={cn(
                        "w-full justify-start text-sm transition-colors duration-200",
                        activeSection === 'finance'
                          ? "text-green-400 bg-green-500/10"
                          : "text-gray-400 hover:text-green-300 hover:bg-green-500/5"
                      )}
                    >
                      <span className="mr-2">💰</span>
                      Finance Hub
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setActiveSection('market');
                        setMobileMenuOpen(false);
                        setMobileFinanceOpen(false);
                      }}
                      className={cn(
                        "w-full justify-start text-sm transition-colors duration-200",
                        activeSection === 'market'
                          ? "text-blue-400 bg-blue-500/10"
                          : "text-gray-400 hover:text-blue-300 hover:bg-blue-500/5"
                      )}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Market Analytics
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Community Items */}
              {[
                { id: 'community', label: 'Community', icon: Users },
                { id: 'chat', label: 'Chat', icon: MessageSquare },
                { id: 'space', label: 'Space', icon: Users },
                { id: 'rooms', label: 'Rooms', icon: Users }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => {
                      setActiveSection(item.id as typeof activeSection);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full justify-start text-left transition-colors duration-200",
                      activeSection === item.id
                        ? "text-pink-400 bg-pink-500/10"
                        : "text-gray-300 hover:text-white hover:bg-purple-500/10"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}

            {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

                                        {activeSection === 'market-mood' ? (
          <MarketMoodPage />
        ) : activeSection === 'watchlist' ? (
          <WatchlistContainerBlock />
        ) : activeSection === 'finance' ? (
          <div className="space-y-8">
            {/* Finance Hub Header with Search */}
            <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 mb-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                    <span className="text-3xl">💰</span>
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Finance Hub
                  </h1>
                </div>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
                  Advanced financial tools and analytics for portfolio management
                </p>
              </div>

              {/* Stock Search Bar */}
              <div className="max-w-md mx-auto mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search stock ticker (e.g., AAPL, TSLA, NVDA)..."
                    value={financeSearchQuery}
                    onChange={(e) => setFinanceSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && financeSearchQuery.trim()) {
                        setSelectedFinanceStock(financeSearchQuery.toUpperCase().trim());
                        setFinanceSearchQuery('');
                      }
                    }}
                    className="pl-12 pr-20 py-4 bg-black/40 border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:bg-black/60 focus:border-blue-400/50 focus:ring-0 focus:outline-none backdrop-blur-sm text-lg"
                  />
                  <Button
                    onClick={() => {
                      if (financeSearchQuery.trim()) {
                        setSelectedFinanceStock(financeSearchQuery.toUpperCase().trim());
                        setFinanceSearchQuery('');
                      }
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    Search
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="text-sm text-gray-400">Currently analyzing:</span>
                  <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 font-semibold">
                    ${selectedFinanceStock}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Finance Tabs */}
            <Tabs value={activeFinanceTab} onValueChange={setActiveFinanceTab}>
              <TabsList className="grid w-full grid-cols-2 bg-black/20 backdrop-blur-xl border border-gray-700/50 max-w-md mx-auto">
                <TabsTrigger
                  value="risk-analysis"
                  className="data-[state=active]:bg-blue-600/30 data-[state=active]:text-blue-300 text-gray-400 flex items-center gap-2"
                >
                  📊 Risk Analysis
                </TabsTrigger>
                <TabsTrigger
                  value="financial-reports"
                  className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 text-gray-400 flex items-center gap-2"
                >
                  📁 Financial Reports
                </TabsTrigger>
              </TabsList>

              {/* Risk Analysis Tab */}
              <TabsContent value="risk-analysis" className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Sentiment Risk Meter */}
                  <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        🎯 Sentiment Risk Meter
                        <Badge className="ml-auto bg-blue-500/20 text-blue-300 border-blue-500/30">
                          ${selectedFinanceStock}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20 p-1 animate-pulse">
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900/90 to-blue-900/90" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className={`text-3xl font-bold ${
                              selectedFinanceStock === 'TSLA' ? 'text-red-400' :
                              selectedFinanceStock === 'NVDA' ? 'text-green-400' :
                              'text-yellow-400'
                            }`}>
                              {selectedFinanceStock === 'TSLA' ? 'HIGH' :
                               selectedFinanceStock === 'NVDA' ? 'LOW' :
                               'MEDIUM'}
                            </div>
                            <div className="text-sm text-gray-400">Risk Level</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-400">Low</span>
                          <span className="text-yellow-400">Medium</span>
                          <span className="text-red-400">High</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${
                            selectedFinanceStock === 'TSLA' ? 'w-5/6 bg-gradient-to-r from-yellow-400 to-red-400' :
                            selectedFinanceStock === 'NVDA' ? 'w-1/4 bg-gradient-to-r from-green-400 to-green-500' :
                            'w-3/5 bg-gradient-to-r from-green-400 to-yellow-400'
                          }`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Risk Grade Card */}
                  <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        🎓 AI Risk Grade
                        <Badge className="ml-auto bg-blue-500/20 text-blue-300 border-blue-500/30">
                          ${selectedFinanceStock}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                      <div className={`text-6xl font-bold mb-2 ${
                        selectedFinanceStock === 'TSLA' ? 'text-red-400' :
                        selectedFinanceStock === 'NVDA' ? 'text-green-400' :
                        selectedFinanceStock === 'GOOGL' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`}>
                        {selectedFinanceStock === 'TSLA' ? 'C-' :
                         selectedFinanceStock === 'NVDA' ? 'A+' :
                         selectedFinanceStock === 'GOOGL' ? 'B' :
                         'B+'}
                      </div>
                      <div className="text-lg text-white mb-4">
                        {selectedFinanceStock === 'TSLA' ? 'High Risk' :
                         selectedFinanceStock === 'NVDA' ? 'Low Risk' :
                         'Moderate Risk'}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Beta</span>
                          <span className="text-blue-400">
                            {selectedFinanceStock === 'TSLA' ? '2.18' :
                             selectedFinanceStock === 'NVDA' ? '1.68' :
                             selectedFinanceStock === 'GOOGL' ? '1.05' :
                             '1.24'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Volume Spike</span>
                          <span className={selectedFinanceStock === 'TSLA' ? 'text-red-400' : 'text-yellow-400'}>
                            {selectedFinanceStock === 'TSLA' ? '+45%' :
                             selectedFinanceStock === 'NVDA' ? '+8%' :
                             '+15%'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sentiment Shift</span>
                          <span className={selectedFinanceStock === 'TSLA' ? 'text-red-400' : 'text-green-400'}>
                            {selectedFinanceStock === 'TSLA' ? 'Declining' : 'Stable'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Volatility Forecast */}
                  <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        📈 Volatility Forecast
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-6">
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-orange-400">+18.5%</div>
                        <div className="text-sm text-gray-400">7-Day Predicted Volatility</div>
                      </div>
                      <div className="h-24 bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-lg flex items-end justify-center p-2">
                        <div className="flex items-end gap-1 h-full">
                          {[12, 15, 18, 22, 19, 16, 14].map((height, i) => (
                            <div
                              key={i}
                              className="bg-gradient-to-t from-blue-400 to-orange-400 w-3 rounded-sm"
                              style={{ height: `${height * 3}px` }}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Risk Heatmap */}
                  <Card className="lg:col-span-2 bg-black/40 border-blue-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        🔥 Sector Risk Heatmap
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { name: 'Tech', risk: 'high', color: 'bg-red-500/30 border-red-500/50' },
                          { name: 'Finance', risk: 'medium', color: 'bg-yellow-500/30 border-yellow-500/50' },
                          { name: 'Healthcare', risk: 'low', color: 'bg-green-500/30 border-green-500/50' },
                          { name: 'Energy', risk: 'high', color: 'bg-red-500/30 border-red-500/50' },
                          { name: 'Consumer', risk: 'medium', color: 'bg-yellow-500/30 border-yellow-500/50' },
                          { name: 'Industrial', risk: 'low', color: 'bg-green-500/30 border-green-500/50' },
                          { name: 'Utilities', risk: 'low', color: 'bg-green-500/30 border-green-500/50' },
                          { name: 'Materials', risk: 'medium', color: 'bg-yellow-500/30 border-yellow-500/50' }
                        ].map((sector, i) => (
                          <div key={i} className={`${sector.color} rounded-lg p-3 border text-center`}>
                            <div className="text-white font-medium">{sector.name}</div>
                            <div className="text-xs text-gray-300 capitalize">{sector.risk}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Live Risk Alerts */}
                  <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        🚨 Live Risk Alerts
                        <Badge className="ml-auto bg-blue-500/20 text-blue-300 border-blue-500/30">
                          ${selectedFinanceStock}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          {
                            alert: `$${selectedFinanceStock} ${selectedFinanceStock === 'TSLA' ? 'moved into High Risk Zone' : selectedFinanceStock === 'NVDA' ? 'showing strong momentum' : 'volatility detected'}`,
                            icon: selectedFinanceStock === 'TSLA' ? '📉' : selectedFinanceStock === 'NVDA' ? '🚀' : '⚠️',
                            time: '2m ago',
                            type: selectedFinanceStock === 'TSLA' ? 'danger' : 'info'
                          },
                          { alert: 'VIX spike detected', icon: '���', time: '5m ago', type: 'warning' },
                          {
                            alert: `${selectedFinanceStock === 'NVDA' ? 'AI sector' : selectedFinanceStock === 'TSLA' ? 'EV sector' : 'Tech sector'} volatility increased`,
                            icon: '⚠️',
                            time: '8m ago',
                            type: 'warning'
                          },
                          { alert: 'Bond yields rising rapidly', icon: '📊', time: '12m ago', type: 'info' }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                            <span className="text-lg">{item.icon}</span>
                            <div className="flex-1">
                              <div className="text-sm text-white">{item.alert}</div>
                              <div className="text-xs text-gray-400">{item.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Financial Reports Tab */}
              <TabsContent value="financial-reports" className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Smart Earnings Summary */}
                  <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        🧠 Smart Earnings Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <h4 className="text-white font-semibold mb-2">NVDA Q3 2024</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            NVIDIA exceeded expectations with EPS of $5.16 vs $4.64 expected, driven by
                            strong data center revenue growth of 279% YoY. Management raised guidance
                            significantly, citing continued AI demand momentum.
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="text-green-400 font-bold">$5.16</div>
                            <div className="text-xs text-gray-400">EPS Actual</div>
                          </div>
                          <div className="p-3 bg-gray-500/10 rounded-lg border border-gray-500/20">
                            <div className="text-gray-300 font-bold">$4.64</div>
                            <div className="text-xs text-gray-400">EPS Expected</div>
                          </div>
                          <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="text-green-400 font-bold">+11.2%</div>
                            <div className="text-xs text-gray-400">Beat</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Earnings Snapshot Grid */}
                  <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        📊 Earnings Snapshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { symbol: 'AAPL', eps: '+2.1%', revenue: '+5.4%', guidance: 'Raised', sentiment: 'positive' },
                          { symbol: 'GOOGL', eps: '-1.8%', revenue: '+3.2%', guidance: 'Maintained', sentiment: 'neutral' },
                          { symbol: 'MSFT', eps: '+4.2%', revenue: '+7.1%', guidance: 'Raised', sentiment: 'positive' },
                          { symbol: 'TSLA', eps: '-3.4%', revenue: '-2.1%', guidance: 'Lowered', sentiment: 'negative' }
                        ].map((stock, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                            <div className="font-semibold text-white">{stock.symbol}</div>
                            <div className="flex gap-2">
                              <Badge className={stock.eps.includes('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                EPS {stock.eps}
                              </Badge>
                              <Badge className={stock.revenue.includes('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                Rev {stock.revenue}
                              </Badge>
                              <Badge className={`${
                                stock.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                                stock.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {stock.guidance}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mood vs Earnings Graph */}
                  <Card className="lg:col-span-2 bg-black/40 border-purple-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        📈 Mood vs. Earnings Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4">
                        <div className="flex items-end justify-between h-full">
                          {[
                            { mood: 65, earnings: 'beat', label: 'Q1' },
                            { mood: 72, earnings: 'beat', label: 'Q2' },
                            { mood: 58, earnings: 'miss', label: 'Q3' },
                            { mood: 78, earnings: 'beat', label: 'Q4' },
                            { mood: 68, earnings: 'meet', label: 'Q1' }
                          ].map((point, i) => (
                            <div key={i} className="text-center">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-4 mb-2 rounded-sm ${
                                    point.earnings === 'beat' ? 'bg-green-400' :
                                    point.earnings === 'miss' ? 'bg-red-400' :
                                    'bg-gray-400'
                                  }`}
                                  style={{ height: `${point.mood}px` }}
                                />
                                <div className="text-xs text-gray-400">{point.label}</div>
                                <div className="text-xs text-white">{point.mood}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-400 rounded-sm" />
                            <span className="text-gray-400">Beat</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-400 rounded-sm" />
                            <span className="text-gray-400">Meet</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-400 rounded-sm" />
                            <span className="text-gray-400">Miss</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : activeSection === 'news-feed' ? (
          <SmartNewsFeed />
        ) : activeSection === 'chat' ? (
          <ChatInterface />
        ) : activeSection === 'space' ? (
          <SpaceSwitcherWidget />
        ) : activeSection === 'rooms' ? (
          <PrivateRoomsContainer />
                ) : activeSection === 'tool' || activeSection === 'market' ? (
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
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
                <SentimentHeatMap />
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

            {/* MoodTrendChart Widget - Full Width */}
            <div className="w-full">
              <MoodTrendChart
                data={moodTrendData}
                timeframe={selectedTimeframe}
                setTimeframe={setSelectedTimeframe}
              />
            </div>

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
