// CoinMarketCap API Service
// Documentation: https://coinmarketcap.com/api/documentation/v1/
// Uses server proxy to avoid CORS restrictions

const BASE_URL = "/api/proxy/coinmarketcap";

// CoinMarketCap API Response Types
export interface CoinMarketCapQuote {
  price: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  percent_change_60d: number;
  percent_change_90d: number;
  market_cap: number;
  market_cap_dominance: number;
  fully_diluted_market_cap: number;
  tvl: number;
  last_updated: string;
}

export interface CoinMarketCapCryptocurrency {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: string;
  tags: string[];
  max_supply: number;
  circulating_supply: number;
  total_supply: number;
  platform?: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    token_address: string;
  };
  is_active: number;
  is_fiat: number;
  cmc_rank: number;
  last_updated: string;
  quote: {
    USD: CoinMarketCapQuote;
  };
}

export interface CoinMarketCapListingsResponse {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
    notice: string | null;
  };
  data: CoinMarketCapCryptocurrency[];
}

export interface CoinMarketCapQuotesResponse {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
    notice: string | null;
  };
  data: {
    [key: string]: CoinMarketCapCryptocurrency;
  };
}

export interface CoinMarketCapMetadata {
  id: number;
  name: string;
  symbol: string;
  category: string;
  description: string;
  slug: string;
  logo: string;
  subreddit: string;
  notice: string;
  tags: string[];
  "tag-names": string[];
  "tag-groups": string[];
  urls: {
    website: string[];
    twitter: string[];
    message_board: string[];
    chat: string[];
    facebook: string[];
    explorer: string[];
    reddit: string[];
    technical_doc: string[];
    source_code: string[];
    announcement: string[];
  };
  platform: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    token_address: string;
  };
  date_added: string;
  twitter_username: string;
  is_hidden: number;
  date_launched: string;
  contract_address: {
    contract_address: string;
    platform: {
      name: string;
      coin: {
        id: string;
        name: string;
        symbol: string;
        slug: string;
      };
    };
  }[];
  self_reported_circulating_supply: number;
  self_reported_tags: string[];
  self_reported_market_cap: number;
  infinite_supply: boolean;
}

// Custom error class
export class CoinMarketCapApiError extends Error {
  constructor(
    message: string,
    public code?: number,
    public status?: string,
  ) {
    super(message);
    this.name = "CoinMarketCapApiError";
  }
}

// API Service Class
class CoinMarketCapService {
  private baseURL = BASE_URL;
  private circuitBreaker = {
    isOpen: false,
    failureCount: 0,
    threshold: 2, // Even lower threshold for faster fallback
    timeout: 60000, // 1 minute instead of 2
    lastFailureTime: 0,
  };
  private proxyAvailable: boolean | null = null; // Track proxy availability

  // Method to manually reset circuit breaker
  public resetCircuitBreaker(): void {
    this.circuitBreaker.isOpen = false;
    this.circuitBreaker.failureCount = 0;
    this.circuitBreaker.lastFailureTime = 0;
    this.proxyAvailable = null;
    console.log("CoinMarketCap circuit breaker reset");
  }

  // Method to check circuit breaker status
  public getCircuitBreakerStatus(): {
    isOpen: boolean;
    timeRemaining?: number;
  } {
    if (!this.circuitBreaker.isOpen) {
      return { isOpen: false };
    }

    const now = Date.now();
    const timeRemaining =
      this.circuitBreaker.timeout - (now - this.circuitBreaker.lastFailureTime);

    if (timeRemaining <= 0) {
      this.resetCircuitBreaker();
      return { isOpen: false };
    }

    return { isOpen: true, timeRemaining };
  }

  private async fetchFromApi<T>(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    // If proxy is known to be unavailable, fail immediately
    if (this.proxyAvailable === false) {
      throw new CoinMarketCapApiError(
        "CoinMarketCap proxy is not available - using mock data",
      );
    }

    // Check circuit breaker
    if (this.circuitBreaker.isOpen) {
      const now = Date.now();
      if (
        now - this.circuitBreaker.lastFailureTime <
        this.circuitBreaker.timeout
      ) {
        throw new CoinMarketCapApiError(
          "Circuit breaker is open - service temporarily unavailable",
        );
      } else {
        // Reset circuit breaker
        this.circuitBreaker.isOpen = false;
        this.circuitBreaker.failureCount = 0;
      }
    }

    const url = new URL(`${this.baseURL}${endpoint}`, window.location.origin);

    // Add parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());

      // Check response status BEFORE consuming the body
      if (!response.ok) {
        throw new CoinMarketCapApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
        );
      }

      const responseText = await response.text();

