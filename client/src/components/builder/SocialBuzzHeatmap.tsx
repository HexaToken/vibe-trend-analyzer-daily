import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Hash, TrendingUp, Users, MessageSquare, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SocialBuzzHeatmapProps {
  title?: string;
  maxTopics?: number;
  platforms?: string;
  autoRefresh?: boolean;
  apiEndpoint?: string;
}

interface TrendingTopic {
  keyword: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  volume: number;
  sentimentScore: number;
  platforms: {
    reddit: number;
    twitter: number;
    discord: number;
  };
  change24h: number;
  category: 'stock' | 'crypto' | 'sector' | 'general';
}

export const SocialBuzzHeatmap: React.FC<SocialBuzzHeatmapProps> = ({
  title = "Social Buzz Heatmap",
  maxTopics = 12,
  platforms = "reddit,twitter,discord",
  autoRefresh = true,
  apiEndpoint = "/api/social/trending"
}) => {
  const [topics, setTopics] = useState<TrendingTopic[]>([
    { keyword: '$NVDA', sentiment: 'bullish', volume: 15420, sentimentScore: 78, platforms: { reddit: 5200, twitter: 8100, discord: 2120 }, change24h: 145, category: 'stock' },
    { keyword: '$TSLA', sentiment: 'bearish', volume: 12340, sentimentScore: 32, platforms: { reddit: 4100, twitter: 6840, discord: 1400 }, change24h: -23, category: 'stock' },
    { keyword: 'AI Revolution', sentiment: 'bullish', volume: 9876, sentimentScore: 82, platforms: { reddit: 3200, twitter: 5276, discord: 1400 }, change24h: 67, category: 'sector' },
    { keyword: '$BTC', sentiment: 'bullish', volume: 18750, sentimentScore: 71, platforms: { reddit: 6200, twitter: 9800, discord: 2750 }, change24h: 89, category: 'crypto' },
    { keyword: 'Fed Meeting', sentiment: 'neutral', volume: 7654, sentimentScore: 52, platforms: { reddit: 2800, twitter: 3854, discord: 1000 }, change24h: 12, category: 'general' },
    { keyword: '$AAPL', sentiment: 'bullish', volume: 11230, sentimentScore: 65, platforms: { reddit: 3800, twitter: 6130, discord: 1300 }, change24h: 34, category: 'stock' },
    { keyword: 'Inflation', sentiment: 'bearish', volume: 6789, sentimentScore: 38, platforms: { reddit: 2500, twitter: 3489, discord: 800 }, change24h: -18, category: 'general' },
    { keyword: '$GOOGL', sentiment: 'neutral', volume: 8432, sentimentScore: 58, platforms: { reddit: 2900, twitter: 4632, discord: 900 }, change24h: 8, category: 'stock' },
    { keyword: 'Quantum Computing', sentiment: 'bullish', volume: 4567, sentimentScore: 74, platforms: { reddit: 1800, twitter: 2167, discord: 600 }, change24h: 156, category: 'sector' },
    { keyword: '$ETH', sentiment: 'bullish', volume: 13456, sentimentScore: 69, platforms: { reddit: 4500, twitter: 7456, discord: 1500 }, change24h: 72, category: 'crypto' },
    { keyword: 'Tech Earnings', sentiment: 'bullish', volume: 10234, sentimentScore: 76, platforms: { reddit: 3600, twitter: 5634, discord: 1000 }, change24h: 98, category: 'sector' },
    { keyword: 'Energy Crisis', sentiment: 'bearish', volume: 5678, sentimentScore: 29, platforms: { reddit: 2100, twitter: 2878, discord: 700 }, change24h: -45, category: 'sector' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setTopics(prev => prev.map(topic => ({
          ...topic,
          volume: Math.max(1000, topic.volume + (Math.random() - 0.5) * 1000),
          sentimentScore: Math.max(0, Math.min(100, topic.sentimentScore + (Math.random() - 0.5) * 10)),
          change24h: topic.change24h + (Math.random() - 0.5) * 20
        })));
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const categories = ['all', 'stock', 'crypto', 'sector', 'general'];
  
  const filteredTopics = selectedCategory === 'all' 
    ? topics.slice(0, maxTopics)
    : topics.filter(topic => topic.category === selectedCategory).slice(0, maxTopics);

  const getVolumeIntensity = (volume: number) => {
    const maxVolume = Math.max(...topics.map(t => t.volume));
    const intensity = (volume / maxVolume) * 100;
    if (intensity >= 80) return 'high';
    if (intensity >= 50) return 'medium';
    return 'low';
  };

  const getIntensityStyles = (intensity: string, sentiment: string) => {
    const baseStyles = "transition-all duration-300 hover:scale-105 cursor-pointer";
    
    if (sentiment === 'bullish') {
      switch (intensity) {
        case 'high': return `${baseStyles} bg-emerald-500/80 shadow-emerald-500/50 shadow-lg border-emerald-400`;
        case 'medium': return `${baseStyles} bg-emerald-500/50 shadow-emerald-500/30 shadow-md border-emerald-500`;
        default: return `${baseStyles} bg-emerald-500/20 border-emerald-600`;
      }
    } else if (sentiment === 'bearish') {
      switch (intensity) {
        case 'high': return `${baseStyles} bg-red-500/80 shadow-red-500/50 shadow-lg border-red-400`;
        case 'medium': return `${baseStyles} bg-red-500/50 shadow-red-500/30 shadow-md border-red-500`;
        default: return `${baseStyles} bg-red-500/20 border-red-600`;
      }
    } else {
      switch (intensity) {
        case 'high': return `${baseStyles} bg-amber-500/80 shadow-amber-500/50 shadow-lg border-amber-400`;
        case 'medium': return `${baseStyles} bg-amber-500/50 shadow-amber-500/30 shadow-md border-amber-500`;
        default: return `${baseStyles} bg-amber-500/20 border-amber-600`;
      }
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '➡️';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stock': return '📊';
      case 'crypto': return '₿';
      case 'sector': return '🏭';
      default: return '💬';
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 10000) return `${(volume / 1000).toFixed(1)}k`;
    return volume.toString();
  };

  return (
    <Card className="finance-card border-0">
      <CardHeader className="border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Hash className="w-5 h-5 text-purple-400" />
            {title}
            {loading && (
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            )}
          </CardTitle>
          
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs h-7 px-3 capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Heatmap Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {filteredTopics.map((topic, index) => {
            const intensity = getVolumeIntensity(topic.volume);
            return (
              <div
                key={index}
                className={cn(
                  "relative rounded-xl p-4 border backdrop-blur-sm group",
                  getIntensityStyles(intensity, topic.sentiment)
                )}
              >
                {/* Topic Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(topic.category)}</span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-black/20 text-white border-white/30"
                    >
                      {topic.category}
                    </Badge>
                  </div>
                  <div className="text-lg">{getSentimentIcon(topic.sentiment)}</div>
                </div>

                {/* Keyword */}
                <div className="mb-3">
                  <h3 className="font-bold text-white text-sm mb-1">{topic.keyword}</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white/80">{formatVolume(topic.volume)} mentions</span>
                    <span className={cn(
                      "font-medium",
                      topic.change24h >= 0 ? "text-emerald-300" : "text-red-300"
                    )}>
                      {topic.change24h >= 0 ? '+' : ''}{topic.change24h.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Sentiment Score */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white/70">Sentiment</span>
                    <span className="font-bold text-white">{topic.sentimentScore}</span>
                  </div>
                  <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        topic.sentiment === 'bullish' ? 'bg-emerald-300' :
                        topic.sentiment === 'bearish' ? 'bg-red-300' : 'bg-amber-300'
                      )}
                      style={{ width: `${topic.sentimentScore}%` }}
                    />
                  </div>
                </div>

                {/* Platform Breakdown - Hidden by default, shown on hover */}
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center">
                  <h4 className="text-white font-bold text-sm mb-3 text-center">Platform Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(topic.platforms).map(([platform, count]) => (
                      <div key={platform} className="flex items-center justify-between text-xs">
                        <span className="capitalize text-white/80">{platform}</span>
                        <span className="font-medium text-white">{formatVolume(count)}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 h-6 text-xs text-purple-300 hover:text-purple-200"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-emerald-500/50 rounded border border-emerald-400" />
            <span className="text-slate-400">Bullish</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-red-500/50 rounded border border-red-400" />
            <span className="text-slate-400">Bearish</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-amber-500/50 rounded border border-amber-400" />
            <span className="text-slate-400">Neutral</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Brightness = Volume</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
