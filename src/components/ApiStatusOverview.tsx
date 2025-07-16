import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { stockDataFallback } from "@/services/stockDataFallback";
import { useQuote } from "@/hooks/useTwelveData";
import { useCryptoQuotes } from "@/hooks/useCoinMarketCap";

export const ApiStatusOverview = () => {
  const [fallbackStatus, setFallbackStatus] = useState(() =>
    stockDataFallback.getStatus(),
  );

  // Test stock API with a simple quote
  const {
    ticker: stockTest,
    loading: stockLoading,
    error: stockError,
  } = useQuote("AAPL", {
    refreshInterval: 0,
    enabled: true,
  });

  // Test crypto API with a simple quote
  const {
    tickers: cryptoTest,
    loading: cryptoLoading,
    error: cryptoError,
  } = useCryptoQuotes(["BTC"], {
    refreshInterval: 0,
    enabled: true,
  });

  const updateStatus = useCallback(() => {
    const newStatus = stockDataFallback.getStatus();
    setFallbackStatus((prevStatus) => {
      // Only update if something actually changed
      if (JSON.stringify(prevStatus) !== JSON.stringify(newStatus)) {
        return newStatus;
      }
      return prevStatus;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(updateStatus, 5000);
    return () => clearInterval(interval);
  }, [updateStatus]);

  const getStatusIcon = (loading: boolean, error: string | null, data: any) => {
    if (loading)
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />;
    if (error) return <XCircle className="h-4 w-4 text-red-600" />;
    if (data) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <AlertCircle className="h-4 w-4 text-yellow-600" />;
  };

  const getStatusText = (loading: boolean, error: string | null, data: any) => {
    if (loading) return "Testing...";
    if (error) return "Failed";
    if (data) return "Working";
    return "Unknown";
  };

  const getStatusColor = (
    loading: boolean,
    error: string | null,
    data: any,
  ) => {
    if (loading) return "secondary";
    if (error) return "destructive";
    if (data) return "default";
    return "outline";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          API Status Overview
        </CardTitle>
        <CardDescription>
          Real-time status of all financial data APIs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">System Status</h4>
              <p className="text-sm text-muted-foreground">
                {fallbackStatus.apiDisabled
                  ? "Using mock data due to API limits"
                  : "All systems operational"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {fallbackStatus.apiDisabled ? (
                <AlertCircle className="h-5 w-5 text-orange-600" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              <Badge
                variant={fallbackStatus.apiDisabled ? "destructive" : "default"}
              >
                {fallbackStatus.apiDisabled ? "Fallback Mode" : "Live Data"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Individual API Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Twelve Data API (Stocks) */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Twelve Data API</h4>
              <div className="flex items-center gap-2">
                {getStatusIcon(stockLoading, stockError, stockTest)}
                <Badge
                  variant={
                    getStatusColor(stockLoading, stockError, stockTest) as any
                  }
                >
                  {getStatusText(stockLoading, stockError, stockTest)}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Stock market data
            </p>
            <div className="text-xs space-y-1">
              <div>Rate Limit: 800 requests/day</div>
              {stockTest && (
                <div className="text-green-600">
                  ✓ AAPL: ${stockTest.price.toFixed(2)}
                </div>
              )}
              {stockError && <div className="text-red-600">✗ {stockError}</div>}
            </div>
          </div>

          {/* CoinMarketCap API (Crypto) */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">CoinMarketCap API</h4>
              <div className="flex items-center gap-2">
                {getStatusIcon(cryptoLoading, cryptoError, cryptoTest[0])}
                <Badge
                  variant={
                    getStatusColor(
                      cryptoLoading,
                      cryptoError,
                      cryptoTest[0],
                    ) as any
                  }
                >
                  {getStatusText(cryptoLoading, cryptoError, cryptoTest[0])}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Cryptocurrency data
            </p>
            <div className="text-xs space-y-1">
              <div>Rate Limit: 333 requests/minute</div>
              {cryptoTest[0] && (
                <div className="text-green-600">
                  ✓ BTC: ${cryptoTest[0].price.toLocaleString()}
                </div>
              )}
              {cryptoError && (
                <div className="text-red-600">✗ {cryptoError}</div>
              )}
            </div>
          </div>
        </div>

        {/* Cache Status */}
        <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Cache Status</h4>
            <Badge variant="outline">{fallbackStatus.cacheSize} items</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Cached data helps reduce API calls and provides faster responses
          </p>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => stockDataFallback.clearCache()}
            >
              Clear Cache
            </Button>
            {fallbackStatus.apiDisabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  stockDataFallback.enableApi();
                  setFallbackStatus(stockDataFallback.getStatus());
                }}
              >
                Force Enable APIs
              </Button>
            )}
          </div>
        </div>

        {/* Recovery Information */}
        {fallbackStatus.apiDisabled && fallbackStatus.apiDisabledUntil && (
          <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <h4 className="font-medium">API Recovery</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              APIs will automatically re-enable at{" "}
              {fallbackStatus.apiDisabledUntil.toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
