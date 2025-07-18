import { useState, useEffect, useCallback, useRef } from "react";
import {
  CoinMarketCapListingsResponse,
  CoinMarketCapQuotesResponse,
  CoinMarketCapCryptocurrency,
  CoinMarketCapApiError,
  convertCMCToTicker,
  convertMultipleCMCToTickers,
} from "../services/coinMarketCapApi";
import { stockDataFallback } from "../services/stockDataFallback";
import { Ticker } from "../types/social";

interface UseCryptoOptions {
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
}

interface UseCryptoQuotesResult {
  data: CoinMarketCapQuotesResponse | null;
  tickers: Ticker[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseCryptoListingsResult {
  data: CoinMarketCapListingsResponse | null;
  tickers: Ticker[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseGlobalMetricsResult {
  data: any | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch cryptocurrency quotes by symbols
 * Note: CoinMarketCap API has CORS restrictions, so this uses mock data in browser environment
 */
export function useCryptoQuotes(
  symbols: string[],
  options: UseCryptoOptions = {},
): UseCryptoQuotesResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<CoinMarketCapQuotesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchQuotes = useCallback(async () => {
    if (!enabled || symbols.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Use the CoinMarketCap service which now proxies through our server
      const { coinMarketCapApi } = await import("../services/coinMarketCapApi");
      const response = await coinMarketCapApi.getQuotesBySymbol(symbols);

      setData(response);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch crypto quotes:", error);

      // Handle circuit breaker errors specifically
      if (
        error instanceof Error &&
        error.message.includes("Circuit breaker is open")
      ) {
        setError(
          "CoinMarketCap API temporarily unavailable (rate limited). Using mock data.",
        );
        console.warn(
          "CoinMarketCap circuit breaker is open, falling back to mock data",
        );
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch crypto data",
        );
      }

      // Fallback to mock data if API fails
      const mockTickers = stockDataFallback.getMockTickers(symbols);
      const mockData: CoinMarketCapQuotesResponse = {
        status: {
          timestamp: new Date().toISOString(),
          error_code: 0,
          error_message: null,
          elapsed: 0,
          credit_count: 0,
          notice: null,
        },
        data: {},
      };

      mockTickers.forEach((ticker) => {
        if (ticker.type === "crypto" || symbols.includes(ticker.symbol)) {
          mockData.data[ticker.symbol] = {
            id: Math.floor(Math.random() * 10000),
            name: ticker.name,
            symbol: ticker.symbol,
            slug: ticker.symbol.toLowerCase(),
            num_market_pairs: Math.floor(Math.random() * 1000),
            date_added: "2021-01-01T00:00:00.000Z",
            tags: ["cryptocurrency"],
            max_supply: 0,
            circulating_supply: Math.floor(Math.random() * 1000000000),
            total_supply: Math.floor(Math.random() * 1000000000),
            is_active: 1,
            is_fiat: 0,
            cmc_rank: Math.floor(Math.random() * 100) + 1,
            last_updated: new Date().toISOString(),
            quote: {
              USD: {
                price: ticker.price,
                volume_24h: ticker.volume,
                volume_change_24h: (Math.random() - 0.5) * 20,
                percent_change_1h: (Math.random() - 0.5) * 5,
                percent_change_24h: ticker.changePercent,
                percent_change_7d: (Math.random() - 0.5) * 30,
                percent_change_30d: (Math.random() - 0.5) * 50,
                percent_change_60d: (Math.random() - 0.5) * 80,
                percent_change_90d: (Math.random() - 0.5) * 100,
                market_cap: ticker.marketCap || ticker.price * 1000000,
                market_cap_dominance: Math.random() * 50,
                fully_diluted_market_cap:
                  (ticker.marketCap || ticker.price * 1000000) * 1.1,
                tvl: 0,
                last_updated: new Date().toISOString(),
              },
            },
          };
        }
      });

      setData(mockData);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch cryptocurrency data - using fallback data",
      );
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

  const tickers = data
    ? convertMultipleCMCToTickers(Object.values(data.data))
    : [];

  return {
    data,
    tickers,
    loading,
    error,
    refetch: fetchQuotes,
  };
}

/**
 * Hook to fetch top cryptocurrency listings
 * Note: CoinMarketCap API has CORS restrictions, so this uses mock data in browser environment
 */
export function useCryptoListings(
  limit: number = 20,
  options: UseCryptoOptions = {},
): UseCryptoListingsResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<CoinMarketCapListingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchListings = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Use the CoinMarketCap service which now proxies through our server
      const { coinMarketCapApi } = await import("../services/coinMarketCapApi");
      const response = await coinMarketCapApi.getListingsLatest(1, limit);

      setData(response);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch crypto listings:", error);

      // Fallback to mock data if API fails
      const cryptoSymbols = [
        "BTC",
        "ETH",
        "BNB",
        "XRP",
        "ADA",
        "SOL",
        "DOT",
        "DOGE",
        "AVAX",
        "SHIB",
        "MATIC",
        "LINK",
        "UNI",
        "LTC",
        "BCH",
        "ATOM",
        "ICP",
        "NEAR",
        "ALGO",
        "FTM",
      ];
      const mockTickers = stockDataFallback.getMockTickers(
        cryptoSymbols.slice(0, limit),
      );
      const mockData: CoinMarketCapListingsResponse = {
        status: {
          timestamp: new Date().toISOString(),
          error_code: 0,
          error_message: null,
          elapsed: 0,
          credit_count: 0,
          notice: null,
        },
        data: mockTickers.map((ticker, index) => ({
          id: index + 1,
          name: ticker.name,
          symbol: ticker.symbol,
          slug: ticker.symbol.toLowerCase(),
          num_market_pairs: Math.floor(Math.random() * 1000),
          date_added: "2021-01-01T00:00:00.000Z",
          tags: ["cryptocurrency"],
          max_supply: 0,
          circulating_supply: Math.floor(Math.random() * 1000000000),
          total_supply: Math.floor(Math.random() * 1000000000),
          is_active: 1,
          is_fiat: 0,
          cmc_rank: index + 1,
          last_updated: new Date().toISOString(),
          quote: {
            USD: {
              price: ticker.price,
              volume_24h: ticker.volume,
              volume_change_24h: (Math.random() - 0.5) * 20,
              percent_change_1h: (Math.random() - 0.5) * 5,
              percent_change_24h: ticker.changePercent,
              percent_change_7d: (Math.random() - 0.5) * 30,
              percent_change_30d: (Math.random() - 0.5) * 50,
              percent_change_60d: (Math.random() - 0.5) * 80,
              percent_change_90d: (Math.random() - 0.5) * 100,
              market_cap: ticker.marketCap || ticker.price * 1000000,
              market_cap_dominance: Math.random() * 50,
              fully_diluted_market_cap:
                (ticker.marketCap || ticker.price * 1000000) * 1.1,
              tvl: 0,
              last_updated: new Date().toISOString(),
            },
          },
        })),
      };

      setData(mockData);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch cryptocurrency listings - using fallback data",
      );
    } finally {
      setLoading(false);
    }
  }, [limit, enabled]);

