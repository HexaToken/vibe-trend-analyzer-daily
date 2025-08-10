import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Brain } from 'lucide-react';
import { cn } from '../lib/utils';

export const Analytics = () => {
  const [activeToolsSubtab, setActiveToolsSubtab] = useState("HeatMap");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeToolsSubtab} onValueChange={setActiveToolsSubtab}>
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
            {/* Sentiment Surface - Futuristic Heatmap Dashboard */}
            <div className="space-y-6">

              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 animate-pulse">
                    <span className="text-3xl">🔥</span>
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">
                    Sentiment Surface
                  </h2>
                </div>
                <p className="text-lg text-gray-300">Real-time sentiment & performance heatmap visualization</p>
              </div>

              {/* Category Filter Bar */}
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-xl">🧭</span>
                    Dashboard Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    {/* Market Type Filter */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Market Type</label>
                      <div className="flex gap-1">
                        {['Stocks', 'Crypto', 'Combined'].map((market) => (
                          <Button
                            key={market}
                            size="sm"
                            variant={market === 'Combined' ? 'default' : 'outline'}
                            className={cn(
                              "text-xs flex-1",
                              market === 'Combined'
                                ? "bg-purple-600 text-white"
                                : "border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                            )}
                          >
                            {market}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Data Type Filter */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Data Type</label>
                      <div className="flex gap-1">
                        {['Sentiment', 'Price', 'Volume'].map((type) => (
                          <Button
                            key={type}
                            size="sm"
                            variant={type === 'Sentiment' ? 'default' : 'outline'}
                            className={cn(
                              "text-xs flex-1",
                              type === 'Sentiment'
                                ? "bg-purple-600 text-white"
                                : "border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                            )}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Timeframe Filter */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Timeframe</label>
                      <div className="flex gap-1">
                        {['1H', '24H', '7D'].map((time) => (
                          <Button
                            key={time}
                            size="sm"
                            variant={time === '24H' ? 'default' : 'outline'}
                            className={cn(
                              "text-xs flex-1",
                              time === '24H'
                                ? "bg-purple-600 text-white"
                                : "border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                            )}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Search Control */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Search Symbol</label>
                      <Input
                        placeholder="BTC, AAPL, etc..."
                        className="bg-black/40 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-0 text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Main Heatmap Grid */}
                <div className="lg:col-span-3">
                  <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                    <CardHeader className="border-b border-purple-500/20">
                      <CardTitle className="text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🗺️</span>
                          Interactive Sentiment Grid
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                          Live Data
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">

                      {/* Heatmap Grid */}
                      <div className="grid grid-cols-6 lg:grid-cols-8 gap-3 mb-6">
                        {[
                          // Stocks
                          { symbol: 'AAPL', name: 'Apple', sentiment: 78, change: '+2.1%', volume: '45M', category: 'stock', icon: '🍎' },
                          { symbol: 'GOOGL', name: 'Google', sentiment: 72, change: '+1.8%', volume: '28M', category: 'stock', icon: '🔍' },
                          { symbol: 'MSFT', name: 'Microsoft', sentiment: 85, change: '+3.2%', volume: '32M', category: 'stock', icon: '🪟' },
                          { symbol: 'TSLA', name: 'Tesla', sentiment: 35, change: '-2.7%', volume: '67M', category: 'stock', icon: '⚡' },
                          { symbol: 'AMZN', name: 'Amazon', sentiment: 68, change: '+0.9%', volume: '23M', category: 'stock', icon: '📦' },
                          { symbol: 'NVDA', name: 'NVIDIA', sentiment: 92, change: '+5.4%', volume: '89M', category: 'stock', icon: '🎮' },
                          { symbol: 'META', name: 'Meta', sentiment: 58, change: '+1.2%', volume: '41M', category: 'stock', icon: '👤' },
                          { symbol: 'NFLX', name: 'Netflix', sentiment: 43, change: '-1.1%', volume: '18M', category: 'stock', icon: '📺' },

                          // Crypto
                          { symbol: 'BTC', name: 'Bitcoin', sentiment: 82, change: '+3.8%', volume: '2.1B', category: 'crypto', icon: '₿' },
                          { symbol: 'ETH', name: 'Ethereum', sentiment: 76, change: '+2.4%', volume: '1.8B', category: 'crypto', icon: '⟐' },
                          { symbol: 'SOL', name: 'Solana', sentiment: 88, change: '+7.2%', volume: '890M', category: 'crypto', icon: '◎' },
                          { symbol: 'ADA', name: 'Cardano', sentiment: 71, change: '+4.1%', volume: '234M', category: 'crypto', icon: '₳' },
                          { symbol: 'DOT', name: 'Polkadot', sentiment: 39, change: '-3.2%', volume: '156M', category: 'crypto', icon: '●' },
                          { symbol: 'MATIC', name: 'Polygon', sentiment: 79, change: '+6.7%', volume: '312M', category: 'crypto', icon: '⬟' },
                          { symbol: 'AVAX', name: 'Avalanche', sentiment: 74, change: '+3.9%', volume: '245M', category: 'crypto', icon: '🔺' },
                          { symbol: 'LINK', name: 'Chainlink', sentiment: 66, change: '+2.1%', volume: '189M', category: 'crypto', icon: '🔗' },

                          // Sectors
                          { symbol: 'TECH', name: 'Technology', sentiment: 81, change: '+2.8%', volume: '12B', category: 'sector', icon: '💻' },
                          { symbol: 'FIN', name: 'Finance', sentiment: 62, change: '+1.2%', volume: '8.4B', category: 'sector', icon: '🏦' },
                          { symbol: 'HLTH', name: 'Healthcare', sentiment: 54, change: '-0.3%', volume: '5.2B', category: 'sector', icon: '🏥' },
                          { symbol: 'ENGY', name: 'Energy', sentiment: 47, change: '-1.8%', volume: '6.7B', category: 'sector', icon: '⚡' },
                          { symbol: 'DEFI', name: 'DeFi', sentiment: 84, change: '+4.2%', volume: '3.1B', category: 'sector', icon: '🏛️' },
                          { symbol: 'AI', name: 'AI Tokens', sentiment: 91, change: '+8.1%', volume: '2.8B', category: 'sector', icon: '🤖' },
                          { symbol: 'GAME', name: 'Gaming', sentiment: 73, change: '+3.5%', volume: '1.9B', category: 'sector', icon: '🎮' },
                          { symbol: 'MEME', name: 'Meme Coins', sentiment: 38, change: '-5.2%', volume: '1.2B', category: 'sector', icon: '🐕' }
                        ].map((item, i) => {
                          const getSentimentColor = (sentiment: number) => {
                            if (sentiment >= 70) return 'from-green-500 to-emerald-600';
                            if (sentiment >= 50) return 'from-yellow-500 to-orange-500';
                            return 'from-red-500 to-rose-600';
                          };

                          const getSentimentGlow = (sentiment: number) => {
                            if (sentiment >= 70) return 'shadow-green-500/30';
                            if (sentiment >= 50) return 'shadow-yellow-500/30';
                            return 'shadow-red-500/30';
                          };

                          return (
                            <div
                              key={i}
                              className={cn(
                                "relative group cursor-pointer rounded-xl p-3 transition-all duration-300 hover:scale-105",
                                `bg-gradient-to-br ${getSentimentColor(item.sentiment)}`,
                                `shadow-lg ${getSentimentGlow(item.sentiment)}`,
                                "hover:shadow-xl"
                              )}
                            >
                              {/* Tile Content */}
                              <div className="text-center">
                                <div className="text-2xl mb-1">{item.icon}</div>
                                <div className="text-white font-bold text-sm">{item.symbol}</div>
                                <div className="text-white/80 text-xs">{item.sentiment}%</div>
                              </div>

                              {/* Hover Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
                                <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-lg p-3 min-w-[200px] shadow-xl">
                                  <div className="text-center space-y-2">
                                    <div className="flex items-center justify-center gap-2">
                                      <span className="text-xl">{item.icon}</span>
                                      <div>
                                        <div className="text-white font-bold">{item.symbol}</div>
                                        <div className="text-gray-400 text-xs">{item.name}</div>
                                      </div>
                                    </div>

                                    <div className="space-y-1 text-xs">
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Sentiment:</span>
                                        <span className={cn(
                                          "font-bold",
                                          item.sentiment >= 70 ? "text-green-400" :
                                          item.sentiment >= 50 ? "text-yellow-400" : "text-red-400"
                                        )}>
                                          {item.sentiment}% {item.sentiment >= 70 ? "🟢" : item.sentiment >= 50 ? "🟡" : "🔴"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">24h Change:</span>
                                        <span className={cn(
                                          "font-bold",
                                          item.change.startsWith('+') ? "text-green-400" : "text-red-400"
                                        )}>
                                          {item.change}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Volume:</span>
                                        <span className="text-blue-400 font-bold">{item.volume}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Category:</span>
                                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                          {item.category}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Legend */}
                      <div className="flex items-center justify-center gap-6 pt-4 border-t border-purple-500/20">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded"></div>
                          <span className="text-green-400">Bullish (70-100%)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded"></div>
                          <span className="text-yellow-400">Neutral (50-69%)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-rose-600 rounded"></div>
                          <span className="text-red-400">Bearish (0-49%)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Highlights Sidebar */}
                <div className="space-y-6">

                  {/* Smart AI Highlights */}
                  <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
                    <CardHeader className="border-b border-green-500/20">
                      <CardTitle className="text-white text-sm flex items-center gap-2">
                        <Brain className="w-4 h-4 text-green-400" />
                        🧠 AI Market Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                          <div className="text-green-400 text-xs font-medium mb-1">🔥 Bullish Surge</div>
                          <div className="text-white text-sm leading-relaxed">
                            $SOL sentiment surged 45% in last 24H after DeFi protocol announcements
                          </div>
                          <div className="text-green-300 text-xs mt-1">2 minutes ago</div>
                        </div>

                        <div className="p-3 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-lg border border-red-500/20">
                          <div className="text-red-400 text-xs font-medium mb-1">📉 Bearish Flip</div>
                          <div className="text-white text-sm leading-relaxed">
                            $TSLA flipped bearish after earnings report missed expectations
                          </div>
                          <div className="text-red-300 text-xs mt-1">15 minutes ago</div>
                        </div>

                        <div className="p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                          <div className="text-blue-400 text-xs font-medium mb-1">🤖 AI Sector Alert</div>
                          <div className="text-white text-sm leading-relaxed">
                            AI tokens showing 91% bullish sentiment, up 23% from yesterday
                          </div>
                          <div className="text-blue-300 text-xs mt-1">1 hour ago</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Live Stats */}
                  <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                    <CardHeader className="border-b border-purple-500/20">
                      <CardTitle className="text-white text-sm flex items-center gap-2">
                        <span className="text-lg">📊</span>
                        Market Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Total Bullish</span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 font-bold">67%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Total Bearish</span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                            <span className="text-red-400 font-bold">21%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Neutral</span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                            <span className="text-yellow-400 font-bold">12%</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-purple-500/20">
                          <div className="text-gray-400 text-xs mb-2">Top Gainers (24h)</div>
                          <div className="space-y-1">
                            {[
                              { symbol: 'SOL', change: '+7.2%' },
                              { symbol: 'NVDA', change: '+5.4%' },
                              { symbol: 'ADA', change: '+4.1%' }
                            ].map((gainer, i) => (
                              <div key={i} className="flex justify-between text-xs">
                                <span className="text-white">{gainer.symbol}</span>
                                <span className="text-green-400 font-bold">{gainer.change}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-purple-500/20">
                          <div className="text-gray-400 text-xs mb-2">Top Losers (24h)</div>
                          <div className="space-y-1">
                            {[
                              { symbol: 'MEME', change: '-5.2%' },
                              { symbol: 'DOT', change: '-3.2%' },
                              { symbol: 'TSLA', change: '-2.7%' }
                            ].map((loser, i) => (
                              <div key={i} className="flex justify-between text-xs">
                                <span className="text-white">{loser.symbol}</span>
                                <span className="text-red-400 font-bold">{loser.change}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Technical Indicators</Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Trend Analysis</Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Volume Patterns</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Scanner" className="mt-6">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">Stock Scanner</h3>
                <p className="text-gray-400 mb-4">
                  Advanced stock screening and filtering tools coming soon.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Custom Filters</Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Real-time Screening</Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Alert System</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
