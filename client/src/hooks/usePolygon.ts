import { useState, useEffect, useCallback, useRef } from "react";
import { polygonApi, type PolygonTickersResponse, type PolygonDividendsResponse } from "../services/polygonApi";

interface UsePolygonOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

interface UseTickersResult {
  data: PolygonTickersResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseDividendsResult {
  data: PolygonDividendsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch stock tickers from Polygon.io
 */
export function usePolygonTickers(
  market: string = "stocks",
  limit: number = 100,
  options: UsePolygonOptions = {},
): UseTickersResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<PolygonTickersResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchTickers = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await polygonApi.getTickers(market, true, "asc", limit, "ticker");
      setData(response);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch stock tickers:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch stock tickers",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [market, limit, enabled]);

  useEffect(() => {
    if (enabled) {
      fetchTickers();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchTickers, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchTickers, refreshInterval, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchTickers,
  };
}

/**
 * Hook to fetch dividend data for a specific ticker
 */
export function usePolygonDividends(
  ticker: string,
  options: UsePolygonOptions = {},
): UseDividendsResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<PolygonDividendsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchDividends = useCallback(async () => {
    if (!enabled || !ticker) return;

    setLoading(true);
    setError(null);

    try {
      const response = await polygonApi.getDividends(ticker);
      setData(response);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch dividends:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch dividend data",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [ticker, enabled]);

  useEffect(() => {
    if (enabled && ticker) {
      fetchDividends();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchDividends, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchDividends, refreshInterval, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchDividends,
  };
}

/**
 * Hook for popular stock tickers with optimized refresh rates
 */
export function usePopularStocks(
  limit: number = 20,
  refreshIntervalMs: number = 300000, // 5 minutes
) {
  return usePolygonTickers("stocks", limit, {
    refreshInterval: refreshIntervalMs,
    enabled: true,
  });
}