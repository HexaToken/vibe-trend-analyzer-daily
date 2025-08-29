import { useState, useEffect, memo, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Activity, 
  BarChart3, 
  Search,
  Bell,
  User,
  Wallet,
  ExternalLink,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  Shield,
  Award,
  RefreshCw
} from "lucide-react";
import { useCryptoListings, useGlobalMetrics } from "@/hooks/useCoinMarketCap";

// Types
interface PortfolioData {
  totalUsd: number;
  totalBtc: number;
  totalEth: number;
  pnl24hPct: number;
  winRate7d: number;
}

interface CryptoToken {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  mcap: number;
  vol24h: number;
  sparkline: number[];
  momentumScore?: number;
}

interface OnChainActivity {
  time: string;
  type: 'buy' | 'sell' | 'transfer';
  symbol: string;
  usdValue: number;
  fromAddr: string;
  toAddr: string;
  txHash: string;
  dex?: string;
}

// Mock data for demonstration
const mockPortfolio: PortfolioData = {
  totalUsd: 125480.32,
  totalBtc: 1.234,
  totalEth: 45.67,
  pnl24hPct: 8.42,
  winRate7d: 73.5
};

const mockOnChainActivity: OnChainActivity[] = [
  {
    time: "2m ago",
    type: "buy",
    symbol: "BTC",
    usdValue: 250000,
    fromAddr: "0x123...abc",
    toAddr: "0x456...def",
    txHash: "0x789...ghi",
    dex: "Uniswap"
  },
  {
    time: "5m ago",
    type: "sell",
    symbol: "ETH",
    usdValue: 180000,
    fromAddr: "0x321...cba",
    toAddr: "0x654...fed",
    txHash: "0x987...ihg"
  },
  {
    time: "8m ago",
    type: "transfer",
    symbol: "USDT",
    usdValue: 500000,
    fromAddr: "0xaaa...bbb",
    toAddr: "0xccc...ddd",
    txHash: "0xeee...fff"
  }
];

const mockNews = [
  "Bitcoin reaches new all-time high amid institutional adoption",
  "Ethereum 2.0 staking rewards increase by 15% this quarter",
  "Major crypto exchange announces zero-fee trading for retail investors",
  "DeFi protocol launches innovative yield farming mechanism",
  "Regulatory clarity boosts crypto market sentiment globally"
];

