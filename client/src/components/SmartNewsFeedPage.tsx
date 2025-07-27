import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Search, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Brain,
  Clock,
  ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  source: string;
  timestamp: string;
  category: string;
  url?: string;
}

type FilterType = 'All News' | 'Bullish' | 'Neutral' | 'Bearish';

const SmartNewsFeedPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All News');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mockArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Tech stocks rally as investors eye AI-driven growth opportunities',
      summary: 'Major technology companies see significant gains amid optimism around artificial intelligence earnings reports and continued innovation.',
      sentiment: 'positive',
      source: 'Wall Street Journal',
      timestamp: '1m ago',
      category: 'Tech'
    },
    {
      id: '2',
      title: 'Federal Reserve hints at potential pause in aggressive rate hiking cycle',
      summary: 'Fed officials signal a more cautious approach to future monetary policy decisions as inflation shows signs of cooling.',
      sentiment: 'neutral',
      source: 'Reuters',
      timestamp: '1m ago',
      category: 'Economy'
    },
    {
      id: '3',
      title: 'Tesla deliveries fall short of analyst expectations for Q4',
      summary: 'Electric vehicle manufacturer reports quarterly delivery numbers below Wall Street forecasts, citing supply chain challenges.',
      sentiment: 'negative',
      source: 'CNBC',
      timestamp: '4m ago',
      category: 'Earnings'
    }
  ];

  const [articles, setArticles] = useState<NewsArticle[]>(mockArticles);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
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
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'negative':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'positive';
      case 'negative':
        return 'negative';
      default:
        return 'neutral';
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (activeFilter !== 'All News') {
      const sentimentMap = {
        'Bullish': 'positive',
        'Bearish': 'negative',
        'Neutral': 'neutral'
      };
      filtered = filtered.filter(article => 
        article.sentiment === sentimentMap[activeFilter as keyof typeof sentimentMap]
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredArticles = filterArticles();

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white flex items-center gap-2">
                  Smart News Feed
                  <span className="text-xs bg-blue-500/30 text-blue-200 px-2 py-1 rounded-full border border-blue-400/30">
                    AI Powered
                  </span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <Input
                  placeholder="Search news, tickers, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-white/30 focus:border-white/30"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-white hover:bg-white/10"
              >
                <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-6">
          {(['All News', 'Bullish', 'Neutral', 'Bearish'] as FilterType[]).map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "text-sm",
                activeFilter === filter
                  ? "bg-white/20 text-white border-white/30 hover:bg-white/25"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* News Articles */}
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="bg-black/20 backdrop-blur-sm border-white/10 hover:bg-black/30 transition-all duration-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    {/* Source and timestamp */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-white/80 text-sm font-medium">{article.source}</span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/60 text-sm">{article.timestamp}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-white text-lg font-semibold mb-3 leading-tight group-hover:text-blue-200 transition-colors">
                      {article.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-white/70 text-sm mb-4 leading-relaxed">
                      {article.summary}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={cn("text-xs border", getSentimentColor(article.sentiment))}>
                          {getSentimentIcon(article.sentiment)}
                          <span className="ml-1">{getSentimentText(article.sentiment)}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs text-white/60 border-white/20">
                          {article.category}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/60 hover:text-white hover:bg-white/10 text-xs"
                      >
                        <Brain className="w-3 h-3 mr-1" />
                        AI Analysis
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-2">No articles found</div>
            <div className="text-white/40 text-sm">Try adjusting your search or filter criteria</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartNewsFeedPage;
