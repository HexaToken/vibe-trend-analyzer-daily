import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Globe,
  Bell,
  Settings,
  User,
  ChevronDown,
  Activity,
  Zap,
  Brain,
  Eye,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import { cn } from '../lib/utils';

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

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timestamp: Date;
  source: string;
}

interface MarketReaction {
  id: string;
  user: string;
  avatar: string;
  message: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timestamp: Date;
  mood: string;
}

export const FuturisticHomepage: React.FC = () => {
  const { setMoodScore } = useMoodTheme();
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'dynamic' | 'light'>('dynamic');
  
  // Core mood data
  const [moodScore] = useState<MoodScore>({
    overall: 72,
    stocks: 68,
    news: 75,
    social: 74,
    timestamp: new Date()
  });

  const [personalMoodScore] = useState(67);
  const [searchFocused, setSearchFocused] = useState(false);

  // Stocks data with trend lines
  const [topStocks] = useState<StockData[]>([
    { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: 3.36, changePercent: 3.36, sentiment: 'bullish', trendData: [245, 247, 250, 248] },
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.28, change: 2.45, changePercent: 2.45, sentiment: 'bullish', trendData: [870, 872, 878, 875] },
    { symbol: 'AAPL', name: 'Apple Inc', price: 190.64, change: 1.12, changePercent: 1.12, sentiment: 'bearish', trendData: [192, 191, 189, 190] }
  ]);

  const [trendingTopics] = useState([
    { topic: 'CPI', sentiment: 'bullish', discussions: '8.9K' },
    { topic: 'Fed', sentiment: 'bullish', discussions: '12.5K' },
    { topic: 'Fed', sentiment: 'neutral', discussions: '15.6K' },
    { topic: 'Inflation', sentiment: 'neutral', discussions: '7.2K' },
    { topic: 'Bearish', sentiment: 'bearish', discussions: '5.8K' }
  ]);

  const [marketReactions] = useState<MarketReaction[]>([
    {
      id: '1',
      user: 'Michael',
      avatar: '/api/placeholder/32/32',
      message: 'Looks like bull market coming',
      sentiment: 'bullish',
      timestamp: new Date(Date.now() - 300000),
      mood: '😊'
    },
    {
      id: '2',
      user: 'Olivia',
      avatar: '/api/placeholder/32/32',
      message: 'Fed news seem prized in',
      sentiment: 'neutral',
      timestamp: new Date(Date.now() - 900000),
      mood: '🤔'
    },
    {
      id: '3',
      user: 'Daniel',
      avatar: '/api/placeholder/32/32',
      message: "I've worried about those headlines",
      sentiment: 'bearish',
      timestamp: new Date(Date.now() - 1200000),
      mood: '😰'
    }
  ]);

  const [moodTrendData] = useState([
    { day: 'Mon', score: 58, stocks: 55, news: 60, forums: 59 },
    { day: 'Tue', score: 62, stocks: 58, news: 65, forums: 63 },
    { day: 'Wed', score: 55, stocks: 52, news: 57, forums: 56 },
    { day: 'Thu', score: 68, stocks: 65, news: 70, forums: 69 },
    { day: 'Fri', score: 72, stocks: 70, news: 74, forums: 71 },
    { day: 'Sat', score: 69, stocks: 67, news: 71, forums: 68 },
    { day: 'Sun', score: 72, stocks: 69, news: 75, forums: 72 }
  ]);

  // Update mood context
  useEffect(() => {
    setMoodScore(moodScore);
  }, [moodScore, setMoodScore]);

  const getMoodLabel = (score: number) => {
    if (score >= 80) return 'Euphoric';
    if (score >= 70) return 'Optimistic';
    if (score >= 60) return 'Positive';
    if (score >= 50) return 'Neutral';
    if (score >= 40) return 'Cautious';
    if (score >= 30) return 'Bearish';
    return 'Fearful';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-cyan-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-amber-400';
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    const colors = {
      bullish: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      bearish: 'bg-red-500/20 text-red-400 border-red-500/30',
      neutral: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    };
    return colors[sentiment as keyof typeof colors];
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-cyan-500/20 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Brain className="w-6 h-6 text-black" />
                </div>
                <h1 className="text-2xl font-light bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MoorMeter
                </h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-6">
                {['Home', 'Market Mood', 'Watchlist', 'Economic Insights', 'Community'].map((item, index) => (
                  <button
                    key={item}
                    className={cn(
                      "text-sm font-medium transition-all duration-300 relative group",
                      index === 0 
                        ? "text-cyan-400" 
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    {item}
                    {index === 0 && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                    )}
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                ))}
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
                      "pl-12 pr-4 py-3 bg-black/30 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm",
                      "focus:bg-black/50 focus:border-cyan-400/50 focus:ring-0 focus:outline-none",
                      searchFocused && "shadow-lg shadow-cyan-500/10"
                    )}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  {searchFocused && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                  )}
                </div>
              </div>

              <Button variant="ghost" size="sm" className="relative p-3 hover:bg-cyan-500/10 rounded-xl group">
                <Bell className="w-5 h-5 text-gray-300 group-hover:text-cyan-400 transition-colors" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-cyan-500 text-black text-xs flex items-center justify-center animate-pulse">
                  3
                </Badge>
              </Button>

              <Button variant="ghost" size="sm" className="p-3 hover:bg-cyan-500/10 rounded-xl group">
                <Settings className="w-5 h-5 text-gray-300 group-hover:text-cyan-400 transition-colors" />
              </Button>

              <Avatar className="w-10 h-10 ring-2 ring-cyan-500/30">
                <AvatarFallback className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-sm">
                  JD
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Hero Mood Score */}
            <div className="text-center mb-12">
              <div className="relative inline-block">
                {/* Outer ring with animated gradient */}
                <div className="w-80 h-80 rounded-full relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-1 animate-spin-slow">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      {/* Inner content */}
                      <div className="text-center">
                        <div className="text-8xl font-light text-white mb-4 animate-pulse">
                          {moodScore.overall}
                        </div>
                        <div className="text-xl text-cyan-400 font-medium mb-2">
                          {getMoodLabel(moodScore.overall)}
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wider">
                          SCORE | 4%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pulse rings */}
                  <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" />
                  <div className="absolute inset-4 rounded-full border border-cyan-400/20 animate-ping delay-75" />
                </div>
              </div>
              
              <p className="text-gray-300 max-w-2xl mx-auto mt-8 text-lg leading-relaxed">
                Today's sentiment suggests rising investor confidence led by tech earnings.
              </p>
              
              {/* Sentiment Breakdown */}
              <div className="flex justify-center gap-8 mt-8">
                {[
                  { label: 'Stocks', value: moodScore.stocks, percentage: '40%' },
                  { label: 'News', value: moodScore.news, percentage: '30%' },
                  { label: 'Forums', value: moodScore.social, percentage: '30%' }
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-white font-medium text-lg mb-1">{item.value}</div>
                    <div className="text-gray-400 text-sm">{item.label}</div>
                    <div className="text-cyan-400 text-xs">{item.percentage}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Stocks */}
            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
              <CardHeader className="border-b border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    Top 10 Stocks Today
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-500/10">
                      Today
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-cyan-500/10">
                      Trend
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-cyan-500/10">
                  {topStocks.map((stock, index) => (
                    <div key={stock.symbol} className="flex items-center justify-between p-6 hover:bg-cyan-500/5 transition-all duration-300 group">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm w-6">{index + 1}</span>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-white text-lg">{stock.symbol}</span>
                            <Badge className={getSentimentBadge(stock.sentiment)}>
                              {stock.sentiment}
                            </Badge>
                          </div>
                          <div className="text-gray-400 text-sm">{stock.name}</div>
                        </div>
                      </div>
                      
                      {/* Mini trend chart */}
                      <div className="hidden md:block">
                        <svg width="60" height="30" className="text-cyan-400">
                          <polyline
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            points={stock.trendData.map((value, i) => `${i * 20},${30 - (value - Math.min(...stock.trendData)) / (Math.max(...stock.trendData) - Math.min(...stock.trendData)) * 20}`).join(' ')}
                            className="opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        </svg>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-white font-medium text-lg">${stock.price}</div>
                        <div className={cn(
                          "text-sm font-medium flex items-center gap-1",
                          stock.change >= 0 ? "text-cyan-400" : "text-red-400"
                        )}>
                          {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mood Trend Graph */}
            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
              <CardHeader className="border-b border-cyan-500/20">
                <CardTitle className="text-white">Mood Trend Graph</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64 flex items-end justify-between gap-4">
                  {moodTrendData.map((day, index) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center group">
                      <div 
                        className="w-full bg-gradient-to-t from-cyan-500/60 to-cyan-400/80 rounded-t transition-all duration-500 hover:from-cyan-500/80 relative"
                        style={{ height: `${day.score * 2.5}px` }}
                      >
                        {/* Hover tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          <div className="font-medium">{day.day}</div>
                          <div>Score: {day.score}</div>
                          <div className="text-cyan-400">Stocks: {day.stocks}</div>
                          <div className="text-blue-400">News: {day.news}</div>
                          <div className="text-purple-400">Forums: {day.forums}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">{day.day}</div>
                      <div className="text-xs text-white">{day.score}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Smart News Feed */}
            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
              <CardHeader className="border-b border-cyan-500/20">
                <CardTitle className="text-white">Smart News Feed</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { title: 'Tech, stocks rally as market has now high;', sentiment: 'bullish' as const },
                    { title: 'Fed expected to maintain market safes', sentiment: 'neutral' as const }
                  ].map((news, index) => (
                    <div key={index} className="group p-4 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:bg-cyan-500/5">
                      <div className="flex items-start gap-3">
                        <Badge className={getSentimentBadge(news.sentiment)}>
                          {news.sentiment}
                        </Badge>
                        <div className="flex-1">
                          <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                            {news.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Personalized Mood Score */}
            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
              <CardHeader className="border-b border-cyan-500/20">
                <CardTitle className="text-white text-sm">Personalized Mood Score</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-white mb-2">+{personalMoodScore}</div>
                  <div className="text-cyan-400 text-sm mb-4">Calm Optimism</div>
                  <Button className="w-full bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30">
                    Edit Watchlist
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
              <CardHeader className="border-b border-cyan-500/20">
                <CardTitle className="text-white text-sm">Trending Topics</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between group hover:bg-cyan-500/5 p-2 -m-2 rounded transition-colors">
                      <div className="flex items-center gap-3">
                        <Badge className={getSentimentBadge(topic.sentiment)}>
                          {topic.sentiment}
                        </Badge>
                        <span className="text-white text-sm group-hover:text-cyan-400 transition-colors">
                          {topic.topic}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Reactions */}
            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
              <CardHeader className="border-b border-cyan-500/20">
                <CardTitle className="text-white text-sm">Market Reactions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {marketReactions.map((reaction) => (
                    <div key={reaction.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-cyan-500/5 transition-colors">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-cyan-500/20 text-cyan-300 text-xs">
                          {reaction.user[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">{reaction.user}</span>
                          <span className="text-lg">{reaction.mood}</span>
                          <span className="text-xs text-gray-500">{formatTimeAgo(reaction.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-300">{reaction.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* API Status */}
            <div className="text-center">
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                Mood Score API: ● Live
              </Badge>
            </div>
          </div>
        </div>
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
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};
