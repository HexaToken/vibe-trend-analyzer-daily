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

    // NewsAPI also has CORS restrictions for browser requests
    // Using mock data due to CORS limitations
    console.warn(
      "NewsAPI requires server-side implementation due to CORS restrictions. Using mock data.",
    );

    setLoading(true);
    setError(null);

    // Generate mock data that looks like real news
    const mockArticles: NewsAPIArticle[] = [
      {
        source: { id: "reuters", name: "Reuters" },
        author: "John Smith",
        title: "Markets Rally as Tech Earnings Beat Expectations",
        description:
          "Major technology companies reported stronger-than-expected quarterly earnings, driving broad market gains.",
        url: "https://example.com/tech-earnings-rally",
        urlToImage: null,
        publishedAt: new Date(
          Date.now() - Math.random() * 24 * 60 * 60 * 1000,
        ).toISOString(),
        content: "Technology stocks led broader market gains today...",
      },
      {
        source: { id: "bloomberg", name: "Bloomberg" },
        author: "Jane Doe",
        title: "Federal Reserve Signals Cautious Approach to Interest Rates",
        description:
          "Central bank officials indicate measured approach to monetary policy amid economic uncertainty.",
        url: "https://example.com/fed-interest-rates",
        urlToImage: null,
        publishedAt: new Date(
          Date.now() - Math.random() * 24 * 60 * 60 * 1000,
        ).toISOString(),
        content: "Federal Reserve officials signaled...",
      },
      {
        source: { id: "cnbc", name: "CNBC" },
        author: "Mike Johnson",
        title: "Cryptocurrency Market Shows Signs of Recovery",
        description:
          "Bitcoin and major altcoins post gains as institutional interest returns to digital assets.",
        url: "https://example.com/crypto-recovery",
        urlToImage: null,
        publishedAt: new Date(
          Date.now() - Math.random() * 24 * 60 * 60 * 1000,
        ).toISOString(),
        content: "The cryptocurrency market showed...",
      },
      {
        source: { id: "wsj", name: "Wall Street Journal" },
        author: "Sarah Wilson",
        title: "Energy Sector Faces Headwinds from Regulatory Changes",
        description:
          "New environmental regulations could impact energy company profitability and investment strategies.",
        url: "https://example.com/energy-regulations",
        urlToImage: null,
        publishedAt: new Date(
          Date.now() - Math.random() * 24 * 60 * 60 * 1000,
        ).toISOString(),
        content: "Energy companies are grappling with...",
      },
      {
        source: { id: "financial-times", name: "Financial Times" },
        author: "Robert Brown",
        title: "Global Supply Chain Disruptions Continue to Impact Markets",
        description:
          "Ongoing logistics challenges affect manufacturing and retail sectors worldwide.",
        url: "https://example.com/supply-chain-disruptions",
        urlToImage: null,
        publishedAt: new Date(
          Date.now() - Math.random() * 24 * 60 * 60 * 1000,
        ).toISOString(),
        content: "Supply chain disruptions continue...",
      },
    ];

    const mockResponse: NewsAPIResponse = {
      status: "ok",
      totalResults: mockArticles.length,
      articles: mockArticles,
    };

    setData(mockResponse);
    setError(
      "Using mock data - NewsAPI requires server-side implementation (CORS restriction)",
    );
    setLoading(false);

    // Original API call code would go here in a server-side environment
    /*
    try {
      const response = await rateLimitedNewsApi.getTopHeadlines(country, category, 10);
      setData(response);
      stockDataFallback.setCachedData(`news_headlines_${country}_${category}`, response);
    } catch (err) {
      const shouldDisableApi = stockDataFallback.handleApiError(err);
      
      if (!shouldDisableApi) {
        const errorMessage = err instanceof NewsApiError 
          ? err.message 
          : 'Failed to fetch news';
        setError(errorMessage);
        console.error('News fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
    */
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

    // NewsAPI has CORS restrictions, using mock data
    console.warn(
      "NewsAPI requires server-side implementation due to CORS restrictions. Using mock data.",
    );

    setLoading(true);
    setError(null);

    // Generate mock search results based on query
    const mockArticles: NewsAPIArticle[] = [
      {
        source: { id: "reuters", name: "Reuters" },
        author: "News Reporter",
        title: `Latest developments in ${query}: Market Analysis`,
        description: `Comprehensive analysis of recent ${query} trends and their market impact.`,
        url: `https://example.com/${query.replace(/\s+/g, "-").toLowerCase()}`,
        urlToImage: null,
        publishedAt: new Date(
          Date.now() - Math.random() * 12 * 60 * 60 * 1000,
        ).toISOString(),
        content: `Recent developments in ${query}...`,
      },
      {
        source: { id: "bloomberg", name: "Bloomberg" },
        author: "Market Analyst",
        title: `${query} Outlook: Expert Predictions and Analysis`,
        description: `Industry experts weigh in on the future prospects of ${query} in current market conditions.`,
        url: `https://example.com/${query.replace(/\s+/g, "-").toLowerCase()}-outlook`,
        urlToImage: null,
        publishedAt: new Date(
          Date.now() - Math.random() * 18 * 60 * 60 * 1000,
        ).toISOString(),
        content: `Experts predict that ${query}...`,
      },
    ];

    const mockResponse: NewsAPIResponse = {
      status: "ok",
      totalResults: mockArticles.length,
      articles: mockArticles,
    };

    setData(mockResponse);
    setError(
      "Using mock data - NewsAPI requires server-side implementation (CORS restriction)",
    );
    setLoading(false);
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
