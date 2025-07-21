import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Search,
  RefreshCw,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Newspaper,
  Brain,
  ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NewsItem {
  id: string;
  headline: string;
  description: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  isRising: boolean;
  category: string;
  aiAnalysis?: string;
  articleUrl?: string;
}

interface SmartNewsFeedProps {
  className?: string;
}

export const SmartNewsFeed: React.FC<SmartNewsFeedProps> = ({ className }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'bullish' | 'neutral' | 'bearish'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAnalysis, setExpandedAnalysis] = useState<string | null>(null);

  // Mock news data - replace with real API data
  const [newsItems] = useState<NewsItem[]>([
    {
      id: '1',
      headline: 'Tech stocks rally as investors eye AI-driven growth opportunities',
      description: 'Major technology companies see significant gains amid optimism around artificial intelligence earnings reports and continued innovation.',
      source: 'Wall Street Journal',
      timestamp: '0m ago',
      sentiment: 'positive',
      sentimentScore: 85,
      isRising: true,
      category: 'Tech',
      aiAnalysis: 'Strong positive sentiment driven by AI revenue growth across major tech companies. Market confidence is high based on analyst upgrades and increased institutional buying.',
      articleUrl: 'https://example.com/tech-rally-ai-growth'
    },
    {
      id: '2',
      headline: 'Federal Reserve hints at potential pause in aggressive rate hiking cycle',
      description: 'Fed officials signal a more cautious approach to future monetary policy decisions as inflation shows signs of cooling.',
      source: 'Reuters',
      timestamp: '15m ago',
      sentiment: 'neutral',
      sentimentScore: 55,
      isRising: false,
      category: 'Economy',
      aiAnalysis: 'Mixed market reaction to Fed commentary. While rate pause is positive for growth stocks, concerns remain about economic slowdown.'
    },
    {
      id: '3',
      headline: 'Tesla deliveries fall short of analyst expectations for Q4',
      description: 'Electric vehicle manufacturer reports quarterly delivery numbers below Wall Street forecasts, citing supply chain challenges.',
      source: 'CNBC',
      timestamp: '32m ago',
      sentiment: 'negative',
      sentimentScore: 25,
      isRising: false,
      category: 'Earnings',
      aiAnalysis: 'Negative sentiment primarily driven by missed delivery targets. However, long-term outlook remains positive based on expanding production capacity.'
    },
    {
      id: '4',
      headline: 'Bitcoin surges past $45K as institutional adoption accelerates',
      description: 'Cryptocurrency markets see renewed interest from large institutional investors and ETF approval speculation.',
      source: 'CoinDesk',
      timestamp: '45m ago',
      sentiment: 'positive',
      sentimentScore: 78,
      isRising: true,
      category: 'Crypto',
      aiAnalysis: 'Strong bullish momentum supported by institutional inflows and regulatory clarity. Technical indicators suggest continued upward trend.'
    },
    {
      id: '5',
      headline: 'Consumer spending data reveals resilient economic fundamentals',
      description: 'Latest retail sales figures exceed expectations, showing continued consumer confidence despite inflation concerns.',
      source: 'Bloomberg',
      timestamp: '1h ago',
      sentiment: 'positive',
      sentimentScore: 72,
      isRising: true,
      category: 'Economy',
      aiAnalysis: 'Positive economic indicator suggesting consumer resilience. Supports arguments for soft landing scenario and reduced recession risk.'
    },
    {
      id: '6',
      headline: 'Banking sector faces regulatory headwinds amid rate environment',
      description: 'Regional banks report mixed earnings as net interest margins face pressure from evolving rate landscape.',
      source: 'Financial Times',
      timestamp: '1h ago',
      sentiment: 'negative',
      sentimentScore: 35,
      isRising: false,
      category: 'Banking',
      aiAnalysis: 'Sector-specific challenges related to interest rate sensitivity. Some banks better positioned than others based on loan portfolios.'
    },
    {
      id: '7',
      headline: 'Energy sector rebounds on improved demand outlook and supply constraints',
      description: 'Oil and gas companies benefit from tighter supply conditions and recovering global demand patterns.',
      source: 'MarketWatch',
      timestamp: '2h ago',
      sentiment: 'positive',
      sentimentScore: 68,
      isRising: true,
      category: 'Energy',
      aiAnalysis: 'Fundamental supply-demand dynamics supporting higher energy prices. Geopolitical factors adding additional upward pressure.'
    },
    {
      id: '8',
      headline: 'Healthcare innovation drives sector optimism despite regulatory uncertainty',
      description: 'Breakthrough treatments and FDA approvals offset concerns about drug pricing policies and regulatory changes.',
      source: 'Healthcare Finance',
      timestamp: '2h ago',
      sentiment: 'neutral',
      sentimentScore: 58,
      isRising: true,
      category: 'Healthcare',
      aiAnalysis: 'Mixed sentiment with innovation positives balanced against regulatory risks. Selective opportunities in biotech and medical devices.'
    }
  ]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-400';
      case 'negative': return 'text-red-400';
      default: return 'text-amber-400';
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    const colors = {
      positive: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      negative: 'bg-red-500/20 text-red-400 border-red-500/30',
      neutral: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    };
    return colors[sentiment as keyof typeof colors];
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '🟢';
      case 'negative': return '🔴';
      default: return '🟡';
    }
  };

  const getFilteredNews = () => {
    let filtered = newsItems;
    
    if (activeFilter !== 'all') {
      const sentimentMap = {
        'bullish': 'positive',
        'bearish': 'negative',
        'neutral': 'neutral'
      };
      filtered = filtered.filter(item => item.sentiment === sentimentMap[activeFilter]);
    }

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.slice(0, 8);
  };

  return (
    <div className={cn("w-full", className)}>
      <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
        {/* Header with gradient */}
        <CardHeader className="bg-gradient-to-r from-purple-600/30 to-violet-600/30 border-b border-purple-500/20 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-cyan-400" />
                Smart News Feed
              </CardTitle>
              <Badge className="bg-purple-200/20 text-purple-300 border-purple-400/30">
                AI Powered
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search news, tickers, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-black/30 border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:bg-black/50 focus:border-pink-400/50"
                />
              </div>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-purple-500/10 rounded-lg">
                <RefreshCw className="w-4 h-4 text-gray-300 hover:text-purple-400" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Filter Tabs */}
        <div className="p-4 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            {[
              { key: 'all', label: 'All News' },
              { key: 'bullish', label: 'Bullish' },
              { key: 'neutral', label: 'Neutral' },
              { key: 'bearish', label: 'Bearish' }
            ].map(filter => (
              <Button
                key={filter.key}
                variant="ghost"
                size="sm"
                onClick={() => setActiveFilter(filter.key as any)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  activeFilter === filter.key
                    ? "bg-purple-500/30 text-purple-300 border border-purple-400/50"
                    : "text-gray-400 hover:text-white hover:bg-purple-500/10"
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* News Items */}
        <CardContent className="p-0">
          <div className="space-y-0">
            {getFilteredNews().map((item, index) => (
              <div
                key={item.id}
                className="p-6 border-b border-purple-500/10 hover:bg-purple-500/5 transition-all duration-300 group"
              >
                {/* Header with source and timestamp */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 font-medium">{item.source}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{item.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs", getSentimentBadge(item.sentiment))}>
                      {getSentimentEmoji(item.sentiment)} {item.sentiment}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {item.isRising ? (
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-400" />
                      )}
                      <span className={cn("text-xs font-medium", getSentimentColor(item.sentiment))}>
                        {item.sentimentScore}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Headline */}
                <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-purple-300 transition-colors cursor-pointer flex items-center gap-2">
                  {item.headline}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Category and AI Analysis */}
                <div className="flex items-center justify-between">
                  <Badge className="bg-gray-700/50 text-gray-300 border-gray-600/50 text-xs">
                    {item.category}
                  </Badge>
                  
                  {item.aiAnalysis && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedAnalysis(
                        expandedAnalysis === item.id ? null : item.id
                      )}
                      className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1"
                    >
                      <Brain className="w-3 h-3" />
                      AI Analysis
                      <ChevronDown className={cn(
                        "w-3 h-3 transition-transform",
                        expandedAnalysis === item.id && "rotate-180"
                      )} />
                    </Button>
                  )}
                </div>

                {/* Expanded AI Analysis */}
                {expandedAnalysis === item.id && item.aiAnalysis && (
                  <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-purple-300">AI Analysis</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {item.aiAnalysis}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {getFilteredNews().length === 0 && (
            <div className="p-12 text-center">
              <Newspaper className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No news found</h3>
              <p className="text-sm text-gray-500">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
