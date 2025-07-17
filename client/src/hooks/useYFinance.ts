import { useQuery, UseQueryResult } from "@tanstack/react-query";

// YFinance Article Interface
export interface YFinanceArticle {
  id: string;
  headline: string;
  url: string;
  time?: string;
  source: string;
  sentiment_score: number;
  symbol?: string;
}

// YFinance News Response Interface
export interface YFinanceNewsResponse {
  status: string;
  source: string;
  total: number;
  articles: YFinanceArticle[];
  error?: string;
}

// YFinance Sentiment Response Interface
export interface YFinanceSentimentResponse {
  status: string;
  source: string;
  sentiment_score: number;
  article_count: number;
  raw_sentiment: number;
  latest_articles: YFinanceArticle[];
  trending_articles: YFinanceArticle[];
  error?: string;
}

// Hook for fetching latest market news
export function useYFinanceLatestNews(refreshInterval: number = 300000): UseQueryResult<YFinanceNewsResponse> {
  return useQuery({
    queryKey: ["yfinance", "news", "latest"],
    queryFn: async (): Promise<YFinanceNewsResponse> => {
      const response = await fetch("/api/proxy/yfinance/news/latest", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
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

// Hook for fetching stock-specific news
export function useYFinanceStockNews(symbol: string = "SPY", refreshInterval: number = 300000): UseQueryResult<YFinanceNewsResponse> {
  return useQuery({
    queryKey: ["yfinance", "news", "stock", symbol],
    queryFn: async (): Promise<YFinanceNewsResponse> => {
      const response = await fetch(`/api/proxy/yfinance/news/trending?symbol=${symbol}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    refetchInterval: refreshInterval,
    staleTime: 240000, // 4 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: true,
  });
}

// Hook for fetching enhanced market sentiment data
export function useYFinanceSentiment(refreshInterval: number = 300000): UseQueryResult<YFinanceSentimentResponse> {
  return useQuery({
    queryKey: ["yfinance", "sentiment"],
    queryFn: async (): Promise<YFinanceSentimentResponse> => {
      const response = await fetch("/api/proxy/yfinance/sentiment", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
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

// Combined hook for all YFinance data
export function useYFinanceData(refreshInterval: number = 300000) {
  const latestNews = useYFinanceLatestNews(refreshInterval);
  const stockNews = useYFinanceStockNews("SPY", refreshInterval);
  const sentiment = useYFinanceSentiment(refreshInterval);

  return {
    latestNews,
    stockNews,
    sentiment,
    isLoading: latestNews.isLoading || stockNews.isLoading || sentiment.isLoading,
    isError: (latestNews.isError || stockNews.isError || sentiment.isError) && 
             !(latestNews.data || stockNews.data || sentiment.data),
    hasData: latestNews.data || stockNews.data || sentiment.data,
  };
}