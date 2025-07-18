import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Search,
  TrendingUp,
  TrendingDown,
  X,
  Brain,
  Activity,
  Target,
  Flame,
  RefreshCw,
} from "lucide-react";

interface WatchlistAsset {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sentiment: number;
  sentimentEmoji: string;
  insight: string;
  trendColor: string;
  gradientFrom: string;
  gradientTo: string;
  sparklineData: number[];
}

interface WatchlistModuleProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const WatchlistModule: React.FC<WatchlistModuleProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const [watchlistAssets] = useState<WatchlistAsset[]>([
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      price: 195.32,
      change: 2.47,
      changePercent: 2.47,
      sentiment: 78,
      sentimentEmoji: "😃",
      insight:
        "Sentiment rising due to strong Q4 earnings and positive analyst upgrades. Institutional buying increasing.",
      trendColor: "green",
      gradientFrom: "from-green-50",
      gradientTo: "to-emerald-50",
      sparklineData: Array.from(
        { length: 24 },
        (_, i) => Math.sin(i * 0.3) * 20 + 40,
      ),
    },
    {
      ticker: "TSLA",
      name: "Tesla Inc.",
      price: 248.87,
      change: -1.23,
      changePercent: -1.23,
      sentiment: 42,
      sentimentEmoji: "😕",
      insight:
        "Mixed sentiment due to production concerns and regulatory challenges. Delivery numbers below expectations.",
      trendColor: "red",
      gradientFrom: "from-red-50",
      gradientTo: "to-rose-50",
      sparklineData: Array.from(
        { length: 24 },
        (_, i) => Math.cos(i * 0.4) * 15 + 30,
      ),
    },
    {
      ticker: "NVDA",
      name: "NVIDIA Corporation",
      price: 785.92,
      change: 5.67,
      changePercent: 5.67,
      sentiment: 92,
      sentimentEmoji: "🚀",
      insight:
        "Extremely bullish on AI chip demand and data center growth. Record breaking revenue guidance.",
      trendColor: "emerald",
      gradientFrom: "from-emerald-50",
      gradientTo: "to-green-50",
      sparklineData: Array.from(
        { length: 24 },
        (_, i) => Math.sin(i * 0.2) * 25 + 60,
      ),
    },
    {
      ticker: "BTC",
      name: "Bitcoin",
      price: 43287,
      change: 3.21,
      changePercent: 3.21,
      sentiment: 65,
      sentimentEmoji: "😊",
      insight:
        "Moderate optimism with institutional adoption trends. ETF inflows positive but volatility concerns remain.",
      trendColor: "yellow",
      gradientFrom: "from-yellow-50",
      gradientTo: "to-amber-50",
      sparklineData: Array.from(
        { length: 24 },
        (_, i) => Math.sin(i * 0.25) * 20 + 45,
      ),
    },
  ]);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 80) return "from-emerald-400 to-green-500";
    if (sentiment >= 60) return "from-green-400 to-emerald-500";
    if (sentiment >= 40) return "from-yellow-400 to-orange-500";
    return "from-orange-400 to-red-500";
  };

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment >= 80) return <Target className="w-3 h-3 text-white" />;
    if (sentiment >= 60) return <Brain className="w-3 h-3 text-white" />;
    if (sentiment >= 40) return <Flame className="w-3 h-3 text-white" />;
    return <Activity className="w-3 h-3 text-white" />;
  };

  const getSentimentIconBg = (sentiment: number) => {
    if (sentiment >= 80) return "from-emerald-500 to-green-600";
    if (sentiment >= 60) return "from-blue-500 to-purple-600";
    if (sentiment >= 40) return "from-yellow-500 to-orange-600";
    return "from-orange-500 to-red-600";
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📋 Your Watchlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your favorite assets with real-time sentiment analysis and
            market data
          </p>
        </div>

        {/* Right-aligned search bar */}
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search ticker…"
              className="pl-10 w-56 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-6">
            + Add to Watchlist
          </Button>
        </div>
      </div>

      {/* Watchlist Asset Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {watchlistAssets.map((asset) => (
          <Card
            key={asset.ticker}
            className={`relative overflow-hidden border-0 bg-gradient-to-br ${asset.gradientFrom} ${asset.gradientTo} dark:from-${asset.trendColor}-900/20 dark:to-${asset.trendColor}-900/20 hover:shadow-xl transition-all duration-300 hover:scale-105`}
          >
            {/* Remove button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 z-10"
            >
              <X className="w-4 h-4" />
            </Button>

            <CardContent className="p-6">
              {/* Ticker and Price */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {asset.ticker}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {asset.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
                    $
                    {asset.ticker === "BTC"
                      ? asset.price.toLocaleString()
                      : asset.price.toFixed(2)}
                  </div>
                  <div
                    className={`flex items-center text-sm font-medium ${
                      asset.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {asset.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {asset.change >= 0 ? "+" : ""}
                    {asset.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Sentiment Score with emoji and color bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    {asset.sentimentEmoji} Sentiment Score
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      asset.sentiment >= 70
                        ? "text-green-600"
                        : asset.sentiment >= 50
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {asset.sentiment}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${getSentimentColor(asset.sentiment)} transition-all duration-500`}
                    style={{ width: `${asset.sentiment}%` }}
                  ></div>
                </div>
              </div>

              {/* Mini Sparkline Chart */}
              <div className="mb-5">
                <p className="text-xs text-gray-500 mb-2">📈 7-day trend</p>
                <div className="flex items-end space-x-1 h-10">
                  {asset.sparklineData.map((height, i) => (
                    <div
                      key={i}
                      className={`bg-gradient-to-t ${getSentimentColor(asset.sentiment)} w-1.5 rounded-sm opacity-70 hover:opacity-100 transition-opacity`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* AI Insight */}
              <div
                className={`bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 border border-${asset.trendColor}-200 dark:border-${asset.trendColor}-800`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full bg-gradient-to-r ${getSentimentIconBg(asset.sentiment)} flex items-center justify-center flex-shrink-0 mt-0.5`}
                  >
                    {getSentimentIcon(asset.sentiment)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                      🧠 AI Insight
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                      {asset.insight}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading State Example */}
      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading new watchlist items...</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Add more tickers to your watchlist using the search bar above
          </p>
        </CardContent>
      </Card>

      {/* Builder.io Integration Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-3 text-blue-900 dark:text-blue-100">
              🧱 Builder.io Integration Ready
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              This Watchlist module is designed as modular Builder.io components
              with drag-and-drop functionality:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  📐 Layout Components:
                </h4>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Responsive grid containers</li>
                  <li>• Draggable asset cards</li>
                  <li>• Dynamic search input</li>
                  <li>• Add/remove buttons</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  ⚙️ Dynamic Features:
                </h4>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Live sentiment scoring</li>
                  <li>• Color-coded gradients</li>
                  <li>• Real-time price updates</li>
                  <li>• AI insight generation</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                🔌 API Integration Points:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <code className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                  GET /user/watchlist
                </code>
                <code className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                  GET /sentiment?ticker=XYZ
                </code>
                <code className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                  POST /watchlist/add
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
