import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import {
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Clock,
  ExternalLink,
  Heart,
  MessageSquare,
  Share2,
  Bell,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart3,
  Globe,
  Zap,
  DollarSign,
  Factory,
  Eye,
  Filter,
  Volume2,
  Play
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import AIAnalysisModal from './AIAnalysisModal';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  aiSummary?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  source: string;
  timestamp: string;
  category: string;
  url?: string;
  tickers?: string[];
  reactions: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
  isExpanded?: boolean;
  topComments?: Comment[];
  sparklineData?: number[];
}

interface Comment {
  id: string;
  user: {
    username: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface AIHighlight {
  id: string;
  type: 'mood_summary' | 'trending_tickers' | 'bearish_headlines';
  title: string;
  content: string;
  value?: string;
  change?: number;
  icon: React.ReactNode;
}

type FilterType = 'AI Curated' | 'Breaking News' | 'By Sector' | 'Earnings' | 'Global Macro' | 'All News' | 'Bullish' | 'Neutral' | 'Bearish';

const SmartNewsFeedPage: React.FC = () => {
  const { themeMode } = useMoodTheme();
  const [activeFilter, setActiveFilter] = useState<FilterType>('AI Curated');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());
  const [userInteractions, setUserInteractions] = useState<{[key: string]: {liked: boolean, saved: boolean, following: boolean}}>({});

  const mockComments: Comment[] = [
    {
      id: '1',
      user: { username: 'TraderJoe', avatar: '/api/placeholder/32/32', verified: true },
      content: '$TSLA looking strong despite the delivery miss. Long-term outlook still bullish 🚀',
      timestamp: '2m ago',
      likes: 23,
      sentiment: 'positive'
    },
    {
      id: '2',
      user: { username: 'MarketWatcher', avatar: '/api/placeholder/32/32' },
      content: 'Supply chain issues are temporary. Q1 should see better numbers.',
      timestamp: '5m ago',
      likes: 15,
      sentiment: 'neutral'
    }
  ];

  const aiHighlights: AIHighlight[] = [
    {
      id: '1',
      type: 'mood_summary',
      title: "Today's Market Mood",
      content: 'Cautiously optimistic on tech earnings',
      value: '72%',
      change: 5.2,
      icon: <Brain className="w-5 h-5" />
    },
    {
      id: '2',
      type: 'trending_tickers',
      title: 'Trending Tickers',
      content: '$NVDA, $TSLA, $AAPL leading discussions',
      value: '3.2K',
      change: 15.7,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: '3',
      type: 'bearish_headlines',
      title: 'Most Bearish',
      content: 'Banking sector regulatory concerns',
      value: '-8.3%',
      change: -2.1,
      icon: <TrendingDown className="w-5 h-5" />
    }
  ];

  const mockArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Tech stocks rally as investors eye AI-driven growth opportunities ahead of earnings',
      summary: 'Major technology companies see significant gains amid optimism around artificial intelligence earnings reports and continued innovation in the sector.',
      aiSummary: 'AI Analysis: Strong institutional buying in mega-cap tech driven by Q4 earnings optimism. Key catalysts: ChatGPT adoption metrics, cloud growth, and semiconductor demand. Risk factors include valuation concerns and potential rate sensitivity.',
      sentiment: 'positive',
      source: 'Wall Street Journal',
      timestamp: '1m ago',
      category: 'Tech',
      url: 'https://www.wsj.com/tech-stocks-rally-ai-growth',
      tickers: ['AAPL', 'MSFT', 'NVDA', 'GOOGL'],
      reactions: { likes: 142, comments: 28, shares: 15, saves: 67 },
      topComments: mockComments,
      sparklineData: [100, 102, 105, 108, 112, 115, 118]
    },
    {
      id: '2',
      title: 'Federal Reserve hints at potential pause in aggressive rate hiking cycle',
      summary: 'Fed officials signal a more cautious approach to future monetary policy decisions as inflation shows signs of cooling across multiple sectors.',
      aiSummary: 'AI Analysis: Dovish pivot anticipated based on recent comments from Fed officials. Market implications include potential rotation from defensive to growth stocks. Watch for bond market reactions and dollar strength indicators.',
      sentiment: 'neutral',
      source: 'Reuters',
      timestamp: '15m ago',
      category: 'Economy',
      url: 'https://www.reuters.com/federal-reserve-rate-pause',
      tickers: ['SPY', 'QQQ', 'TLT'],
      reactions: { likes: 89, comments: 45, shares: 12, saves: 34 },
      topComments: mockComments.slice(0, 1),
      sparklineData: [100, 98, 99, 101, 100, 102, 101]
    },
    {
      id: '3',
      title: 'Tesla deliveries fall short of analyst expectations for Q4, supply chain cited',
      summary: 'Electric vehicle manufacturer reports quarterly delivery numbers below Wall Street forecasts, citing ongoing supply chain challenges and production constraints.',
      aiSummary: 'AI Analysis: Delivery miss of ~8% vs consensus estimates. Production bottlenecks in Shanghai and Austin facilities. Positive outlook for Q1 2024 based on management guidance. Stock oversold technically.',
      sentiment: 'negative',
      source: 'CNBC',
      timestamp: '4m ago',
      category: 'Earnings',
      url: 'https://www.cnbc.com/tesla-deliveries-q4-shortfall',
      tickers: ['TSLA'],
      reactions: { likes: 67, comments: 92, shares: 8, saves: 23 },
      topComments: mockComments,
      sparklineData: [100, 95, 92, 88, 85, 87, 89]
    },
    {
      id: '4',
      title: 'Breakthrough renewable energy storage technology could reshape grid infrastructure',
      summary: 'New solid-state battery technology promises 10x energy density improvements, potentially revolutionizing renewable energy storage and electric vehicle applications.',
      aiSummary: 'AI Analysis: Paradigm shift in energy storage. Patents filed by consortium of major tech companies. Commercial viability expected within 3-5 years. Massive implications for energy transition and grid stability.',
      sentiment: 'positive',
      source: 'Nature Energy',
      timestamp: '32m ago',
      category: 'Energy',
      url: 'https://www.nature.com/energy-breakthrough',
      tickers: ['ENPH', 'SEDG', 'NEE'],
      reactions: { likes: 234, comments: 67, shares: 45, saves: 156 },
      topComments: [],
      sparklineData: [100, 105, 110, 115, 120, 125, 130]
    }
  ];

  const [articles, setArticles] = useState<NewsArticle[]>(mockArticles);

  const filterOptions: { label: FilterType; icon?: React.ReactNode }[] = [
    { label: 'AI Curated', icon: <Brain className="w-4 h-4" /> },
    { label: 'Breaking News', icon: <Zap className="w-4 h-4" /> },
    { label: 'By Sector', icon: <Factory className="w-4 h-4" /> },
    { label: 'Earnings', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Global Macro', icon: <Globe className="w-4 h-4" /> },
    { label: 'Bullish' },
    { label: 'Neutral' },
    { label: 'Bearish' }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-3 h-3" />;
      case 'negative':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    if (themeMode === 'light') {
      switch (sentiment) {
        case 'positive':
          return 'bg-green-50 text-green-700 border-green-300 shadow-sm';
        case 'negative':
          return 'bg-red-50 text-red-700 border-red-300 shadow-sm';
        default:
          return 'bg-yellow-50 text-yellow-700 border-yellow-300 shadow-sm';
      }
    } else {
      switch (sentiment) {
        case 'positive':
          return 'bg-green-500/20 text-green-400 border-green-500/30 shadow-green-500/20';
        case 'negative':
          return 'bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/20';
        default:
          return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-yellow-500/20';
      }
    }
  };

  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'Bullish';
      case 'negative':
        return 'Bearish';
      default:
        return 'Neutral';
    }
  };

  const getSentimentGlow = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'shadow-lg shadow-green-500/10 border-green-500/20';
      case 'negative':
        return 'shadow-lg shadow-red-500/10 border-red-500/20';
      default:
        return 'shadow-lg shadow-blue-500/10 border-blue-500/20';
    }
  };

  const toggleArticleExpansion = (articleId: string) => {
    const newExpanded = new Set(expandedArticles);
    if (newExpanded.has(articleId)) {
      newExpanded.delete(articleId);
    } else {
      newExpanded.add(articleId);
    }
    setExpandedArticles(newExpanded);
  };

  const handleInteraction = (articleId: string, type: 'like' | 'save' | 'follow') => {
    setUserInteractions(prev => ({
      ...prev,
      [articleId]: {
        ...prev[articleId],
        [type === 'follow' ? 'following' : type === 'like' ? 'liked' : 'saved']: 
          !prev[articleId]?.[type === 'follow' ? 'following' : type === 'like' ? 'liked' : 'saved']
      }
    }));
  };

  const renderTickerTags = (tickers: string[] = []) => {
    return tickers.map(ticker => (
      <Badge
        key={ticker}
        variant="outline"
        className="text-xs text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10 cursor-pointer transition-all duration-200 hover:shadow-md hover:shadow-cyan-500/20"
      >
        ${ticker}
      </Badge>
    ));
  };

  const renderSparkline = (data: number[] = []) => {
    if (data.length === 0) return null;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 20;
      return `${x},${y}`;
    }).join(' ');

    const color = data[data.length - 1] > data[0] ? '#10b981' : '#ef4444';

    return (
      <div className="w-16 h-8 flex items-center">
        <svg width="60" height="24" className="overflow-visible">
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            className="opacity-80"
          />
        </svg>
      </div>
    );
  };

  const filterArticles = () => {
    let filtered = articles;

    // Apply sentiment-based filters
    if (['Bullish', 'Bearish', 'Neutral'].includes(activeFilter)) {
      const sentimentMap = {
        'Bullish': 'positive',
        'Bearish': 'negative',
        'Neutral': 'neutral'
      };
      filtered = filtered.filter(article => 
        article.sentiment === sentimentMap[activeFilter as keyof typeof sentimentMap]
      );
    }

    // Apply category-based filters
    if (activeFilter === 'By Sector') {
      filtered = filtered.filter(article => 
        ['Tech', 'Energy', 'Finance'].includes(article.category)
      );
    } else if (activeFilter === 'Earnings') {
      filtered = filtered.filter(article => 
        article.category === 'Earnings' || article.title.toLowerCase().includes('earnings')
      );
    } else if (activeFilter === 'Breaking News') {
      filtered = filtered.filter(article => {
        const timestamp = new Date(Date.now() - parseInt(article.timestamp.split('m')[0]) * 60000);
        return Date.now() - timestamp.getTime() < 30 * 60 * 1000; // Last 30 minutes
      });
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.tickers?.some(ticker => ticker.toLowerCase().includes(query.replace('$', ''))) ||
        (query.startsWith('$') && article.tickers?.some(ticker => 
          ticker.toLowerCase() === query.substring(1).toLowerCase()
        ))
      );
    }

    return filtered;
  };

  const filteredArticles = filterArticles();

  const handleAIAnalysis = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <div className={`min-h-screen ${
      themeMode === 'light' 
        ? 'bg-white day-mode-container' 
        : 'bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 ${
        themeMode === 'light'
          ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200'
          : 'bg-black/20 backdrop-blur-sm border-b border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                themeMode === 'light'
                  ? 'bg-blue-100 border border-blue-200'
                  : 'bg-white/20'
              }`}>
                <Brain className={`w-5 h-5 ${
                  themeMode === 'light' ? 'text-blue-600' : 'text-white'
                }`} />
              </div>
              <div>
                <h1 className={`text-xl font-semibold flex items-center gap-2 ${
                  themeMode === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  MoodMeter News
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    themeMode === 'light'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  }`}>
                    AI Powered
                  </span>
                </h1>
                <p className={`text-sm ${
                  themeMode === 'light' ? 'text-gray-600' : 'text-white/60'
                }`}>Sentiment-aware financial news</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  themeMode === 'light' ? 'text-gray-400' : 'text-white/60'
                }`} />
                <Input
                  placeholder="Search news, $TICKERS, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 w-80 ${
                    themeMode === 'light'
                      ? 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                      : 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-white/30 focus:border-white/30'
                  }`}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={themeMode === 'light'
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
                }
              >
                <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Highlights Banner */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {aiHighlights.map((highlight) => (
            <Card key={highlight.id} className={`transition-all duration-300 highlight-card ${
              themeMode === 'light'
                ? 'bg-[#FFFFFF] border border-[#E0E3EB] hover:border-[#2962FF] hover:shadow-md shadow-sm day-mode'
                : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-white/10'
            }`} style={themeMode === 'light' ? { 
              backgroundColor: '#FFFFFF !important', 
              borderColor: '#E0E3EB !important',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important'
            } : {}}>
              <CardContent className="p-4 card-content">
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 ${
                    themeMode === 'light' ? 'text-blue-600' : 'text-white/80'
                  }`} style={themeMode === 'light' ? { color: '#2962FF !important' } : {}}>
                    {highlight.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-semibold mb-1 ${
                      themeMode === 'light' ? 'text-gray-900' : 'text-white/90'
                    }`} style={themeMode === 'light' ? { color: '#2A2E39 !important', fontWeight: '600 !important' } : {}}>{highlight.title}</h3>
                    <p className={`text-xs truncate ${
                      themeMode === 'light' ? 'text-gray-600' : 'text-white/70'
                    }`} style={themeMode === 'light' ? { color: '#4B5563 !important', fontWeight: '500 !important' } : {}}>{highlight.content}</p>
                    {highlight.value && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-lg font-bold ${
                          themeMode === 'light' ? 'text-gray-900' : 'text-white'
                        }`} style={themeMode === 'light' ? { color: '#2A2E39 !important', fontWeight: '700 !important' } : {}}>{highlight.value}</span>
                        {highlight.change && (
                          <span className={cn(
                            "text-xs flex items-center gap-1",
                            highlight.change > 0 
                              ? themeMode === 'light' ? "text-green-600" : "text-green-400"
                              : themeMode === 'light' ? "text-red-600" : "text-red-400"
                          )}>
                            {highlight.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(highlight.change)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filterOptions.map((option) => (
            <Button
              key={option.label}
              variant={activeFilter === option.label ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter(option.label)}
              className={cn(
                "text-sm whitespace-nowrap flex items-center gap-2",
                themeMode === 'light'
                  ? activeFilter === option.label
                    ? "bg-[#2962FF] hover:bg-[#1e4fd6] shadow-lg"
                    : "text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#2A2E39]"
                  : activeFilter === option.label
                    ? "bg-white/20 text-white border-white/30 hover:bg-white/25 shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
              style={themeMode === 'light' && activeFilter === option.label ? 
                { 
                  backgroundColor: '#2962FF !important', 
                  color: '#FFFFFF !important', 
                  borderColor: '#2962FF !important' 
                } : {}
              }
            >
              {option.icon}
              {option.label}
            </Button>
          ))}
        </div>

        {/* News Articles */}
        <div className="space-y-6">
          {filteredArticles.map((article) => {
            const isExpanded = expandedArticles.has(article.id);
            const userState = userInteractions[article.id] || {};
            
            return (
              <Card 
                key={article.id} 
                className={cn(
                  "transition-all duration-300 cursor-pointer group news-card",
                  themeMode === 'light'
                    ? "bg-[#FFFFFF] border border-[#E0E3EB] hover:bg-[#F9FAFB] hover:border-[#2962FF] shadow-sm hover:shadow-md"
                    : "bg-black/20 backdrop-blur-sm border-white/10 hover:bg-black/30",
                  getSentimentGlow(article.sentiment)
                )}
                style={themeMode === 'light' ? { 
                  backgroundColor: '#FFFFFF !important', 
                  borderColor: '#E0E3EB !important'
                } : {}}
              >
                <CardContent className="p-6 card-content">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-sm font-medium ${
                      themeMode === 'light' ? 'text-gray-700' : 'text-white/80'
                    }`} style={themeMode === 'light' ? { color: '#4B5563', fontWeight: '500' } : {}}>{article.source}</span>
                    <span className={themeMode === 'light' ? 'text-gray-400' : 'text-white/40'} style={themeMode === 'light' ? { color: '#9CA3AF' } : {}}>•</span>
                    <span className={`text-sm flex items-center gap-1 ${
                      themeMode === 'light' ? 'text-gray-600' : 'text-white/60'
                    }`} style={themeMode === 'light' ? { color: '#4B5563' } : {}}>
                      <Clock className="w-3 h-3" />
                      {article.timestamp}
                    </span>
                    <div className="flex items-center gap-2 ml-auto">
                      <Badge className={cn("text-xs border", getSentimentColor(article.sentiment))}>
                        {getSentimentIcon(article.sentiment)}
                        <span className="ml-1">{getSentimentText(article.sentiment)}</span>
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${
                        themeMode === 'light'
                          ? 'text-gray-600 border-gray-300'
                          : 'text-white/60 border-white/20'
                      }`} style={themeMode === 'light' ? { color: '#4B5563', borderColor: '#E0E3EB' } : {}}>
                        {article.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Title */}
                  <div 
                    className="flex items-start gap-4 cursor-pointer"
                    onClick={() => toggleArticleExpansion(article.id)}
                  >
                    <div className="flex-1">
                      <h2 className={`text-lg font-semibold mb-3 leading-tight transition-colors ${
                        themeMode === 'light'
                          ? 'text-gray-900 group-hover:text-blue-600'
                          : 'text-white group-hover:text-blue-200'
                      }`} style={themeMode === 'light' ? { color: '#2A2E39', fontWeight: '600' } : {}}>
                        {article.title}
                      </h2>

                      {/* Summary */}
                      <p className={`text-sm mb-4 leading-relaxed ${
                        themeMode === 'light' ? 'text-gray-700' : 'text-white/70'
                      }`} style={themeMode === 'light' ? { color: '#4B5563', fontWeight: '500' } : {}}>
                        {article.summary}
                      </p>

                      {/* Tickers */}
                      {article.tickers && article.tickers.length > 0 && (
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          <span className={`text-xs ${
                            themeMode === 'light' ? 'text-gray-600' : 'text-white/60'
                          }`} style={themeMode === 'light' ? { color: '#4B5563', fontWeight: '500' } : {}}>Related:</span>
                          {renderTickerTags(article.tickers)}
                          {article.sparklineData && renderSparkline(article.sparklineData)}
                        </div>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm" className={
                      themeMode === 'light'
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        : 'text-white/60 hover:text-white'
                    } style={themeMode === 'light' ? { color: '#4B5563' } : {}}>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className={`mt-4 pt-4 border-t ${
                      themeMode === 'light' ? 'border-gray-200' : 'border-white/10'
                    }`} style={themeMode === 'light' ? { borderColor: '#E0E3EB' } : {}}>
                      {/* AI Summary */}
                      {article.aiSummary && (
                        <div className={`mb-4 p-3 rounded-lg border ${
                          themeMode === 'light'
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-blue-500/10 border-blue-500/20'
                        }`} style={themeMode === 'light' ? { backgroundColor: '#EBF8FF', borderColor: '#BFDBFE' } : {}}>
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className={`w-4 h-4 ${
                              themeMode === 'light' ? 'text-blue-600' : 'text-blue-400'
                            }`} style={themeMode === 'light' ? { color: '#2962FF' } : {}} />
                            <span className={`text-sm font-medium ${
                              themeMode === 'light' ? 'text-blue-600' : 'text-blue-400'
                            }`} style={themeMode === 'light' ? { color: '#2962FF', fontWeight: '600' } : {}}>AI Analysis</span>
                          </div>
                          <p className={`text-sm leading-relaxed ${
                            themeMode === 'light' ? 'text-gray-700' : 'text-white/80'
                          }`} style={themeMode === 'light' ? { color: '#4B5563', fontWeight: '500' } : {}}>{article.aiSummary}</p>
                        </div>
                      )}

                      {/* Top Comments */}
                      {article.topComments && article.topComments.length > 0 && (
                        <div className="mb-4">
                          <h4 className={`text-sm font-medium mb-3 flex items-center gap-2 ${
                            themeMode === 'light' ? 'text-gray-700' : 'text-white/80'
                          }`} style={themeMode === 'light' ? { color: '#2A2E39', fontWeight: '600' } : {}}>
                            <MessageSquare className="w-4 h-4" />
                            Top Community Takes
                          </h4>
                          <div className="space-y-3">
                            {article.topComments.slice(0, 3).map((comment) => (
                              <div key={comment.id} className={`flex items-start gap-3 p-3 rounded-lg ${
                                themeMode === 'light' ? 'bg-gray-50' : 'bg-white/5'
                              }`} style={themeMode === 'light' ? { backgroundColor: '#F9FAFB' } : {}}>
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={comment.user.avatar} />
                                  <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-sm font-medium ${
                                      themeMode === 'light' ? 'text-gray-800' : 'text-white/80'
                                    }`} style={themeMode === 'light' ? { color: '#2A2E39', fontWeight: '600' } : {}}>{comment.user.username}</span>
                                    {comment.user.verified && (
                                      <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs" style={{ color: '#FFFFFF' }}>✓</span>
                                      </div>
                                    )}
                                    <span className={`text-xs ${
                                      themeMode === 'light' ? 'text-gray-500' : 'text-white/40'
                                    }`} style={themeMode === 'light' ? { color: '#6B7280' } : {}}>{comment.timestamp}</span>
                                  </div>
                                  <p className={`text-sm ${
                                    themeMode === 'light' ? 'text-gray-700' : 'text-white/70'
                                  }`} style={themeMode === 'light' ? { color: '#4B5563', fontWeight: '500' } : {}}>{comment.content}</p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <button className={`flex items-center gap-1 transition-colors ${
                                      themeMode === 'light'
                                        ? 'text-gray-600 hover:text-red-600'
                                        : 'text-white/60 hover:text-red-400'
                                    }`}>
                                      <Heart className="w-3 h-3" />
                                      <span className="text-xs">{comment.likes}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Post Your Take CTA */}
                          <div className={`mt-3 p-3 rounded-lg border ${
                            themeMode === 'light'
                              ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
                              : 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20'
                          }`} style={themeMode === 'light' ? { background: 'linear-gradient(to right, #EBF8FF, #E0F7FA)', borderColor: '#BFDBFE' } : {}}>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${
                                themeMode === 'light' ? 'text-gray-700' : 'text-white/80'
                              }`} style={themeMode === 'light' ? { color: '#4B5563', fontWeight: '500' } : {}}>What's your take on this news?</span>
                              <Button size="sm" style={{ backgroundColor: '#2962FF', borderColor: '#2962FF', color: '#FFFFFF' }}>
                                Post Your Take
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reaction Bar */}
                  <div className={`flex items-center justify-between mt-4 pt-4 border-t ${
                    themeMode === 'light' ? 'border-gray-200' : 'border-white/10'
                  }`} style={themeMode === 'light' ? { borderColor: '#E0E3EB' } : {}}>
                    <div className="flex items-center gap-6">
                      <button 
                        className={cn(
                          "flex items-center gap-2 text-sm transition-colors",
                          userState.liked 
                            ? "text-red-400" 
                            : themeMode === 'light' 
                              ? "text-gray-600 hover:text-red-600" 
                              : "text-white/60 hover:text-red-400"
                        )}
                        onClick={() => handleInteraction(article.id, 'like')}
                      >
                        <Heart className={cn("w-4 h-4", userState.liked && "fill-current")} />
                        <span>{article.reactions.likes}</span>
                      </button>
                      
                      <button className={`flex items-center gap-2 text-sm transition-colors ${
                        themeMode === 'light'
                          ? 'text-gray-600 hover:text-blue-600'
                          : 'text-white/60 hover:text-blue-400'
                      }`}>
                        <MessageSquare className="w-4 h-4" />
                        <span>{article.reactions.comments}</span>
                      </button>
                      
                      <button className={`flex items-center gap-2 text-sm transition-colors ${
                        themeMode === 'light'
                          ? 'text-gray-600 hover:text-green-600'
                          : 'text-white/60 hover:text-green-400'
                      }`}>
                        <Share2 className="w-4 h-4" />
                        <span>{article.reactions.shares}</span>
                      </button>
                      
                      <button 
                        className={cn(
                          "flex items-center gap-2 text-sm transition-colors",
                          userState.saved 
                            ? "text-yellow-400" 
                            : themeMode === 'light' 
                              ? "text-gray-600 hover:text-yellow-600" 
                              : "text-white/60 hover:text-yellow-400"
                        )}
                        onClick={() => handleInteraction(article.id, 'save')}
                      >
                        <Bookmark className={cn("w-4 h-4", userState.saved && "fill-current")} />
                        <span>{article.reactions.saves}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-xs ${
                          themeMode === 'light'
                            ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Bell className="w-3 h-3 mr-1" />
                        Follow News on {article.tickers?.[0] ? `$${article.tickers[0]}` : 'Topic'}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAIAnalysis(article)}
                        className={`text-xs ${
                          themeMode === 'light'
                            ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            : 'text-white/60 hover:text-blue-400 hover:bg-blue-500/10'
                        }`}
                      >
                        <Brain className="w-3 h-3 mr-1" />
                        AI Analysis
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-xs ${
                          themeMode === 'light'
                            ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Volume2 className="w-3 h-3 mr-1" />
                        Listen
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className={`text-lg mb-2 ${
              themeMode === 'light' ? 'text-gray-600' : 'text-white/60'
            }`}>No articles found</div>
            <div className={`text-sm ${
              themeMode === 'light' ? 'text-gray-500' : 'text-white/40'
            }`}>Try adjusting your search or filter criteria</div>
          </div>
        )}
      </div>

      {/* AI Analysis Modal */}
      {selectedArticle && (
        <AIAnalysisModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          article={selectedArticle}
        />
      )}
    </div>
  );
};

export default SmartNewsFeedPage;
