import React, { useState } from "react";
import { TrendingUp, RefreshCw, Calendar, DollarSign, BarChart3, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAlphaVantageTimeSeries } from "@/hooks/useAlphaVantage";

const popularStocks = [
  { symbol: "IBM", name: "International Business Machines" },
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "V", name: "Visa Inc." },
];

export const AlphaVantageDemo = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("IBM");
  
  // Get time series data for selected symbol
  const { 
    data: timeSeriesData, 
    loading: timeSeriesLoading, 
    error: timeSeriesError,
    refetch: refetchTimeSeries 
  } = useAlphaVantageTimeSeries(selectedSymbol, { 
    refreshInterval: 300000, // 5 minutes
    enabled: true 
  });

  const handleRefresh = () => {
    refetchTimeSeries();
  };

  const getRecentPrices = () => {
    if (!timeSeriesData?.["Time Series (Daily)"]) return [];
    
    const timeSeries = timeSeriesData["Time Series (Daily)"];
    const sortedDates = Object.keys(timeSeries).sort().reverse();
    
    return sortedDates.slice(0, 10).map(date => ({
      date,
      ...timeSeries[date],
    }));
  };

  const getLatestPrice = () => {
    const recentPrices = getRecentPrices();
    if (recentPrices.length === 0) return null;
    
    const latest = recentPrices[0];
    const previous = recentPrices[1];
    
    const latestClose = parseFloat(latest["4. close"]);
    const previousClose = previous ? parseFloat(previous["4. close"]) : latestClose;
    const change = latestClose - previousClose;
    const changePercent = ((change / previousClose) * 100);
    
    return {
      price: latestClose,
      change,
      changePercent,
      volume: parseInt(latest["5. volume"]),
      date: latest.date,
    };
  };

  const latestPrice = getLatestPrice();
  const recentPrices = getRecentPrices();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Alpha Vantage Stock Data</h2>
          <p className="text-muted-foreground">
            Real-time and historical stock data from Alpha Vantage API
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select stock symbol" />
            </SelectTrigger>
            <SelectContent>
              {popularStocks.map((stock) => (
                <SelectItem key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} disabled={timeSeriesLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${timeSeriesLoading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Current Price */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Current Price - {selectedSymbol}
            </CardTitle>
            <CardDescription>
              Latest trading data and price movement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {timeSeriesLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mr-2" />
                <span>Loading price data...</span>
              </div>
            ) : timeSeriesError ? (
              <div className="text-center py-8 text-red-600">
                <p>Error: {timeSeriesError}</p>
                <Button variant="outline" onClick={refetchTimeSeries} className="mt-2">
                  Try Again
                </Button>
              </div>
            ) : latestPrice ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    ${latestPrice.price.toFixed(2)}
                  </div>
                  <div className={`text-sm ${latestPrice.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {latestPrice.change >= 0 ? '+' : ''}${latestPrice.change.toFixed(2)} 
                    ({latestPrice.changePercent >= 0 ? '+' : ''}{latestPrice.changePercent.toFixed(2)}%)
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(latestPrice.date).toLocaleDateString()}
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Volume</div>
                    <div className="font-semibold">{latestPrice.volume.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Symbol</div>
                    <div className="font-semibold">{selectedSymbol}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No price data available for {selectedSymbol}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historical Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Price History
            </CardTitle>
            <CardDescription>
              Last 10 trading days for {selectedSymbol}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {timeSeriesLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mr-2" />
                <span>Loading history...</span>
              </div>
            ) : timeSeriesError ? (
              <div className="text-center py-8 text-red-600">
                <p>Error loading data</p>
              </div>
            ) : recentPrices.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentPrices.map((price, index) => (
                  <div key={price.date} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold text-sm">
                        {new Date(price.date).toLocaleDateString()}
                      </div>
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        {index === 0 ? "Latest" : `${index + 1} days ago`}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Open: </span>
                        <span>${parseFloat(price["1. open"]).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">High: </span>
                        <span className="text-green-600">${parseFloat(price["2. high"]).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Low: </span>
                        <span className="text-red-600">${parseFloat(price["3. low"]).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Close: </span>
                        <span className="font-semibold">${parseFloat(price["4. close"]).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-muted-foreground">
                      Volume: {parseInt(price["5. volume"]).toLocaleString()}
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
              API Status & Information
            </CardTitle>
            <CardDescription>
              Alpha Vantage API integration details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg bg-green-50">
                <div className="font-semibold text-green-800 mb-2">✓ Available Features</div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Daily Time Series Data</li>
                  <li>• Real-time Stock Prices</li>
                  <li>• Historical Price Data</li>
                  <li>• Volume Information</li>
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
                    <div>Alpha Vantage</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Data Points</div>
                    <div>{recentPrices.length} recent prices</div>
                  </div>
                  {timeSeriesData?.["Meta Data"] && (
                    <div>
                      <div className="text-muted-foreground">Last Refreshed</div>
                      <div className="text-xs">{timeSeriesData["Meta Data"]["3. Last Refreshed"]}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Status Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>API Integration Status</CardTitle>
          <CardDescription>
            Current status of Alpha Vantage API integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {recentPrices.length}
              </div>
              <div className="text-sm text-muted-foreground">Historical Data Points</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {selectedSymbol}
              </div>
              <div className="text-sm text-muted-foreground">Current Symbol</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {latestPrice ? `$${latestPrice.price.toFixed(2)}` : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">Latest Price</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};