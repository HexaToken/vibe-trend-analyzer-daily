import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Search,
  Filter,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Crown,
  Zap,
  BarChart3,
  DollarSign,
  Volume2,
  Target,
} from "lucide-react";

interface StockData {
  ticker: string;
  companyName: string;
  currentPrice: number;
  change1D: number;
  sentimentScore: number;
  sentimentLabel: "Bullish" | "Bearish" | "Neutral";
  volume24h: number;
  marketCap: "Small" | "Mid" | "Large";
  sector: string;
}

interface BasicScreenerProps {
  className?: string;
}

const MOCK_STOCKS: StockData[] = [
  {
    ticker: "AAPL",
    companyName: "Apple Inc.",
    currentPrice: 175.43,
    change1D: 2.34,
    sentimentScore: 75,
    sentimentLabel: "Bullish",
    volume24h: 58000000,
    marketCap: "Large",
    sector: "Technology"
  },
  {
    ticker: "TSLA",
    companyName: "Tesla Inc.",
    currentPrice: 238.77,
    change1D: -1.87,
    sentimentScore: 68,
    sentimentLabel: "Bullish",
    volume24h: 45000000,
    marketCap: "Large",
    sector: "Automotive"
  },
  {
    ticker: "NVDA",
    companyName: "NVIDIA Corporation",
    currentPrice: 421.13,
    change1D: 5.67,
    sentimentScore: 82,
    sentimentLabel: "Bullish",
    volume24h: 32000000,
    marketCap: "Large",
    sector: "Technology"
  },
  {
    ticker: "MSFT",
    companyName: "Microsoft Corporation",
    currentPrice: 378.85,
    change1D: 1.24,
    sentimentScore: 71,
    sentimentLabel: "Bullish",
    volume24h: 28000000,
    marketCap: "Large",
    sector: "Technology"
  },
  {
    ticker: "JPM",
    companyName: "JPMorgan Chase & Co.",
    currentPrice: 154.32,
    change1D: -0.45,
    sentimentScore: 42,
    sentimentLabel: "Neutral",
    volume24h: 15000000,
    marketCap: "Large",
    sector: "Finance"
  },
  {
    ticker: "JNJ",
    companyName: "Johnson & Johnson",
    currentPrice: 163.24,
    change1D: 0.89,
    sentimentScore: 56,
    sentimentLabel: "Neutral",
    volume24h: 8500000,
    marketCap: "Large",
    sector: "Healthcare"
  },
  {
    ticker: "V",
    companyName: "Visa Inc.",
    currentPrice: 267.91,
    change1D: 1.87,
    sentimentScore: 64,
    sentimentLabel: "Bullish",
    volume24h: 5200000,
    marketCap: "Large",
    sector: "Finance"
  },
  {
    ticker: "WMT",
    companyName: "Walmart Inc.",
    currentPrice: 159.76,
    change1D: -0.23,
    sentimentScore: 48,
    sentimentLabel: "Neutral",
    volume24h: 7800000,
    marketCap: "Large",
    sector: "Consumer"
  },
  {
    ticker: "DIS",
    companyName: "The Walt Disney Company",
    currentPrice: 96.45,
    change1D: -2.1,
    sentimentScore: 35,
    sentimentLabel: "Bearish",
    volume24h: 12000000,
    marketCap: "Large",
    sector: "Entertainment"
  },
  {
    ticker: "AMD",
    companyName: "Advanced Micro Devices",
    currentPrice: 142.38,
    change1D: 3.45,
    sentimentScore: 73,
    sentimentLabel: "Bullish",
    volume24h: 34000000,
    marketCap: "Large",
    sector: "Technology"
  },
  {
    ticker: "NFLX",
    companyName: "Netflix Inc.",
    currentPrice: 487.23,
    change1D: 1.67,
    sentimentScore: 59,
    sentimentLabel: "Neutral",
    volume24h: 4500000,
    marketCap: "Large",
    sector: "Entertainment"
  },
  {
    ticker: "CRM",
    companyName: "Salesforce Inc.",
    currentPrice: 267.89,
    change1D: 2.34,
    sentimentScore: 66,
    sentimentLabel: "Bullish",
    volume24h: 3200000,
    marketCap: "Large",
    sector: "Technology"
  },
  {
    ticker: "PLTR",
    companyName: "Palantir Technologies",
    currentPrice: 23.67,
    change1D: 4.87,
    sentimentScore: 78,
    sentimentLabel: "Bullish",
    volume24h: 25000000,
    marketCap: "Mid",
    sector: "Technology"
  },
  {
    ticker: "SPOT",
    companyName: "Spotify Technology",
    currentPrice: 189.45,
    change1D: -1.23,
    sentimentScore: 52,
    sentimentLabel: "Neutral",
    volume24h: 1800000,
    marketCap: "Mid",
    sector: "Entertainment"
  },
  {
    ticker: "SQ",
    companyName: "Block Inc.",
    currentPrice: 67.89,
    change1D: 2.87,
    sentimentScore: 61,
    sentimentLabel: "Bullish",
    volume24h: 8900000,
    marketCap: "Mid",
    sector: "Finance"
  },
  {
    ticker: "COIN",
    companyName: "Coinbase Global",
    currentPrice: 198.34,
    change1D: 6.45,
    sentimentScore: 72,
    sentimentLabel: "Bullish",
    volume24h: 7600000,
    marketCap: "Mid",
    sector: "Finance"
  },
  {
    ticker: "SOFI",
    companyName: "SoFi Technologies",
    currentPrice: 8.76,
    change1D: 1.23,
    sentimentScore: 58,
    sentimentLabel: "Neutral",
    volume24h: 15000000,
    marketCap: "Small",
    sector: "Finance"
  },
  {
    ticker: "BB",
    companyName: "BlackBerry Limited",
    currentPrice: 3.45,
    change1D: -2.34,
    sentimentScore: 28,
    sentimentLabel: "Bearish",
    volume24h: 2100000,
    marketCap: "Small",
    sector: "Technology"
  },
  {
    ticker: "AMC",
    companyName: "AMC Entertainment",
    currentPrice: 4.78,
    change1D: 8.34,
    sentimentScore: 69,
    sentimentLabel: "Bullish",
    volume24h: 89000000,
    marketCap: "Small",
    sector: "Entertainment"
  },
  {
    ticker: "GME",
    companyName: "GameStop Corp.",
    currentPrice: 16.89,
    change1D: 12.67,
    sentimentScore: 74,
    sentimentLabel: "Bullish",
    volume24h: 45000000,
    marketCap: "Small",
    sector: "Consumer"
  }
];

