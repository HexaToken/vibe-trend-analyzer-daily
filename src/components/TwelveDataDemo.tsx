import { useState } from "react";
import { RefreshCw, TrendingUp, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { RealTimePrice, StockGrid } from "./social/RealTimePrice";
import {
  useQuote,
  useMultipleQuotes,
  useTimeSeries,
} from "@/hooks/useTwelveData";
import { twelveDataApi } from "@/services/twelveDataApi";
import { stockDataFallback } from "@/services/stockDataFallback";

export const TwelveDataDemo = () => {
  const [testSymbol, setTestSymbol] = useState("AAPL");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [apiStatus, setApiStatus] = useState(stockDataFallback.getStatus());

  // Update API status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setApiStatus(stockDataFallback.getStatus());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Test popular stocks
  const popularStocks = ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA", "AMZN"];
  const {
    tickers: popularTickers,
    loading: popularLoading,
    error: popularError,
  } = useMultipleQuotes(popularStocks);

  // Test single quote
  const {
    ticker: singleTicker,
    loading: singleLoading,
    error: singleError,
    refetch,
  } = useQuote(testSymbol);

  // Test time series
  const { data: timeSeries, loading: timeSeriesLoading } = useTimeSeries(
    testSymbol,
    "1day",
    10,
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await twelveDataApi.symbolSearch(searchQuery);
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Twelve Data API Integration Demo</h1>
        <p className="text-muted-foreground">
          Real-time stock market data powered by Twelve Data API
        </p>
      </div>

      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            API Status & Testing
          </CardTitle>
          <CardDescription>
            Test the Twelve Data API integration with various endpoints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>API Key:</strong> Configured and ready to use. Rate limit:
              800 requests/minute for free tier.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {popularTickers.length}
              </div>
              <div className="text-sm text-muted-foreground">Stocks Loaded</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">30s</div>
              <div className="text-sm text-muted-foreground">Refresh Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                Real-time
              </div>
              <div className="text-sm text-muted-foreground">Data Updates</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Single Quote Test */}
      <Card>
        <CardHeader>
          <CardTitle>Single Quote Test</CardTitle>
          <CardDescription>
            Test real-time quote fetching for a specific symbol
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter symbol (e.g., AAPL, TSLA)"
              value={testSymbol}
              onChange={(e) => setTestSymbol(e.target.value.toUpperCase())}
              className="max-w-xs"
            />
            <Button onClick={refetch} disabled={singleLoading}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${singleLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {singleError && (
            <Alert variant="destructive">
              <AlertDescription>Error: {singleError}</AlertDescription>
            </Alert>
          )}

          {singleTicker && (
            <div className="p-4 border rounded-lg">
              <RealTimePrice symbol={testSymbol} size="lg" showRefresh={true} />
              <Separator className="my-3" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Exchange</div>
                  <div className="font-medium">
                    {singleTicker.exchange || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Volume</div>
                  <div className="font-medium">
                    {singleTicker.volume.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Type</div>
                  <div className="font-medium capitalize">
                    {singleTicker.type}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Last Updated</div>
                  <div className="font-medium">
                    {singleTicker.lastUpdated.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Popular Stocks Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Stocks</CardTitle>
          <CardDescription>
            Real-time data for popular stocks (auto-refreshing every 30 seconds)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {popularLoading && popularTickers.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading stock data...</p>
            </div>
          ) : popularError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Error loading popular stocks: {popularError}
              </AlertDescription>
            </Alert>
          ) : (
            <StockGrid symbols={popularStocks} />
          )}
        </CardContent>
      </Card>

      {/* Symbol Search */}
      <Card>
        <CardHeader>
          <CardTitle>Symbol Search</CardTitle>
          <CardDescription>
            Search for stock symbols using the Twelve Data API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for stocks (e.g., Apple, Tesla)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="max-w-md"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Search Results:</h4>
              <div className="grid gap-2 max-h-64 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div>
                      <div className="font-medium">{result.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.instrument_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {result.exchange} • {result.country} •{" "}
                        {result.instrument_type}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTestSymbol(result.symbol)}
                    >
                      Test
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time Series Data */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Data</CardTitle>
          <CardDescription>
            Last 10 days of data for {testSymbol}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {timeSeriesLoading ? (
            <div className="text-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p>Loading historical data...</p>
            </div>
          ) : timeSeries ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {timeSeries.values.map((value, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded text-sm"
                >
                  <div className="font-medium">{value.datetime}</div>
                  <div className="flex gap-4">
                    <span>Open: ${parseFloat(value.open).toFixed(2)}</span>
                    <span>High: ${parseFloat(value.high).toFixed(2)}</span>
                    <span>Low: ${parseFloat(value.low).toFixed(2)}</span>
                    <span className="font-medium">
                      Close: ${parseFloat(value.close).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No historical data available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Details</CardTitle>
          <CardDescription>
            How the Twelve Data API is integrated into your app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Features Implemented:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Real-time stock quotes with auto-refresh</li>
              <li>Multiple stock data fetching with rate limiting</li>
              <li>Historical time series data</li>
              <li>Symbol search functionality</li>
              <li>Error handling and loading states</li>
              <li>Integration with social platform cashtags</li>
              <li>Responsive UI components for stock data display</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Components Created:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">TwelveDataService</Badge>
              <Badge variant="outline">useTwelveData hooks</Badge>
              <Badge variant="outline">RealTimePrice</Badge>
              <Badge variant="outline">InlinePrice</Badge>
              <Badge variant="outline">StockGrid</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Integrated In:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Social Platform</Badge>
              <Badge variant="secondary">Ticker Pages</Badge>
              <Badge variant="secondary">Trending Sidebar</Badge>
              <Badge variant="secondary">Post Cashtags</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
