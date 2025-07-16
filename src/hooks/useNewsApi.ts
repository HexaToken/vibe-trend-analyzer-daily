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
  isRealData: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch top headlines
 * Tries proxy API first, falls back to mock data
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
  const [isRealData, setIsRealData] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchNews = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Try to fetch real data via proxy
      const response = await newsApi.getTopHeadlines(country, category, 20, 1);
      setData(response);
      setIsRealData(true);
      setError(null);
      console.log("✅ NewsAPI: Using real data via proxy");
    } catch (err) {
      console.warn("⚠️ NewsAPI failed, using mock data:", err);

      // Fall back to mock data
      const mockNews = stockDataFallback.getMockNews();
      const mockArticles = category
        ? mockNews.filter((news) => {
            const categoryKeywords: Record<string, string[]> = {
              business: [
                "market",
                "stock",
                "financial",
                "economic",
                "business",
              ],
              technology: ["tech", "AI", "software", "digital", "innovation"],
              general: ["news", "update", "report", "analysis"],
            };
            const keywords = categoryKeywords[category] || [];
            return keywords.some(
              (keyword) =>
                news.headline.toLowerCase().includes(keyword) ||
                news.summary.toLowerCase().includes(keyword),
            );
          })
        : mockNews;

      const mockData: NewsAPIResponse = {
        status: "ok",
        totalResults: mockArticles.length,
        articles: mockArticles.map((article) => ({
          source: {
            id: null,
            name: article.source.name,
          },
          author: "Mock Author",
          title: article.headline,
          description: article.summary,
          url: article.originalUrl || `https://example.com/news/${article.id}`,
          urlToImage: null,
          publishedAt: article.source.publishedAt,
          content: article.summary + "...",
        })),
      };

      setData(mockData);
      setIsRealData(false);
      setError(
        `Using mock data - ${err instanceof Error ? err.message : "API unavailable"}`,
      );
    }

    setLoading(false);
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

  const articles = data ? data.articles.map(convertNewsAPIToNewsArticle) : [];

  return {
    data,
    articles,
    loading,
    error,
    isRealData,
    refetch: fetchNews,
  };
}

/**
 * Hook to search for news articles
 * Tries proxy API first, falls back to mock data
 */
export function useNewsSearch(
  query: string,
  sortBy: "relevancy" | "popularity" | "publishedAt" = "publishedAt",
  options: UseNewsOptions = {},
): UseNewsResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<NewsAPIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const searchNews = useCallback(async () => {
    if (!enabled || !query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Try to fetch real data via proxy
      const response = await newsApi.searchNews(query, sortBy, 20, 1);
      setData(response);
      setIsRealData(true);
      setError(null);
      console.log("✅ NewsAPI: Using real data via proxy");
    } catch (err) {
      console.warn("⚠️ NewsAPI search failed, using mock data:", err);

      // Fall back to filtered mock data
      const mockNews = stockDataFallback.getMockNews();
      const searchTerms = query.toLowerCase().split(" ");
      const filteredNews = mockNews.filter((article) =>
        searchTerms.some(
          (term) =>
            article.headline.toLowerCase().includes(term) ||
            article.summary.toLowerCase().includes(term),
        ),
      );

      const mockData: NewsAPIResponse = {
        status: "ok",
        totalResults: filteredNews.length,
        articles: filteredNews.map((article) => ({
          source: {
            id: null,
            name: article.source.name,
          },
          author: "Mock Author",
          title: article.headline,
          description: article.summary,
          url: article.originalUrl || `https://example.com/news/${article.id}`,
          urlToImage: null,
          publishedAt: article.source.publishedAt,
          content: article.summary + "...",
        })),
      };

      setData(mockData);
      setIsRealData(false);
      setError(
        `Using mock data - ${err instanceof Error ? err.message : "API unavailable"}`,
      );
    }

    setLoading(false);
  }, [query, sortBy, enabled]);

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

  const articles = data ? data.articles.map(convertNewsAPIToNewsArticle) : [];

  return {
    data,
    articles,
    loading,
    error,
    isRealData,
    refetch: searchNews,
  };
}

/**
 * Hook for business news specifically
 */
export function useBusinessNews(
  refreshIntervalMs: number = 300000, // 5 minutes
  options: UseNewsOptions = {},
) {
  return useTopHeadlines("us", "business", {
    ...options,
    refreshInterval: refreshIntervalMs,
  });
}

/**
 * Hook for technology news specifically
 */
export function useTechnologyNews(
  refreshIntervalMs: number = 300000, // 5 minutes
  options: UseNewsOptions = {},
) {
  return useTopHeadlines("us", "technology", {
    ...options,
    refreshInterval: refreshIntervalMs,
  });
}

/**
 * Hook for general financial news search
 */
export function useFinancialNews(
  searchQuery: string = "financial markets",
  refreshIntervalMs: number = 300000, // 5 minutes
  options: UseNewsOptions = {},
) {
  return useNewsSearch(searchQuery, "publishedAt", {
    ...options,
    refreshInterval: refreshIntervalMs,
  });
}
