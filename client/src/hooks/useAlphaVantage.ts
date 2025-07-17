import { useState, useEffect, useCallback, useRef } from "react";
import {
  alphaVantageApi,
  rateLimitedAlphaVantageApi,
  AlphaVantageQuote,
  AlphaVantageTimeSeries,
  AlphaVantageApiError,
  convertAVToTicker,
  convertMultipleAVToTickers,
} from "../services/alphaVantageApi";
import { stockDataFallback } from "../services/stockDataFallback";
import { Ticker } from "../types/social";

interface UseQuoteOptions {
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
}

interface UseQuoteResult {
  data: AlphaVantageQuote | null;
  ticker: Ticker | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseMultipleQuotesResult {
  data: AlphaVantageQuote[];
  tickers: Ticker[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseTimeSeriesResult {
  data: AlphaVantageTimeSeries | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch a single stock quote
 */
export function useQuote(
  symbol: string,
  options: UseQuoteOptions = {},
): UseQuoteResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<AlphaVantageQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchQuote = useCallback(async () => {
    if (!enabled || !symbol) return;

    // Check if API is disabled due to rate limits
    if (stockDataFallback.isApiDisabled()) {
      const mockTicker = stockDataFallback.getMockTicker(symbol);
      if (mockTicker) {
        const mockData: AlphaVantageQuote = {
          "Global Quote": {
            "01. symbol": mockTicker.symbol,
            "02. open": mockTicker.price.toString(),
            "03. high": (mockTicker.price * 1.02).toString(),
            "04. low": (mockTicker.price * 0.98).toString(),
            "05. price": mockTicker.price.toString(),
            "06. volume": mockTicker.volume.toString(),
            "07. latest trading day": new Date().toISOString().split("T")[0],
            "08. previous close": (
              mockTicker.price - mockTicker.change
            ).toString(),
            "09. change": mockTicker.change.toString(),
            "10. change percent": `${mockTicker.changePercent.toFixed(2)}%`,
          },
        };
        setData(mockData);
        setError("Using mock data - API rate limit reached");
      }
      return;
    }

    // Check cache first
    const cacheKey = `av_quote_${symbol}`;
    const cachedData = stockDataFallback.getCachedData(cacheKey);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const quote = await rateLimitedAlphaVantageApi.getQuote(symbol);
      setData(quote);
      stockDataFallback.setCachedData(cacheKey, quote);
    } catch (err) {
      const shouldDisableApi = stockDataFallback.handleApiError(err);

      if (shouldDisableApi) {
        // Use mock data when API is disabled
        const mockTicker = stockDataFallback.getMockTicker(symbol);
        if (mockTicker) {
          const mockData: AlphaVantageQuote = {
            "Global Quote": {
              "01. symbol": mockTicker.symbol,
              "02. open": mockTicker.price.toString(),
              "03. high": (mockTicker.price * 1.02).toString(),
              "04. low": (mockTicker.price * 0.98).toString(),
              "05. price": mockTicker.price.toString(),
              "06. volume": mockTicker.volume.toString(),
              "07. latest trading day": new Date().toISOString().split("T")[0],
              "08. previous close": (
                mockTicker.price - mockTicker.change
              ).toString(),
              "09. change": mockTicker.change.toString(),
              "10. change percent": `${mockTicker.changePercent.toFixed(2)}%`,
            },
          };
          setData(mockData);
          setError("Using mock data - API rate limit reached");
        }
      } else {
        const errorMessage =
          err instanceof AlphaVantageApiError
            ? err.message
            : "Failed to fetch quote";
        setError(errorMessage);
        console.error("Quote fetch error:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [symbol, enabled]);

  useEffect(() => {
    if (enabled && symbol) {
      fetchQuote();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchQuote, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchQuote, refreshInterval, enabled, symbol]);

  const ticker = data ? convertAVToTicker(data) : null;

  return {
    data,
    ticker,
    loading,
    error,
    refetch: fetchQuote,
  };
}

/**
 * Hook to fetch multiple stock quotes
 */
export function useMultipleQuotes(
  symbols: string[],
  options: UseQuoteOptions = {},
): UseMultipleQuotesResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<AlphaVantageQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchQuotes = useCallback(async () => {
    if (!enabled || symbols.length === 0) return;

    // Check if API is disabled due to rate limits
    if (stockDataFallback.isApiDisabled()) {
      const mockTickers = stockDataFallback.getMockTickers(symbols);
      const mockQuotes: AlphaVantageQuote[] = mockTickers.map((ticker) => ({
        "Global Quote": {
          "01. symbol": ticker.symbol,
          "02. open": ticker.price.toString(),
          "03. high": (ticker.price * 1.02).toString(),
          "04. low": (ticker.price * 0.98).toString(),
          "05. price": ticker.price.toString(),
          "06. volume": ticker.volume.toString(),
          "07. latest trading day": new Date().toISOString().split("T")[0],
          "08. previous close": (ticker.price - ticker.change).toString(),
          "09. change": ticker.change.toString(),
          "10. change percent": `${ticker.changePercent.toFixed(2)}%`,
        },
      }));

      setData(mockQuotes);
      setError("Using mock data - API rate limit reached");
      return;
    }

    // Check cache first
    const cacheKey = `av_quotes_${symbols.join(",")}`;
    const cachedData = stockDataFallback.getCachedData(cacheKey);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Alpha Vantage doesn't support batch quotes, so we fetch them individually
      const quotes: AlphaVantageQuote[] = [];
      for (const symbol of symbols) {
        try {
          const quote = await rateLimitedAlphaVantageApi.getQuote(symbol);
          quotes.push(quote);
        } catch (err) {
          console.warn(`Failed to fetch quote for ${symbol}:`, err);
          // Continue with other symbols
        }
      }

      setData(quotes);
      stockDataFallback.setCachedData(cacheKey, quotes);
    } catch (err) {
      const shouldDisableApi = stockDataFallback.handleApiError(err);

      if (shouldDisableApi) {
        // Use mock data when API is disabled
        const mockTickers = stockDataFallback.getMockTickers(symbols);
        const mockQuotes: AlphaVantageQuote[] = mockTickers.map((ticker) => ({
          "Global Quote": {
            "01. symbol": ticker.symbol,
            "02. open": ticker.price.toString(),
            "03. high": (ticker.price * 1.02).toString(),
            "04. low": (ticker.price * 0.98).toString(),
            "05. price": ticker.price.toString(),
            "06. volume": ticker.volume.toString(),
            "07. latest trading day": new Date().toISOString().split("T")[0],
            "08. previous close": (ticker.price - ticker.change).toString(),
            "09. change": ticker.change.toString(),
            "10. change percent": `${ticker.changePercent.toFixed(2)}%`,
          },
        }));

        setData(mockQuotes);
        setError("Using mock data - API rate limit reached");
      } else {
        const errorMessage =
          err instanceof AlphaVantageApiError
            ? err.message
            : "Failed to fetch quotes";
        setError(errorMessage);
        console.error("Multiple quotes fetch error:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [symbols, enabled]);

  useEffect(() => {
    if (enabled && symbols.length > 0) {
      fetchQuotes();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchQuotes, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchQuotes, refreshInterval, enabled]);

  const tickers = data.length > 0 ? convertMultipleAVToTickers(data) : [];

  return {
    data,
    tickers,
    loading,
    error,
    refetch: fetchQuotes,
  };
}

/**
 * Hook to fetch historical time series data
 */
export function useTimeSeries(
  symbol: string,
  interval: "1min" | "5min" | "15min" | "30min" | "60min" = "5min",
  outputsize: "compact" | "full" = "compact",
  enabled: boolean = true,
): UseTimeSeriesResult {
  const [data, setData] = useState<AlphaVantageTimeSeries | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeSeries = useCallback(async () => {
    if (!enabled || !symbol) return;

    // Check if API is disabled due to rate limits
    if (stockDataFallback.isApiDisabled()) {
      setError("Using mock data - API rate limit reached");
      return;
    }

    // Check cache first
    const cacheKey = `av_timeseries_${symbol}_${interval}`;
    const cachedData = stockDataFallback.getCachedData(cacheKey);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const timeSeries = await rateLimitedAlphaVantageApi.getTimeSeries(
        symbol,
        interval,
        outputsize,
      );
      setData(timeSeries);
      stockDataFallback.setCachedData(cacheKey, timeSeries);
    } catch (err) {
      const shouldDisableApi = stockDataFallback.handleApiError(err);

      if (!shouldDisableApi) {
        const errorMessage =
          err instanceof AlphaVantageApiError
            ? err.message
            : "Failed to fetch time series";
        setError(errorMessage);
        console.error("Time series fetch error:", err);
      } else {
        setError("Using mock data - API rate limit reached");
      }
    } finally {
      setLoading(false);
    }
  }, [symbol, interval, outputsize, enabled]);

  useEffect(() => {
    if (enabled && symbol) {
      fetchTimeSeries();
    }
  }, [fetchTimeSeries, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchTimeSeries,
  };
}

/**
 * Hook for real-time updates with automatic refresh
 */
export function useRealTimeQuotes(
  symbols: string[],
  refreshIntervalMs: number = 60000,
) {
  return useMultipleQuotes(symbols, {
    refreshInterval: refreshIntervalMs,
    enabled: symbols.length > 0,
  });
}

/**
 * Hook for watchlist real-time updates
 */
export function useWatchlistRealTime(watchlistSymbols: string[]) {
  const [isMarketOpen, setIsMarketOpen] = useState(true); // You could fetch this from market state API

  // Use faster refresh during market hours, slower when closed
  const refreshInterval = isMarketOpen ? 60000 : 300000; // 1 minute vs 5 minutes

  return useMultipleQuotes(watchlistSymbols, {
    refreshInterval,
    enabled: watchlistSymbols.length > 0,
  });
}
