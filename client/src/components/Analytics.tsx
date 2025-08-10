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
  const [searchTicker, setSearchTicker] = useState("");
  const [selectedMarketCap, setSelectedMarketCap] = useState("All Sizes");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedVolume, setSelectedVolume] = useState("All Volumes");
  const [selectedSocialBuzz, setSelectedSocialBuzz] = useState("All Levels");
  const [savedTemplates, setSavedTemplates] = useState<string[]>(["Growth Template", "Value Template"]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");

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
    (searchQuery === "" ||
     stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
     stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     stock.sector.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (searchTicker === "" ||
     stock.symbol.toLowerCase().includes(searchTicker.toLowerCase()) ||
     stock.name.toLowerCase().includes(searchTicker.toLowerCase())) &&
    (selectedMarketCap === "All Sizes" ||
     (selectedMarketCap === "Large Cap" && parseFloat(stock.marketCap.replace(/[TB]/g, '')) > 10) ||
     (selectedMarketCap === "Mid Cap" && parseFloat(stock.marketCap.replace(/[TB]/g, '')) >= 2 && parseFloat(stock.marketCap.replace(/[TB]/g, '')) <= 10) ||
     (selectedMarketCap === "Small Cap" && parseFloat(stock.marketCap.replace(/[TB]/g, '')) < 2)) &&
    (selectedSector === "All Sectors" || stock.sector === selectedSector) &&
    stock.price >= priceRange[0] && stock.price <= priceRange[1] &&
    stock.sentiment >= moodScore[0] && stock.sentiment <= moodScore[1]
  );

  const handleSaveTemplate = () => {
    if (newTemplateName.trim()) {
      setSavedTemplates([...savedTemplates, newTemplateName.trim()]);
      setNewTemplateName("");
      setShowSaveDialog(false);
      alert(`Template "${newTemplateName}" saved successfully!`);
    }
  };

  const handleLoadTemplate = (templateName: string) => {
    // Load predefined template settings
    if (templateName === "Growth Template") {
      setPriceRange([50, 500]);
      setPeRatio([15, 40]);
      setRsi([40, 70]);
      setSelectedSector("Technology");
      setMoodScore([60, 100]);
    } else if (templateName === "Value Template") {
      setPriceRange([10, 200]);
      setPeRatio([5, 20]);
      setRsi([30, 60]);
      setSelectedSector("Finance");
      setMoodScore([40, 80]);
    }
    alert(`Template "${templateName}" loaded successfully!`);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Symbol', 'Name', 'Price', 'Change %', 'Sentiment', 'Market Cap', 'Volume', 'Sector'],
      ...filteredStocks.map(stock => [
        stock.symbol,
        stock.name,
        stock.price.toString(),
        stock.change.toString(),
        stock.sentiment.toString(),
        stock.marketCap,
        stock.volume,
        stock.sector
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock_screener_results_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const applyGrowthFilter = () => {
    setSelectedSector("Technology");
    setPriceRange([100, 500]);
    setMoodScore([70, 100]);
    setRsi([50, 80]);
    alert("Growth Tech Stocks filter applied!");
  };

  const applyOversoldFilter = () => {
    setRsi([0, 30]);
    setDayChange([-10, -2]);
    setMoodScore([30, 60]);
    alert("Oversold Bounce Candidates filter applied!");
  };

  const resetAllFilters = () => {
    setPriceRange([0, 500]);
    setPeRatio([0, 100]);
    setRsi([0, 100]);
    setDayChange([-20, 20]);
    setVolatility([0, 10]);
    setMoodScore([0, 100]);
    setNewsScore([0, 100]);
    setSearchTicker("");
    setSelectedMarketCap("All Sizes");
    setSelectedSector("All Sectors");
    setSelectedVolume("All Volumes");
    setSelectedSocialBuzz("All Levels");
  };

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
                      <Button size="sm" className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30" onClick={applyGrowthFilter}>
                        ⭐ Growth Tech Stocks
                      </Button>
                      <Button size="sm" className="bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30" onClick={applyOversoldFilter}>
                        ⭐ Oversold Bounce Candidates
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-300" onClick={() => setShowSaveDialog(true)}>
                        📁 Save Template
                      </Button>
                      <select
                        onChange={(e) => e.target.value && handleLoadTemplate(e.target.value)}
                        className="bg-black/40 border border-gray-500/30 rounded text-gray-300 text-sm px-3 py-1"
                      >
                        <option value="">📂 Load Template</option>
                        {savedTemplates.map((template, index) => (
                          <option key={index} value={template}>{template}</option>
                        ))}
                      </select>
                      <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-300" onClick={handleExportCSV}>
                        📊 Export CSV
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Main Advanced Screener Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left Sidebar - Filters */}
                  <div className="lg:col-span-1">
                    <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          🔧 Filters
                          <div className="ml-auto flex gap-2">
                            <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-300 text-xs" onClick={resetAllFilters}>
                              Reset
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-300 text-xs">
                              Hide Filters
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Search */}
                        <div>
                          <Input
                            placeholder="Search ticker or company..."
                            value={searchTicker}
                            onChange={(e) => setSearchTicker(e.target.value)}
                            className="bg-black/40 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-0 text-sm"
                          />
                        </div>

                        {/* Fundamentals */}
                        <div>
                          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            💰 Fundamentals
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-gray-400 text-xs mb-2 block">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
                              <div className="h-2 bg-gray-700 rounded-full relative">
                                <div
                                  className="absolute top-0 h-2 bg-purple-500 rounded-full"
                                  style={{
                                    left: `${(priceRange[0] / 500) * 100}%`,
                                    width: `${((priceRange[1] - priceRange[0]) / 500) * 100}%`
                                  }}
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="500"
                                  value={priceRange[0]}
                                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="500"
                                  value={priceRange[1]}
                                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-gray-400 text-xs mb-2 block">P/E Ratio: {peRatio[0]} - {peRatio[1]}</label>
                              <div className="h-2 bg-gray-700 rounded-full relative">
                                <div
                                  className="absolute top-0 h-2 bg-purple-500 rounded-full"
                                  style={{
                                    left: `${(peRatio[0] / 100) * 100}%`,
                                    width: `${((peRatio[1] - peRatio[0]) / 100) * 100}%`
                                  }}
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={peRatio[0]}
                                  onChange={(e) => setPeRatio([parseInt(e.target.value), peRatio[1]])}
                                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={peRatio[1]}
                                  onChange={(e) => setPeRatio([peRatio[0], parseInt(e.target.value)])}
                                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-gray-400 text-xs mb-1 block">Market Cap</label>
                              <select
                                value={selectedMarketCap}
                                onChange={(e) => setSelectedMarketCap(e.target.value)}
                                className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2"
                              >
                                <option>All Sizes</option>
                                <option>Large Cap</option>
                                <option>Mid Cap</option>
                                <option>Small Cap</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-gray-400 text-xs mb-1 block">Sector</label>
                              <select
                                value={selectedSector}
                                onChange={(e) => setSelectedSector(e.target.value)}
                                className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2"
                              >
                                <option>All Sectors</option>
                                <option>Technology</option>
                                <option>Finance</option>
                                <option>Healthcare</option>
                                <option>Consumer</option>
                                <option>Automotive</option>
                                <option>Crypto</option>
                                <option>ETF</option>
                                <option>Entertainment</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Technicals */}
                        <div>
                          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            📈 Technicals
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-gray-400 text-xs mb-2 block">RSI: {rsi[0]} - {rsi[1]}</label>
                              <div className="h-2 bg-gray-700 rounded-full relative">
                                <div
                                  className="absolute top-0 h-2 bg-blue-500 rounded-full"
                                  style={{
                                    left: `${(rsi[0] / 100) * 100}%`,
                                    width: `${((rsi[1] - rsi[0]) / 100) * 100}%`
                                  }}
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={rsi[0]}
                                  onChange={(e) => setRsi([parseInt(e.target.value), rsi[1]])}
                                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={rsi[1]}
                                  onChange={(e) => setRsi([rsi[0], parseInt(e.target.value)])}
                                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-gray-400 text-xs mb-1 block">Volume</label>
                              <select
                                value={selectedVolume}
                                onChange={(e) => setSelectedVolume(e.target.value)}
                                className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2"
                              >
                                <option>All Volumes</option>
                                <option>High Volume</option>
                                <option>Medium Volume</option>
                                <option>Low Volume</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Performance */}
                        <div>
                          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            📊 Performance
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-gray-400 text-xs mb-2 block">1D Change: -20% - 20%</label>
                              <div className="h-2 bg-gray-700 rounded-full relative">
                                <div className="absolute left-1/2 top-0 h-2 bg-green-500 rounded-full" style={{width: '30%'}} />
                                <div className="absolute top-0 w-3 h-3 bg-green-400 rounded-full -mt-0.5 border-2 border-white" style={{left: '40%'}} />
                                <div className="absolute top-0 w-3 h-3 bg-green-400 rounded-full -mt-0.5 border-2 border-white" style={{left: '70%'}} />
                              </div>
                            </div>
                            <div>
                              <label className="text-gray-400 text-xs mb-2 block">Volatility: 0 - 10</label>
                              <div className="h-2 bg-gray-700 rounded-full relative">
                                <div className="absolute left-0 top-0 h-2 bg-orange-500 rounded-full" style={{width: '50%'}} />
                                <div className="absolute left-0 top-0 w-3 h-3 bg-orange-400 rounded-full -mt-0.5 border-2 border-white" style={{left: '0%'}} />
                                <div className="absolute top-0 w-3 h-3 bg-orange-400 rounded-full -mt-0.5 border-2 border-white" style={{left: '50%'}} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sentiment */}
                        <div>
                          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            🧠 Sentiment (MoodMeter)
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-gray-400 text-xs mb-2 block">Mood Score: 0 - 100</label>
                              <div className="h-2 bg-gray-700 rounded-full relative">
                                <div className="absolute left-0 top-0 h-2 bg-emerald-500 rounded-full" style={{width: '75%'}} />
                                <div className="absolute left-0 top-0 w-3 h-3 bg-emerald-400 rounded-full -mt-0.5 border-2 border-white" style={{left: '0%'}} />
                                <div className="absolute top-0 w-3 h-3 bg-emerald-400 rounded-full -mt-0.5 border-2 border-white" style={{left: '75%'}} />
                              </div>
                            </div>
                            <div>
                              <label className="text-gray-400 text-xs mb-1 block">Social Buzz</label>
                              <select
                                value={selectedSocialBuzz}
                                onChange={(e) => setSelectedSocialBuzz(e.target.value)}
                                className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2"
                              >
                                <option>All Levels</option>
                                <option>High Buzz</option>
                                <option>Medium Buzz</option>
                                <option>Low Buzz</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-gray-400 text-xs mb-2 block">News Score: 0 - 100</label>
                              <div className="h-2 bg-gray-700 rounded-full relative">
                                <div className="absolute left-0 top-0 h-2 bg-cyan-500 rounded-full" style={{width: '60%'}} />
                                <div className="absolute left-0 top-0 w-3 h-3 bg-cyan-400 rounded-full -mt-0.5 border-2 border-white" style={{left: '0%'}} />
                                <div className="absolute top-0 w-3 h-3 bg-cyan-400 rounded-full -mt-0.5 border-2 border-white" style={{left: '60%'}} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Live Mode */}
                        <div className="pt-4 border-t border-purple-500/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-white text-sm font-medium">Live Mode</span>
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">PRO</Badge>
                            </div>
                            <Button size="sm" variant={liveMode ? "default" : "outline"} className={liveMode ? "bg-green-600 text-white" : "border-gray-500/30 text-gray-400"} onClick={() => setLiveMode(!liveMode)}>
                              {liveMode ? "ON" : "OFF"}
                            </Button>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">Auto-refresh every 30 seconds</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Main Content - Results */}
                  <div className="lg:col-span-3">
                    <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <CardTitle className="text-white">Found {filteredStocks.length} stocks</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                🕐 Real-time
                              </Badge>
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                                🤖 AI Enhanced
                              </Badge>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-300">
                            Hide Filters
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Advanced Stock Results Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.50, change: 5.20, sentiment: 32.5, rsi: 67.3, news: 82, badge: 'Bullish', analysis: 'Positive news catalyst detected' },
                            { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 421.25, change: -0.89, sentiment: 72.1, rsi: 58.7, news: 89, badge: 'Bullish', analysis: 'Technically overbought - potential pullback' },
                            { symbol: 'AAPL', name: 'Apple Inc.', price: 195.50, change: 1.60, sentiment: 58.7, rsi: 72.5, news: 76, badge: 'Neutral', analysis: 'No significant patterns detected' },
                            { symbol: 'AMD', name: 'Adv Micro Dev...', price: 142.80, change: -2.30, sentiment: 42.8, rsi: 61, news: 67, badge: 'Neutral', analysis: 'No significant patterns detected' },
                            { symbol: 'MSFT', name: 'Microsoft Corporation', price: 420.15, change: 1.41, sentiment: 64.4, rsi: 75, news: 74, badge: 'Bullish', analysis: 'No significant patterns detected' }
                          ].map((stock, index) => (
                            <Card key={stock.symbol} className="bg-gradient-to-br from-slate-800/60 to-purple-900/40 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                      {stock.symbol[0]}
                                    </div>
                                    <div>
                                      <h3 className="text-white font-bold text-lg">{stock.symbol}</h3>
                                      <p className="text-gray-400 text-xs">{stock.name}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <Badge className={stock.badge === 'Bullish' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                                      {stock.badge}
                                    </Badge>
                                    <p className="text-xs text-gray-400 mt-1">Technology</p>
                                  </div>
                                </div>

                                <div className="space-y-3 mb-4">
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

                                  {/* Price and Volume Info */}
                                  <div className="flex justify-between text-xs text-gray-400">
                                    <span>P/E 43.2 • Vol 68.1M</span>
                                    <span>RSI {stock.rsi} {stock.badge === 'Bullish' ? '(Overbought)' : '(Neutral)'}</span>
                                  </div>

                                  {/* Mood Score Progress Bar */}
                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs text-gray-400">Mood Score</span>
                                      <span className="text-xs font-bold text-white">{Math.round(stock.sentiment)}/100</span>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full">
                                      <div className={cn("h-2 rounded-full", stock.sentiment > 60 ? 'bg-green-400' : stock.sentiment > 40 ? 'bg-yellow-400' : 'bg-red-400')} style={{width: `${stock.sentiment}%`}} />
                                    </div>
                                  </div>

                                  {/* Technical Indicators */}
                                  <div className="flex justify-between text-xs">
                                    <div className="flex items-center gap-1">
                                      <span className="text-gray-400">{Math.round(stock.rsi)}%</span>
                                      <div className="w-4 h-1 bg-gray-700 rounded">
                                        <div className="h-1 bg-blue-400 rounded" style={{width: `${stock.rsi}%`}} />
                                      </div>
                                      <span className="text-blue-400 font-bold">AI 75%</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-cyan-400">📰 News {stock.news}</span>
                                    </div>
                                  </div>

                                  {/* Analysis Text */}
                                  <div className="flex items-center gap-2 text-xs">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span className="text-gray-400">{stock.analysis}</span>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="flex-1 border-purple-500/30 text-purple-300 text-xs">
                                    👁 View
                                  </Button>
                                  <Button size="sm" className="bg-green-600 text-white text-xs">
                                    📋 Watch
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-400 text-xs">
                                    •••
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
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

      {/* Save Template Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-white text-lg font-bold mb-4">Save Template</h3>
            <Input
              placeholder="Enter template name..."
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              className="mb-4 bg-black/40 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-0"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleSaveTemplate}
                className="flex-1 bg-purple-600 text-white"
                disabled={!newTemplateName.trim()}
              >
                Save Template
              </Button>
              <Button
                onClick={() => {
                  setShowSaveDialog(false);
                  setNewTemplateName("");
                }}
                variant="outline"
                className="flex-1 border-gray-500/30 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
