import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FinanceStockTableProps {
  title?: string;
  maxStocks?: number;
  showSentiment?: boolean;
  showVolume?: boolean;
  autoRefresh?: boolean;
  apiEndpoint?: string;
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  volume: string;
}

export const FinanceStockTable: React.FC<FinanceStockTableProps> = ({
  title = "Top Stocks Today",
  maxStocks = 10,
  showSentiment = true,
  showVolume = true,
  autoRefresh = true,
  apiEndpoint = "/api/proxy/finnhub/quote"
}) => {
  const [stocks, setStocks] = useState<StockData[]>([
    { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: -3.22, changePercent: -1.28, sentiment: 'bearish', volume: '45.2M' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.28, change: 12.45, changePercent: 1.44, sentiment: 'bullish', volume: '38.7M' },
    { symbol: 'AAPL', name: 'Apple Inc', price: 190.64, change: 2.18, changePercent: 1.16, sentiment: 'bullish', volume: '52.1M' },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 139.69, change: 1.87, changePercent: 1.36, sentiment: 'bullish', volume: '28.9M' },
    { symbol: 'MSFT', name: 'Microsoft Corp', price: 378.85, change: -2.44, changePercent: -0.64, sentiment: 'neutral', volume: '31.4M' },
    { symbol: 'AMZN', name: 'Amazon.com Inc', price: 155.74, change: 4.12, changePercent: 2.72, sentiment: 'bullish', volume: '41.3M' },
    { symbol: 'META', name: 'Meta Platforms', price: 501.92, change: -8.33, changePercent: -1.63, sentiment: 'bearish', volume: '19.8M' },
    { symbol: 'JPM', name: 'JPMorgan Chase', price: 178.25, change: 1.95, changePercent: 1.11, sentiment: 'neutral', volume: '12.7M' },
    { symbol: 'V', name: 'Visa Inc', price: 267.89, change: 3.44, changePercent: 1.30, sentiment: 'bullish', volume: '6.8M' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.33, change: -0.87, changePercent: -0.55, sentiment: 'neutral', volume: '8.9M' }
  ]);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!autoRefresh) return;

    const updateStocks = () => {
      setLoading(true);
      
      // Simulate real-time price updates
      setStocks(prevStocks => 
        prevStocks.map(stock => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * 2,
          change: stock.change + (Math.random() - 0.5) * 0.5,
          changePercent: stock.changePercent + (Math.random() - 0.5) * 0.1
        }))
      );
      
      setLoading(false);
    };

    const interval = setInterval(updateStocks, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <ChevronUp className="w-3 h-3" />;
      case 'bearish': return <ChevronDown className="w-3 h-3" />;
      default: return <Minus className="w-3 h-3" />;
    }
  };

  const displayedStocks = stocks.slice(0, maxStocks);

  return (
    <Card className="finance-card border-0">
      <CardHeader className="border-b border-slate-700/50">
        <CardTitle className="flex items-center gap-2 text-white">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          {title}
          {loading && (
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-700/50">
          {displayedStocks.map((stock, index) => (
            <div key={stock.symbol} className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400 w-6">{index + 1}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{stock.symbol}</span>
                    {showSentiment && (
                      <Badge className={cn(
                        "text-xs px-2",
                        stock.sentiment === 'bullish' ? "bg-green-500/20 text-green-400" :
                        stock.sentiment === 'bearish' ? "bg-red-500/20 text-red-400" :
                        "bg-amber-500/20 text-amber-400"
                      )}>
                        {getSentimentIcon(stock.sentiment)}
                        {stock.sentiment}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-slate-400">{stock.name}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-white font-medium">${stock.price.toFixed(2)}</div>
                <div className={cn(
                  "text-sm font-medium",
                  stock.change >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </div>
              </div>
              
              {showVolume && (
                <div className="text-right text-xs text-slate-400">
                  Vol: {stock.volume}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