      // Check if response is HTML (proxy returning error page)
      if (
        responseText.trim().startsWith("<!DOCTYPE") ||
        responseText.trim().startsWith("<html")
      ) {
        this.proxyAvailable = false; // Mark proxy as unavailable
        throw new CoinMarketCapApiError(
          "API proxy returned HTML instead of JSON - service may be unavailable",
          500,
          "proxy_error",
        );
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new CoinMarketCapApiError(
          "Invalid JSON response from API",
          500,
          "parse_error",
        );
      }

      // Check for API errors
      if (data.status && data.status.error_code !== 0) {
        // Special handling for rate limit errors
        if (
          data.status.error_message &&
          (data.status.error_message.includes("rate limit") ||
            data.status.error_message.includes("IP rate limit"))
        ) {
          // Increase circuit breaker timeout for rate limits
          this.circuitBreaker.timeout = 600000; // 10 minutes for rate limits
          this.circuitBreaker.isOpen = true;
          this.circuitBreaker.lastFailureTime = Date.now();
        }

        throw new CoinMarketCapApiError(
          data.status.error_message || "API request failed",
          data.status.error_code,
          "error",
        );
      }

      // Reset failure count on success
      this.circuitBreaker.failureCount = 0;
      this.proxyAvailable = true; // Mark proxy as available
      return data;
    } catch (error) {
      // Update circuit breaker on failure
      this.circuitBreaker.failureCount++;
      this.circuitBreaker.lastFailureTime = Date.now();

      if (this.circuitBreaker.failureCount >= this.circuitBreaker.threshold) {
        this.circuitBreaker.isOpen = true;
        console.warn(
          "CoinMarketCap API circuit breaker opened due to failures",
        );
      }

      if (error instanceof CoinMarketCapApiError) {
        throw error;
      }
      throw new CoinMarketCapApiError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Get latest cryptocurrency listings
   */
  async getListingsLatest(
    start: number = 1,
    limit: number = 10,
    convert: string = "USD",
    sort: string = "market_cap",
  ): Promise<CoinMarketCapListingsResponse> {
    return this.fetchFromApi<CoinMarketCapListingsResponse>("/listings", {
      start: start.toString(),
      limit: limit.toString(),
      convert,
      sort,
    });
  }

  /**
   * Get quotes for specific cryptocurrencies by symbol
   */
  async getQuotesBySymbol(
    symbols: string[],
    convert: string = "USD",
  ): Promise<CoinMarketCapQuotesResponse> {
    return this.fetchFromApi<CoinMarketCapQuotesResponse>("/quotes", {
      symbol: symbols.join(","),
      convert,
    });
  }

  /**
   * Get quotes for specific cryptocurrencies by ID
   */
  async getQuotesById(
    ids: number[],
    convert: string = "USD",
  ): Promise<CoinMarketCapQuotesResponse> {
    return this.fetchFromApi<CoinMarketCapQuotesResponse>("/quotes", {
      id: ids.join(","),
      convert,
    });
  }

  /**
   * Get cryptocurrency metadata
   */
  async getMetadata(
    symbols?: string[],
    ids?: number[],
  ): Promise<{
    status: any;
    data: { [key: string]: CoinMarketCapMetadata };
  }> {
    const params: Record<string, string> = {};
    if (symbols && symbols.length > 0) {
      params.symbol = symbols.join(",");
    }
    if (ids && ids.length > 0) {
      params.id = ids.join(",");
    }

    return this.fetchFromApi("/info", params);
  }

  /**
   * Search for cryptocurrencies
   */
  async searchCryptocurrencies(query: string): Promise<{
    status: any;
    data: {
      cryptocurrencies: Array<{
        id: number;
        name: string;
        symbol: string;
        slug: string;
        rank: number;
        is_active: number;
        first_historical_data: string;
        last_historical_data: string;
      }>;
    };
  }> {
    return this.fetchFromApi("/map", {
      listing_status: "active",
      symbol: query,
    });
  }

  /**
   * Get trending cryptocurrencies
   */
  async getTrendingCryptocurrencies(
    limit: number = 10,
    timePeriod: "1h" | "24h" | "7d" | "30d" = "24h",
  ): Promise<CoinMarketCapListingsResponse> {
    return this.fetchFromApi<CoinMarketCapListingsResponse>("/trending", {
      limit: limit.toString(),
      time_period: timePeriod,
    });
  }

  /**
   * Get global cryptocurrency market metrics
   */
  async getGlobalMetrics(convert: string = "USD"): Promise<{
    status: any;
    data: {
      active_cryptocurrencies: number;
      total_cryptocurrencies: number;
      active_market_pairs: number;
      active_exchanges: number;
      total_exchanges: number;
      eth_dominance: number;
      btc_dominance: number;
      eth_dominance_yesterday: number;
      btc_dominance_yesterday: number;
      eth_dominance_24h_percentage_change: number;
      btc_dominance_24h_percentage_change: number;
      defi_volume_24h: number;
      defi_volume_24h_reported: number;
      defi_market_cap: number;
      defi_24h_percentage_change: number;
      stablecoin_volume_24h: number;
      stablecoin_volume_24h_reported: number;
      stablecoin_market_cap: number;
      stablecoin_24h_percentage_change: number;
      derivatives_volume_24h: number;
      derivatives_volume_24h_reported: number;
      derivatives_24h_percentage_change: number;
      quote: {
        [key: string]: {
          total_market_cap: number;
          total_volume_24h: number;
          total_volume_24h_reported: number;
          altcoin_volume_24h: number;
          altcoin_volume_24h_reported: number;
          altcoin_market_cap: number;
          total_market_cap_yesterday: number;
          total_volume_24h_yesterday: number;
          total_market_cap_yesterday_percentage_change: number;
          total_volume_24h_yesterday_percentage_change: number;
          last_updated: string;
        };
      };
      last_updated: string;
    };
  }> {
    return this.fetchFromApi("/global-metrics", { convert });
  }
}

