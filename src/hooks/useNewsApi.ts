import { useState, useEffect, useCallback, useRef } from "react";
import {
  newsApi,
  rateLimitedNewsApi,
  NewsAPIResponse,
  NewsAPIArticle,
  NewsApiError,
  convertNewsAPIToNewsArticle,
} from "../services/newsApi";
import { stockDataFallback } from "../services/stockDataFallback";
import { NewsArticle } from "../data/mockData";

interface UseNewsOptions {
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
}

interface UseNewsResult {
  data: NewsAPIResponse | null;
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch top headlines
 */
export function useTopHeadlines(
  country: string = "us",
  category?:
    | "business"
    | "entertainment"
    | "general"
    | "health"
    | "science"
    | "sports"
    | "technology",
  options: UseNewsOptions = {},
): UseNewsResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<NewsAPIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchNews = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Use the proxy server to fetch real news data
      const response = await fetch(
        `http://localhost:3001/api/proxy/newsapi/top-headlines?country=${country}&category=${category || "business"}&pageSize=20`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setData(data);
      stockDataFallback.setCachedData(
        `news_headlines_${country}_${category}`,
        data,
      );
    } catch (err) {
      const shouldDisableApi = stockDataFallback.handleApiError(err);

      if (!shouldDisableApi) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch news";
        setError(errorMessage);
        console.error("News fetch error:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [country, category, enabled]);

  useEffect(() => {
    if (enabled) {
      fetchNews();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchNews, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchNews, refreshInterval, enabled]);

  const articles = data
    ? data.articles.map((article) => convertNewsAPIToNewsArticle(article))
    : [];

  return {
    data,
    articles,
    loading,
    error,
    refetch: fetchNews,
  };
}

/**
 * Hook to search for news articles
 */
export function useNewsSearch(
  query: string,
  options: UseNewsOptions = {},
): UseNewsResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<NewsAPIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const searchNews = useCallback(async () => {
    if (!enabled || !query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Use the proxy server to search for real news data
      const response = await fetch(
        `http://localhost:3001/api/proxy/newsapi/everything?q=${encodeURIComponent(query)}&pageSize=20&sortBy=publishedAt`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setData(data);
      stockDataFallback.setCachedData(`news_search_${query}`, data);
    } catch (err) {
      const shouldDisableApi = stockDataFallback.handleApiError(err);

      if (!shouldDisableApi) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to search news";
        setError(errorMessage);
        console.error("News search error:", err);
      }
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
    ? data.articles.map((article) => convertNewsAPIToNewsArticle(article))
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
 * Hook for business news specifically
 */
export function useBusinessNews(options: UseNewsOptions = {}) {
  return useTopHeadlines("us", "business", options);
}

/**
 * Hook for technology news specifically
 */
export function useTechnologyNews(options: UseNewsOptions = {}) {
  return useTopHeadlines("us", "technology", options);
}

/**
 * Hook for real-time news updates
 */
export function useRealTimeNews(
  category?: "business" | "technology",
  refreshIntervalMs: number = 300000, // 5 minutes
) {
  return useTopHeadlines("us", category, {
    refreshInterval: refreshIntervalMs,
    enabled: true,
  });
}