export const NeonSenseCryptoDashboard = () => {
  const [sentimentScore, setSentimentScore] = useState(72);
  const [selectedWatchlist, setSelectedWatchlist] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsIndex, setNewsIndex] = useState(0);
  const [isNewsPlaying, setIsNewsPlaying] = useState(true);

  // Get real crypto data
  const { tickers: cryptoData, loading, error } = useCryptoListings(20);
  const { data: globalMetrics } = useGlobalMetrics();

  // Auto-rotate news
  useEffect(() => {
    if (!isNewsPlaying) return;
    const interval = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % mockNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isNewsPlaying]);

  // Format functions
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toLocaleString()}`;
  };

  const getSentimentColor = (score: number) => {
    if (score >= 75) return "from-[#C3FF00] to-[#16C784]";
    if (score >= 50) return "from-[#FF1F8F] to-[#00E5FF]";
    return "from-[#EA3943] to-[#FF1F8F]";
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 75) return "Greed";
    if (score >= 25) return "Neutral";
    return "Fear";
  };

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white p-6 space-y-6">
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 bg-[#0F152B]/90 backdrop-blur-xl border-b border-[#00E5FF]/20 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00E5FF] to-[#FF1F8F] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#00E5FF] to-[#C3FF00] bg-clip-text text-transparent">
                NeonSense
              </span>
            </div>
            <Badge className="bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20">
              Crypto Dashboard
            </Badge>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9AA4BF]" />
              <Input
                placeholder="Search tokens, wallets, news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#0F152B]/50 border-[#00E5FF]/20 text-white placeholder-[#9AA4BF] focus:border-[#00E5FF]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" className="bg-gradient-to-r from-[#00E5FF] to-[#FF1F8F] text-black font-semibold hover:scale-105 transition-transform">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
            <Button variant="ghost" size="icon" className="text-[#9AA4BF] hover:text-[#00E5FF]">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#9AA4BF] hover:text-[#00E5FF]">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Portfolio */}
        <Card className="bg-gradient-to-br from-[#0F152B] to-[#1A1F35] border-[#00E5FF]/20 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-[#9AA4BF]">Total Portfolio</div>
              <BarChart3 className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {formatNumber(mockPortfolio.totalUsd)}
            </div>
            <div className="text-xs text-[#9AA4BF] mb-3">
              {mockPortfolio.totalBtc.toFixed(3)} BTC • {mockPortfolio.totalEth.toFixed(2)} ETH
            </div>
            <div className="h-8 flex items-end justify-between">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-[#00E5FF]/20 to-[#00E5FF] rounded-full"
                  style={{ height: `${Math.random() * 100}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 24h P/L */}
        <Card className="bg-gradient-to-br from-[#0F152B] to-[#1A1F35] border-[#16C784]/20 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-[#9AA4BF]">24h P/L</div>
              <div className="w-2 h-2 bg-[#16C784] rounded-full animate-pulse" />
            </div>
            <div className="text-3xl font-bold text-[#16C784] mb-2">
              +{mockPortfolio.pnl24hPct.toFixed(2)}%
            </div>
            <div className="text-xs text-[#9AA4BF] mb-3">
              +${((mockPortfolio.totalUsd * mockPortfolio.pnl24hPct) / 100).toFixed(2)}
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-[#16C784]" />
              <span className="text-xs text-[#16C784]">Strong uptrend</span>
            </div>
          </CardContent>
        </Card>

        {/* Win Rate */}
        <Card className="bg-gradient-to-br from-[#0F152B] to-[#1A1F35] border-[#C3FF00]/20 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-[#9AA4BF]">Win Rate (7d)</div>
              <Target className="w-4 h-4 text-[#C3FF00]" />
            </div>
            <div className="text-3xl font-bold text-[#C3FF00] mb-2">
              {mockPortfolio.winRate7d.toFixed(1)}%
            </div>
            <div className="relative">
              <div className="w-16 h-16 mx-auto">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(195, 255, 0, 0.2)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#C3FF00"
                    strokeWidth="3"
                    strokeDasharray={`${mockPortfolio.winRate7d}, 100`}
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Trade */}
        <Card className="bg-gradient-to-br from-[#0F152B] to-[#1A1F35] border-[#FF1F8F]/20 overflow-hidden">
          <CardContent className="p-6">
            <div className="text-sm text-[#9AA4BF] mb-4">Quick Trade</div>
            <div className="space-y-3">
              <Input
                placeholder="Symbol (e.g., BTC)"
                className="bg-[#0A0F1F] border-[#FF1F8F]/20 text-white placeholder-[#9AA4BF]"
              />
              <Input
                placeholder="Amount"
                className="bg-[#0A0F1F] border-[#FF1F8F]/20 text-white placeholder-[#9AA4BF]"
              />
              <div className="grid grid-cols-2 gap-2">
                <Button className="bg-[#16C784] hover:bg-[#16C784]/80 text-black font-semibold">
                  Buy
                </Button>
                <Button className="bg-[#EA3943] hover:bg-[#EA3943]/80 text-white font-semibold">
                  Sell
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Pulse Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Sentiment Gauge */}
        <Card className="bg-gradient-to-br from-[#0F152B] to-[#1A1F35] border-[#00E5FF]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#00E5FF]">
              <Activity className="w-5 h-5" />
              AI Sentiment Gauge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#00E5FF] to-[#C3FF00] bg-clip-text text-transparent mb-2">
                {sentimentScore}
              </div>
              <div className="text-sm text-[#9AA4BF]">
                {getSentimentLabel(sentimentScore)}
              </div>
            </div>
            <div className="relative h-3 bg-[#0A0F1F] rounded-full overflow-hidden">
              <div 
                className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getSentimentColor(sentimentScore)} transition-all duration-1000 ease-out`}
                style={{ width: `${sentimentScore}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#9AA4BF] mt-2">
              <span>Fear</span>
              <span>Neutral</span>
              <span>Greed</span>
            </div>
          </CardContent>
        </Card>

        {/* Trending Coins Heatmap */}
        <Card className="bg-gradient-to-br from-[#0F152B] to-[#1A1F35] border-[#FF1F8F]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#FF1F8F]">
              <Sparkles className="w-5 h-5" />
              Trending Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {cryptoData.slice(0, 8).map((crypto) => (
                <div
                  key={crypto.symbol}
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                    crypto.changePercent > 0
                      ? 'bg-gradient-to-br from-[#16C784]/20 to-[#16C784]/10 border border-[#16C784]/30'
                      : 'bg-gradient-to-br from-[#EA3943]/20 to-[#EA3943]/10 border border-[#EA3943]/30'
                  }`}
                >
                  <div className="text-xs font-semibold">{crypto.symbol}</div>
                  <div className="text-xs text-[#9AA4BF]">${crypto.price?.toFixed(2) || '0.00'}</div>
                  <div className={`text-xs font-bold ${
                    crypto.changePercent > 0 ? 'text-[#16C784]' : 'text-[#EA3943]'
                  }`}>
                    {crypto.changePercent > 0 ? '+' : ''}{crypto.changePercent?.toFixed(1) || '0.0'}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* News Ticker */}
        <Card className="bg-gradient-to-br from-[#0F152B] to-[#1A1F35] border-[#C3FF00]/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-[#C3FF00]">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Latest News
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNewsPlaying(!isNewsPlaying)}
                className="text-[#C3FF00] hover:text-[#C3FF00]/80"
              >
                {isNewsPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-20 flex items-center">
              <p className="text-sm text-white leading-relaxed">
                {mockNews[newsIndex]}
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex gap-1">
                {mockNews.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === newsIndex ? 'bg-[#C3FF00]' : 'bg-[#9AA4BF]/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Watchlist and Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Card className="bg-gradient-to-br from-[#0F152B] to-[#1A1F35] border-[#00E5FF]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#00E5FF]">Watchlist</CardTitle>
                <Tabs value={selectedWatchlist} onValueChange={setSelectedWatchlist}>
                  <TabsList className="bg-[#0A0F1F] border-[#00E5FF]/20">
                    <TabsTrigger value="All" className="data-[state=active]:bg-[#00E5FF] data-[state=active]:text-black">All</TabsTrigger>
                    <TabsTrigger value="Blue Chips" className="data-[state=active]:bg-[#00E5FF] data-[state=active]:text-black">Blue Chips</TabsTrigger>
                    <TabsTrigger value="DeFi" className="data-[state=active]:bg-[#00E5FF] data-[state=active]:text-black">DeFi</TabsTrigger>
                    <TabsTrigger value="Memes" className="data-[state=active]:bg-[#00E5FF] data-[state=active]:text-black">Memes</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cryptoData.slice(0, 10).map((crypto) => (
                  <div
                    key={crypto.symbol}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#0A0F1F]/50 hover:bg-[#0A0F1F] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#00E5FF] to-[#FF1F8F] rounded-full flex items-center justify-center text-xs font-bold text-black">
                        {crypto.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{crypto.symbol}</div>
                        <div className="text-xs text-[#9AA4BF]">{crypto.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">
                        ${crypto.price?.toFixed(2) || '0.00'}
                      </div>
                      <div className={`text-xs font-medium ${
                        crypto.changePercent > 0 ? 'text-[#16C784]' : 'text-[#EA3943]'
                      }`}>
                        {crypto.changePercent > 0 ? '+' : ''}{crypto.changePercent?.toFixed(2) || '0.00'}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#9AA4BF]">
                        {formatNumber(crypto.marketCap || 0)}
                      </div>
                      <div className="text-xs text-[#9AA4BF]">
                        Vol: {formatNumber(crypto.volume || 0)}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-[#9AA4BF] hover:text-[#00E5FF]">
                      <Bell className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-gradient-to-br from-[#0F152B] to-[#1A1F35] border-[#FF1F8F]/20">
            <CardHeader>
              <CardTitle className="text-[#FF1F8F]">Advanced Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-[#0A0F1F] rounded-lg flex items-center justify-center">
                <div className="text-center text-[#9AA4BF]">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Interactive Chart</p>
                  <p className="text-xs">TradingView Integration</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-xs text-[#9AA4BF]">Sentiment Overlay</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-xs text-[#9AA4BF]">Volume Spikes</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-xs text-[#9AA4BF]">Whale Flow</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* On-Chain Activity Radar */}
      <Card className="bg-gradient-to-br from-[#0F152B] to-[#1A1F35] border-[#00E5FF]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#00E5FF]">
              <Activity className="w-5 h-5" />
              On-Chain Activity Radar
            </CardTitle>
            <div className="flex gap-2">
              <Badge className="bg-[#16C784]/10 text-[#16C784] border-[#16C784]/20">≥ $100k</Badge>
              <Badge className="bg-[#C3FF00]/10 text-[#C3FF00] border-[#C3FF00]/20">New Pair</Badge>
              <Badge className="bg-[#FF1F8F]/10 text-[#FF1F8F] border-[#FF1F8F]/20">Smart Money</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockOnChainActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[#0A0F1F]/50">
                <div className="flex items-center gap-3">
                  <Badge className={`${
                    activity.type === 'buy' 
                      ? 'bg-[#16C784]/10 text-[#16C784] border-[#16C784]/20'
                      : activity.type === 'sell'
                        ? 'bg-[#EA3943]/10 text-[#EA3943] border-[#EA3943]/20'
                        : 'bg-[#9AA4BF]/10 text-[#9AA4BF] border-[#9AA4BF]/20'
                  }`}>
                    {activity.type.toUpperCase()}
                  </Badge>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {formatNumber(activity.usdValue)} {activity.symbol}
                    </div>
                    <div className="text-xs text-[#9AA4BF]">
                      {activity.fromAddr} → {activity.toAddr}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#9AA4BF]">{activity.time}</div>
                  {activity.dex && (
                    <div className="text-xs text-[#00E5FF]">{activity.dex}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Row - AI Brief, Portfolio Health, Gamification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Neon Brief */}
        <Card className="bg-gradient-to-br from-[#0F152B] to-[#1A1F35] border-[#C3FF00]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C3FF00]">
              <Sparkles className="w-5 h-5" />
              Neon Brief
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-[#C3FF00] rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-white">Bitcoin showing strong momentum above $95k resistance</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-[#00E5FF] rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-white">Ethereum DeFi TVL reaches new quarterly high</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-[#FF1F8F] rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-white">Altcoin season indicators suggest continued uptrend</p>
              </div>
            </div>
            <Button 
              className="w-full mt-4 bg-[#C3FF00]/10 hover:bg-[#C3FF00]/20 text-[#C3FF00] border border-[#C3FF00]/20"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Insights
            </Button>
          </CardContent>
        </Card>

        {/* Portfolio Health */}
        <Card className="bg-gradient-to-br from-[#0F152B] to-[#1A1F35] border-[#16C784]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#16C784]">
              <Shield className="w-5 h-5" />
              Portfolio Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-[#16C784] mb-2">A+</div>
              <div className="text-sm text-[#9AA4BF]">Excellent Diversification</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#9AA4BF]">Volatility Score</span>
                <span className="text-[#16C784]">Low</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#9AA4BF]">Risk Level</span>
                <span className="text-[#C3FF00]">Moderate</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#9AA4BF]">Correlation</span>
                <span className="text-[#16C784]">Well Spread</span>
              </div>
            </div>
            <Button 
              className="w-full mt-4 bg-[#16C784]/10 hover:bg-[#16C784]/20 text-[#16C784] border border-[#16C784]/20"
              variant="outline"
            >
              Simulate Rebalance
            </Button>
          </CardContent>
        </Card>

        {/* Gamification */}
        <Card className="bg-gradient-to-br from-[#0F152B] to-[#1A1F35] border-[#FF1F8F]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#FF1F8F]">
              <Award className="w-5 h-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#C3FF00]/20 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-[#C3FF00]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Diamond Hands</div>
                  <div className="text-xs text-[#9AA4BF]">Hold for 30+ days</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00E5FF]/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-[#00E5FF]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Bull Runner</div>
                  <div className="text-xs text-[#9AA4BF]">+10% in 24h</div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-[#0A0F1F]/50 rounded-lg">
              <div className="text-xs text-[#9AA4BF] mb-1">Daily Leaderboard</div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white">#3 Today</span>
                <span className="text-xs text-[#16C784]">+12.4%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
const NeonSenseCryptoDashboardMemo = memo(NeonSenseCryptoDashboard);
NeonSenseCryptoDashboardMemo.displayName = 'NeonSenseCryptoDashboard';

export default NeonSenseCryptoDashboardMemo;