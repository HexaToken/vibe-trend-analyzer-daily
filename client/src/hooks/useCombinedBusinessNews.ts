import { useState, useEffect, useCallback } from "react";
import { useBusinessNews } from "./useNewsApi";
import { useYFinanceNews } from "./useYFinanceNews";
import { NewsArticle } from "../data/mockData";

interface UseCombinedBusinessNewsOptions {
  refreshInterval?: number;
  enabled?: boolean;
  includeNewsApi?: boolean;
  includeYFinanceNews?: boolean;
  maxArticles?: number;
}

interface UseCombinedBusinessNewsResult {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  sources: {
    newsApi: {
      articles: NewsArticle[];
      loading: boolean;
      error: string | null;
    };
    yfinance: {
      articles: NewsArticle[];
      loading: boolean;
      error: string | null;
    };
  };
}

/**
 * Hook that combines business news from both NewsAPI and YFinance
 */
export function useCombinedBusinessNews(
  options: UseCombinedBusinessNewsOptions = {},
): UseCombinedBusinessNewsResult {
  const {
    refreshInterval = 0,
    enabled = true,
    includeNewsApi = true,
    includeYFinanceNews = true,
    maxArticles = 30,
  } = options;

  // Fetch from NewsAPI
  const newsApiResult = useBusinessNews({
    refreshInterval,
    enabled: enabled && includeNewsApi,
  });

  // Fetch from YFinance
  const yfinanceResult = useYFinanceNews({
    refreshInterval,
    enabled: enabled && includeYFinanceNews,
  });

  const [combinedArticles, setCombinedArticles] = useState<NewsArticle[]>([]);
  const [combinedError, setCombinedError] = useState<string | null>(null);

  // Combine and deduplicate articles
  const combineArticles = useCallback(() => {
    const allArticles: NewsArticle[] = [];
    const errors: string[] = [];

    // Add NewsAPI articles
    if (includeNewsApi && newsApiResult.articles.length > 0) {
      allArticles.push(...newsApiResult.articles);
    }
    if (includeNewsApi && newsApiResult.error) {
      errors.push(`NewsAPI: ${newsApiResult.error}`);
    }

    // Add YFinance articles
    if (includeYFinanceNews && yfinanceResult.articles.length > 0) {
      allArticles.push(...yfinanceResult.articles);
    }
    if (includeYFinanceNews && yfinanceResult.error) {
      errors.push(`YFinance: ${yfinanceResult.error}`);
    }

    // Deduplicate by headline similarity and URL
    const uniqueArticles = allArticles.filter((article, index, arr) => {
      return (
        arr.findIndex((other) => {
          // Check for exact headline match
          const headlineMatch =
            other.headline.toLowerCase().trim() ===
            article.headline.toLowerCase().trim();

          // Check for URL match if both have URLs
          const urlMatch =
            article.originalUrl &&
            other.originalUrl &&
            article.originalUrl === other.originalUrl;

          // Check for similar headlines (first 50 characters)
          const similarHeadline =
            other.headline.toLowerCase().substring(0, 50) ===
            article.headline.toLowerCase().substring(0, 50);

          return headlineMatch || urlMatch || similarHeadline;
        }) === index
      );
    });

    // Sort by published date (newest first), then by sentiment score (highest first)
    uniqueArticles.sort((a, b) => {
      const dateA = new Date(a.source.publishedAt).getTime();
      const dateB = new Date(b.source.publishedAt).getTime();

      // Primary sort by date (newest first)
      if (dateB !== dateA) {
        return dateB - dateA;
      }

      // Secondary sort by sentiment score (highest first)
      return b.sentimentScore - a.sentimentScore;
    });

    // Limit the number of articles
    const limitedArticles = uniqueArticles.slice(0, maxArticles);

    setCombinedArticles(limitedArticles);
    setCombinedError(errors.length > 0 ? errors.join("; ") : null);
  }, [
    newsApiResult.articles.length,
    newsApiResult.error,
    yfinanceResult.articles.length,
    yfinanceResult.error,
    includeNewsApi,
    includeYFinanceNews,
    maxArticles,
  ]);

  useEffect(() => {
    combineArticles();
  }, [combineArticles]);

  const refetch = useCallback(async () => {
    const promises: Promise<void>[] = [];

    if (includeNewsApi) {
      promises.push(newsApiResult.refetch());
    }

    if (includeYFinanceNews) {
      promises.push(yfinanceResult.refetch());
    }

    await Promise.all(promises);
  }, [
    newsApiResult.refetch,
    yfinanceResult.refetch,
    includeNewsApi,
    includeYFinanceNews,
  ]);

  return {
    articles: combinedArticles,
    loading:
      (includeNewsApi ? newsApiResult.loading : false) ||
      (includeYFinanceNews ? yfinanceResult.loading : false),
    error: combinedError,
    refetch,
    sources: {
      newsApi: {
        articles: newsApiResult.articles,
        loading: newsApiResult.loading,
        error: newsApiResult.error,
      },
      yfinance: {
        articles: yfinanceResult.articles,
        loading: yfinanceResult.loading,
        error: yfinanceResult.error,
      },
    },
  };
}