// Export singleton instance
export const coinMarketCapApi = new CoinMarketCapService();

// Utility function to reset the circuit breaker
export const resetCoinMarketCapCircuitBreaker = () => {
  coinMarketCapApi.resetCircuitBreaker();
};

// Utility function to check circuit breaker status
export const getCoinMarketCapCircuitBreakerStatus = () => {
  return coinMarketCapApi.getCircuitBreakerStatus();
};

// Auto-reset circuit breaker on app start if it's been more than 1 minute
const autoResetCircuitBreaker = () => {
  const status = coinMarketCapApi.getCircuitBreakerStatus();
  if (status.isOpen && status.timeRemaining && status.timeRemaining < 30000) {
    console.log("Auto-resetting circuit breaker on app start");
    coinMarketCapApi.resetCircuitBreaker();
  }
};

// Run auto-reset when the module loads
autoResetCircuitBreaker();

// Utility functions to convert CoinMarketCap responses to our app's Ticker format
export function convertCMCToTicker(
  crypto: CoinMarketCapCryptocurrency,
  additionalData?: Partial<import("../types/social").Ticker>,
): import("../types/social").Ticker {
  const usdQuote = crypto.quote.USD;
  const change = usdQuote.percent_change_24h || 0;
  const price = usdQuote.price || 0;
  const volume = usdQuote.volume_24h || 0;

  return {
    symbol: crypto.symbol,
    name: crypto.name,
    type: "crypto" as const,
    exchange: "CMC",
    marketCap: usdQuote.market_cap,
    price,
    change: (price * change) / 100, // Convert percentage to absolute change
    changePercent: change,
    volume,
    sentimentScore: 0, // This would come from social sentiment analysis
    bullishCount: 0,
    bearishCount: 0,
    neutralCount: 0,
    totalPosts: 0,
    trendingScore: crypto.cmc_rank ? (1000 - crypto.cmc_rank) / 10 : 0, // Use rank as trending score
    postVolume24h: 0,
    sentimentChange24h: 0,
    lastUpdated: new Date(usdQuote.last_updated),
    ...additionalData,
  };
}

export function convertMultipleCMCToTickers(
  cryptos: CoinMarketCapCryptocurrency[],
  additionalData?: Record<string, Partial<import("../types/social").Ticker>>,
): import("../types/social").Ticker[] {
  return cryptos.map((crypto) =>
    convertCMCToTicker(crypto, additionalData?.[crypto.symbol]),
  );
}

// Rate limiting helper (CoinMarketCap has different rate limits based on plan)
class CMCRateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number = 333, timeWindowMs: number = 60000) {
    // 333 requests per minute for basic plan
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

export const cmcRateLimiter = new CMCRateLimiter();

// Enhanced API service with rate limiting
export class RateLimitedCoinMarketCapService extends CoinMarketCapService {
  async getListingsLatest(
    start: number = 1,
    limit: number = 100,
    convert: string = "USD",
    sort: string = "market_cap",
  ): Promise<CoinMarketCapListingsResponse> {
    await cmcRateLimiter.checkLimit();
    return super.getListingsLatest(start, limit, convert, sort);
  }

  async getQuotesBySymbol(
    symbols: string[],
    convert: string = "USD",
  ): Promise<CoinMarketCapQuotesResponse> {
    await cmcRateLimiter.checkLimit();
    return super.getQuotesBySymbol(symbols, convert);
  }

  async getQuotesById(
    ids: number[],
    convert: string = "USD",
  ): Promise<CoinMarketCapQuotesResponse> {
    await cmcRateLimiter.checkLimit();
    return super.getQuotesById(ids, convert);
  }

  async getTrendingCryptocurrencies(
    limit: number = 10,
    timePeriod: "1h" | "24h" | "7d" | "30d" = "24h",
  ): Promise<CoinMarketCapListingsResponse> {
    await cmcRateLimiter.checkLimit();
    return super.getTrendingCryptocurrencies(limit, timePeriod);
  }
}

export const rateLimitedCoinMarketCapApi =
  new RateLimitedCoinMarketCapService();
