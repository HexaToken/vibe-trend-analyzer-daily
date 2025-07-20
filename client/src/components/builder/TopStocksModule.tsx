"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { TrendingUp, TrendingDown, BarChart3, RefreshCw } from "lucide-react";

interface TopStocksModuleProps {
  title?: string;
  maxStocks?: number;
  showSentiment?: boolean;
  apiEndpoint?: string;
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sentiment: number;
  volume: number;
}

const topStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "META", name: "Meta Platforms" },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "CRM", name: "Salesforce Inc." },
  { symbol: "ADBE", name: "Adobe Inc." },
];

export const TopStocksModule: React.FC<TopStocksModuleProps> = ({
  title = "Top 10 Stocks Today",
  maxStocks = 10,
  showSentiment = true,
  apiEndpoint = "/api/proxy/finnhub/quote",
}) => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      try {
        // Simulate API calls for demo - replace with real API integration
        const stockData: StockData[] = topStocks
          .slice(0, maxStocks)
          .map((stock, index) => ({
            symbol: stock.symbol,
            name: stock.name,
            price: 150 + Math.random() * 200,
            change: (Math.random() - 0.5) * 20,
            changePercent: (Math.random() - 0.5) * 10,
            sentiment: 30 + Math.random() * 60,
            volume: Math.floor(Math.random() * 10000000),
          }));

        setStocks(stockData);
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [maxStocks, apiEndpoint]);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return "bg-green-500";
    if (sentiment >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getSentimentEmoji = (sentiment: number) => {
    if (sentiment >= 80) return "🚀";
    if (sentiment >= 70) return "😊";
    if (sentiment >= 50) return "😐";
    if (sentiment >= 30) return "😕";
    return "😢";
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-blue-900/20">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6" />
            <span>{title}</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Live
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Change
                </th>
                {showSentiment && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Sentiment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Mood
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {stocks.map((stock, index) => (
                <tr
                  key={stock.symbol}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {stock.symbol.slice(0, 2)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {stock.symbol}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-32">
                          {stock.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(stock.price)}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {stock.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`font-medium ${stock.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {stock.change >= 0 ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {stock.change >= 0 ? "+" : ""}
                      {formatCurrency(stock.change)}
                    </div>
                  </td>

                  {showSentiment && (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getSentimentColor(stock.sentiment)}`}
                              style={{ width: `${stock.sentiment}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {Math.round(stock.sentiment)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-2xl animate-pulse">
                          {getSentimentEmoji(stock.sentiment)}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Updated: {new Date().toLocaleTimeString()}</span>
              <span>•</span>
              <span>Real-time sentiment analysis</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopStocksModule;
