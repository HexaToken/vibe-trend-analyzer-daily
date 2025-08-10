import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search, Bell, User, Zap, TrendingUp, TrendingDown, 
  Eye, Star, AlertTriangle, BarChart3, ArrowUpRight,
  ArrowDownRight, Wallet, Settings, RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface CoinData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: string;
  volume: string;
  momentum: number;
  sparkline: number[];
}

interface PortfolioData {
  totalUsd: number;
  totalBtc: number;
  totalEth: number;
  pnl24hPct: number;
  winRate7d: number;
}

interface OnChainActivity {
  time: string;
  type: 'buy' | 'sell' | 'transfer';
  symbol: string;
  usdValue: number;
  fromAddr: string;
  toAddr: string;
  txHash: string;
}

export const NeonSenseCryptoDashboard = () => {
  const [selectedWatchlist, setSelectedWatchlist] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCoinDrawer, setShowCoinDrawer] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [sentimentScore, setSentimentScore] = useState(73);
  const [refreshing, setRefreshing] = useState(false);

  // Mock Data
  const portfolioData: PortfolioData = {
    totalUsd: 247580.50,
    totalBtc: 3.847,
    totalEth: 127.23,
    pnl24hPct: 5.67,
    winRate7d: 82.3
  };

  const coinData: CoinData[] = [
    { symbol: 'BTC', name: 'Bitcoin', price: 67420.50, change24h: 3.2, change7d: 8.5, marketCap: '1.32T', volume: '28.5B', momentum: 85, sparkline: [65000, 66200, 66800, 67100, 67420] },
    { symbol: 'ETH', name: 'Ethereum', price: 3842.30, change24h: 5.1, change7d: 12.3, marketCap: '462B', volume: '15.2B', momentum: 92, sparkline: [3650, 3720, 3800, 3825, 3842] },
    { symbol: 'SOL', name: 'Solana', price: 198.45, change24h: 8.7, change7d: 22.1, marketCap: '93B', volume: '4.8B', momentum: 96, sparkline: [180, 185, 192, 195, 198] },
    { symbol: 'ADA', name: 'Cardano', price: 0.875, change24h: -2.1, change7d: 5.8, marketCap: '31B', volume: '1.2B', momentum: 45, sparkline: [0.89, 0.88, 0.87, 0.875, 0.875] },
    { symbol: 'AVAX', name: 'Avalanche', price: 42.18, change24h: 6.3, change7d: 15.7, marketCap: '16B', volume: '890M', momentum: 78, sparkline: [39, 40, 41, 42, 42.18] },
    { symbol: 'DOT', name: 'Polkadot', price: 7.92, change24h: -0.8, change7d: 3.2, marketCap: '11B', volume: '340M', momentum: 52, sparkline: [7.95, 7.93, 7.91, 7.90, 7.92] },
    { symbol: 'MATIC', name: 'Polygon', price: 0.945, change24h: 4.2, change7d: 18.9, marketCap: '9B', volume: '520M', momentum: 73, sparkline: [0.91, 0.92, 0.93, 0.94, 0.945] },
    { symbol: 'UNI', name: 'Uniswap', price: 12.65, change24h: -1.5, change7d: 7.4, marketCap: '7.6B', volume: '280M', momentum: 58, sparkline: [12.8, 12.7, 12.6, 12.65, 12.65] }
  ];

  const onChainActivities: OnChainActivity[] = [
    { time: '2m ago', type: 'buy', symbol: 'ETH', usdValue: 2500000, fromAddr: '0x123...abc', toAddr: '0x456...def', txHash: '0x789...ghi' },
    { time: '5m ago', type: 'sell', symbol: 'BTC', usdValue: 1200000, fromAddr: '0xabc...123', toAddr: '0xdef...456', txHash: '0xghi...789' },
    { time: '8m ago', type: 'transfer', symbol: 'SOL', usdValue: 500000, fromAddr: '0x111...222', toAddr: '0x333...444', txHash: '0x555...666' },
    { time: '12m ago', type: 'buy', symbol: 'AVAX', usdValue: 750000, fromAddr: '0x777...888', toAddr: '0x999...000', txHash: '0xaaa...bbb' }
  ];

  const neonBriefPoints = [
    "BTC showing strong momentum with institutional buying pressure",
    "ETH 2.0 staking rewards driving increased long-term holding",
    "Solana DeFi TVL surged 40% this week amid ecosystem growth",
    "Whale accumulation detected in top 10 altcoins",
    "Fear & Greed index trending toward 'Greed' territory"
  ];

  const getSentimentColor = (score: number) => {
    if (score <= 25) return 'text-red-400';
    if (score <= 50) return 'text-orange-400';
    if (score <= 75) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getSentimentLabel = (score: number) => {
    if (score <= 25) return 'Extreme Fear';
    if (score <= 50) return 'Fear';
    if (score <= 75) return 'Neutral';
    return 'Greed';
  };

  const getMomentumColor = (momentum: number) => {
    if (momentum >= 80) return 'shadow-[0_0_20px_rgba(0,229,255,0.6)]';
    if (momentum >= 60) return 'shadow-[0_0_15px_rgba(195,255,0,0.4)]';
    return 'shadow-[0_0_10px_rgba(255,31,143,0.3)]';
  };

  const handleRefreshInsights = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const MiniSparkline = ({ data, isPositive }: { data: number[], isPositive: boolean }) => (
    <svg width="60" height="20" className="inline-block">
      <polyline
        points={data.map((val, i) => `${(i / (data.length - 1)) * 60},${20 - ((val - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * 20}`).join(' ')}
        fill="none"
        stroke={isPositive ? '#16C784' : '#EA3943'}
        strokeWidth="1.5"
      />
    </svg>
  );

  return (
    <div className="min-h-screen" style={{ background: '#0A0F1F' }}>
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-gray-800/50" style={{ background: 'rgba(15, 21, 43, 0.9)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">NeonSense</span>
              </div>
              <div className="text-gray-400">|</div>
              <h1 className="text-lg font-semibold text-white">Crypto Dashboard</h1>
            </div>

            {/* Center: Global Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search tokens, wallets, news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-0"
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <Button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white hover:opacity-90">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Portfolio */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-400 text-sm">Total Portfolio</div>
                <div className="text-cyan-400">
                  <MiniSparkline data={[240000, 242000, 245000, 247000, 247580]} isPositive={true} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                ${portfolioData.totalUsd.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                {portfolioData.totalBtc} BTC • {portfolioData.totalEth} ETH
              </div>
            </CardContent>
          </Card>

          {/* 24h P/L */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-400 text-sm">24h P/L</div>
                <div className={cn(
                  "w-3 h-3 rounded-full animate-pulse",
                  portfolioData.pnl24hPct >= 0 ? "bg-green-400" : "bg-red-400"
                )} />
              </div>
              <div className={cn(
                "text-2xl font-bold mb-1",
                portfolioData.pnl24hPct >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {portfolioData.pnl24hPct >= 0 ? '+' : ''}{portfolioData.pnl24hPct}%
              </div>
              <div className="text-sm text-gray-400">
                ${(portfolioData.totalUsd * (portfolioData.pnl24hPct / 100)).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {/* Win Rate */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-400 text-sm">Win Rate (7d)</div>
                <div className="relative w-8 h-8">
                  <svg className="transform -rotate-90 w-8 h-8">
                    <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-700" />
                    <circle 
                      cx="16" cy="16" r="12" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      fill="none" 
                      strokeDasharray={`${2 * Math.PI * 12}`}
                      strokeDashoffset={`${2 * Math.PI * 12 * (1 - portfolioData.winRate7d / 100)}`}
                      className="text-cyan-400"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {portfolioData.winRate7d}%
              </div>
              <div className="text-sm text-gray-400">
                23/28 trades
              </div>
            </CardContent>
          </Card>

          {/* Quick Trade */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardContent className="p-6">
              <div className="text-gray-400 text-sm mb-4">Quick Trade</div>
              <div className="space-y-3">
                <Input
                  placeholder="Symbol (e.g. BTC)"
                  className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400"
                />
                <Input
                  placeholder="Amount"
                  className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">Buy</Button>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">Sell</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Pulse Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Sentiment Gauge */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-4">AI Sentiment Gauge</div>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-700" />
                    <circle 
                      cx="64" cy="64" r="56" 
                      stroke="url(#sentiment-gradient)" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - sentimentScore / 100)}`}
                      className="transition-all duration-700"
                    />
                    <defs>
                      <linearGradient id="sentiment-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#EA3943" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#16C784" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={cn("text-2xl font-bold", getSentimentColor(sentimentScore))}>
                        {sentimentScore}
                      </div>
                      <div className="text-xs text-gray-400">{getSentimentLabel(sentimentScore)}</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Fear</span>
                  <span>Neutral</span>
                  <span>Greed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trending Coins Heatmap */}
          <Card className="lg:col-span-2 border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardHeader>
              <CardTitle className="text-white">Trending Coins Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {coinData.slice(0, 8).map((coin, index) => (
                  <div
                    key={coin.symbol}
                    className={cn(
                      "p-3 rounded-lg border border-gray-700/50 cursor-pointer transition-all duration-300 hover:scale-105",
                      coin.momentum >= 80 ? "bg-cyan-400/10 border-cyan-400/30" :
                      coin.momentum >= 60 ? "bg-lime-400/10 border-lime-400/30" :
                      "bg-pink-400/10 border-pink-400/30",
                      getMomentumColor(coin.momentum)
                    )}
                    onClick={() => {
                      setSelectedCoin(coin);
                      setShowCoinDrawer(true);
                    }}
                  >
                    <div className="text-center">
                      <div className="text-white font-semibold text-sm">{coin.symbol}</div>
                      <div className="text-xs text-gray-400 mb-1">${coin.price.toFixed(2)}</div>
                      <div className={cn(
                        "text-xs font-medium flex items-center justify-center gap-1",
                        coin.change24h >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {coin.change24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                      </div>
                      <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-purple-500" 
                          style={{ width: `${Math.min(coin.momentum, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* News Ticker */}
        <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="text-gray-400 text-sm font-medium">📰 Latest News</div>
              <div className="flex-1 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                  <span className="text-white text-sm">
                    Bitcoin ETF inflows reach new record • Ethereum Layer 2 adoption soars 300% • 
                    Major bank announces crypto custody services • DeFi TVL surpasses $200B milestone • 
                    Central bank explores digital currency pilot • Crypto regulation framework approved
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Watchlists + Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Watchlist */}
          <Card className="lg:col-span-2 border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Watchlist</CardTitle>
                <Tabs value={selectedWatchlist} onValueChange={setSelectedWatchlist}>
                  <TabsList className="bg-gray-800/50">
                    <TabsTrigger value="All" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="Blue Chips" className="text-xs">Blue Chips</TabsTrigger>
                    <TabsTrigger value="DeFi" className="text-xs">DeFi</TabsTrigger>
                    <TabsTrigger value="Memes" className="text-xs">Memes</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {coinData.map((coin, index) => (
                  <div key={coin.symbol} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                        {coin.symbol[0]}
                      </div>
                      <div>
                        <div className="text-white font-medium">{coin.symbol}</div>
                        <div className="text-gray-400 text-xs">{coin.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">${coin.price.toLocaleString()}</div>
                      <div className={cn(
                        "text-xs flex items-center gap-1",
                        coin.change24h >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {coin.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-xs">{coin.marketCap}</div>
                      <div className="text-gray-400 text-xs">{coin.volume}</div>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-700 text-gray-400">
                      <Bell className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Advanced Chart Panel */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardHeader>
              <CardTitle className="text-white text-sm">Advanced Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <div className="text-gray-400 text-sm mb-4">TradingView Integration</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Sentiment Overlay</span>
                    <div className="w-8 h-4 bg-gray-700 rounded-full relative">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full absolute top-0.5 left-0.5 transition-transform" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Volume Spikes</span>
                    <div className="w-8 h-4 bg-gray-700 rounded-full relative">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full absolute top-0.5 right-0.5 transition-transform" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Whale Flow</span>
                    <div className="w-8 h-4 bg-cyan-400 rounded-full relative">
                      <div className="w-3 h-3 bg-gray-900 rounded-full absolute top-0.5 right-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* On-Chain Activity & AI Brief */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* On-Chain Activity Radar */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">On-Chain Activity Radar</CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30 text-xs">≥$100k</Badge>
                  <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30 text-xs">Smart Money</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {onChainActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30">
                    <Badge className={cn(
                      "px-2 py-1 text-xs",
                      activity.type === 'buy' ? "bg-green-600/20 text-green-400 border-green-600/30" :
                      activity.type === 'sell' ? "bg-red-600/20 text-red-400 border-red-600/30" :
                      "bg-gray-600/20 text-gray-400 border-gray-600/30"
                    )}>
                      {activity.type.toUpperCase()}
                    </Badge>
                    <div className="flex-1">
                      <div className="text-white text-sm">
                        ${activity.usdValue.toLocaleString()} {activity.symbol}
                      </div>
                      <div className="text-gray-400 text-xs">{activity.time}</div>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-700 text-gray-400">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Neon Brief */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">AI Neon Brief</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-cyan-400/30 text-cyan-400"
                  onClick={handleRefreshInsights}
                  disabled={refreshing}
                >
                  <RefreshCw className={cn("w-3 h-3 mr-2", refreshing && "animate-spin")} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {neonBriefPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                    <div className="text-gray-300 text-sm">{point}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Health & Gamification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio Health */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardHeader>
              <CardTitle className="text-white">Portfolio Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-4xl font-bold text-green-400">A+</div>
                  <div className="text-gray-400 text-sm">Health Score</div>
                </div>
                <div className="relative w-20 h-20">
                  <svg className="transform -rotate-90 w-20 h-20">
                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-700" />
                    <circle 
                      cx="40" cy="40" r="32" 
                      stroke="currentColor" 
                      strokeWidth="6" 
                      fill="none" 
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      strokeDashoffset={`${2 * Math.PI * 32 * (1 - 0.89)}`}
                      className="text-green-400"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold">89%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-gray-400 text-sm">Suggestions:</div>
                <div className="text-white text-sm">• Well-diversified across top assets</div>
                <div className="text-white text-sm">• Consider reducing high-beta exposure</div>
                <div className="text-white text-sm">• Strong momentum indicators</div>
              </div>
              <Button className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white">
                Simulate Rebalance
              </Button>
            </CardContent>
          </Card>

          {/* Gamification */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardHeader>
              <CardTitle className="text-white">Achievements & Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-gray-400 text-sm mb-2">Recent Badges</div>
                  <div className="flex gap-2">
                    <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">🏆 +10% Day</Badge>
                    <Badge className="bg-orange-400/20 text-orange-400 border-orange-400/30">₿ 1 BTC Holder</Badge>
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-2">Daily Gains Leaderboard</div>
                  <div className="space-y-2">
                    {[
                      { rank: 1, name: 'CryptoWhale92', gains: '+24.5%' },
                      { rank: 2, name: 'DiamondHands', gains: '+18.2%' },
                      { rank: 3, name: 'You', gains: '+5.67%' }
                    ].map((user, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                            user.rank === 1 ? "bg-yellow-400 text-black" :
                            user.rank === 2 ? "bg-gray-400 text-black" :
                            user.rank === 3 ? "bg-orange-400 text-black" :
                            "bg-gray-700 text-white"
                          )}>
                            {user.rank}
                          </span>
                          <span className={user.name === 'You' ? 'text-cyan-400' : 'text-white'}>{user.name}</span>
                        </div>
                        <span className="text-green-400">{user.gains}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};
