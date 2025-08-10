import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search, Zap, Settings, Camera, Save, User, Monitor, 
  TrendingUp, TrendingDown, BarChart3, Activity, Volume2,
  Eye, Crosshair, Maximize, Plus, ChevronDown, ChevronRight,
  Play, Pause, SkipBack, SkipForward, RefreshCw, Target,
  DollarSign, Clock, Flame, Brain, Layers, Filter, X,
  Menu, Smartphone, Tablet, LineChart, CandlestickChart
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEffect } from 'react';

interface ChartState {
  symbol: string;
  exchange: string;
  timeframe: string;
  indicators: {
    sma: Array<{len: number, show: boolean}>;
    ema: Array<{len: number, show: boolean}>;
    rsi: {len: number, upper: number, lower: number, show: boolean};
    macd: {fast: number, slow: number, signal: number, show: boolean};
    bb: {len: number, std: number, show: boolean};
    vwap: {session: string, show: boolean};
    atr: {len: number, show: boolean};
    ichimoku: {conversion: number, base: number, spanB: number, displacement: number, show: boolean};
  };
  compare: string[];
}

interface Position {
  symbol: string;
  side: 'long' | 'short';
  size: number;
  avgPrice: number;
  pnl: number;
  pnlPercent: number;
}

interface Trade {
  time: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
}

interface WhaleTransaction {
  time: string;
  symbol: string;
  amount: number;
  type: 'buy' | 'sell';
  wallet: string;
}

