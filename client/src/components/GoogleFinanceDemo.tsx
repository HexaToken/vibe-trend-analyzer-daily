import { useState } from "react";
import { RefreshCw, TrendingUp, AlertCircle, Search } from "lucide-react";
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
import { stockDataFallback } from "@/services/stockDataFallback";
import {
  useGoogleFinanceQuote,
  useGoogleFinanceSearch,
  useGoogleFinanceTrending,
} from "@/hooks/useGoogleFinance";
import { ApiStatusOverview } from "@/components/ApiStatusOverview";
import { NewsDemo } from "@/components/NewsDemo";

export const GoogleFinanceDemo = () => {
  const [testSymbol, setTestSymbol] = useState("AAPL");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchEnabled, setSearchEnabled] = useState(false);

  // Get API status
  const apiStatus = stockDataFallback.getStatus();

  // Test individual stock quote
  const {
    data: quoteData,
    loading: quoteLoading,
    error: quoteError,
    refetch: refetchQuote,
  } = useGoogleFinanceQuote(testSymbol, { refreshInterval: 180000 }); // 3 minutes

  // Test search functionality
  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useGoogleFinanceSearch(searchQuery, { enabled: searchEnabled });

  // Test trending stocks
  const {
    data: trendingData,
    loading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useGoogleFinanceTrending({ refreshInterval: 180000 }); // 3 minutes

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchEnabled(true);
      refetchSearch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    const prefix = isPositive ? "+" : "";
    const color = isPositive ? "text-green-600" : "text-red-600";
    
    return (
      <span className={color}>
        {prefix}{formatPrice(change)} ({prefix}{changePercent.toFixed(2)}%)
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          Google Finance API Integration Demo
        </h1>
        <p className="text-muted-foreground">
          Real-time stock data powered by Google Finance via SerpAPI
        </p>
      </div>

      {/* API Status Overview */}
      <ApiStatusOverview />

      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            API Status & Testing
          </CardTitle>
          <CardDescription>
            Test the Google Finance API integration via SerpAPI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant={apiStatus.apiDisabled ? "destructive" : "default"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div>
                  <strong>API Status:</strong> {apiStatus.message}
                </div>
                {apiStatus.apiDisabled ? (
                  <div className="space-y-1">
                    {apiStatus.apiDisabledUntil && (
                      <div className="text-sm">
                        <strong>Retry After:</strong>{" "}
                        {apiStatus.apiDisabledUntil.toLocaleString()}
                      </div>
                    )}
                    <div className="text-sm">
                      <strong>Fallback:</strong> Using cached/mock data
                    </div>
                  </div>
                ) : (
                  <div className="text-sm">
                    <strong>Cache Size:</strong> {apiStatus.cacheSize} items
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Single Stock Quote Test */}
      <Card>
        <CardHeader>
          <CardTitle>Single Stock Quote Test</CardTitle>
          <CardDescription>
            Test individual stock quote fetching from Google Finance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={testSymbol}
              onChange={(e) => setTestSymbol(e.target.value.toUpperCase())}
              className="max-w-xs"
            />
            <Button onClick={refetchQuote} disabled={quoteLoading}>
              {quoteLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </div>

          {quoteError && (
            <Alert variant="destructive">
              <AlertDescription>Error: {quoteError}</AlertDescription>
            </Alert>
          )}

          {quoteData?.summary && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">
                    {quoteData.summary.name} ({quoteData.summary.symbol})
                  </h3>
                  <Badge variant="secondary">{quoteData.summary.exchange}</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Price</div>
                    <div className="text-xl font-bold">
                      {formatPrice(quoteData.summary.price)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Change</div>
                    <div className="font-semibold">
                      {formatChange(quoteData.summary.change, quoteData.summary.change_percent)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Previous Close</div>
                    <div>{quoteData.summary.previous_close ? formatPrice(quoteData.summary.previous_close) : "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Volume</div>
                    <div>{quoteData.summary.volume ? quoteData.summary.volume.toLocaleString() : "N/A"}</div>
                  </div>
                </div>

                {(quoteData.summary.market_cap || quoteData.summary.pe_ratio || quoteData.summary.div_yield) && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      {quoteData.summary.market_cap && (
                        <div>
                          <div className="text-muted-foreground">Market Cap</div>
                          <div>{quoteData.summary.market_cap}</div>
                        </div>
                      )}
                      {quoteData.summary.pe_ratio && (
                        <div>
                          <div className="text-muted-foreground">P/E Ratio</div>
                          <div>{quoteData.summary.pe_ratio.toFixed(2)}</div>
                        </div>
                      )}
                      {quoteData.summary.div_yield && (
                        <div>
                          <div className="text-muted-foreground">Div Yield</div>
                          <div>{quoteData.summary.div_yield.toFixed(2)}%</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {quoteLoading && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading stock data...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stock Search Test */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Search Test</CardTitle>
          <CardDescription>
            Search for stocks using Google Finance via SerpAPI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for stocks (e.g., Apple, Tesla)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="max-w-md"
            />
            <Button onClick={handleSearch} disabled={searchLoading}>
              {searchLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {searchError && (
            <Alert variant="destructive">
              <AlertDescription>Search Error: {searchError}</AlertDescription>
            </Alert>
          )}

          {searchData?.markets && (
            <div className="space-y-4">
              {Object.entries(searchData.markets).map(([market, stocks]) => (
                <div key={market}>
                  <h4 className="font-medium mb-2">{market} Market:</h4>
                  <div className="grid gap-2">
                    {stocks.map((stock, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">{stock.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatPrice(stock.price)}</div>
                          <div className="text-sm">
                            {formatChange(stock.change, stock.change_percent)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchLoading && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Searching stocks...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trending Stocks */}
      <Card>
        <CardHeader>
          <CardTitle>Trending Stocks</CardTitle>
          <CardDescription>
            Popular and trending stocks from Google Finance (auto-refreshing every 3 minutes)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trendingError && (
            <Alert variant="destructive">
              <AlertDescription>Trending Error: {trendingError}</AlertDescription>
            </Alert>
          )}

          {trendingData?.markets && (
            <div className="space-y-4">
              {Object.entries(trendingData.markets).map(([market, stocks]) => (
                <div key={market}>
                  <h4 className="font-medium mb-2">{market}:</h4>
                  <div className="grid gap-2 max-h-64 overflow-y-auto">
                    {stocks.map((stock, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">{stock.name}</div>
                          <div className="text-xs text-muted-foreground">{stock.exchange}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatPrice(stock.price)}</div>
                          <div className="text-sm">
                            {formatChange(stock.change, stock.change_percent)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {trendingLoading && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading trending stocks...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* News Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>NewsAPI Integration</CardTitle>
          <CardDescription>
            Business and technology news integration with sentiment analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              View the complete news integration demo below
            </p>
            <NewsDemo />
          </div>
        </CardContent>
      </Card>

      {/* Integration Details */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Details</CardTitle>
          <CardDescription>
            How Google Finance API via SerpAPI is integrated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Google Finance Features (via SerpAPI):</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Real-time stock quotes with comprehensive market data</li>
              <li>Stock search functionality with market categorization</li>
              <li>Trending stocks discovery and monitoring</li>
              <li>Market capitalization, P/E ratio, and dividend yield data</li>
              <li>52-week high/low tracking</li>
              <li>Volume and trading statistics</li>
              <li>Multi-exchange support (NASDAQ, NYSE, etc.)</li>
              <li>Error handling and fallback to cached data</li>
              <li>Rate limiting and API usage optimization</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">API Endpoints:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">GET /api/proxy/serpapi/google-finance?symbol={symbol}</Badge>
              <Badge variant="outline">GET /api/proxy/serpapi/google-finance-search?q={query}</Badge>
              <Badge variant="outline">GET /api/proxy/serpapi/google-finance-trending</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Components Created:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">GoogleFinanceService</Badge>
              <Badge variant="outline">useGoogleFinance hooks</Badge>
              <Badge variant="outline">GoogleFinanceDemo</Badge>
              <Badge variant="outline">RateLimitedService</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};