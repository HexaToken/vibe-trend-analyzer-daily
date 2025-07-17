import { useState, useEffect, useCallback, useRef } from "react";
import {
  rateLimitedGoogleFinanceApi,
  GoogleFinanceResponse,
  GoogleFinanceMarketData,
  GoogleFinanceApiError,
} from "../services/googleFinanceApi";
import { stockDataFallback } from "../services/stockDataFallback";

interface UseGoogleFinanceOptions {
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
}

interface UseGoogleFinanceResult {
  data: GoogleFinanceResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch stock quote from Google Finance via SerpAPI
 */
export function useGoogleFinanceQuote(
  symbol: string,
  options: UseGoogleFinanceOptions = {},
): UseGoogleFinanceResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<GoogleFinanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchQuote = useCallback(async () => {
    if (!enabled || !symbol.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Check if API is disabled
      if (stockDataFallback.isApiDisabled()) {
        const cached = stockDataFallback.getCachedData(`google_finance_${symbol}`);
        if (cached) {
          setData(cached);
          return;
        }
        
        // Create mock data
        const mockData: GoogleFinanceResponse = {
          search_metadata: {
            id: `mock_${symbol}`,
            status: "Success",
            json_endpoint: "",
            created_at: new Date().toISOString(),
            processed_at: new Date().toISOString(),
            google_finance_url: `https://www.google.com/finance/quote/${symbol}`,
            raw_html_file: "",
            total_time_taken: 0.1,
          },
          search_parameters: {
            engine: "google_finance",
            q: symbol,
            gl: "us",
            hl: "en",
          },
          summary: {
            symbol: symbol,
            name: `${symbol} Inc.`,
            price: Math.random() * 1000 + 50,
            change: (Math.random() - 0.5) * 20,
            change_percent: (Math.random() - 0.5) * 5,
            currency: "USD",
            market: "US",
            exchange: "NASDAQ",
            timezone: "EST",
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString(),
            previous_close: Math.random() * 1000 + 50,
            open: Math.random() * 1000 + 50,
            high: Math.random() * 1000 + 60,
            low: Math.random() * 1000 + 40,
            volume: Math.floor(Math.random() * 10000000),
            market_cap: `${(Math.random() * 1000 + 100).toFixed(1)}B`,
            pe_ratio: Math.random() * 30 + 10,
            div_yield: Math.random() * 5 + 1,
            week_52_high: Math.random() * 1000 + 100,
            week_52_low: Math.random() * 1000 + 20,
          },
        };
        
        setData(mockData);
        stockDataFallback.setCachedData(`google_finance_${symbol}`, mockData);
        return;
      }

      // Use the proxy server to fetch real data via SerpAPI
      const response = await fetch(
        `/api/proxy/serpapi/google-finance?symbol=${encodeURIComponent(symbol)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData = await response.json();
      setData(apiData);
      stockDataFallback.setCachedData(`google_finance_${symbol}`, apiData);
    } catch (err) {
      console.warn("Google Finance API proxy failed, falling back to mock data:", err);
      
      // Handle API errors and potentially disable the API
      if (err instanceof GoogleFinanceApiError) {
        const shouldDisableApi = stockDataFallback.handleApiError(err);
        if (shouldDisableApi) {
          setError("API temporarily disabled due to rate limits. Using cached data.");
        } else {
          setError(err.message);
        }
      } else {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      }

      // Fallback to mock data
      const mockData: GoogleFinanceResponse = {
        search_metadata: {
          id: `mock_${symbol}`,
          status: "Success",
          json_endpoint: "",
          created_at: new Date().toISOString(),
          processed_at: new Date().toISOString(),
          google_finance_url: `https://www.google.com/finance/quote/${symbol}`,
          raw_html_file: "",
          total_time_taken: 0.1,
        },
        search_parameters: {
          engine: "google_finance",
          q: symbol,
          gl: "us",
          hl: "en",
        },
        summary: {
          symbol: symbol,
          name: `${symbol} Inc.`,
          price: Math.random() * 1000 + 50,
          change: (Math.random() - 0.5) * 20,
          change_percent: (Math.random() - 0.5) * 5,
          currency: "USD",
          market: "US",
          exchange: "NASDAQ",
          timezone: "EST",
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(),
          previous_close: Math.random() * 1000 + 50,
          open: Math.random() * 1000 + 50,
          high: Math.random() * 1000 + 60,
          low: Math.random() * 1000 + 40,
          volume: Math.floor(Math.random() * 10000000),
          market_cap: `${(Math.random() * 1000 + 100).toFixed(1)}B`,
          pe_ratio: Math.random() * 30 + 10,
          div_yield: Math.random() * 5 + 1,
          week_52_high: Math.random() * 1000 + 100,
          week_52_low: Math.random() * 1000 + 20,
        },
      };
      
      setData(mockData);
      stockDataFallback.setCachedData(`google_finance_${symbol}`, mockData);
    } finally {
      setLoading(false);
    }
  }, [symbol, enabled]);

  const refetch = useCallback(async () => {
    await fetchQuote();
  }, [fetchQuote]);

  useEffect(() => {
    if (enabled && symbol.trim()) {
      fetchQuote();
    }
  }, [fetchQuote, enabled, symbol]);

  useEffect(() => {
    if (refreshInterval > 0 && enabled) {
      intervalRef.current = setInterval(fetchQuote, refreshInterval);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [fetchQuote, refreshInterval, enabled]);

  return { data, loading, error, refetch };
}

/**
 * Hook to search stocks using Google Finance via SerpAPI
 */
export function useGoogleFinanceSearch(
  query: string,
  options: UseGoogleFinanceOptions = {},
): UseGoogleFinanceResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<GoogleFinanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const searchStocks = useCallback(async () => {
    if (!enabled || !query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Check if API is disabled
      if (stockDataFallback.isApiDisabled()) {
        const cached = stockDataFallback.getCachedData(`google_finance_search_${query}`);
        if (cached) {
          setData(cached);
          return;
        }
      }

      // Use the proxy server to search via SerpAPI
      const response = await fetch(
        `/api/proxy/serpapi/google-finance-search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData = await response.json();
      setData(apiData);
      stockDataFallback.setCachedData(`google_finance_search_${query}`, apiData);
    } catch (err) {
      console.warn("Google Finance search proxy failed, falling back to mock data:", err);
      
      if (err instanceof GoogleFinanceApiError) {
        const shouldDisableApi = stockDataFallback.handleApiError(err);
        if (shouldDisableApi) {
          setError("API temporarily disabled due to rate limits. Using cached data.");
        } else {
          setError(err.message);
        }
      } else {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      }

      // Fallback to mock search results
      const mockData: GoogleFinanceResponse = {
        search_metadata: {
          id: `mock_search_${query}`,
          status: "Success",
          json_endpoint: "",
          created_at: new Date().toISOString(),
          processed_at: new Date().toISOString(),
          google_finance_url: `https://www.google.com/finance/search?q=${query}`,
          raw_html_file: "",
          total_time_taken: 0.1,
        },
        search_parameters: {
          engine: "google_finance",
          q: query,
          gl: "us",
          hl: "en",
        },
        markets: {
          "US": [
            {
              symbol: "AAPL",
              name: "Apple Inc.",
              price: 195.25,
              change: 2.75,
              change_percent: 1.43,
              currency: "USD",
              market: "US",
              exchange: "NASDAQ",
              timezone: "EST",
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString(),
            },
            {
              symbol: "GOOGL",
              name: "Alphabet Inc.",
              price: 2845.50,
              change: -15.25,
              change_percent: -0.53,
              currency: "USD",
              market: "US",
              exchange: "NASDAQ",
              timezone: "EST",
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString(),
            },
          ],
        },
      };
      
      setData(mockData);
      stockDataFallback.setCachedData(`google_finance_search_${query}`, mockData);
    } finally {
      setLoading(false);
    }
  }, [query, enabled]);

  const refetch = useCallback(async () => {
    await searchStocks();
  }, [searchStocks]);

  useEffect(() => {
    if (enabled && query.trim()) {
      searchStocks();
    }
  }, [searchStocks, enabled, query]);

  useEffect(() => {
    if (refreshInterval > 0 && enabled) {
      intervalRef.current = setInterval(searchStocks, refreshInterval);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [searchStocks, refreshInterval, enabled]);

  return { data, loading, error, refetch };
}

/**
 * Hook to get trending stocks from Google Finance via SerpAPI
 */
export function useGoogleFinanceTrending(
  options: UseGoogleFinanceOptions = {},
): UseGoogleFinanceResult {
  const { refreshInterval = 180000, enabled = true } = options; // 3 minutes default
  const [data, setData] = useState<GoogleFinanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchTrending = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Check if API is disabled
      if (stockDataFallback.isApiDisabled()) {
        const cached = stockDataFallback.getCachedData("google_finance_trending");
        if (cached) {
          setData(cached);
          return;
        }
      }

      // Use the proxy server to fetch trending data via SerpAPI
      const response = await fetch("/api/proxy/serpapi/google-finance-trending");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData = await response.json();
      setData(apiData);
      stockDataFallback.setCachedData("google_finance_trending", apiData);
    } catch (err) {
      console.warn("Google Finance trending proxy failed, falling back to mock data:", err);
      
      if (err instanceof GoogleFinanceApiError) {
        const shouldDisableApi = stockDataFallback.handleApiError(err);
        if (shouldDisableApi) {
          setError("API temporarily disabled due to rate limits. Using cached data.");
        } else {
          setError(err.message);
        }
      } else {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      }

      // Fallback to mock trending data
      const mockData: GoogleFinanceResponse = {
        search_metadata: {
          id: "mock_trending",
          status: "Success",
          json_endpoint: "",
          created_at: new Date().toISOString(),
          processed_at: new Date().toISOString(),
          google_finance_url: "https://www.google.com/finance/trending",
          raw_html_file: "",
          total_time_taken: 0.1,
        },
        search_parameters: {
          engine: "google_finance",
          q: "trending",
          gl: "us",
          hl: "en",
        },
        markets: {
          "Trending": [
            {
              symbol: "AAPL",
              name: "Apple Inc.",
              price: 195.25,
              change: 2.75,
              change_percent: 1.43,
              currency: "USD",
              market: "US",
              exchange: "NASDAQ",
              timezone: "EST",
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString(),
            },
            {
              symbol: "TSLA",
              name: "Tesla, Inc.",
              price: 248.50,
              change: -8.25,
              change_percent: -3.21,
              currency: "USD",
              market: "US",
              exchange: "NASDAQ",
              timezone: "EST",
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString(),
            },
          ],
        },
      };
      
      setData(mockData);
      stockDataFallback.setCachedData("google_finance_trending", mockData);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  const refetch = useCallback(async () => {
    await fetchTrending();
  }, [fetchTrending]);

  useEffect(() => {
    if (enabled) {
      fetchTrending();
    }
  }, [fetchTrending, enabled]);

  useEffect(() => {
    if (refreshInterval > 0 && enabled) {
      intervalRef.current = setInterval(fetchTrending, refreshInterval);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [fetchTrending, refreshInterval, enabled]);

  return { data, loading, error, refetch };
}