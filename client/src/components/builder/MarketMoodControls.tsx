import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Search, 
  Filter, 
  Calendar, 
  Settings, 
  TrendingUp, 
  Newspaper, 
  MessageSquare, 
  BarChart3,
  Brain,
  RefreshCw,
  Download,
  Share
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface MarketMoodControlsProps {
  title?: string;
  showFilters?: boolean;
  showExport?: boolean;
  onDateRangeChange?: (range: string) => void;
  onSourceToggle?: (sources: string[]) => void;
  onSearch?: (query: string) => void;
  onExplainMood?: () => void;
}

interface FilterState {
  dateRange: '1D' | '7D' | '30D' | '90D' | '6M' | '1Y';
  sources: {
    stocks: boolean;
    news: boolean;
    social: boolean;
  };
  searchQuery: string;
}

export const MarketMoodControls: React.FC<MarketMoodControlsProps> = ({
  title = "Market Mood Controls",
  showFilters = true,
  showExport = true,
  onDateRangeChange,
  onSourceToggle,
  onSearch,
  onExplainMood
}) => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '7D',
    sources: {
      stocks: true,
      news: true,
      social: true
    },
    searchQuery: ''
  });
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);

  const dateRanges = [
    { value: '1D', label: '1 Day', icon: '📅' },
    { value: '7D', label: '7 Days', icon: '📊' },
    { value: '30D', label: '30 Days', icon: '📈' },
    { value: '90D', label: '90 Days', icon: '📉' },
    { value: '6M', label: '6 Months', icon: '🗓️' },
    { value: '1Y', label: '1 Year', icon: '📋' }
  ];

  const sources = [
    { key: 'stocks', label: 'Stocks', icon: TrendingUp, color: 'emerald' },
    { key: 'news', label: 'News', icon: Newspaper, color: 'blue' },
    { key: 'social', label: 'Social', icon: MessageSquare, color: 'purple' }
  ];

  const handleDateRangeChange = (range: string) => {
    setFilters(prev => ({ ...prev, dateRange: range as FilterState['dateRange'] }));
    onDateRangeChange?.(range);
  };

  const handleSourceToggle = (sourceKey: string) => {
    const newSources = {
      ...filters.sources,
      [sourceKey]: !filters.sources[sourceKey as keyof FilterState['sources']]
    };
    setFilters(prev => ({ ...prev, sources: newSources }));
    
    const activeSources = Object.entries(newSources)
      .filter(([_, active]) => active)
      .map(([key]) => key);
    
    onSourceToggle?.(activeSources);
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
    onSearch?.(query);
  };

  const handleExplainMood = () => {
    setIsExplaining(true);
    onExplainMood?.();
    setTimeout(() => setIsExplaining(false), 2000);
  };

  const getSourceColor = (color: string) => {
    const colors = {
      emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30',
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30'
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  const getActiveSources = () => {
    return Object.entries(filters.sources)
      .filter(([_, active]) => active)
      .map(([key]) => key);
  };

  return (
    <Card className="finance-card border-0">
      <CardHeader className="border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Settings className="w-5 h-5 text-cyan-400" />
            {title}
          </CardTitle>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
            {getActiveSources().length}/3 sources active
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Search Bar */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Search Tickers or Topics</label>
          <div className="relative">
            <div className={cn(
              "relative transition-all duration-300",
              isSearchFocused ? "transform scale-105" : ""
            )}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search NVDA, AI, crypto..."
                value={filters.searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={cn(
                  "pl-10 pr-4 py-3 bg-slate-800/50 border-slate-600 rounded-xl text-white placeholder-slate-400 transition-all duration-300",
                  "focus:bg-slate-800/70 focus:border-cyan-400/50 focus:ring-0 focus:outline-none",
                  isSearchFocused && "shadow-lg shadow-cyan-500/10 border-cyan-400/30"
                )}
              />
              {isSearchFocused && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {showFilters && (
          <>
            {/* Date Range Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Date Range
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {dateRanges.map((range) => (
                  <Button
                    key={range.value}
                    variant={filters.dateRange === range.value ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleDateRangeChange(range.value)}
                    className={cn(
                      "text-xs h-10 px-3 transition-all duration-300",
                      filters.dateRange === range.value 
                        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-lg shadow-cyan-500/20" 
                        : "hover:bg-slate-700/50"
                    )}
                  >
                    <span className="mr-1">{range.icon}</span>
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Source Toggles */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                Data Sources
              </label>
              <div className="grid grid-cols-3 gap-3">
                {sources.map((source) => {
                  const IconComponent = source.icon;
                  const isActive = filters.sources[source.key as keyof FilterState['sources']];
                  
                  return (
                    <Button
                      key={source.key}
                      variant="ghost"
                      onClick={() => handleSourceToggle(source.key)}
                      className={cn(
                        "h-16 p-4 flex flex-col items-center gap-2 border transition-all duration-300",
                        isActive 
                          ? getSourceColor(source.color)
                          : "border-slate-600 hover:border-slate-500 bg-slate-800/30"
                      )}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-xs font-medium">{source.label}</span>
                      {isActive && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-current rounded-full animate-pulse" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* AI Controls */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-400" />
            AI Analysis
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={handleExplainMood}
              disabled={isExplaining}
              className={cn(
                "h-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30",
                "text-purple-300 border border-purple-500/30 transition-all duration-300",
                "hover:shadow-lg hover:shadow-purple-500/20"
              )}
            >
              {isExplaining ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Explain Today's Mood
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              className="h-12 border border-slate-600 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800/50"
            >
              <BarChart3 className="w-4 h-4 mr-2 text-cyan-400" />
              View Detailed Analytics
            </Button>
          </div>
        </div>

        {showExport && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">Export & Share</label>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 border border-slate-600 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800/50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 border border-slate-600 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800/50"
              >
                <Share className="w-4 h-4 mr-2" />
                Share Analysis
              </Button>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {(filters.searchQuery || getActiveSources().length < 3) && (
          <div className="pt-4 border-t border-slate-700/50">
            <div className="flex flex-wrap gap-2">
              {filters.searchQuery && (
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  Search: "{filters.searchQuery}"
                </Badge>
              )}
              {getActiveSources().length < 3 && (
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  {getActiveSources().length}/3 sources
                </Badge>
              )}
              <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                Range: {filters.dateRange}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
