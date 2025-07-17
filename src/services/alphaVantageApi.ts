// Alpha Vantage API Service
// Documentation: https://www.alphavantage.co/documentation/

const API_KEY = "HALSVTB25JRRRQ79";
const BASE_URL = "https://www.alphavantage.co/query";

// Alpha Vantage API Response Types
export interface AlphaVantageQuote {
  "Global Quote": {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "07. latest trading day": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
  };
}

export interface AlphaVantageTimeSeriesValue {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

export interface AlphaVantageTimeSeries {
  "Meta Data": {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Interval": string;
    "5. Output Size": string;
    "6. Time Zone": string;
  };
  "Time Series (5min)": {
    [key: string]: AlphaVantageTimeSeriesValue;
  };
}

export interface AlphaVantageSearchResult {
  bestMatches: Array<{
    "1. symbol": string;
    "2. name": string;
    "3. type": string;
    "4. region": string;
    "5. marketOpen": string;
    "6. marketClose": string;
    "7. timezone": string;
    "8. currency": string;
    "9. matchScore": string;
  }>;
}

export interface AlphaVantageError {
  "Error Message"?: string;
  Note?: string;
  Information?: string;
}

// Custom error class
export class AlphaVantageApiError extends Error {
  constructor(
    message: string,
    public code?: number,
    public status?: string,
  ) {
    super(message);
    this.name = "AlphaVantageApiError";
  }
}

// API Service Class
class AlphaVantageService {
  private baseURL = BASE_URL;
  private apiKey = API_KEY;

  private async fetchFromApi<T>(params: Record<string, string>): Promise<T> {
    const url = new URL(this.baseURL);

    // Add API key and parameters
    url.searchParams.append("apikey", this.apiKey);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());
      const data = await response.json();

      // Check for API errors
      if (data["Error Message"]) {
        throw new AlphaVantageApiError(data["Error Message"]);
      }

      if (data["Note"]) {
        throw new AlphaVantageApiError(data["Note"]);
      }

      if (data["Information"]) {
        throw new AlphaVantageApiError(data["Information"]);
      }

      if (!response.ok) {
        throw new AlphaVantageApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof AlphaVantageApiError) {
        throw error;
      }
      throw new AlphaVantageApiError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Get real-time quote for a single symbol
   */
  async getQuote(symbol: string): Promise<AlphaVantageQuote> {
    return this.fetchFromApi<AlphaVantageQuote>({
      function: "GLOBAL_QUOTE",
      symbol,
    });
  }

  /**
   * Get intraday time series data
   */
  async getTimeSeries(
    symbol: string,
    interval: "1min" | "5min" | "15min" | "30min" | "60min" = "5min",
    outputsize: "compact" | "full" = "compact",
  ): Promise<AlphaVantageTimeSeries> {
    return this.fetchFromApi<AlphaVantageTimeSeries>({
      function: "TIME_SERIES_INTRADAY",
      symbol,
      interval,
      outputsize,
    });
  }

  /**
   * Search for symbols
   */
  async symbolSearch(query: string): Promise<AlphaVantageSearchResult> {
    return this.fetchFromApi<AlphaVantageSearchResult>({
      function: "SYMBOL_SEARCH",
      keywords: query,
    });
  }

  /**
   * Get daily time series data
   */
  async getDailyTimeSeries(
    symbol: string,
    outputsize: "compact" | "full" = "compact",
  ): Promise<any> {
    return this.fetchFromApi({
      function: "TIME_SERIES_DAILY",
      symbol,
      outputsize,
    });
  }

  /**
   * Get company overview (fundamental data)
   */
  async getCompanyOverview(symbol: string): Promise<any> {
    return this.fetchFromApi({
      function: "OVERVIEW",
      symbol,
    });
  }
}

// Export singleton instance
export const alphaVantageApi = new AlphaVantageService();

// Utility functions to convert Alpha Vantage responses to our app's Ticker format
export function convertAVToTicker(
  quote: AlphaVantageQuote,
  additionalData?: Partial<import("../types/social").Ticker>,
): import("../types/social").Ticker {
  const globalQuote = quote["Global Quote"];
  const price = parseFloat(globalQuote["05. price"]) || 0;
  const change = parseFloat(globalQuote["09. change"]) || 0;
  const changePercentStr = globalQuote["10. change percent"].replace("%", "");
  const changePercent = parseFloat(changePercentStr) || 0;
  const volume = parseFloat(globalQuote["06. volume"]) || 0;

  return {
    symbol: globalQuote["01. symbol"],
    name: globalQuote["01. symbol"], // Alpha Vantage doesn't provide company name in quotes
    type: "stock" as const,
    exchange: "US", // Alpha Vantage primarily covers US markets
    price,
    change,
    changePercent,
    volume,
    sentimentScore: 0, // This would come from social sentiment analysis
    bullishCount: 0,
    bearishCount: 0,
    neutralCount: 0,
    totalPosts: 0,
    trendingScore: 0,
    postVolume24h: 0,
    sentimentChange24h: 0,
    lastUpdated: new Date(globalQuote["07. latest trading day"]),
    ...additionalData,
  };
}

export function convertMultipleAVToTickers(
  quotes: AlphaVantageQuote[],
  additionalData?: Record<string, Partial<import("../types/social").Ticker>>,
): import("../types/social").Ticker[] {
  return quotes.map((quote) => {
    const symbol = quote["Global Quote"]["01. symbol"];
    return convertAVToTicker(quote, additionalData?.[symbol]);
  });
}

// Rate limiting helper (Alpha Vantage has rate limits)
class AVRateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number = 5, timeWindowMs: number = 60000) {
    // 5 requests per minute for free tier
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

export const avRateLimiter = new AVRateLimiter();

// Enhanced API service with rate limiting
export class RateLimitedAlphaVantageService extends AlphaVantageService {
  async getQuote(symbol: string): Promise<AlphaVantageQuote> {
    await avRateLimiter.checkLimit();
    return super.getQuote(symbol);
  }

  async getTimeSeries(
    symbol: string,
    interval: "1min" | "5min" | "15min" | "30min" | "60min" = "5min",
    outputsize: "compact" | "full" = "compact",
  ): Promise<AlphaVantageTimeSeries> {
    await avRateLimiter.checkLimit();
    return super.getTimeSeries(symbol, interval, outputsize);
  }

  async symbolSearch(query: string): Promise<AlphaVantageSearchResult> {
    await avRateLimiter.checkLimit();
    return super.symbolSearch(query);
  }
}

export const rateLimitedAlphaVantageApi = new RateLimitedAlphaVantageService();
