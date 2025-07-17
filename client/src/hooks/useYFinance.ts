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

// YFinance Ticker Info Response Interface
export interface YFinanceTickerData {
  symbol: string;
  company_name: string;
  sector: string;
  industry: string;
  country: string;
  currency: string;
  exchange: string;
  website: string;
  business_summary: string;
  market_cap: number;
  enterprise_value: number;
  pe_ratio: number;
  forward_pe: number;
  peg_ratio: number;
  price_to_book: number;
  price_to_sales: number;
  debt_to_equity: number;
  return_on_equity: number;
  return_on_assets: number;
  profit_margin: number;
  gross_margin: number;
  operating_margin: number;
  dividend_yield: number;
  dividend_rate: number;
  payout_ratio: number;
  ex_dividend_date: string;
  shares_outstanding: number;
  float_shares: number;
  shares_short: number;
  short_ratio: number;
  beta: number;
  "52_week_high": number;
  "52_week_low": number;
  "50_day_average": number;
  "200_day_average": number;
  average_volume: number;
  average_volume_10days: number;
  bid: number;
  ask: number;
  bid_size: number;
  ask_size: number;
  total_revenue: number;
  revenue_per_share: number;
  earnings_per_share: number;
  forward_eps: number;
  earnings_growth: number;
  revenue_growth: number;
  recommendation: string;
  target_high_price: number;
  target_low_price: number;
  target_mean_price: number;
  number_of_analyst_opinions: number;
  full_time_employees: number;
  audit_risk: number;
  board_risk: number;
  compensation_risk: number;
  shareholder_rights_risk: number;
  overall_risk: number;
  current_price: number;
  price_change: number;
  price_change_percent: number;
  volume: number;
}

export interface YFinanceTickerResponse {
  status: string;
  source: string;
  symbol: string;
  data: YFinanceTickerData;
  error?: string;
}

// Hook for fetching latest market news
export function useYFinanceLatestNews(
  refreshInterval: number = 300000,
): UseQueryResult<YFinanceNewsResponse> {
  return useQuery({
    queryKey: ["yfinance", "news", "latest"],
    queryFn: async (): Promise<YFinanceNewsResponse> => {
      try {
        const response = await fetch("/api/proxy/yfinance/news/latest", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // If service returns error, provide mock data
        if (data.error) {
          return createMockLatestNews();
        }

        return data;
      } catch (error) {
        console.warn("YFinance latest news failed, using mock data:", error);
        return createMockLatestNews();
      }
    },
    refetchInterval: refreshInterval,
    staleTime: 240000, // 4 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for fetching stock-specific news
export function useYFinanceStockNews(
  symbol: string = "SPY",
  refreshInterval: number = 300000,
): UseQueryResult<YFinanceNewsResponse> {
  return useQuery({
    queryKey: ["yfinance", "news", "stock", symbol],
    queryFn: async (): Promise<YFinanceNewsResponse> => {
      const response = await fetch(
        `/api/proxy/yfinance/news/trending?symbol=${symbol}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
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
export function useYFinanceSentiment(
  refreshInterval: number = 300000,
): UseQueryResult<YFinanceSentimentResponse> {
  return useQuery({
    queryKey: ["yfinance", "sentiment"],
    queryFn: async (): Promise<YFinanceSentimentResponse> => {
      const response = await fetch("/api/proxy/yfinance/sentiment", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
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

// Hook for fetching comprehensive ticker information
export function useYFinanceTickerInfo(
  symbol: string,
  refreshInterval: number = 300000,
): UseQueryResult<YFinanceTickerResponse> {
  return useQuery({
    queryKey: ["yfinance", "ticker", symbol],
    queryFn: async (): Promise<YFinanceTickerResponse> => {
      const response = await fetch(
        `/api/proxy/yfinance/ticker?symbol=${symbol}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!symbol,
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
    isLoading:
      latestNews.isLoading || stockNews.isLoading || sentiment.isLoading,
    isError:
      (latestNews.isError || stockNews.isError || sentiment.isError) &&
      !(latestNews.data || stockNews.data || sentiment.data),
    hasData: latestNews.data || stockNews.data || sentiment.data,
  };
}
