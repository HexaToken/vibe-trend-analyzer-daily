import { useQuery, UseQueryResult } from "@tanstack/react-query";

// YCNBC News Article Interface
export interface YCNBCArticle {
  id: string;
  headline: string;
  url: string;
  time?: string;
  source: string;
  sentiment_score: number;
}

// YCNBC News Response Interface
export interface YCNBCNewsResponse {
  status: string;
  source: string;
  total: number;
  articles: YCNBCArticle[];
  error?: string;
}

// YCNBC Sentiment Response Interface
export interface YCNBCSentimentResponse {
  status: string;
  source: string;
  sentiment_score: number;
  article_count: number;
  raw_sentiment: number;
  latest_articles: YCNBCArticle[];
  trending_articles: YCNBCArticle[];
  error?: string;
}

// Hook for fetching latest CNBC news
export function useYCNBCLatestNews(refreshInterval: number = 300000): UseQueryResult<YCNBCNewsResponse> {
  return useQuery({
    queryKey: ["ycnbc", "news", "latest"],
    queryFn: async (): Promise<YCNBCNewsResponse> => {
      const response = await fetch("/api/proxy/ycnbc/news/latest");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    refetchInterval: refreshInterval,
    staleTime: 240000, // 4 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for fetching CNBC trending news
export function useYCNBCTrendingNews(refreshInterval: number = 300000): UseQueryResult<YCNBCNewsResponse> {
  return useQuery({
    queryKey: ["ycnbc", "news", "trending"],
    queryFn: async (): Promise<YCNBCNewsResponse> => {
      const response = await fetch("/api/proxy/ycnbc/news/trending");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    refetchInterval: refreshInterval,
    staleTime: 240000, // 4 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for fetching enhanced CNBC sentiment data
export function useYCNBCSentiment(refreshInterval: number = 300000): UseQueryResult<YCNBCSentimentResponse> {
  return useQuery({
    queryKey: ["ycnbc", "sentiment"],
    queryFn: async (): Promise<YCNBCSentimentResponse> => {
      const response = await fetch("/api/proxy/ycnbc/sentiment");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    refetchInterval: refreshInterval,
    staleTime: 240000, // 4 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Combined hook for all YCNBC data
export function useYCNBCData(refreshInterval: number = 300000) {
  const latestNews = useYCNBCLatestNews(refreshInterval);
  const trendingNews = useYCNBCTrendingNews(refreshInterval);
  const sentiment = useYCNBCSentiment(refreshInterval);

  return {
    latestNews,
    trendingNews,
    sentiment,
    isLoading: latestNews.isLoading || trendingNews.isLoading || sentiment.isLoading,
    isError: latestNews.isError || trendingNews.isError || sentiment.isError,
    hasData: latestNews.data || trendingNews.data || sentiment.data,
  };
}