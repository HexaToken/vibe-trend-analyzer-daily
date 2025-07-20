import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Filter,
  BarChart3,
  Eye,
} from "lucide-react";

interface DiscussedStock {
  id: string;
  symbol: string;
  name: string;
  mentions: number;
  sentiment: number;
  priceChange: number;
  price: number;
  volume: number;
  rank: number;
  changeFromPrevious: number;
}

interface TopDiscussedWidgetProps {
  className?: string;
}

export const TopDiscussedWidget: React.FC<TopDiscussedWidgetProps> = ({
  className,
}) => {
  const [stocks, setStocks] = useState<DiscussedStock[]>([
    {
      id: "1",
      symbol: "NVDA",
      name: "NVIDIA Corp",
      mentions: 1247,
      sentiment: 85,
      priceChange: 3.42,
      price: 875.28,
      volume: 89234567,
      rank: 1,
      changeFromPrevious: 2,
    },
    {
      id: "2",
      symbol: "TSLA",
      name: "Tesla Inc",
      mentions: 892,
      sentiment: 67,
      priceChange: -1.23,
      price: 248.42,
      volume: 45123890,
      rank: 2,
      changeFromPrevious: -1,
    },
    {
      id: "3",
      symbol: "AAPL",
      name: "Apple Inc",
      mentions: 743,
      sentiment: 45,
      priceChange: 0.89,
      price: 182.52,
      volume: 67890123,
      rank: 3,
      changeFromPrevious: 0,
    },
    {
      id: "4",
      symbol: "META",
      name: "Meta Platforms",
      mentions: 567,
      sentiment: -23,
      priceChange: -2.15,
      price: 306.34,
      volume: 23456789,
      rank: 4,
      changeFromPrevious: 3,
    },
    {
      id: "5",
      symbol: "AMD",
      name: "Advanced Micro",
      mentions: 423,
      sentiment: 78,
      priceChange: 2.78,
      price: 142.67,
      volume: 34567890,
      rank: 5,
      changeFromPrevious: -2,
    },
  ]);

  const [sortBy, setSortBy] = useState<"mentions" | "sentiment" | "price">(
    "mentions",
  );
  const [timeframe, setTimeframe] = useState<"1h" | "4h" | "24h">("4h");

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prev) =>
        prev.map((stock) => ({
          ...stock,
          mentions: Math.max(
            50,
            stock.mentions + Math.floor((Math.random() - 0.4) * 100),
          ),
          sentiment: Math.max(
            -100,
            Math.min(100, stock.sentiment + (Math.random() - 0.5) * 8),
          ),
          priceChange: stock.priceChange + (Math.random() - 0.5) * 2,
        })),
      );
    }, 25000); // Update every 25 seconds

    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 20)
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (sentiment > -20)
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const getPriceChangeColor = (change: number) => {
    return change > 0
      ? "text-green-400"
      : change < 0
        ? "text-red-400"
        : "text-gray-400";
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Activity className="w-3 h-3 text-gray-400" />;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) return `${(volume / 1000000000).toFixed(1)}B`;
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    switch (sortBy) {
      case "mentions":
        return b.mentions - a.mentions;
      case "sentiment":
        return b.sentiment - a.sentiment;
      case "price":
        return b.priceChange - a.priceChange;
      default:
        return 0;
    }
  });

  return (
    <Card
      className={`bg-gray-800/50 border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 overflow-hidden ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2 text-lg font-bold">
            💬 Top Discussed
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-gray-700/50 p-1">
              {(["1h", "4h", "24h"] as const).map((period) => (
                <Button
                  key={period}
                  size="sm"
                  variant={timeframe === period ? "default" : "ghost"}
                  className={`text-xs h-6 px-2 ${
                    timeframe === period
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setTimeframe(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Most mentioned stocks in the last {timeframe}
          </div>
          <div className="flex items-center gap-1">
            <Filter className="w-3 h-3 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-xs bg-gray-700/50 text-gray-300 border border-gray-600/50 rounded px-2 py-1"
            >
              <option value="mentions">By Mentions</option>
              <option value="sentiment">By Sentiment</option>
              <option value="price">By Price Change</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <div className="space-y-3">
          {sortedStocks.map((stock, index) => (
            <div
              key={stock.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-200 cursor-pointer border border-gray-600/20 hover:border-gray-500/50"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-gray-400 text-sm font-bold w-6">
                    #{index + 1}
                  </div>
                  {getRankChangeIcon(stock.changeFromPrevious)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold text-sm">
                      ${stock.symbol}
                    </span>
                    <span className="text-xs text-gray-400 truncate max-w-16">
                      {stock.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageCircle className="w-3 h-3" />
                      <span>{stock.mentions.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Eye className="w-3 h-3" />
                      <span>{formatVolume(stock.volume)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right">
                <div className="space-y-1">
                  <div
                    className={`text-sm font-medium whitespace-nowrap ${getPriceChangeColor(stock.priceChange)}`}
                  >
                    {stock.priceChange > 0 ? "+" : ""}
                    {stock.priceChange.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-400">
                    ${stock.price.toFixed(2)}
                  </div>
                </div>

                <Badge
                  className={`text-xs px-1 py-1 min-w-[50px] text-center whitespace-nowrap ${getSentimentColor(stock.sentiment)}`}
                >
                  {stock.sentiment > 0 ? "+" : ""}
                  {stock.sentiment.toFixed(2)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              Sorted by {sortBy}
            </span>
            <span>
              {stocks
                .reduce((sum, stock) => sum + stock.mentions, 0)
                .toLocaleString()}{" "}
              total mentions
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
