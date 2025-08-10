import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, TrendingUp, TrendingDown, BarChart3, Crown } from 'lucide-react';
import { cn } from '../lib/utils';
import StrategySwiper from './StrategySwiper';

export const Analytics = () => {
  const [activeTab, setActiveTab] = useState("Scanner");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfiler, setShowProfiler] = useState(false);
  const [screenerType, setScreenerType] = useState("basic");
  const [aiQuery, setAiQuery] = useState("Ask AI: Find mid-cap tech stocks with rising sentiment and strong momentum...");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [peRatio, setPeRatio] = useState([0, 100]);
  const [rsi, setRsi] = useState([0, 100]);
  const [dayChange, setDayChange] = useState([-20, 20]);
  const [volatility, setVolatility] = useState([0, 10]);
  const [moodScore, setMoodScore] = useState([0, 100]);
  const [newsScore, setNewsScore] = useState([0, 100]);
  const [liveMode, setLiveMode] = useState(true);

  // Mock stock data for the screener
  const stockData = [
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.50, change: -3.21, sentiment: 35, marketCap: '789B', volume: '67M', sector: 'Automotive', lastClose: 257.23 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 432.50, change: 5.23, sentiment: 92, marketCap: '1.1T', volume: '89M', sector: 'Technology', lastClose: 410.89 },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 190.64, change: 2.34, sentiment: 78, marketCap: '2.9T', volume: '45M', sector: 'Technology', lastClose: 186.40 },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 154.32, change: -1.87, sentiment: 68, marketCap: '1.6T', volume: '23M', sector: 'Consumer', lastClose: 157.21 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 420.15, change: 1.89, sentiment: 85, marketCap: '3.1T', volume: '32M', sector: 'Technology', lastClose: 412.37 },
    { symbol: 'SPY', name: 'SPDR S&P 500', price: 154.32, change: 0.75, sentiment: 71, marketCap: '487B', volume: '89M', sector: 'ETF', lastClose: 153.16 },
    { symbol: 'JPM', name: 'JPMorgan Chase', price: 163.24, change: -0.89, sentiment: 65, marketCap: '478B', volume: '12M', sector: 'Finance', lastClose: 164.70 },
    { symbol: 'V', name: 'Visa Inc.', price: 267.91, change: 1.45, sentiment: 82, marketCap: '567B', volume: '8M', sector: 'Finance', lastClose: 264.10 },
    { symbol: 'WMT', name: 'Walmart Inc.', price: 163.56, change: 0.34, sentiment: 58, marketCap: '445B', volume: '15M', sector: 'Consumer', lastClose: 163.01 },
    { symbol: 'BTC', name: 'Bitcoin', price: 65.23, change: 2.18, sentiment: 79, marketCap: '1.3T', volume: '2.1B', sector: 'Crypto', lastClose: 63.84 },
    { symbol: 'SOL', name: 'Solana', price: 67.89, change: 7.45, sentiment: 88, marketCap: '31B', volume: '890M', sector: 'Crypto', lastClose: 63.21 },
    { symbol: 'COIN', name: 'Coinbase Global', price: 198.34, change: 4.12, sentiment: 73, marketCap: '49B', volume: '28M', sector: 'Crypto', lastClose: 190.53 },
    { symbol: 'SPW', name: 'SP Global Inc.', price: 8.76, change: -2.34, sentiment: 52, marketCap: '134B', volume: '6M', sector: 'Finance', lastClose: 8.97 },
    { symbol: 'IEF', name: 'iShares Bond ETF', price: 3.45, change: -1.23, sentiment: 48, marketCap: '21B', volume: '4M', sector: 'ETF', lastClose: 3.49 },
    { symbol: 'AMC', name: 'AMC Entertainment', price: 4.78, change: 12.34, sentiment: 67, marketCap: '2.1B', volume: '125M', sector: 'Entertainment', lastClose: 4.26 },
    { symbol: 'GME', name: 'GameStop Corp.', price: 16.89, change: 8.76, sentiment: 71, marketCap: '5.2B', volume: '67M', sector: 'Consumer', lastClose: 15.53 },
    { symbol: 'NFLX', name: 'Netflix, Inc.', price: 487.23, change: 2.45, sentiment: 75, marketCap: '210B', volume: '18M', sector: 'Technology', lastClose: 475.56 },
    { symbol: 'CRM', name: 'Salesforce.com', price: 267.89, change: 1.67, sentiment: 69, marketCap: '263B', volume: '11M', sector: 'Technology', lastClose: 263.51 }
  ];

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return 'text-green-400';
    if (sentiment >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSentimentBg = (sentiment: number) => {
    if (sentiment >= 70) return 'bg-green-500/20 border-green-500/30';
    if (sentiment >= 50) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const filteredStocks = stockData.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-xl border border-gray-700/50">
            <TabsTrigger
              value="HeatMap"
              className="data-[state=active]:bg-gray-700/50 data-[state=active]:text-white text-gray-400"
            >
              🔥 Heat Map
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
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🔥</div>
                <h3 className="text-2xl font-bold text-white mb-2">Heat Map</h3>
                <p className="text-gray-400 mb-4">
                  Real-time sentiment & performance heatmap visualization coming soon.
                </p>
              </div>
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
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Scanner" className="mt-6">
            {/* Stock Screener Header */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Match Your Strategy</h2>
                </div>
                <p className="text-gray-300 text-sm">Discover your trading personality</p>

                {/* Strategy Button */}
                <div className="mt-4">
                  <Button
                    onClick={() => setShowProfiler(true)}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0"
                  >
                    ✨ Start Profiling →
                  </Button>
                </div>
              </div>
            </div>

            {/* Screener Tabs */}
            <div className="mb-6">
              <div className="flex gap-4">
                <Button
                  variant={screenerType === "basic" ? "default" : "outline"}
                  className={screenerType === "basic" ? "bg-purple-600 text-white" : "border-purple-500/30 text-purple-300"}
                  onClick={() => setScreenerType("basic")}
                >
                  Basic Screener
                </Button>
                <Button
                  variant={screenerType === "advanced" ? "default" : "outline"}
                  className={screenerType === "advanced" ? "bg-purple-600 text-white" : "border-purple-500/30 text-purple-300"}
                  onClick={() => setScreenerType("advanced")}
                >
                  Advanced Screener
                </Button>
              </div>
            </div>

            {/* Conditional Screener Content */}
            {screenerType === "basic" ? (
              <div>
                {/* Basic Stock Screener */}
                <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  🔍 Basic Stock Screener
                  <div className="ml-auto flex gap-2">
                    <Button size="sm" variant="outline" className="border-green-500/30 text-green-300">
                      Clear filters
                    </Button>
                    <Button size="sm" className="bg-purple-600 text-white">
                      Start analysis
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Ask for sector to ask stocks with using momentum and strong movements"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-black/40 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-0"
                    />
                    <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-4 py-1 h-8">
                      Search
                    </Button>
                  </div>
                </div>

                {/* Filters */}
                <div className="mb-6">
                  <h3 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                    🔧 Filters
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Market Cap</label>
                      <select className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2">
                        <option>All Sizes</option>
                        <option>Large Cap</option>
                        <option>Mid Cap</option>
                        <option>Small Cap</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Volume (24h)</label>
                      <select className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2">
                        <option>All Volumes</option>
                        <option>High Volume</option>
                        <option>Medium Volume</option>
                        <option>Low Volume</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Sentiment Score</label>
                      <select className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2">
                        <option>All Sentiments</option>
                        <option>Bullish</option>
                        <option>Neutral</option>
                        <option>Bearish</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Sector</label>
                      <select className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2">
                        <option>All Sectors</option>
                        <option>Technology</option>
                        <option>Finance</option>
                        <option>Consumer</option>
                        <option>Crypto</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Advanced Filters */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-white text-sm">Most Moow Advanced Filters</h4>
                    <div className="flex gap-2 text-xs">
                      <span className="text-gray-400">RSI - Moving Average - ROE ORM - Volume Analysis - News Alerts</span>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold px-6">
                    Upgrade to Pro
                  </Button>
                </div>

                {/* Results Count */}
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">
                    Found 35 results • <span className="text-purple-300 cursor-pointer hover:underline">See 35 results first time</span>
                  </p>
                </div>

                {/* Stock Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {filteredStocks.slice(0, 16).map((stock, index) => (
                    <Card key={stock.symbol} className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-white font-bold text-lg">{stock.symbol}</h3>
                            <p className="text-gray-400 text-xs truncate max-w-32">{stock.name}</p>
                          </div>
                          <Badge className={getSentimentBg(stock.sentiment)}>
                            {stock.sentiment}%
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-white">${stock.price}</span>
                            <div className={cn(
                              "flex items-center gap-1 text-sm font-medium",
                              stock.change >= 0 ? "text-green-400" : "text-red-400"
                            )}>
                              {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {stock.change >= 0 ? '+' : ''}{stock.change}%
                            </div>
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Sentiment Score</span>
                              <span className={getSentimentColor(stock.sentiment)}>{stock.sentiment}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Market Cap</span>
                              <span className="text-gray-300">{stock.marketCap}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Volume</span>
                              <span className="text-gray-300">{stock.volume}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Last Close</span>
                              <span className="text-gray-300">${stock.lastClose}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Technology</span>
                              <span className="text-gray-300">{stock.sector}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 border-purple-500/30 text-purple-300 text-xs">
                            View
                          </Button>
                          <Button size="sm" className="bg-green-600 text-white text-xs">
                            Watch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Unlock Full Results */}
            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Crown className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-2xl font-bold text-white">Unlock Full Results</h3>
                </div>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  You're viewing the top 16 results. Upgrade to PRO for all tools and access powerful filters and advanced strategies.
                </p>
                <div className="flex gap-4 justify-center mb-6">
                  <Button className="bg-yellow-500 text-black font-semibold hover:bg-yellow-400">
                    Upgrade to PRO
                  </Button>
                  <Button variant="outline" className="border-yellow-500/30 text-yellow-300">
                    Start Free Trial
                  </Button>
                  <Button variant="outline" className="border-yellow-500/30 text-yellow-300">
                    See Pricing
                  </Button>
                  <Button variant="outline" className="border-yellow-500/30 text-yellow-300">
                    Advanced Strategies
                  </Button>
                  <Button variant="outline" className="border-yellow-500/30 text-yellow-300">
                    Signal Features
                  </Button>
                </div>
                <Button className="bg-purple-600 text-white">
                  Upgrade to PRO
                </Button>
              </CardContent>
            </Card>
              </div>
            ) : (
              /* Advanced Stock Screener */
              <div className="space-y-6">
                {/* Smart Stock Screener Header */}
                <Card className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <Search className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Smart Stock Screener</h2>
                    </div>
                    <p className="text-gray-300 text-sm mb-6">AI-powered screening with sentiment analysis</p>

                    {/* AI Search Bar */}
                    <div className="relative mb-6">
                      <Input
                        type="text"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        className="pl-4 pr-20 py-4 bg-black/40 border-emerald-500/30 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-0 text-lg rounded-xl"
                      />
                      <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg">
                        Search
                      </Button>
                    </div>

                    {/* Quick Filter Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm" className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30">
                        ⭐ Growth Tech Stocks
                      </Button>
                      <Button size="sm" className="bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30">
                        ⭐ Oversold Bounce Candidates
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-300">
                        📁 Save Template
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-300">
                        📂 Load Template
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-300">
                        📊 Export CSV
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Advanced Results */}
                <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Found 5 stocks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-2xl font-bold text-white mb-2">Advanced Screener</h3>
                      <p className="text-gray-400 mb-4">
                        Complete advanced screening interface coming soon.
                      </p>
                      <Button className="bg-purple-600 text-white">
                        Enable Pro Features
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Strategy Profiler Modal */}
      {showProfiler && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <StrategySwiper
            placement="screener"
            onComplete={(profile) => {
              console.log('Profile completed:', profile);
              setShowProfiler(false);
            }}
            onClose={() => setShowProfiler(false)}
          />
        </div>
      )}
    </div>
  );
};
