import React from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  statusColor: 'blue' | 'green' | 'red';
}

interface TrendingTickerBarProps {
  className?: string;
}

export const TrendingTickerBar: React.FC<TrendingTickerBarProps> = ({ className }) => {
  // Mock trending ticker data - in a real app this would come from props or API
  const trendingTickers: TickerData[] = [
    {
      symbol: 'SPY',
      price: 158.61,
      change: 4.29,
      changePercent: 4.32,
      statusColor: 'blue'
    },
    {
      symbol: 'AAPL',
      price: 236.65,
      change: -3.96,
      changePercent: -3.90,
      statusColor: 'green'
    },
    {
      symbol: 'NVDA',
      price: 454.65,
      change: -8.35,
      changePercent: -3.65,
      statusColor: 'red'
    },
    {
      symbol: 'DIA',
      price: 174.26,
      change: -6.45,
      changePercent: -3.45,
      statusColor: 'blue'
    },
    {
      symbol: 'TSLA',
      price: 245.67,
      change: 12.43,
      changePercent: 5.32,
      statusColor: 'green'
    }
  ];

  const marketSummary = 4.32; // Overall market change percentage

    const getStatusColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-[#00FF99]';
      case 'red':
        return 'bg-[#FF4B4B]';
      case 'blue':
      default:
        return 'bg-[#61A0FF]';
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]';
  };

  const formatChange = (change: number) => {
    const symbol = change >= 0 ? '▲' : '▼';
    const sign = change >= 0 ? '+' : '';
    return `${symbol} ${sign}${change.toFixed(2)}%`;
  };

  return (
    <div className={cn(
      "w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-purple-500/20 px-4 py-3",
      className
    )}>
      <div className="flex items-center justify-between max-w-full">
        {/* Left Section - Trending Label */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              TRENDING
            </span>
          </div>
          
          {/* Market Summary Bubble */}
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
            <span className={cn(
              "text-xs font-bold",
              marketSummary >= 0 ? "text-emerald-300" : "text-red-300"
            )}>
              {marketSummary >= 0 ? '+' : ''}{marketSummary.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Center Section - Ticker Items (Scrollable) */}
        <div className="flex-1 mx-4 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
          <div className="flex items-center gap-3 min-w-max">
            {trendingTickers.map((ticker, index) => (
              <div
                key={ticker.symbol}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50 hover:border-purple-500/30 transition-all duration-200 hover:bg-slate-800/80 min-w-max"
              >
                {/* Status Dot */}
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  getStatusColor(ticker.statusColor)
                )} />
                
                {/* Ticker Info */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">
                    ${ticker.symbol}
                  </span>
                  <span className="text-xs text-gray-300">
                    ${ticker.price.toFixed(2)}
                  </span>
                  <span className={cn(
                    "text-xs font-medium",
                    getChangeColor(ticker.changePercent)
                  )}>
                    {formatChange(ticker.changePercent)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Refresh Info */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <RefreshCw className="w-3 h-3 text-gray-400 animate-spin" style={{
            animationDuration: '3s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite'
          }} />
          <span className="text-xs text-gray-400 hidden sm:inline">
            Updates every 30s
          </span>
        </div>
      </div>
    </div>
  );
};