export const AdvancedChartsPro = () => {
  const [chartState, setChartState] = useState<ChartState>({
    symbol: "BTCUSDT",
    exchange: "BINANCE",
    timeframe: "1h",
    indicators: {
      sma: [
        {len: 20, show: true},
        {len: 50, show: true},
        {len: 200, show: false}
      ],
      ema: [{len: 9, show: false}],
      rsi: {len: 14, upper: 70, lower: 30, show: true},
      macd: {fast: 12, slow: 26, signal: 9, show: true},
      bb: {len: 20, std: 2, show: false},
      vwap: {session: "session", show: false},
      atr: {len: 14, show: false},
      ichimoku: {conversion: 9, base: 26, spanB: 52, displacement: 26, show: false}
    },
    compare: []
  });

  const [activeTab, setActiveTab] = useState("chart");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [overlayControls, setOverlayControls] = useState({
    crosshair: true,
    logScale: false,
    autoFit: true,
    compare: false
  });
  const [expandedSections, setExpandedSections] = useState({
    sma: true,
    ema: false,
    rsi: true,
    macd: true,
    bb: false,
    vwap: false,
    atr: false,
    ichimoku: false
  });

  const timeframes = [
    { label: '1m', value: '1m' },
    { label: '5m', value: '5m' },
    { label: '15m', value: '15m' },
    { label: '1h', value: '1h' },
    { label: '4h', value: '4h' },
    { label: '1D', value: '1d' },
    { label: '1W', value: '1w' },
    { label: '1M', value: '1M' }
  ];

  const symbols = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', exchange: 'BINANCE' },
    { symbol: 'ETHUSDT', name: 'Ethereum', exchange: 'BINANCE' },
    { symbol: 'SOLUSDT', name: 'Solana', exchange: 'BINANCE' },
    { symbol: 'ADAUSDT', name: 'Cardano', exchange: 'BINANCE' },
    { symbol: 'DOTUSDT', name: 'Polkadot', exchange: 'BINANCE' }
  ];

  // Mock data
  const currentPrice = 67234.56;
  const priceChange = 2.34;
  const priceChangeAmount = 1567.89;

  const mockPosition: Position = {
    symbol: 'BTCUSDT',
    side: 'long',
    size: 0.1,
    avgPrice: 65000,
    pnl: 223.45,
    pnlPercent: 3.44
  };

  const mockTrades: Trade[] = [
    { time: '14:32:15', price: 67234.56, size: 0.025, side: 'buy' },
    { time: '14:32:12', price: 67230.12, size: 0.033, side: 'sell' },
    { time: '14:32:08', price: 67235.89, size: 0.021, side: 'buy' },
    { time: '14:32:05', price: 67228.34, size: 0.045, side: 'sell' },
    { time: '14:32:01', price: 67240.23, size: 0.018, side: 'buy' }
  ];

  const mockWhaleTransactions: WhaleTransaction[] = [
    { time: '14:30', symbol: 'BTC', amount: 150, type: 'buy', wallet: '1A1z...x9Y' },
    { time: '14:25', symbol: 'ETH', amount: 2000, type: 'sell', wallet: '0x3f...2a8' },
    { time: '14:20', symbol: 'BTC', amount: 87, type: 'buy', wallet: '1F5k...w2R' }
  ];

  const IndicatorToggle = ({ 
    label, 
    enabled, 
    onToggle, 
    children 
  }: { 
    label: string, 
    enabled: boolean, 
    onToggle: () => void, 
    children?: React.ReactNode 
  }) => (
    <div className="border border-gray-700/50 rounded-lg p-3" style={{ background: '#0F152B' }}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-white font-medium text-sm">{label}</label>
        <div className={cn(
          "w-10 h-5 rounded-full cursor-pointer transition-colors",
          enabled ? "bg-cyan-400" : "bg-gray-600"
        )} onClick={onToggle}>
          <div className={cn(
            "w-4 h-4 rounded-full bg-white transition-transform mt-0.5",
            enabled ? "translate-x-5" : "translate-x-0.5"
          )} />
        </div>
      </div>
      {enabled && children}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#0A0F1F' }}>
      {/* Enhanced Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-gray-800/50" style={{ background: 'rgba(15, 21, 43, 0.95)' }}>
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">NeonSense</span>
              </div>
              <div className="text-gray-400">|</div>
              <h1 className="text-lg font-semibold text-white">Advanced Charts</h1>
            </div>

            {/* Center: Pair Selector & Timeframes */}
            <div className="flex items-center gap-4 justify-center">
              {/* Pair Selector */}
              <div className="relative">
                <Button variant="outline" className="border-gray-700 text-white w-40 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
                      ₿
                    </div>
                    <span>BTC/USDT</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>

              {/* Timeframe Pills */}
              <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
                {timeframes.map((tf) => (
                  <Button
                    key={tf.value}
                    variant={chartState.timeframe === tf.value ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "text-xs px-3 py-1",
                      chartState.timeframe === tf.value 
                        ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white" 
                        : "text-gray-400 hover:text-white"
                    )}
                    onClick={() => setChartState({...chartState, timeframe: tf.value})}
                  >
                    {tf.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 justify-end">
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                <Monitor className="w-4 h-4 mr-2" />
                Theme
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                <Camera className="w-4 h-4 mr-2" />
                Snapshot
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Workspace
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col">
          {/* Chart Workspace */}
          <div className="flex-1 p-6">
            <Card className="h-full border-gray-800/50" style={{ background: '#0F152B' }}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <TabsList className="bg-gray-800/50">
                      <TabsTrigger value="chart" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                        <LineChart className="w-4 h-4 mr-2" />
                        Chart
                      </TabsTrigger>
                      <TabsTrigger value="replay" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                        <Play className="w-4 h-4 mr-2" />
                        Replay
                      </TabsTrigger>
                      <TabsTrigger value="strategy" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                        <Target className="w-4 h-4 mr-2" />
                        Strategy Tester
                      </TabsTrigger>
                    </TabsList>

                    {/* Overlay Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant={overlayControls.crosshair ? "default" : "outline"}
                        size="sm"
                        className={overlayControls.crosshair ? "bg-cyan-400 text-black" : "border-gray-700 text-gray-300"}
                        onClick={() => setOverlayControls({...overlayControls, crosshair: !overlayControls.crosshair})}
                      >
                        <Crosshair className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={overlayControls.logScale ? "default" : "outline"}
                        size="sm"
                        className={overlayControls.logScale ? "bg-cyan-400 text-black" : "border-gray-700 text-gray-300"}
                        onClick={() => setOverlayControls({...overlayControls, logScale: !overlayControls.logScale})}
                      >
                        Log
                      </Button>
                      <Button
                        variant={overlayControls.autoFit ? "default" : "outline"}
                        size="sm"
                        className={overlayControls.autoFit ? "bg-cyan-400 text-black" : "border-gray-700 text-gray-300"}
                        onClick={() => setOverlayControls({...overlayControls, autoFit: !overlayControls.autoFit})}
                      >
                        <Maximize className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 text-gray-300"
                        onClick={() => setOverlayControls({...overlayControls, compare: !overlayControls.compare})}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Compare
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="h-full pb-6">
                <TabsContent value="chart" className="h-full mt-0">
                  {/* Holographic Chart Canvas */}
                  <div
                    id="ns-chart-root"
                    className="ns-holo-card ns-grid ns-radial ns-scan h-96 relative overflow-hidden"
                    data-symbol={chartState.symbol}
                    data-timeframe={chartState.timeframe}
                    data-exchange={chartState.exchange}
                  >
                    {/* Starfield Background */}
                    <canvas
                      id="ns-stars"
                      className="ns-starfield absolute inset-0 z-0"
                      style={{pointerEvents: 'none'}}
                    ></canvas>
                    {/* Holographic Chart Display */}
                    <div className="absolute inset-0 p-4 z-10">
                      {/* Chart Grid */}
                      <div className="w-full h-full relative">
                        <svg className="w-full h-full opacity-30">
                          <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#333" strokeWidth="0.5"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>

                        {/* Simulated Candlestick Chart */}
                        <svg className="absolute inset-0 w-full h-full">
                          <g transform="translate(40, 20)">
                            {/* Price line simulation */}
                            <polyline
                              points="0,150 30,120 60,180 90,140 120,100 150,160 180,130 210,90 240,110 270,80 300,120"
                              fill="none"
                              stroke="#00E5FF"
                              strokeWidth="2"
                              className="ns-glow-line opacity-80"
                            />
                            {/* Volume bars */}
                            {Array.from({length: 15}, (_, i) => (
                              <rect
                                key={i}
                                x={i * 20}
                                y={200 + Math.random() * 40}
                                width="12"
                                height={Math.random() * 60 + 10}
                                fill="#666"
                                opacity="0.4"
                              />
                            ))}
                          </g>
                        </svg>

                        {/* Holographic Price Display with Glow */}
                        <div className="absolute top-4 left-4 text-white">
                          <div className="ns-value-badge inline-block">
                            <div className="text-2xl font-bold text-[#00E5FF]">
                              ${(42680 + Math.random() * 1000).toFixed(2)}
                            </div>
                          </div>
                          <div className="text-sm text-green-400 mt-2 ns-glow-line">
                            +2.34% (+$986.23)
                          </div>
                        </div>

                        {/* Holographic Crosshair */}
                        <div className="ns-crosshair" style={{left: '60%', top: '40%'}}></div>

                        {/* Symbol Info & FX Controls */}
                        <div className="absolute top-4 right-4 text-white text-right">
                          <div className="text-lg font-semibold">{chartState.symbol}</div>
                          <div className="text-sm text-gray-400">{chartState.exchange}</div>
                        </div>

                        {/* Futuristic FX Controls */}
                        <div className="ns-fx-controls">
                          <div className="ns-fx-toggle active">FX ON</div>
                          <div className="ns-fx-toggle">GRID</div>
                          <div className="ns-fx-toggle">TEAL</div>
                        </div>

                        {/* AI Pattern Tags */}
                        <div className="ns-ai-tag" style={{left: '25%', top: '30%'}}>
                          🔺 Bullish Engulfing
                        </div>
                        <div className="ns-ai-tag" style={{right: '20%', bottom: '25%'}}>
                          📈 Support Level
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Indicator Panels */}
                  <div className="mt-4 space-y-4">
                    {/* Holographic RSI Panel */}
                    {chartState.indicators.rsi.show && (
                      <Card className="ns-indicator-panel border-gray-800/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white text-sm flex items-center justify-between">
                            RSI ({chartState.indicators.rsi.len})
                            <div className="ns-value-badge">
                              <div className="text-blue-400">65.3</div>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="h-24">
                          <div className="relative h-full">
                            <div className="absolute top-2 left-0 right-0 h-px bg-red-500/30"></div>
                            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-600"></div>
                            <div className="absolute bottom-2 left-0 right-0 h-px bg-green-500/30"></div>
                            <svg className="w-full h-full">
                              <polyline
                                points="0,60 50,45 100,35 150,50 200,40 250,30 300,45"
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="2"
                              />
                            </svg>
                            <div className="absolute top-1 left-2 text-xs text-red-400">70</div>
                            <div className="absolute top-1/2 left-2 text-xs text-gray-400">50</div>
                            <div className="absolute bottom-1 left-2 text-xs text-green-400">30</div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* MACD Panel */}
                    {chartState.indicators.macd.show && (
                      <Card className="border-gray-800/50" style={{ background: '#0A0F1F' }}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white text-sm flex items-center justify-between">
                            MACD ({chartState.indicators.macd.fast},{chartState.indicators.macd.slow},{chartState.indicators.macd.signal})
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">+234.5</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="h-24">
                          <div className="relative h-full">
                            <svg className="w-full h-full">
                              <polyline
                                points="0,40 50,35 100,30 150,45 200,35 250,25 300,40"
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="2"
                              />
                              <polyline
                                points="0,45 50,40 100,35 150,50 200,40 250,30 300,45"
                                fill="none"
                                stroke="#F59E0B"
                                strokeWidth="1.5"
                              />
                            </svg>
                            <div className="absolute bottom-0 flex items-end justify-around w-full h-6">
                              {[8, 12, 6, 15, 9, 4, 11].map((height, i) => (
                                <div
                                  key={i}
                                  className="w-4 bg-gradient-to-t from-cyan-400 to-cyan-300 rounded-sm"
                                  style={{ height: `${height}px` }}
                                />
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Volume Panel */}
                    <Card className="border-gray-800/50" style={{ background: '#0A0F1F' }}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-sm flex items-center justify-between">
                          Volume
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">28.5B</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="h-16">
                        <div className="flex items-end justify-around h-full">
                          {[20, 35, 15, 45, 25, 38, 30, 28, 40, 22, 33, 26].map((height, i) => (
                            <div
                              key={i}
                              className={cn(
                                "flex-1 mx-0.5 rounded-sm",
                                i % 2 === 0 ? "bg-green-500" : "bg-red-500"
                              )}
                              style={{ height: `${height}%` }}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="replay" className="h-full mt-0">
                  <div className="h-96 rounded-lg border border-gray-700/50 bg-black/20 flex flex-col items-center justify-center">
                    <div className="text-center mb-8">
                      <h3 className="text-white text-xl mb-2">Market Replay</h3>
                      <p className="text-gray-400">Replay historical market data</p>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white">
                        <Play className="w-4 h-4 mr-2" />
                        Play
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                        <Pause className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="w-96 bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full w-1/3"></div>
                    </div>
                    <div className="text-gray-400 text-sm mt-2">2024-01-15 14:30:00</div>
                  </div>
                </TabsContent>

                <TabsContent value="strategy" className="h-full mt-0">
                  <div className="h-96 rounded-lg border border-gray-700/50 bg-black/20 p-6">
                    <h3 className="text-white text-xl mb-6">Strategy Tester</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-gray-300 font-medium mb-4">Entry Conditions</h4>
                        <div className="space-y-3">
                          <select className="w-full bg-gray-800 border border-gray-700 rounded text-white p-2">
                            <option>RSI crosses above 30</option>
                            <option>MACD bullish crossover</option>
                            <option>Price above SMA(20)</option>
                          </select>
                          <select className="w-full bg-gray-800 border border-gray-700 rounded text-white p-2">
                            <option>AND</option>
                            <option>OR</option>
                          </select>
                          <select className="w-full bg-gray-800 border border-gray-700 rounded text-white p-2">
                            <option>Volume greater than Average</option>
                            <option>Bollinger Band squeeze</option>
                            <option>Price breakout</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-gray-300 font-medium mb-4">Exit Conditions</h4>
                        <div className="space-y-3">
                          <select className="w-full bg-gray-800 border border-gray-700 rounded text-white p-2">
                            <option>RSI crosses below 70</option>
                            <option>MACD bearish crossover</option>
                            <option>Price below SMA(20)</option>
                          </select>
                          <Input placeholder="Stop Loss %" className="bg-gray-800 border-gray-700 text-white" />
                          <Input placeholder="Take Profit %" className="bg-gray-800 border-gray-700 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                      <Button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white">
                        Run Backtest
                      </Button>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Win Rate:</span>
                          <span className="text-green-400 ml-2">67.3%</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Profit Factor:</span>
                          <span className="text-green-400 ml-2">1.42</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Max Drawdown:</span>
                          <span className="text-red-400 ml-2">-12.5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Bottom Strip */}
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Book Depth */}
              <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">Order Book Depth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gradient-to-r from-red-500/10 via-gray-800 to-green-500/10 rounded flex items-center justify-center">
                    <div className="text-gray-400 text-sm">Depth Chart Placeholder</div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Trades */}
              <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">Recent Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-xs">
                    {mockTrades.map((trade, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-gray-400">{trade.time}</span>
                        <span className="text-white">{trade.price.toLocaleString()}</span>
                        <span className={trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                          {trade.size}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Position Summary */}
              <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center justify-between">
                    Position Summary
                    <Button variant="outline" size="sm" className="border-red-500/30 text-red-400">
                      <X className="w-3 h-3 mr-1" />
                      Close
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Symbol:</span>
                      <span className="text-white">{mockPosition.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Side:</span>
                      <Badge className={mockPosition.side === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                        {mockPosition.side.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Size:</span>
                      <span className="text-white">{mockPosition.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Avg Price:</span>
                      <span className="text-white">${mockPosition.avgPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">PNL:</span>
                      <span className="text-green-400">+${mockPosition.pnl} (+{mockPosition.pnlPercent}%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={cn(
          "transition-all duration-300 border-l border-gray-800/50",
          sidebarOpen ? "w-80" : "w-0 overflow-hidden"
        )}>
          <div className="h-full p-6 space-y-6" style={{ background: '#0A0F1F' }}>
            {/* Sidebar Toggle */}
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Indicators</h3>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <ChevronRight className={cn("w-4 h-4 transition-transform", sidebarOpen && "rotate-180")} />
              </Button>
            </div>

            {/* Indicators Drawer */}
            <div className="space-y-4">
              {/* SMA */}
              <IndicatorToggle
                label="Simple Moving Average (SMA)"
                enabled={chartState.indicators.sma.some(sma => sma.show)}
                onToggle={() => {
                  const newSma = chartState.indicators.sma.map(sma => ({...sma, show: !sma.show}));
                  setChartState({
                    ...chartState,
                    indicators: {...chartState.indicators, sma: newSma}
                  });
                }}
              >
                <div className="space-y-2">
                  {chartState.indicators.sma.map((sma, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={sma.len}
                        className="w-16 h-8 bg-gray-800 border-gray-700 text-white text-xs"
                        onChange={(e) => {
                          const newSma = [...chartState.indicators.sma];
                          newSma[i].len = parseInt(e.target.value);
                          setChartState({
                            ...chartState,
                            indicators: {...chartState.indicators, sma: newSma}
                          });
                        }}
                      />
                      <div className="w-6 h-6 rounded bg-green-500 cursor-pointer"></div>
                      <span className="text-gray-400 text-xs">Period</span>
                    </div>
                  ))}
                </div>
              </IndicatorToggle>

              {/* RSI */}
              <IndicatorToggle
                label="Relative Strength Index (RSI)"
                enabled={chartState.indicators.rsi.show}
                onToggle={() => {
                  setChartState({
                    ...chartState,
                    indicators: {
                      ...chartState.indicators,
                      rsi: {...chartState.indicators.rsi, show: !chartState.indicators.rsi.show}
                    }
                  });
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={chartState.indicators.rsi.len}
                      className="w-16 h-8 bg-gray-800 border-gray-700 text-white text-xs"
                      onChange={(e) => {
                        setChartState({
                          ...chartState,
                          indicators: {
                            ...chartState.indicators,
                            rsi: {...chartState.indicators.rsi, len: parseInt(e.target.value)}
                          }
                        });
                      }}
                    />
                    <span className="text-gray-400 text-xs">Period</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={chartState.indicators.rsi.upper}
                      onChange={(e) => {
                        setChartState({
                          ...chartState,
                          indicators: {
                            ...chartState.indicators,
                            rsi: {...chartState.indicators.rsi, upper: parseInt(e.target.value)}
                          }
                        });
                      }}
                      className="w-16 h-8 bg-gray-800 border-gray-700 text-white text-xs"
                    />
                    <span className="text-gray-400 text-xs">Upper</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={chartState.indicators.rsi.lower}
                      onChange={(e) => {
                        setChartState({
                          ...chartState,
                          indicators: {
                            ...chartState.indicators,
                            rsi: {...chartState.indicators.rsi, lower: parseInt(e.target.value)}
                          }
                        });
                      }}
                      className="w-16 h-8 bg-gray-800 border-gray-700 text-white text-xs"
                    />
                    <span className="text-gray-400 text-xs">Lower</span>
                  </div>
                </div>
              </IndicatorToggle>

              {/* MACD */}
              <IndicatorToggle
                label="MACD"
                enabled={chartState.indicators.macd.show}
                onToggle={() => {
                  setChartState({
                    ...chartState,
                    indicators: {
                      ...chartState.indicators,
                      macd: {...chartState.indicators.macd, show: !chartState.indicators.macd.show}
                    }
                  });
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={chartState.indicators.macd.fast}
                      onChange={(e) => {
                        setChartState({
                          ...chartState,
                          indicators: {
                            ...chartState.indicators,
                            macd: {...chartState.indicators.macd, fast: parseInt(e.target.value)}
                          }
                        });
                      }}
                      className="w-16 h-8 bg-gray-800 border-gray-700 text-white text-xs"
                    />
                    <span className="text-gray-400 text-xs">Fast</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={chartState.indicators.macd.slow}
                      onChange={(e) => {
                        setChartState({
                          ...chartState,
                          indicators: {
                            ...chartState.indicators,
                            macd: {...chartState.indicators.macd, slow: parseInt(e.target.value)}
                          }
                        });
                      }}
                      className="w-16 h-8 bg-gray-800 border-gray-700 text-white text-xs"
                    />
                    <span className="text-gray-400 text-xs">Slow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={chartState.indicators.macd.signal}
                      onChange={(e) => {
                        setChartState({
                          ...chartState,
                          indicators: {
                            ...chartState.indicators,
                            macd: {...chartState.indicators.macd, signal: parseInt(e.target.value)}
                          }
                        });
                      }}
                      className="w-16 h-8 bg-gray-800 border-gray-700 text-white text-xs"
                    />
                    <span className="text-gray-400 text-xs">Signal</span>
                  </div>
                </div>
              </IndicatorToggle>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
                  onClick={() => {
                    // Trigger custom event for chart updates
                    window.dispatchEvent(new CustomEvent('ns:applyIndicators', { 
                      detail: chartState 
                    }));
                  }}
                >
                  Apply to Chart
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-700 text-gray-300"
                  onClick={() => {
                    // Reset all indicators
                    setChartState({
                      ...chartState,
                      indicators: {
                        sma: chartState.indicators.sma.map(sma => ({...sma, show: false})),
                        ema: chartState.indicators.ema.map(ema => ({...ema, show: false})),
                        rsi: {...chartState.indicators.rsi, show: false},
                        macd: {...chartState.indicators.macd, show: false},
                        bb: {...chartState.indicators.bb, show: false},
                        vwap: {...chartState.indicators.vwap, show: false},
                        atr: {...chartState.indicators.atr, show: false},
                        ichimoku: {...chartState.indicators.ichimoku, show: false}
                      }
                    });
                  }}
                >
                  Remove All
                </Button>
              </div>
            </div>

            {/* AI Insights */}
            <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                    <span className="text-gray-300">Strong bullish momentum detected with 87% confidence</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                    <span className="text-gray-300">RSI approaching overbought territory</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                    <span className="text-gray-300">Volume confirms price movement</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* On-Chain Pulse */}
            <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  On-Chain Pulse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Whale Transactions</span>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                      {mockWhaleTransactions.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {mockWhaleTransactions.slice(0, 3).map((tx, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Badge className={tx.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {tx.type.toUpperCase()}
                          </Badge>
                          <span className="text-white">{tx.amount} {tx.symbol}</span>
                        </div>
                        <span className="text-gray-400">{tx.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
        <Button
          className={cn(
            "fixed bottom-6 right-6 lg:hidden z-50 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg",
            sidebarOpen && "hidden"
          )}
          onClick={() => setSidebarOpen(true)}
        >
          <Layers className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
