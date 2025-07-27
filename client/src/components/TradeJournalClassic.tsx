import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import { Plus, BarChart3, Activity, Download } from 'lucide-react';
import { cn } from '../lib/utils';

interface Trade {
  id: string;
  ticker: string;
  action: 'BUY' | 'SELL';
  status: 'OPEN' | 'CLOSED';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  pnl?: number;
  sentiment: number;
  notes: string;
  entryDate: string;
  exitDate?: string;
}

export default function TradeJournalClassic() {
  const { themeMode } = useMoodTheme();
  
  const [trades] = useState<Trade[]>([
    {
      id: '1',
      ticker: 'AAPL',
      action: 'BUY',
      status: 'CLOSED',
      entryPrice: 175.50,
      exitPrice: 182.30,
      quantity: 100,
      pnl: 680.00,
      sentiment: 72,
      notes: 'Strong earnings report expected, technical breakout confirmed',
      entryDate: '2024-01-15',
      exitDate: '2024-01-22'
    },
    {
      id: '2',
      ticker: 'TSLA',
      action: 'BUY',
      status: 'OPEN',
      entryPrice: 245.80,
      quantity: 50,
      sentiment: 45,
      notes: 'Bought the dip but market sentiment very negative',
      entryDate: '2024-01-20'
    },
    {
      id: '3',
      ticker: 'NVDA',
      action: 'BUY',
      status: 'CLOSED',
      entryPrice: 520.00,
      exitPrice: 498.50,
      quantity: 25,
      pnl: -537.50,
      sentiment: 85,
      notes: 'FOMO on AI hype, ignored technical signals',
      entryDate: '2024-01-10',
      exitDate: '2024-01-18'
    }
  ]);

  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const closedTrades = trades.filter(trade => trade.status === 'CLOSED');
  const profitableTrades = closedTrades.filter(trade => trade.pnl && trade.pnl > 0);
  const winRate = closedTrades.length > 0 ? (profitableTrades.length / closedTrades.length) * 100 : 0;
  const avgSentiment = trades.length > 0 ? trades.reduce((sum, trade) => sum + trade.sentiment, 0) / trades.length : 0;

  const getTickerLogo = (ticker: string) => {
    const logos: Record<string, string> = {
      'AAPL': '🍎',
      'TSLA': '🚗', 
      'NVDA': '🔥'
    };
    return logos[ticker] || '📈';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn(
        "rounded-2xl p-6 border",
        themeMode === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-gradient-to-br from-purple-900/80 via-purple-800/60 to-purple-900/80 backdrop-blur-xl border-purple-500/20'
      )}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            <h1 className={cn(
              "text-3xl font-bold",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              Smart Trade Journal
            </h1>
          </div>
          <p className={cn(
            "text-lg",
            themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
          )}>
            Track, analyze, and improve your trading with emotion-based insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={cn(
            "p-4 rounded-xl border",
            themeMode === 'light'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-black/40 border-purple-500/20'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <Plus className="w-4 h-4 text-green-400" />
              <span className={cn(
                "text-sm font-medium",
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
              )}>
                Total P&L
              </span>
            </div>
            <div className={cn(
              "text-2xl font-bold",
              totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
            )}>
              ${totalPnL.toFixed(2)}
            </div>
          </div>

          <div className={cn(
            "p-4 rounded-xl border",
            themeMode === 'light'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-black/40 border-purple-500/20'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className={cn(
                "text-sm font-medium",
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
              )}>
                Win Rate
              </span>
            </div>
            <div className={cn(
              "text-2xl font-bold",
              winRate >= 50 ? 'text-green-400' : 'text-yellow-400'
            )}>
              {winRate.toFixed(1)}%
            </div>
          </div>

          <div className={cn(
            "p-4 rounded-xl border",
            themeMode === 'light'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-black/40 border-purple-500/20'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span className={cn(
                "text-sm font-medium",
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
              )}>
                Total Trades
              </span>
            </div>
            <div className={cn(
              "text-2xl font-bold",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              {trades.length}
            </div>
          </div>

          <div className={cn(
            "p-4 rounded-xl border",
            themeMode === 'light'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-black/40 border-purple-500/20'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-pink-400" />
              <span className={cn(
                "text-sm font-medium",
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
              )}>
                Avg Sentiment
              </span>
            </div>
            <div className={cn(
              "text-2xl font-bold",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              {avgSentiment.toFixed(0)}
            </div>
          </div>
        </div>

        {/* Add New Trade Button */}
        <div className="flex justify-center">
          <Button className={cn(
            "px-6 py-3 rounded-xl font-semibold flex items-center gap-2",
            themeMode === 'light'
              ? 'bg-[#3F51B5] hover:bg-[#303F9F] text-white'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
          )}>
            <Plus className="w-5 h-5" />
            Add New Trade
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="log" className="w-full">
        <TabsList className={cn(
          "grid w-full grid-cols-3",
          themeMode === 'light'
            ? 'bg-gray-100 border border-gray-200'
            : 'bg-purple-900/40 border border-purple-500/20'
        )}>
          <TabsTrigger
            value="log"
            className={cn(
              themeMode === 'light'
                ? 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-600'
                : 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300'
            )}
          >
            Trade Log
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className={cn(
              themeMode === 'light'
                ? 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-600'
                : 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300'
            )}
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className={cn(
              themeMode === 'light'
                ? 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-600'
                : 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300'
            )}
          >
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="mt-6">
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                themeMode === 'light'
                  ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  : 'border-gray-600 text-gray-300 hover:bg-gray-800'
              )}
            >
              All Trades
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-2",
                themeMode === 'light'
                  ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  : 'border-gray-600 text-gray-300 hover:bg-gray-800'
              )}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          {/* Trade List */}
          <div className="space-y-4">
            {trades.map((trade) => (
              <Card
                key={trade.id}
                className={cn(
                  "border transition-all duration-300 cursor-pointer hover:shadow-lg",
                  themeMode === 'light'
                    ? 'bg-white border-gray-200 hover:border-gray-300'
                    : 'bg-gradient-to-r from-purple-900/40 to-purple-800/30 border-purple-500/20 hover:border-purple-400/40'
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getTickerLogo(trade.ticker)}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={cn(
                            "text-xl font-bold",
                            themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                          )}>
                            ${trade.ticker}
                          </h3>
                          <Badge className={cn(
                            trade.action === 'BUY'
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          )}>
                            {trade.action}
                          </Badge>
                          <Badge className={cn(
                            trade.status === 'OPEN'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          )}>
                            {trade.status}
                          </Badge>
                        </div>
                        <div className={cn(
                          "text-sm",
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          Confident • {trade.entryDate}
                          {trade.exitDate && ` → ${trade.exitDate}`}
                        </div>
                      </div>
                    </div>
                    
                    {trade.pnl !== undefined && (
                      <div className="text-right">
                        <div className={cn(
                          "text-2xl font-bold",
                          trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                        )}>
                          {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                        </div>
                        <div className={cn(
                          "text-sm",
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          {trade.quantity} shares
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className={cn(
                        "text-sm",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        Entry Price
                      </div>
                      <div className={cn(
                        "font-semibold",
                        themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                      )}>
                        ${trade.entryPrice.toFixed(2)}
                      </div>
                    </div>
                    {trade.exitPrice && (
                      <div>
                        <div className={cn(
                          "text-sm",
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          Exit Price
                        </div>
                        <div className={cn(
                          "font-semibold",
                          themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                        )}>
                          ${trade.exitPrice.toFixed(2)}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className={cn(
                        "text-sm",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        Sentiment
                      </div>
                      <div className={cn(
                        "font-semibold",
                        themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                      )}>
                        {trade.sentiment}/100
                      </div>
                    </div>
                    <div>
                      <div className={cn(
                        "text-sm",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        Quantity
                      </div>
                      <div className={cn(
                        "font-semibold",
                        themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                      )}>
                        {trade.quantity}
                      </div>
                    </div>
                  </div>

                  <div className={cn(
                    "p-3 rounded-lg",
                    themeMode === 'light'
                      ? 'bg-gray-50 border border-gray-200'
                      : 'bg-black/40 border border-purple-500/20'
                  )}>
                    <div className={cn(
                      "text-sm mb-1",
                      themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                    )}>
                      Notes:
                    </div>
                    <div className={cn(
                      "text-sm",
                      themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                    )}>
                      {trade.notes}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card className={cn(
            "border",
            themeMode === 'light'
              ? 'bg-white border-gray-200'
              : 'bg-purple-900/40 border-purple-500/20'
          )}>
            <CardContent className="p-8 text-center">
              <BarChart3 className={cn(
                "w-12 h-12 mx-auto mb-4",
                themeMode === 'light' ? 'text-gray-400' : 'text-gray-500'
              )} />
              <h3 className={cn(
                "text-xl font-semibold mb-2",
                themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
              )}>
                Analytics Coming Soon
              </h3>
              <p className={cn(
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
              )}>
                Advanced analytics and performance metrics will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <Card className={cn(
            "border",
            themeMode === 'light'
              ? 'bg-white border-gray-200'
              : 'bg-purple-900/40 border-purple-500/20'
          )}>
            <CardContent className="p-8 text-center">
              <Activity className={cn(
                "w-12 h-12 mx-auto mb-4",
                themeMode === 'light' ? 'text-gray-400' : 'text-gray-500'
              )} />
              <h3 className={cn(
                "text-xl font-semibold mb-2",
                themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
              )}>
                AI Insights Coming Soon
              </h3>
              <p className={cn(
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
              )}>
                AI-powered insights about your trading patterns will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
