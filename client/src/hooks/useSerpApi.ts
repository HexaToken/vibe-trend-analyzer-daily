import { useState, useEffect, useCallback, useRef } from "react";
import {
  serpNewsApi,
  rateLimitedSerpNewsApi,
  SerpApiResponse,
  SerpNewsArticle,
  SerpApiError,
  convertSerpToNewsArticle,
} from "../services/serpApi";
import { stockDataFallback } from "../services/stockDataFallback";
import { NewsArticle } from "../data/mockData";

interface UseSerpNewsOptions {
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
}

interface UseSerpNewsResult {
  data: SerpApiResponse | null;
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to search Google News via SerpAPI
 */
export function useSerpNewsSearch(
  query: string,
  options: UseSerpNewsOptions = {},
): UseSerpNewsResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<SerpApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const searchNews = useCallback(async () => {
    if (!enabled || !query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Use the proxy server to search for real news data via SerpAPI
      const response = await fetch(
        `/api/proxy/serpapi/search?q=${encodeURIComponent(query)}&num=20`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setData(data);
      stockDataFallback.setCachedData(`serp_search_${query}`, data);
    } catch (err) {
      console.warn(
        "SerpAPI search proxy failed, falling back to mock data:",
        err,
      );

      // Fallback to mock search results
      const mockArticles: SerpNewsArticle[] = [
        {
          position: 1,
          title: `Breaking: Latest ${query} News and Market Impact`,
          link: `https://example.com/${query.replace(/\s+/g, "-").toLowerCase()}`,
          source: "Reuters",
          date: new Date(
            Date.now() - Math.random() * 12 * 60 * 60 * 1000,
          ).toISOString(),
          snippet: `Latest developments and analysis regarding ${query} and its impact on financial markets.`,
          thumbnail: null,
        },
        {
          position: 2,
          title: `${query} Market Analysis: Expert Insights`,
          link: `https://example.com/${query.replace(/\s+/g, "-").toLowerCase()}-analysis`,
          source: "Bloomberg",
          date: new Date(
            Date.now() - Math.random() * 18 * 60 * 60 * 1000,
          ).toISOString(),
          snippet: `Industry experts provide comprehensive analysis of ${query} trends and future outlook.`,
          thumbnail: null,
        },
        {
          position: 3,
          title: `${query} Update: Key Developments Today`,
          link: `https://example.com/${query.replace(/\s+/g, "-").toLowerCase()}-update`,
          source: "CNBC",
          date: new Date(
            Date.now() - Math.random() * 6 * 60 * 60 * 1000,
          ).toISOString(),
          snippet: `Key developments and updates in the ${query} sector affecting investors and stakeholders.`,
          thumbnail: null,
        },
      ];

      const mockResponse: SerpApiResponse = {
        search_metadata: {
          id: `mock_${Date.now()}`,
          status: "Success",
          json_endpoint: "",
          created_at: new Date().toISOString(),
          processed_at: new Date().toISOString(),
          google_news_url: "",
          raw_html_file: "",
          total_time_taken: 0.1,
        },
        search_parameters: {
          engine: "google_news",
          q: query,
          gl: "us",
          hl: "en",
        },
        search_information: {
          total_results: mockArticles.length,
          time_taken_displayed: 0.1,
          query_displayed: query,
        },
        news_results: mockArticles,
      };

      setData(mockResponse);
      setError("Using mock data - SerpAPI proxy unavailable");
    } finally {
      setLoading(false);
    }
  }, [query, enabled]);

  useEffect(() => {
    if (enabled && query.trim()) {
      searchNews();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(searchNews, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [searchNews, refreshInterval, enabled]);

  const articles = data
    ? data.news_results.map((article) => convertSerpToNewsArticle(article))
    : [];

  return {
    data,
    articles,
    loading,
    error,
    refetch: searchNews,
  };
}

/**
 * Hook to get top news via SerpAPI
 */
export function useSerpTopNews(
  options: UseSerpNewsOptions = {},
): UseSerpNewsResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<SerpApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchTopNews = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Use the proxy server to fetch top news via SerpAPI
      const response = await fetch(
        `/api/proxy/serpapi/search?q=top%20news&num=20`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setData(data);
      stockDataFallback.setCachedData("serp_top_news", data);
    } catch (err) {
      console.warn(
        "SerpAPI top news proxy failed, falling back to mock data:",
        err,
      );

      // Fallback to mock top news
      const mockArticles: SerpNewsArticle[] = [
        {
          position: 1,
          title: "Global Markets Rally as Economic Data Shows Positive Trends",
          link: "https://example.com/markets-rally",
          source: "Reuters",
          date: new Date(
            Date.now() - Math.random() * 4 * 60 * 60 * 1000,
          ).toISOString(),
          snippet:
            "Major stock indices post gains following release of encouraging economic indicators across multiple sectors.",
          thumbnail: null,
        },
        {
          position: 2,
          title: "Technology Sector Leads Innovation with New AI Breakthroughs",
          link: "https://example.com/tech-ai-breakthrough",
          source: "TechCrunch",
          date: new Date(
            Date.now() - Math.random() * 8 * 60 * 60 * 1000,
          ).toISOString(),
          snippet:
            "Leading technology companies announce significant advances in artificial intelligence capabilities.",
          thumbnail: null,
        },
        {
          position: 3,
          title: "Federal Reserve Maintains Current Interest Rate Policy",
          link: "https://example.com/fed-rates",
          source: "Bloomberg",
          date: new Date(
            Date.now() - Math.random() * 12 * 60 * 60 * 1000,
          ).toISOString(),
          snippet:
            "Central bank officials signal continued monitoring of economic conditions before next policy adjustment.",
          thumbnail: null,
        },
      ];

      const mockResponse: SerpApiResponse = {
        search_metadata: {
          id: `mock_top_${Date.now()}`,
          status: "Success",
          json_endpoint: "",
          created_at: new Date().toISOString(),
          processed_at: new Date().toISOString(),
          google_news_url: "",
          raw_html_file: "",
          total_time_taken: 0.1,
        },
        search_parameters: {
          engine: "google_news",
          q: "top news",
          gl: "us",
          hl: "en",
        },
        search_information: {
          total_results: mockArticles.length,
          time_taken_displayed: 0.1,
          query_displayed: "top news",
        },
        news_results: mockArticles,
      };

      setData(mockResponse);
      setError("Using mock data - SerpAPI proxy unavailable");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      fetchTopNews();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchTopNews, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchTopNews, refreshInterval, enabled]);

  const articles = data
    ? data.news_results.map((article) => convertSerpToNewsArticle(article))
    : [];

  return {
    data,
    articles,
    loading,
    error,
    refetch: fetchTopNews,
  };
}

/**
 * Hook for business news via SerpAPI
 */
export function useSerpBusinessNews(options: UseSerpNewsOptions = {}) {
  return useSerpNewsSearch("business news", options);
}

/**
 * Hook for technology news via SerpAPI
 */
export function useSerpTechnologyNews(options: UseSerpNewsOptions = {}) {
  return useSerpNewsSearch("technology news", options);
}

/**
 * Hook for cryptocurrency news via SerpAPI
 */
export function useSerpCryptoNews(options: UseSerpNewsOptions = {}) {
  return useSerpNewsSearch("cryptocurrency bitcoin", options);
}

/**
 * Hook for real-time news updates via SerpAPI
 */
export function useSerpRealTimeNews(
  query?: string,
  refreshIntervalMs: number = 300000, // 5 minutes
) {
  if (query) {
    return useSerpNewsSearch(query, {
      refreshInterval: refreshIntervalMs,
      enabled: true,
    });
  }

  return useSerpTopNews({
    refreshInterval: refreshIntervalMs,
    enabled: true,
  });
}
