// SerpAPI Google News Service
// Documentation: https://serpapi.com/search?engine=google_news

const API_KEY = process.env.VITE_SERPAPI_KEY || "demo_api_key";
const BASE_URL = "https://serpapi.com/search";

// SerpAPI Response Types
export interface SerpNewsArticle {
  position: number;
  title: string;
  link: string;
  source: string;
  date: string;
  snippet?: string;
  thumbnail?: string;
  stories?: Array<{
    title: string;
    link: string;
    source: string;
    date: string;
  }>;
}

export interface SerpApiResponse {
  search_metadata: {
    id: string;
    status: string;
    json_endpoint: string;
    created_at: string;
    processed_at: string;
    google_news_url: string;
    raw_html_file: string;
    total_time_taken: number;
  };
  search_parameters: {
    engine: string;
    q: string;
    gl: string;
    hl: string;
  };
  search_information: {
    total_results: number;
    time_taken_displayed: number;
    query_displayed: string;
  };
  news_results: SerpNewsArticle[];
}

export interface SerpApiError {
  error: string;
}

// Custom error class
export class SerpApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: string,
  ) {
    super(message);
    this.name = "SerpApiError";
  }
}

// API Service Class
class SerpNewsService {
  private baseURL = BASE_URL;
  private apiKey = API_KEY;

  private async fetchFromApi<T>(
    params: Record<string, string> = {},
  ): Promise<T> {
    const url = new URL(this.baseURL);

    // Add required parameters
    url.searchParams.append("engine", "google_news");
    url.searchParams.append("api_key", this.apiKey);

    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());
      const data = await response.json();

      // Check for API errors
      if (data.error) {
        throw new SerpApiError(data.error || "API request failed", "api_error");
      }

      if (!response.ok) {
        throw new SerpApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status.toString(),
        );
      }

      return data;
    } catch (error) {
      if (error instanceof SerpApiError) {
        throw error;
      }
      throw new SerpApiError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Search Google News
   */
  async searchNews(
    query: string,
    country: string = "us",
    language: string = "en",
    num: number = 20,
  ): Promise<SerpApiResponse> {
    const params: Record<string, string> = {
      q: query,
      gl: country,
      hl: language,
      num: num.toString(),
    };

    return this.fetchFromApi<SerpApiResponse>(params);
  }

  /**
   * Get top news (general search)
   */
  async getTopNews(
    country: string = "us",
    language: string = "en",
    num: number = 20,
  ): Promise<SerpApiResponse> {
    return this.searchNews("top news", country, language, num);
  }

  /**
   * Get business news specifically
   */
  async getBusinessNews(
    country: string = "us",
    language: string = "en",
    num: number = 20,
  ): Promise<SerpApiResponse> {
    return this.searchNews("business news", country, language, num);
  }

  /**
   * Get technology news specifically
   */
  async getTechnologyNews(
    country: string = "us",
    language: string = "en",
    num: number = 20,
  ): Promise<SerpApiResponse> {
    return this.searchNews("technology news", country, language, num);
  }

  /**
   * Get crypto/cryptocurrency news
   */
  async getCryptoNews(
    country: string = "us",
    language: string = "en",
    num: number = 20,
  ): Promise<SerpApiResponse> {
    return this.searchNews("cryptocurrency bitcoin", country, language, num);
  }
}

// Export singleton instance
export const serpNewsApi = new SerpNewsService();

// Utility function to convert SerpAPI article to our app's NewsArticle format
export function convertSerpToNewsArticle(
  article: SerpNewsArticle,
  sentimentScore?: number,
): import("../data/mockData").NewsArticle {
  // Generate a simple sentiment score based on headline analysis
  const generateSentimentScore = (title: string, snippet?: string) => {
    const text = `${title} ${snippet || ""}`.toLowerCase();

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
      "rally",
      "bull",
      "breakthrough",
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
      "bear",
      "recession",
      "crisis",
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

  // Parse date - SerpAPI returns dates in various formats
  const parseDate = (dateStr: string): string => {
    try {
      // Try to parse the date string and convert to ISO format
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        // If parsing fails, return current timestamp
        return new Date().toISOString();
      }
      return date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  return {
    id: `serp_${Math.random().toString(36).substring(2, 9)}_${Date.now()}_${(article.link + article.title).replace(/[^a-zA-Z0-9]/g, "").substring(0, 8)}`,
    headline: article.title,
    summary: article.snippet || "No description available",
    sentimentScore:
      sentimentScore || generateSentimentScore(article.title, article.snippet),
    keyPhrases: [], // Could be extracted from content in a more sophisticated implementation
    source: {
      name: article.source,
      publishedAt: parseDate(article.date),
    },
    originalUrl: article.link,
    whyItMatters: "Breaking news and market sentiment analysis",
    relatedTrends: [], // Could be extracted from related stories
  };
}

// Rate limiting helper (SerpAPI has rate limits based on plan)
class SerpRateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number = 100, timeWindowMs: number = 3600000) {
    // 100 requests per hour for free plan
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

export const serpRateLimiter = new SerpRateLimiter();

// Enhanced API service with rate limiting
export class RateLimitedSerpNewsService extends SerpNewsService {
  async searchNews(
    query: string,
    country: string = "us",
    language: string = "en",
    num: number = 20,
  ): Promise<SerpApiResponse> {
    await serpRateLimiter.checkLimit();
    return super.searchNews(query, country, language, num);
  }

  async getTopNews(
    country: string = "us",
    language: string = "en",
    num: number = 20,
  ): Promise<SerpApiResponse> {
    await serpRateLimiter.checkLimit();
    return super.getTopNews(country, language, num);
  }

  async getBusinessNews(
    country: string = "us",
    language: string = "en",
    num: number = 20,
  ): Promise<SerpApiResponse> {
    await serpRateLimiter.checkLimit();
    return super.getBusinessNews(country, language, num);
  }

  async getTechnologyNews(
    country: string = "us",
    language: string = "en",
    num: number = 20,
  ): Promise<SerpApiResponse> {
    await serpRateLimiter.checkLimit();
    return super.getTechnologyNews(country, language, num);
  }

  async getCryptoNews(
    country: string = "us",
    language: string = "en",
    num: number = 20,
  ): Promise<SerpApiResponse> {
    await serpRateLimiter.checkLimit();
    return super.getCryptoNews(country, language, num);
  }
}

export const rateLimitedSerpNewsApi = new RateLimitedSerpNewsService();
