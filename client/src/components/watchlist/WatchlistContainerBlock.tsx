import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { 
  Search, 
  Plus, 
  Filter, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Star,
  Clock,
  DollarSign,
  Activity,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WatchlistAssetCard } from "./WatchlistAssetCard";
import { AddTickerModal } from "./AddTickerModal";
import { mockWatchlistAssets, mockWatchlistStats } from "@/data/watchlistMockData";
import type { WatchlistAsset } from "@/types/watchlist";

interface WatchlistContainerBlockProps {
  className?: string;
}

export const WatchlistContainerBlock = ({ className }: WatchlistContainerBlockProps) => {
  const { themeMode } = useMoodTheme();
  const [assets, setAssets] = useState<WatchlistAsset[]>(mockWatchlistAssets);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change' | 'sentiment'>('sentiment');
  const [filterType, setFilterType] = useState<'all' | 'stock' | 'crypto'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showStats, setShowStats] = useState(true);

  // Filter and sort assets
  const filteredAssets = assets
    .filter(asset => {
      const matchesSearch = asset.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           asset.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || asset.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.currentPrice - a.currentPrice;
        case 'change':
          return b.dailyChangePercent - a.dailyChangePercent;
        case 'sentiment':
          return b.sentimentScore - a.sentimentScore;
        default:
          return 0;
      }
    });

  const handleAddAsset = (newAsset: WatchlistAsset) => {
    setAssets(prev => [...prev, newAsset]);
  };

  const handleRemoveAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const handleToggleAlert = (id: string) => {
    // Mock alert toggle
    console.log('Toggle alert for:', id);
  };

  const handleToggleFavorite = (id: string) => {
    // Mock favorite toggle
    console.log('Toggle favorite for:', id);
  };

  // Calculate live stats
  const liveStats = {
    totalAssets: assets.length,
    avgSentiment: Math.round(assets.reduce((sum, asset) => sum + asset.sentimentScore, 0) / assets.length),
    totalGainers: assets.filter(asset => asset.dailyChange > 0).length,
    totalLosers: assets.filter(asset => asset.dailyChange < 0).length,
    topPerformer: assets.reduce((top, asset) => 
      asset.dailyChangePercent > (top?.dailyChangePercent || -Infinity) ? asset : top, null as WatchlistAsset | null),
    worstPerformer: assets.reduce((worst, asset) => 
      asset.dailyChangePercent < (worst?.dailyChangePercent || Infinity) ? asset : worst, null as WatchlistAsset | null)
  };

  return (
    <div className={cn("space-y-6 p-6", className)}>
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Your Watchlist
            </h1>
            <p className="text-gray-400 mt-1">
              Track your favorite assets with real-time sentiment analysis
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="hidden md:flex"
            >
              {showStats ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </Button>
            
            <AddTickerModal 
              onAddAsset={handleAddAsset}
              existingTickers={assets.map(a => a.ticker)}
            >
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Add to Watchlist
              </Button>
            </AddTickerModal>
          </div>
        </div>

        {/* Stats Cards */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-400">TOTAL ASSETS</span>
                </div>
                <div className="text-2xl font-bold text-white mt-1">{liveStats.totalAssets}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-gray-400">AVG SENTIMENT</span>
                </div>
                <div className={cn(
                  "text-2xl font-bold mt-1",
                  liveStats.avgSentiment >= 70 ? "text-emerald-400" :
                  liveStats.avgSentiment >= 50 ? "text-yellow-400" : "text-red-400"
                )}>
                  {liveStats.avgSentiment.toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-gray-400">GAINERS</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{liveStats.totalGainers}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-gray-400">LOSERS</span>
                </div>
                <div className="text-2xl font-bold text-red-400 mt-1">{liveStats.totalLosers}</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search ticker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 focus:border-purple-500"
            />
          </div>

          {/* Filters */}
          <Select value={filterType} onValueChange={(value: typeof filterType) => setFilterType(value)}>
            <SelectTrigger className="w-32 bg-gray-800/50 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="stock">Stocks</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: typeof sortBy) => setSortBy(value)}>
            <SelectTrigger className="w-36 bg-gray-800/50 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sentiment">Sentiment</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="change">Change</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            className="h-8 px-3"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            className="h-8 px-3"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Assets Grid/List */}
      {filteredAssets.length > 0 ? (
        <div className={cn(
          "gap-6",
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
            : "space-y-4"
        )}>
          {filteredAssets.map((asset) => (
            <WatchlistAssetCard
              key={asset.id}
              asset={asset}
              onRemove={handleRemoveAsset}
              onToggleAlert={handleToggleAlert}
              onToggleFavorite={handleToggleFavorite}
              className={viewMode === 'list' ? "max-w-none" : ""}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700/50">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {searchQuery ? 'No assets found' : 'Your watchlist is empty'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? `No assets matching "${searchQuery}" found.`
                : 'Start by adding your favorite stocks and crypto assets to track their sentiment and performance.'
              }
            </p>
            {!searchQuery && (
              <AddTickerModal 
                onAddAsset={handleAddAsset}
                existingTickers={assets.map(a => a.ticker)}
              >
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Asset
                </Button>
              </AddTickerModal>
            )}
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      {assets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {liveStats.topPerformer && (
            <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 border-emerald-700/30">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Top Performer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{liveStats.topPerformer.ticker}</span>
                    <p className="text-sm text-gray-400">{liveStats.topPerformer.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold">
                      +{liveStats.topPerformer.dailyChangePercent.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-400">
                      Sentiment: {liveStats.topPerformer.sentimentScore.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {liveStats.worstPerformer && (
            <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-700/30">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-red-400 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{liveStats.worstPerformer.ticker}</span>
                    <p className="text-sm text-gray-400">{liveStats.worstPerformer.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400 font-bold">
                      {liveStats.worstPerformer.dailyChangePercent.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-400">
                      Sentiment: {liveStats.worstPerformer.sentimentScore.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