const SECTORS = ["All", "Technology", "Finance", "Healthcare", "Entertainment", "Consumer", "Automotive"];

export const BasicScreener: React.FC<BasicScreenerProps> = ({ className }) => {
  const { themeMode } = useMoodTheme();
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>(MOCK_STOCKS.slice(0, 20));
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedMarketCap, setSelectedMarketCap] = useState<string>("All");
  const [selectedVolume, setSelectedVolume] = useState<string>("All");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("All");
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const applyFilters = () => {
    let filtered = MOCK_STOCKS;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(stock => 
        stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(stock => 
      stock.currentPrice >= priceRange[0] && stock.currentPrice <= priceRange[1]
    );

    // Market cap filter
    if (selectedMarketCap !== "All") {
      filtered = filtered.filter(stock => stock.marketCap === selectedMarketCap);
    }

    // Volume filter
    if (selectedVolume !== "All") {
      filtered = filtered.filter(stock => {
        if (selectedVolume === "Low") return stock.volume24h < 10000000;
        if (selectedVolume === "Medium") return stock.volume24h >= 10000000 && stock.volume24h < 30000000;
        if (selectedVolume === "High") return stock.volume24h >= 30000000;
        return true;
      });
    }

    // Sentiment filter
    if (selectedSentiment !== "All") {
      filtered = filtered.filter(stock => stock.sentimentLabel === selectedSentiment);
    }

    // Sector filter
    if (selectedSector !== "All") {
      filtered = filtered.filter(stock => stock.sector === selectedSector);
    }

    // Limit to 20 results for free users
    setFilteredStocks(filtered.slice(0, 20));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 500]);
    setSelectedMarketCap("All");
    setSelectedVolume("All");
    setSelectedSentiment("All");
    setSelectedSector("All");
    setFilteredStocks(MOCK_STOCKS.slice(0, 20));
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, priceRange, selectedMarketCap, selectedVolume, selectedSentiment, selectedSector]);

  const getSentimentColor = (sentiment: string, score: number) => {
    if (sentiment === "Bullish") return "text-green-400 bg-green-500/20 border-green-500/30";
    if (sentiment === "Bearish") return "text-red-400 bg-red-500/20 border-red-500/30";
    return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const handleAdvancedFilter = () => {
    setShowUpgradeModal(true);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-purple-400" />
            Basic Stock Screener
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Filter stocks by basic criteria • Free tier: Top 20 results
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={clearFilters}
            variant="outline"
            size="sm"
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Clear Filters
          </Button>
          
          <Button
            onClick={handleAdvancedFilter}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
          >
            <Crown className="w-4 h-4" />
            Pro Filters
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by ticker symbol or company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-400/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-400" />
            Filter Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                    className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-400/50"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 500])}
                    className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-400/50"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(priceRange[1]/500)*100}%, #374151 ${(priceRange[1]/500)*100}%, #374151 100%)`
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>$0</span>
                <span>$500+</span>
              </div>
            </div>

            {/* Market Cap */}
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                Market Cap
              </Label>
              <Select value={selectedMarketCap} onValueChange={setSelectedMarketCap}>
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select market cap" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="All">All Sizes</SelectItem>
                  <SelectItem value="Small">Small Cap</SelectItem>
                  <SelectItem value="Mid">Mid Cap</SelectItem>
                  <SelectItem value="Large">Large Cap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Volume */}
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-orange-400" />
                Volume (24h)
              </Label>
              <Select value={selectedVolume} onValueChange={setSelectedVolume}>
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select volume" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="All">All Volumes</SelectItem>
                  <SelectItem value="Low">Low (&lt;10M)</SelectItem>
                  <SelectItem value="Medium">Medium (10M-30M)</SelectItem>
                  <SelectItem value="High">High (&gt;30M)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sentiment */}
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Sentiment Score
              </Label>
              <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select sentiment" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="All">All Sentiments</SelectItem>
                  <SelectItem value="Bullish">Bullish</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                  <SelectItem value="Bearish">Bearish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sector */}
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                Sector
              </Label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {SECTORS.map(sector => (
                    <SelectItem key={sector} value={sector}>
                      {sector === "All" ? "All Sectors" : sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pro Features Teaser */}
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-4 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  Pro Filters Available
                </h4>
                <p className="text-gray-400 text-sm">
                  RSI, Moving Averages, P/E Ratio, Dividend Yield & more
                </p>
              </div>
              <Button
                onClick={handleAdvancedFilter}
                size="sm"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-medium"
              >
                Upgrade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="text-white">
          <span className="text-lg font-medium">
            Showing {filteredStocks.length} stocks
          </span>
          {filteredStocks.length === 20 && (
            <span className="text-gray-400 text-sm ml-2">
              (Limited to 20 results for free users)
            </span>
          )}
        </div>
        
        <Badge variant="outline" className="border-purple-500/30 text-purple-400">
          Free Tier
        </Badge>
      </div>

      {/* Stock Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStocks.map((stock) => (
          <Card key={stock.ticker} className="bg-black/40 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg">{stock.ticker}</h3>
                    <p className="text-gray-400 text-xs truncate max-w-[150px]">
                      {stock.companyName}
                    </p>
                  </div>
                  <Badge className={cn("text-xs border", getSentimentColor(stock.sentimentLabel, stock.sentimentScore))}>
                    {stock.sentimentLabel}
                  </Badge>
                </div>

                {/* Price & Change */}
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <span className="text-xl font-bold">
                      ${stock.currentPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    stock.change1D >= 0 ? "text-green-400" : "text-red-400"
                  )}>
                    {stock.change1D >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stock.change1D >= 0 ? "+" : ""}{stock.change1D.toFixed(2)}%
                  </div>
                </div>

                {/* Sentiment Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Sentiment</span>
                    <span className="text-white">{stock.sentimentScore}/100</span>
                  </div>
                  <Progress 
                    value={stock.sentimentScore} 
                    className="h-2"
                    style={{
                      background: "rgba(75, 85, 99, 0.3)"
                    }}
                  />
                </div>

                {/* Additional Info */}
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Vol: {formatVolume(stock.volume24h)}</span>
                  <span>{stock.marketCap} Cap</span>
                </div>

                {/* Sector Badge */}
                <Badge variant="outline" className="w-full justify-center text-xs border-gray-600 text-gray-300">
                  {stock.sector}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredStocks.length === 0 && (
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">No stocks found</h3>
            <p className="text-gray-400 mb-4">
              Try adjusting your filters or search terms to see more results.
            </p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upgrade CTA */}
      {filteredStocks.length === 20 && (
        <Card className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-white text-xl font-bold mb-2">See More Results</h3>
            <p className="text-gray-300 mb-4">
              Upgrade to Pro to view unlimited results and access advanced filters like RSI, moving averages, and technical indicators.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <Badge variant="outline" className="border-yellow-400/30 text-yellow-400">
                Unlimited Results
              </Badge>
              <Badge variant="outline" className="border-yellow-400/30 text-yellow-400">
                Technical Indicators
              </Badge>
              <Badge variant="outline" className="border-yellow-400/30 text-yellow-400">
                Real-time Alerts
              </Badge>
              <Badge variant="outline" className="border-yellow-400/30 text-yellow-400">
                Export Data
              </Badge>
            </div>
            <Button
              onClick={handleAdvancedFilter}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8"
            >
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BasicScreener;
