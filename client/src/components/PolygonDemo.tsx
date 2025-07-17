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
import { polygonApi } from "@/services/alphaVantageApi";
import { stockDataFallback } from "@/services/stockDataFallback";
import {
  useCryptoListings,
  useCryptoQuotes,
  useGlobalMetrics,
} from "@/hooks/useCoinMarketCap";
import { coinMarketCapApi } from "@/services/coinMarketCapApi";
import {
  CryptoGrid,
  CryptoMarketOverview,
} from "@/components/crypto/CryptoPrice";
import { ApiStatusOverview } from "@/components/ApiStatusOverview";
import { NewsDemo } from "@/components/NewsDemo";

export const PolygonDemo = () => {
  const [testSymbol, setTestSymbol] = useState("AAPL");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dividendData, setDividendData] = useState<any[]>([]);
  const [isDividendLoading, setIsDividendLoading] = useState(false);

  // Get API status directly without storing in state to avoid infinite loops
  const apiStatus = stockDataFallback.getStatus();

  // Test popular stocks - Top 10 only
  const popularStocks = ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA", "AMZN", "META", "NFLX", "SPY", "QQQ"];

  // Test popular cryptocurrencies
  const popularCryptos = ["BTC", "ETH", "BNB", "XRP", "ADA", "SOL"];
  const {
    tickers: cryptoTickers,
    loading: cryptoLoading,
    error: cryptoError,
  } = useCryptoQuotes(popularCryptos);

  // Test crypto listings
  const { tickers: topCryptos, loading: cryptoListingsLoading } =
    useCryptoListings(10);

  // Test global metrics
  const { data: globalMetrics, loading: metricsLoading } = useGlobalMetrics();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await polygonApi.symbolSearch(searchQuery);
      setSearchResults(results.results?.slice(0, 10) || []); // Limit to 10 results
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDividendFetch = async () => {
    if (!testSymbol.trim()) return;

    setIsDividendLoading(true);
    try {
      const response = await polygonApi.getDividends(testSymbol);
      setDividendData(response.results || []);
    } catch (error) {
      console.error("Dividend fetch error:", error);
      setDividendData([]);
    } finally {
      setIsDividendLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          Polygon.io API Integration Demo
        </h1>
        <p className="text-muted-foreground">
          Real-time stock quotes, dividends, and financial data powered by Polygon.io API + cryptocurrency data from CoinMarketCap API + business news from NewsAPI
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
            Test the Polygon.io API integration with stock data and dividends
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

          {/* Single Stock Test */}
          <div className="space-y-2">
            <h4 className="font-medium">Test Single Stock Quote</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Enter stock symbol (e.g., AAPL)"
                value={testSymbol}
                onChange={(e) => setTestSymbol(e.target.value.toUpperCase())}
                className="max-w-xs"
              />
              <RealTimePrice
                symbol={testSymbol}
                size="lg"
                showRefresh={true}
                className="flex items-center gap-2"
              />
            </div>
          </div>

          {/* Dividend Data Test */}
          <div className="space-y-2">
            <h4 className="font-medium">Test Dividend Data</h4>
            <div className="flex gap-2">
              <Button 
                onClick={handleDividendFetch} 
                disabled={isDividendLoading}
                size="sm"
              >
                {isDividendLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  "Fetch Dividends"
                )}
              </Button>
              <span className="text-sm text-muted-foreground">
                for {testSymbol}
              </span>
            </div>
            
            {dividendData.length > 0 && (
              <div className="mt-4 space-y-2">
                <h5 className="font-medium">Recent Dividends for {testSymbol}:</h5>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {dividendData.slice(0, 10).map((dividend, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded text-sm"
                    >
                      <div className="flex gap-4">
                        <span><strong>Ex-Date:</strong> {dividend.ex_dividend_date}</span>
                        <span><strong>Pay Date:</strong> {dividend.pay_date}</span>
                      </div>
                      <div className="flex gap-4">
                        <span><strong>Amount:</strong> ${dividend.cash_amount}</span>
                        <span><strong>Frequency:</strong> {dividend.frequency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Popular Stocks Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Stocks - Top 10</CardTitle>
          <CardDescription>
            Real-time data for the top 10 most popular stocks (auto-refreshing every 3 minutes)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StockGrid symbols={popularStocks} />
        </CardContent>
      </Card>

      {/* Popular Crypto Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Cryptocurrencies</CardTitle>
          <CardDescription>
            Real-time data for popular cryptocurrencies (auto-refreshing every 3 minutes)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cryptoLoading && cryptoTickers.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading crypto data...</p>
            </div>
          ) : cryptoError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Error loading crypto data: {cryptoError}
              </AlertDescription>
            </Alert>
          ) : (
            <CryptoGrid tickers={cryptoTickers} />
          )}
        </CardContent>
      </Card>

      {/* Top Cryptocurrencies */}
      <Card>
        <CardHeader>
          <CardTitle>Top Cryptocurrencies by Market Cap</CardTitle>
          <CardDescription>
            Real-time rankings and market data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cryptoListingsLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading crypto listings...</p>
            </div>
          ) : topCryptos.length > 0 ? (
            <CryptoGrid tickers={topCryptos} />
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No crypto listings available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Global Crypto Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Global Crypto Market Metrics</CardTitle>
          <CardDescription>
            Overall cryptocurrency market statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metricsLoading ? (
            <div className="text-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p>Loading market metrics...</p>
            </div>
          ) : globalMetrics ? (
            <CryptoMarketOverview metrics={globalMetrics} />
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No global metrics available
            </p>
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

      {/* Symbol Search */}
      <Card>
        <CardHeader>
          <CardTitle>Symbol Search</CardTitle>
          <CardDescription>
            Search for stock symbols using the Polygon.io API
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
                      <div className="font-medium">{result.ticker}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {result.market}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Details */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Details</CardTitle>
          <CardDescription>
            How Polygon.io API, CoinMarketCap API, and NewsAPI are integrated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Stock Features (Polygon.io API):</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Real-time stock quotes with auto-refresh</li>
              <li>Dividend data fetching and display</li>
              <li>Symbol search functionality</li>
              <li>Error handling and loading states</li>
              <li>Integration with social platform cashtags</li>
              <li>Responsive UI components for stock data display</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">
              Crypto Features (CoinMarketCap API):
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Real-time cryptocurrency quotes and rankings</li>
              <li>Top cryptocurrency listings by market cap</li>
              <li>Global cryptocurrency market metrics</li>
              <li>Bitcoin and Ethereum dominance tracking</li>
              <li>Smart detection of crypto vs stock symbols in posts</li>
              <li>Comprehensive error handling and fallback to mock data</li>
              <li>Rate limiting and caching for optimal performance</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">News Features (NewsAPI):</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Business and technology news headlines</li>
              <li>News search functionality with keyword matching</li>
              <li>Automated sentiment analysis for articles</li>
              <li>Real-time news updates and refresh capabilities</li>
              <li>Multiple news source aggregation</li>
              <li>Article metadata and publication tracking</li>
              <li>Integration with sentiment scoring system</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Components Created:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">PolygonService</Badge>
              <Badge variant="outline">CoinMarketCapService</Badge>
              <Badge variant="outline">NewsAPIService</Badge>
              <Badge variant="outline">usePolygon hooks</Badge>
              <Badge variant="outline">useCoinMarketCap hooks</Badge>
              <Badge variant="outline">useNewsApi hooks</Badge>
              <Badge variant="outline">RealTimePrice</Badge>
              <Badge variant="outline">CryptoPrice</Badge>
              <Badge variant="outline">InlinePrice</Badge>
              <Badge variant="outline">InlineCryptoPrice</Badge>
              <Badge variant="outline">StockGrid</Badge>
              <Badge variant="outline">CryptoGrid</Badge>
              <Badge variant="outline">TopNews</Badge>
              <Badge variant="outline">NewsDemo</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};