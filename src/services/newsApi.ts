// NewsAPI Service
// Documentation: https://newsapi.org/docs

const API_KEY = "9a45d08310a946bab8d2738f74b69fc5";
const BASE_URL = "https://newsapi.org/v2";

// NewsAPI Response Types
export interface NewsAPIArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

export interface NewsAPIError {
  status: string;
  code: string;
  message: string;
}

// Custom error class
export class NewsApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: string,
  ) {
    super(message);
    this.name = "NewsApiError";
  }
}

// API Service Class
class NewsService {
  private baseURL = BASE_URL;
  private apiKey = API_KEY;

  private async fetchFromApi<T>(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    // Add API key and parameters
    url.searchParams.append("apiKey", this.apiKey);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());
      const data = await response.json();

      // Check for API errors
      if (data.status === "error") {
        throw new NewsApiError(
          data.message || "API request failed",
          data.code,
          data.status,
        );
      }

      if (!response.ok) {
        throw new NewsApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status.toString(),
        );
      }

      return data;
    } catch (error) {
      if (error instanceof NewsApiError) {
        throw error;
      }
      throw new NewsApiError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Get top headlines
   */
  async getTopHeadlines(
    country: string = "us",
    category?:
      | "business"
      | "entertainment"
      | "general"
      | "health"
      | "science"
      | "sports"
      | "technology",
    pageSize: number = 20,
    page: number = 1,
  ): Promise<NewsAPIResponse> {
    const params: Record<string, string> = {
      country,
      pageSize: pageSize.toString(),
      page: page.toString(),
    };

    if (category) {
      params.category = category;
    }

    return this.fetchFromApi<NewsAPIResponse>("/top-headlines", params);
  }

  /**
   * Search for news articles
   */
  async searchNews(
    query: string,
    sortBy: "relevancy" | "popularity" | "publishedAt" = "publishedAt",
    pageSize: number = 20,
    page: number = 1,
    language: string = "en",
  ): Promise<NewsAPIResponse> {
    return this.fetchFromApi<NewsAPIResponse>("/everything", {
      q: query,
      sortBy,
      pageSize: pageSize.toString(),
      page: page.toString(),
      language,
    });
  }

  /**
   * Get business news specifically
   */
  async getBusinessNews(
    pageSize: number = 20,
    page: number = 1,
  ): Promise<NewsAPIResponse> {
    return this.getTopHeadlines("us", "business", pageSize, page);
  }

  /**
   * Get technology news specifically
   */
  async getTechnologyNews(
    pageSize: number = 20,
    page: number = 1,
  ): Promise<NewsAPIResponse> {
    return this.getTopHeadlines("us", "technology", pageSize, page);
  }
}

// Export singleton instance
export const newsApi = new NewsService();

// Utility function to convert NewsAPI article to our app's NewsArticle format
export function convertNewsAPIToNewsArticle(
  article: NewsAPIArticle,
  sentimentScore?: number,
): import("../data/mockData").NewsArticle {
  // Generate a simple sentiment score based on headline analysis
  const generateSentimentScore = (
    title: string,
    description?: string | null,
  ) => {
    const text = `${title} ${description || ""}`.toLowerCase();

    // Simple sentiment keywords (in production, you'd use a proper sentiment analysis service)
    const positiveWords = [
      "gains",
      "growth",
      "surge",
      "rise",
      "boost",
      "positive",
      "success",
      "profit",
      "strong",
      "up",
    ];
    const negativeWords = [
      "loss",
      "decline",
      "fall",
      "drop",
      "crash",
      "negative",
      "fail",
      "down",
      "weak",
      "concern",
    ];

    let score = 50; // neutral starting point

    positiveWords.forEach((word) => {
      if (text.includes(word)) score += 5;
    });

    negativeWords.forEach((word) => {
      if (text.includes(word)) score -= 5;
    });

    return Math.max(0, Math.min(100, score));
  };

  return {
    id:
      (article.url + article.title + article.publishedAt)
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 20) ||
      `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Create unique ID, fallback to timestamp + random
    headline: article.title,
    summary: article.description || "No description available",
    sentimentScore:
      sentimentScore ||
      generateSentimentScore(article.title, article.description),
    keyPhrases: [], // Could be extracted from content in a more sophisticated implementation
    source: {
      name: article.source.name,
      publishedAt: article.publishedAt,
    },
    originalUrl: article.url,
    whyItMatters: "Financial markets and sentiment analysis", // Generic explanation
    relatedTrends: [], // Could be extracted from content
  };
}

// Rate limiting helper (NewsAPI has rate limits)
class NewsRateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number = 1000, timeWindowMs: number = 86400000) {
    // 1000 requests per day for developer plan
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  async checkLimit(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(
      (time) => now - time < this.timeWindow,
    );

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return this.checkLimit();
    }

    this.requests.push(now);
  }
}

export const newsRateLimiter = new NewsRateLimiter();

// Enhanced API service with rate limiting
export class RateLimitedNewsService extends NewsService {
  async getTopHeadlines(
    country: string = "us",
    category?:
      | "business"
      | "entertainment"
      | "general"
      | "health"
      | "science"
      | "sports"
      | "technology",
    pageSize: number = 20,
    page: number = 1,
  ): Promise<NewsAPIResponse> {
    await newsRateLimiter.checkLimit();
    return super.getTopHeadlines(country, category, pageSize, page);
  }

  async searchNews(
    query: string,
    sortBy: "relevancy" | "popularity" | "publishedAt" = "publishedAt",
    pageSize: number = 20,
    page: number = 1,
    language: string = "en",
  ): Promise<NewsAPIResponse> {
    await newsRateLimiter.checkLimit();
    return super.searchNews(query, sortBy, pageSize, page, language);
  }
}

export const rateLimitedNewsApi = new RateLimitedNewsService();
