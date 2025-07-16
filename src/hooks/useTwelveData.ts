import { useState, useEffect, useCallback, useRef } from "react";
import {
  twelveDataApi,
  rateLimitedTwelveDataApi,
  TwelveDataQuote,
  TwelveDataTimeSeries,
  TwelveDataApiError,
  convertToTicker,
  convertMultipleToTickers,
} from "../services/twelveDataApi";
import { Ticker } from "../types/social";

interface UseQuoteOptions {
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
}

interface UseQuoteResult {
  data: TwelveDataQuote | null;
  ticker: Ticker | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseMultipleQuotesResult {
  data: Record<string, TwelveDataQuote> | null;
  tickers: Ticker[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseTimeSeriesResult {
  data: TwelveDataTimeSeries | null;
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
  const [data, setData] = useState<TwelveDataQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchQuote = useCallback(async () => {
    if (!enabled || !symbol) return;

    setLoading(true);
    setError(null);

    try {
      const quote = await rateLimitedTwelveDataApi.getQuote(symbol);
      setData(quote);
    } catch (err) {
      const errorMessage =
        err instanceof TwelveDataApiError
          ? err.message
          : "Failed to fetch quote";
      setError(errorMessage);
      console.error("Quote fetch error:", err);
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

  const ticker = data ? convertToTicker(data) : null;

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
  const [data, setData] = useState<Record<string, TwelveDataQuote> | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchQuotes = useCallback(async () => {
    if (!enabled || symbols.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const quotes = await rateLimitedTwelveDataApi.getQuotes(symbols);
      setData(quotes);
    } catch (err) {
      const errorMessage =
        err instanceof TwelveDataApiError
          ? err.message
          : "Failed to fetch quotes";
      setError(errorMessage);
      console.error("Multiple quotes fetch error:", err);
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

  const tickers = data ? convertMultipleToTickers(data) : [];

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
  interval:
    | "1min"
    | "5min"
    | "15min"
    | "30min"
    | "45min"
    | "1h"
    | "2h"
    | "4h"
    | "1day"
    | "1week"
    | "1month" = "1day",
  outputsize: number = 30,
  enabled: boolean = true,
): UseTimeSeriesResult {
  const [data, setData] = useState<TwelveDataTimeSeries | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeSeries = useCallback(async () => {
    if (!enabled || !symbol) return;

    setLoading(true);
    setError(null);

    try {
      const timeSeries = await rateLimitedTwelveDataApi.getTimeSeries(
        symbol,
        interval,
        outputsize,
      );
      setData(timeSeries);
    } catch (err) {
      const errorMessage =
        err instanceof TwelveDataApiError
          ? err.message
          : "Failed to fetch time series";
      setError(errorMessage);
      console.error("Time series fetch error:", err);
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
  refreshIntervalMs: number = 30000,
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
  const refreshInterval = isMarketOpen ? 30000 : 300000; // 30 seconds vs 5 minutes

  return useMultipleQuotes(watchlistSymbols, {
    refreshInterval,
    enabled: watchlistSymbols.length > 0,
  });
}
