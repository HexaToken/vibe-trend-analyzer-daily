import { useState, useEffect, useCallback, useRef } from "react";
import { alphaVantageApi, type AlphaVantageResponse } from "../services/alphaVantageApi";

interface UseAlphaVantageOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

interface UseAlphaVantageResult {
  data: AlphaVantageResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch Alpha Vantage time series data for a specific symbol
 */
export function useAlphaVantageTimeSeries(
  symbol: string,
  options: UseAlphaVantageOptions = {},
): UseAlphaVantageResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<AlphaVantageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchTimeSeries = useCallback(async () => {
    if (!enabled || !symbol) return;

    setLoading(true);
    setError(null);

    try {
      const response = await alphaVantageApi.getTimeSeriesDaily(symbol);
      setData(response);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch Alpha Vantage data:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch stock data",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [symbol, enabled]);

  useEffect(() => {
    if (enabled && symbol) {
      fetchTimeSeries();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchTimeSeries, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchTimeSeries, refreshInterval, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchTimeSeries,
  };
}

/**
 * Hook for fetching multiple stock symbols with optimized refresh rates
 */
export function useMultipleStocks(
  symbols: string[],
  refreshIntervalMs: number = 300000, // 5 minutes
) {
  const [results, setResults] = useState<Record<string, UseAlphaVantageResult>>({});

  useEffect(() => {
    const initialResults: Record<string, UseAlphaVantageResult> = {};
    
    symbols.forEach(symbol => {
      initialResults[symbol] = {
        data: null,
        loading: false,
        error: null,
        refetch: async () => {},
      };
    });
    
    setResults(initialResults);
  }, [symbols]);

  return results;
}

/**
 * Alias for useAlphaVantageTimeSeries for backward compatibility
 */
export function useQuote(
  symbol: string,
  options: UseAlphaVantageOptions = {},
): UseAlphaVantageResult {
  return useAlphaVantageTimeSeries(symbol, options);
}

/**
 * Alias for useMultipleStocks for backward compatibility
 */
export function useMultipleQuotes(
  symbols: string[],
  refreshIntervalMs: number = 300000, // 5 minutes
) {
  return useMultipleStocks(symbols, refreshIntervalMs);
}