// Polygon.io API Service
// Documentation: https://polygon.io/docs/

const API_KEY = "ABeiglsv3LqhpieYSQiAYW9c0IhcpzaX";
const BASE_URL = "https://api.polygon.io";

// Polygon.io API Response Types
export interface PolygonQuote {
  status: string;
  request_id: string;
  results: {
    symbol: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    timestamp: number;
    change: number;
    change_percent: number;
  };
}

export interface PolygonDividend {
  cash_amount: number;
  declaration_date: string;
  dividend_type: string;
  ex_dividend_date: string;
  frequency: number;
  pay_date: string;
  record_date: string;
  ticker: string;
}

export interface PolygonDividendsResponse {
  status: string;
  request_id: string;
  results: PolygonDividend[];
  next_url?: string;
}

export interface PolygonTickerDetails {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  cik: string;
  composite_figi: string;
  share_class_figi: string;
  market_cap: number;
}

export interface PolygonError {
  error?: string;
  message?: string;
  status?: string;
}

// Custom error class
export class PolygonApiError extends Error {
  constructor(
    message: string,
    public code?: number,
    public status?: string,
  ) {
    super(message);
    this.name = "PolygonApiError";
  }
}

// API Service Class
class PolygonService {
  private baseURL = BASE_URL;
  private apiKey = API_KEY;

  private async fetchFromApi<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
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
      if (data.error) {
        throw new PolygonApiError(data.error);
      }

      if (data.message && data.status !== "OK") {
        throw new PolygonApiError(data.message);
      }

      if (!response.ok) {
        throw new PolygonApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof PolygonApiError) {
        throw error;
      }
      throw new PolygonApiError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Get dividends data
   */
  async getDividends(params: {
    ticker?: string;
    ex_dividend_date?: string;
    record_date?: string;
    declaration_date?: string;
    pay_date?: string;
    frequency?: number;
    cash_amount?: string;
    dividend_type?: string;
    limit?: number;
    sort?: string;
    order?: string;
  } = {}): Promise<PolygonDividendsResponse> {
    const queryParams: Record<string, string> = {};
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams[key] = value.toString();
      }
    });

    return this.fetchFromApi<PolygonDividendsResponse>("/v3/reference/dividends", queryParams);
  }

  /**
   * Get ticker details
   */
  async getTickerDetails(ticker: string): Promise<PolygonTickerDetails> {
    return this.fetchFromApi<PolygonTickerDetails>(`/v3/reference/tickers/${ticker.toUpperCase()}`);
  }

  /**
   * Get previous close data (for quote-like information)
   */
  async getPreviousClose(ticker: string): Promise<any> {
    return this.fetchFromApi<any>(`/v2/aggs/ticker/${ticker.toUpperCase()}/prev`);
  }

  /**
   * Get real-time quote for a single symbol (using previous close as fallback)
   */
  async getQuote(symbol: string): Promise<PolygonQuote> {
    const prevClose = await this.getPreviousClose(symbol);
    return {
      status: "OK",
      request_id: "mock_request_id",
      results: {
        symbol: symbol.toUpperCase(),
        open: prevClose.results?.[0]?.o || 0,
        high: prevClose.results?.[0]?.h || 0,
        low: prevClose.results?.[0]?.l || 0,
        close: prevClose.results?.[0]?.c || 0,
        volume: prevClose.results?.[0]?.v || 0,
        timestamp: prevClose.results?.[0]?.t || Date.now(),
        change: 0,
        change_percent: 0,
      },
    };
  }

  /**
   * Search for symbols (using ticker details)
   */
  async symbolSearch(query: string): Promise<{ results: PolygonTickerDetails[] }> {
    // This would typically use the tickers endpoint with search
    // For now, we'll return a mock structure
    return {
      results: [],
    };
  }
}

// Export singleton instance
export const polygonApi = new PolygonService();
export const alphaVantageApi = polygonApi; // Backward compatibility alias

// Utility functions to convert Polygon responses to our app's Ticker format
export function convertPolygonToTicker(
  quote: PolygonQuote,
  additionalData?: Partial<import("../types/social").Ticker>,
): import("../types/social").Ticker {
  const results = quote.results;
  const price = results.close || 0;
  const change = results.change || 0;
  const changePercent = results.change_percent || 0;
  const volume = results.volume || 0;

  return {
    symbol: results.symbol,
    name: results.symbol, // Polygon doesn't provide company name in quotes
    type: "stock" as const,
    exchange: "US", // Polygon primarily covers US markets
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
    lastUpdated: new Date(results.timestamp),
    ...additionalData,
  };
}

// Backward compatibility - keep old function names
export const convertAVToTicker = convertPolygonToTicker;

export function convertMultiplePolygonToTickers(
  quotes: PolygonQuote[],
  additionalData?: Record<string, Partial<import("../types/social").Ticker>>,
): import("../types/social").Ticker[] {
  return quotes.map((quote) => {
    const symbol = quote.results.symbol;
    return convertPolygonToTicker(quote, additionalData?.[symbol]);
  });
}

// Backward compatibility
export const convertMultipleAVToTickers = convertMultiplePolygonToTickers;

// Rate limiting helper (Polygon has rate limits)
class PolygonRateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number = 5, timeWindowMs: number = 60000) {
    // 5 requests per minute for basic tier
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

export const polygonRateLimiter = new PolygonRateLimiter();

// Enhanced API service with rate limiting
export class RateLimitedPolygonService extends PolygonService {
  async getQuote(symbol: string): Promise<PolygonQuote> {
    await polygonRateLimiter.checkLimit();
    return super.getQuote(symbol);
  }

  async getDividends(params: any = {}): Promise<PolygonDividendsResponse> {
    await polygonRateLimiter.checkLimit();
    return super.getDividends(params);
  }

  async getTickerDetails(ticker: string): Promise<PolygonTickerDetails> {
    await polygonRateLimiter.checkLimit();
    return super.getTickerDetails(ticker);
  }
}

export const rateLimitedPolygonApi = new RateLimitedPolygonService();
export const rateLimitedAlphaVantageApi = rateLimitedPolygonApi; // Backward compatibility

// Export error types for backward compatibility
export { PolygonApiError as AlphaVantageApiError };
export type { PolygonQuote as AlphaVantageQuote };
export type { PolygonDividendsResponse as AlphaVantageTimeSeries };
export type { PolygonTickerDetails as AlphaVantageSearchResult };
