import React, { useState } from "react";
import { Search, TrendingUp, RefreshCw, Calendar, DollarSign, BarChart3, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinnhubSymbolLookup, useFinnhubQuote, useFinnhubCandles } from "@/hooks/useFinnhub";

const popularSearches = [
  "apple", "microsoft", "tesla", "google", "amazon", "meta", "nvidia", "netflix", "spotify", "uber"
];

export const FinnhubDemo = () => {
  const [searchQuery, setSearchQuery] = useState<string>("apple");
  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL");
  
  // Get symbol lookup results
  const { 
    data: symbolData, 
    loading: symbolLoading, 
    error: symbolError,
    refetch: refetchSymbol 
  } = useFinnhubSymbolLookup(searchQuery, { 
    refreshInterval: 0, // Only search when query changes
    enabled: true 
  });

  // Get real-time quote for selected symbol
  const { 
    data: quoteData, 
    loading: quoteLoading, 
    error: quoteError,
    refetch: refetchQuote 
  } = useFinnhubQuote(selectedSymbol, { 
    refreshInterval: 300000, // 5 minutes
    enabled: true 
  });

  // Get candlestick data for selected symbol
  const { 
    data: candleData, 
    loading: candleLoading, 
    error: candleError,
    refetch: refetchCandles 
  } = useFinnhubCandles(selectedSymbol, "D", undefined, undefined, { 
    refreshInterval: 300000, // 5 minutes
    enabled: true 
  });

  const handleRefresh = () => {
    refetchSymbol();
    refetchQuote();
    refetchCandles();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getRecentCandles = () => {
    if (!candleData?.t || candleData.s !== "ok") return [];
    
    const { c, h, l, o, t, v } = candleData;
    const recentData = [];
    
    // Get last 10 days
    const startIndex = Math.max(0, t.length - 10);
    for (let i = startIndex; i < t.length; i++) {
      recentData.push({
        timestamp: t[i],
        open: o[i],
        high: h[i],
        low: l[i],
        close: c[i],
        volume: v[i],
      });
    }
    
    return recentData.reverse(); // Most recent first
  };

  const recentCandles = getRecentCandles();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Finnhub Stock Data</h2>
          <p className="text-muted-foreground">
            Real-time stock data and symbol search powered by Finnhub API
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleRefresh} disabled={symbolLoading || quoteLoading || candleLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${symbolLoading || quoteLoading || candleLoading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Symbol Search
          </CardTitle>
          <CardDescription>
            Search for company symbols using Finnhub's symbol lookup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search for companies (e.g., apple, tesla, microsoft)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              />
              <Button onClick={() => handleSearch(searchQuery)} disabled={symbolLoading}>
                {symbolLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search) => (
                <Button 
                  key={search} 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSearch(search)}
                  className="text-xs"
                >
                  {search}
                </Button>
              ))}
            </div>

            {symbolError ? (
              <div className="text-center py-4 text-red-600">
                <p>Search Error: {symbolError}</p>
              </div>
            ) : symbolData?.result && symbolData.result.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <div className="text-sm font-semibold">Found {symbolData.count} results:</div>
                {symbolData.result.slice(0, 10).map((symbol, index) => (
                  <div key={index} className="p-2 border rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{symbol.displaySymbol}</div>
                      <div className="text-sm text-muted-foreground">{symbol.description}</div>
                      <Badge variant="secondary" className="text-xs">{symbol.type}</Badge>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedSymbol(symbol.symbol)}
                      variant={selectedSymbol === symbol.symbol ? "default" : "outline"}
                    >
                      {selectedSymbol === symbol.symbol ? "Selected" : "Select"}
                    </Button>
                  </div>
                ))}
              </div>
            ) : searchQuery && !symbolLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{searchQuery}"</p>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Real-time Quote */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Real-time Quote - {selectedSymbol}
            </CardTitle>
            <CardDescription>
              Live stock price and trading data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quoteLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mr-2" />
                <span>Loading quote...</span>
              </div>
            ) : quoteError ? (
              <div className="text-center py-8 text-red-600">
                <p>Error: {quoteError}</p>
                <Button variant="outline" onClick={refetchQuote} className="mt-2">
                  Try Again
                </Button>
              </div>
            ) : quoteData ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    ${quoteData.c.toFixed(2)}
                  </div>
                  <div className={`text-sm ${quoteData.d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {quoteData.d >= 0 ? '+' : ''}${quoteData.d.toFixed(2)} 
                    ({quoteData.dp >= 0 ? '+' : ''}{quoteData.dp.toFixed(2)}%)
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(quoteData.t * 1000).toLocaleString()}
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Open</div>
                    <div className="font-semibold">${quoteData.o.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Previous Close</div>
                    <div className="font-semibold">${quoteData.pc.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">High</div>
                    <div className="font-semibold text-green-600">${quoteData.h.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Low</div>
                    <div className="font-semibold text-red-600">${quoteData.l.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No quote data available for {selectedSymbol}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historical Candlestick Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Price History
            </CardTitle>
            <CardDescription>
              Recent daily candlestick data for {selectedSymbol}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {candleLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mr-2" />
                <span>Loading history...</span>
              </div>
            ) : candleError ? (
              <div className="text-center py-8 text-red-600">
                <p>Error loading data</p>
              </div>
            ) : recentCandles.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentCandles.map((candle, index) => (
                  <div key={candle.timestamp} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold text-sm">
                        {new Date(candle.timestamp * 1000).toLocaleDateString()}
                      </div>
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        {index === 0 ? "Latest" : `${index + 1} days ago`}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Open: </span>
                        <span>${candle.open.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">High: </span>
                        <span className="text-green-600">${candle.high.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Low: </span>
                        <span className="text-red-600">${candle.low.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Close: </span>
                        <span className="font-semibold">${candle.close.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-muted-foreground">
                      Volume: {candle.volume.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No historical data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              API Status & Features
            </CardTitle>
            <CardDescription>
              Finnhub API integration details and capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg bg-green-50">
                <div className="font-semibold text-green-800 mb-2">✓ Available Features</div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Symbol Search & Lookup</li>
                  <li>• Real-time Stock Quotes</li>
                  <li>• Historical Candlestick Data</li>
                  <li>• Price Change & Volume Data</li>
                </ul>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="font-semibold mb-2">Current Status</div>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Selected Symbol</div>
                    <div className="font-semibold">{selectedSymbol}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">API Provider</div>
                    <div>Finnhub.io</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Search Results</div>
                    <div>{symbolData?.count || 0} symbols found</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Historical Points</div>
                    <div>{recentCandles.length} recent days</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Status Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Finnhub API Integration Status</CardTitle>
          <CardDescription>
            Current status and data availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {symbolData?.count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Search Results</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {selectedSymbol}
              </div>
              <div className="text-sm text-muted-foreground">Selected Symbol</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {quoteData ? `$${quoteData.c.toFixed(2)}` : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">Current Price</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {recentCandles.length}
              </div>
              <div className="text-sm text-muted-foreground">Historical Days</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};