  useEffect(() => {
    if (enabled) {
      fetchListings();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchListings, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchListings, refreshInterval, enabled]);

  const tickers = data ? convertMultipleCMCToTickers(data.data) : [];

  return {
    data,
    tickers,
    loading,
    error,
    refetch: fetchListings,
  };
}

/**
 * Hook to fetch global cryptocurrency market metrics
 * Note: CoinMarketCap API has CORS restrictions, so this uses mock data in browser environment
 */
export function useGlobalMetrics(
  options: UseCryptoOptions = {},
): UseGlobalMetricsResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchMetrics = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Use the CoinMarketCap service which now proxies through our server
      const { coinMarketCapApi } = await import("../services/coinMarketCapApi");
      const response = await coinMarketCapApi.getGlobalMetrics();

      setData(response);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch global metrics:", error);

      // Fallback to mock data if API fails
      const mockData = {
        status: {
          timestamp: new Date().toISOString(),
          error_code: 0,
          error_message: null,
          elapsed: 0,
          credit_count: 0,
          notice: null,
        },
        data: {
          active_cryptocurrencies: 26950,
          total_cryptocurrencies: 26950,
          active_market_pairs: 95468,
          active_exchanges: 756,
          total_exchanges: 756,
          eth_dominance: 17.8234,
          btc_dominance: 52.1456,
          defi_volume_24h: 4567890123,
          defi_market_cap: 123456789012,
          stablecoin_volume_24h: 45678901234,
          stablecoin_market_cap: 156789012345,
          quote: {
            USD: {
              total_market_cap: 2387654321098,
              total_volume_24h: 98765432109,
              total_market_cap_yesterday_percentage_change: 2.45,
              total_volume_24h_yesterday_percentage_change: -1.23,
              last_updated: new Date().toISOString(),
            },
          },
        },
      };

      setData(mockData);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch global metrics - using fallback data",
      );
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      fetchMetrics();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchMetrics, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchMetrics, refreshInterval, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchMetrics,
  };
}

/**
 * Hook for popular cryptocurrencies with real-time updates
 */
export function usePopularCryptos(
  limit: number = 10,
  refreshIntervalMs: number = 300000, // 5 minutes
) {
  return useCryptoListings(limit, {
    refreshInterval: refreshIntervalMs,
    enabled: true,
  });
}

/**
 * Hook for specific crypto quotes with real-time updates
 */
export function useRealTimeCryptos(
  symbols: string[],
  refreshIntervalMs: number = 300000, // 5 minutes
) {
  return useCryptoQuotes(symbols, {
    refreshInterval: refreshIntervalMs,
    enabled: symbols.length > 0,
  });
}
