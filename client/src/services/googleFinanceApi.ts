// Google Finance API Service via SerpAPI
// Documentation: https://serpapi.com/search?engine=google_finance

const API_KEY = import.meta.env.VITE_SERPAPI_KEY || "demo_api_key";
const BASE_URL = "https://serpapi.com/search";

// Google Finance Response Types
export interface GoogleFinanceStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  currency: string;
  market: string;
  market_cap?: string;
  pe_ratio?: number;
  div_yield?: number;
  exchange: string;
  timezone: string;
  date: string;
  time: string;
}

export interface GoogleFinanceMarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  currency: string;
  market: string;
  exchange: string;
  timezone: string;
  date: string;
  time: string;
  previous_close?: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
  market_cap?: string;
  pe_ratio?: number;
  div_yield?: number;
  week_52_high?: number;
  week_52_low?: number;
}

export interface GoogleFinanceResponse {
  search_metadata: {
    id: string;
    status: string;
    json_endpoint: string;
    created_at: string;
    processed_at: string;
    google_finance_url: string;
    raw_html_file: string;
    total_time_taken: number;
  };
  search_parameters: {
    engine: string;
    q: string;
    gl: string;
    hl: string;
  };
  summary?: GoogleFinanceMarketData;
  markets?: {
    [key: string]: GoogleFinanceStock[];
  };
  news?: Array<{
    title: string;
    link: string;
    source: string;
    date: string;
    snippet?: string;
    thumbnail?: string;
  }>;
}

export interface GoogleFinanceError {
  error: string;
}

// Custom error class
export class GoogleFinanceApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: string,
  ) {
    super(message);
    this.name = "GoogleFinanceApiError";
  }
}

// API Service Class
class GoogleFinanceService {
  private baseURL = BASE_URL;
  private apiKey = API_KEY;

  private async fetchFromApi<T>(
    params: Record<string, string> = {},
  ): Promise<T> {
    const url = new URL(this.baseURL);
    
    // Add required parameters
    url.searchParams.set("engine", "google_finance");
    url.searchParams.set("api_key", this.apiKey);
    
    // Add custom parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new GoogleFinanceApiError(
        `HTTP error! status: ${response.status}`,
        response.status.toString(),
      );
    }

    const data = await response.json();

    if ("error" in data) {
      throw new GoogleFinanceApiError(
        data.error,
        "API_ERROR",
      );
    }

    return data as T;
  }

  // Get stock quote
  async getStockQuote(symbol: string): Promise<GoogleFinanceResponse> {
    try {
      const response = await this.fetchFromApi<GoogleFinanceResponse>({
        q: symbol,
        gl: "us",
        hl: "en",
      });

      return response;
    } catch (error) {
      if (error instanceof GoogleFinanceApiError) {
        throw error;
      }
      throw new GoogleFinanceApiError(
        `Failed to fetch stock quote for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // Get market data
  async getMarketData(market: string = "us"): Promise<GoogleFinanceResponse> {
    try {
      const response = await this.fetchFromApi<GoogleFinanceResponse>({
        q: market,
        gl: "us",
        hl: "en",
      });

      return response;
    } catch (error) {
      if (error instanceof GoogleFinanceApiError) {
        throw error;
      }
      throw new GoogleFinanceApiError(
        `Failed to fetch market data for ${market}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // Search for stocks
  async searchStocks(query: string): Promise<GoogleFinanceResponse> {
    try {
      const response = await this.fetchFromApi<GoogleFinanceResponse>({
        q: query,
        gl: "us",
        hl: "en",
      });

      return response;
    } catch (error) {
      if (error instanceof GoogleFinanceApiError) {
        throw error;
      }
      throw new GoogleFinanceApiError(
        `Failed to search stocks for ${query}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // Get trending stocks
  async getTrendingStocks(): Promise<GoogleFinanceResponse> {
    try {
      const response = await this.fetchFromApi<GoogleFinanceResponse>({
        q: "trending",
        gl: "us",
        hl: "en",
      });

      return response;
    } catch (error) {
      if (error instanceof GoogleFinanceApiError) {
        throw error;
      }
      throw new GoogleFinanceApiError(
        `Failed to fetch trending stocks: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // Convert Google Finance data to our internal format
  convertToInternalFormat(data: GoogleFinanceMarketData): {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume?: number;
    marketCap?: string;
    lastUpdated: Date;
  } {
    return {
      symbol: data.symbol,
      name: data.name,
      price: data.price,
      change: data.change,
      changePercent: data.change_percent,
      volume: data.volume,
      marketCap: data.market_cap,
      lastUpdated: new Date(),
    };
  }
}

// Rate-limited version of the service
class RateLimitedGoogleFinanceService {
  private service = new GoogleFinanceService();
  private lastRequestTime = 0;
  private minInterval = 1000; // 1 second between requests
  private requestQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason: any) => void;
    method: string;
    args: any[];
  }> = [];
  private processing = false;

  private async processQueue() {
    if (this.processing || this.requestQueue.length === 0) return;

    this.processing = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift()!;
      
      const timeSinceLastRequest = Date.now() - this.lastRequestTime;
      if (timeSinceLastRequest < this.minInterval) {
        await new Promise(resolve => 
          setTimeout(resolve, this.minInterval - timeSinceLastRequest)
        );
      }

      try {
        const result = await (this.service as any)[request.method](...request.args);
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }

      this.lastRequestTime = Date.now();
    }

    this.processing = false;
  }

  private queueRequest<T>(method: string, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ resolve, reject, method, args });
      this.processQueue();
    });
  }

  async getStockQuote(symbol: string): Promise<GoogleFinanceResponse> {
    return this.queueRequest('getStockQuote', symbol);
  }

  async getMarketData(market: string = "us"): Promise<GoogleFinanceResponse> {
    return this.queueRequest('getMarketData', market);
  }

  async searchStocks(query: string): Promise<GoogleFinanceResponse> {
    return this.queueRequest('searchStocks', query);
  }

  async getTrendingStocks(): Promise<GoogleFinanceResponse> {
    return this.queueRequest('getTrendingStocks');
  }

  convertToInternalFormat(data: GoogleFinanceMarketData) {
    return this.service.convertToInternalFormat(data);
  }
}

// Export instances
export const googleFinanceApi = new GoogleFinanceService();
export const rateLimitedGoogleFinanceApi = new RateLimitedGoogleFinanceService();