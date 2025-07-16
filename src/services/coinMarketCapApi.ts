// CoinMarketCap API Service
// Documentation: https://coinmarketcap.com/api/documentation/v1/

const API_KEY = "a23f6083-9fcc-44d9-b03f-7cee769e3b91";
const BASE_URL = "https://pro-api.coinmarketcap.com/v1";
const PROXY_BASE_URL = "http://localhost:3001/api/proxy/coinmarketcap";

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
  private proxyURL = PROXY_BASE_URL;
  private apiKey = API_KEY;
  private useProxy = true; // Toggle to use proxy or direct API

  private async fetchFromApi<T>(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    // Use proxy if available, fallback to direct API
    if (this.useProxy) {
      return this.fetchViaProxy<T>(endpoint, params);
    }

    const url = new URL(`${this.baseURL}${endpoint}`);

    // Add parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const headers = {
      "X-CMC_PRO_API_KEY": this.apiKey,
      Accept: "application/json",
      "Accept-Encoding": "deflate, gzip",
    };

    try {
      const response = await fetch(url.toString(), { headers });
      const data = await response.json();

      // Check for API errors
      if (data.status && data.status.error_code !== 0) {
        throw new CoinMarketCapApiError(
          data.status.error_message || "API request failed",
          data.status.error_code,
          "error",
        );
      }

      if (!response.ok) {
        throw new CoinMarketCapApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof CoinMarketCapApiError) {
        throw error;
      }
      throw new CoinMarketCapApiError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async fetchViaProxy<T>(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    try {
      let proxyEndpoint = "";

      // Map API endpoints to proxy endpoints
      if (endpoint === "/cryptocurrency/listings/latest") {
        proxyEndpoint = "/listings";
      } else if (endpoint === "/cryptocurrency/quotes/latest") {
        proxyEndpoint = "/quotes";
      } else if (endpoint === "/global-metrics/quotes/latest") {
        proxyEndpoint = "/global-metrics";
      } else {
        // Fallback to direct API for unsupported endpoints
        this.useProxy = false;
        return this.fetchFromApi<T>(endpoint, params);
      }

      const url = new URL(`${this.proxyURL}${proxyEndpoint}`);

      // Add parameters
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      const response = await fetch(url.toString());

      if (!response.ok) {
        // If proxy fails, try direct API as fallback
        console.warn("Proxy failed, falling back to direct API");
        this.useProxy = false;
        return this.fetchFromApi<T>(endpoint, params);
      }

      const data = await response.json();

      // Check for API errors
      if (data.error) {
        throw new CoinMarketCapApiError(data.error);
      }

      return data;
    } catch (error) {
      // If proxy fails, try direct API as fallback
      console.warn("Proxy error, falling back to direct API:", error);
      this.useProxy = false;
      return this.fetchFromApi<T>(endpoint, params);
    }
  }

  /**
   * Get latest cryptocurrency listings
   */
  async getListingsLatest(
    start: number = 1,
    limit: number = 100,
    convert: string = "USD",
    sort: string = "market_cap",
  ): Promise<CoinMarketCapListingsResponse> {
    return this.fetchFromApi<CoinMarketCapListingsResponse>(
      "/cryptocurrency/listings/latest",
      {
        start: start.toString(),
        limit: limit.toString(),
        convert,
        sort,
      },
    );
  }

  /**
   * Get quotes for specific cryptocurrencies by symbol
   */
  async getQuotesBySymbol(
    symbols: string[],
    convert: string = "USD",
  ): Promise<CoinMarketCapQuotesResponse> {
    return this.fetchFromApi<CoinMarketCapQuotesResponse>(
      "/cryptocurrency/quotes/latest",
      {
        symbol: symbols.join(","),
        convert,
      },
    );
  }

  /**
   * Get quotes for specific cryptocurrencies by ID
   */
  async getQuotesById(
    ids: number[],
    convert: string = "USD",
  ): Promise<CoinMarketCapQuotesResponse> {
    return this.fetchFromApi<CoinMarketCapQuotesResponse>(
      "/cryptocurrency/quotes/latest",
      {
        id: ids.join(","),
        convert,
      },
    );
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

    return this.fetchFromApi("/cryptocurrency/info", params);
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
    return this.fetchFromApi("/cryptocurrency/map", {
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
    return this.fetchFromApi<CoinMarketCapListingsResponse>(
      "/cryptocurrency/trending/latest",
      {
        limit: limit.toString(),
        time_period: timePeriod,
      },
    );
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
    return this.fetchFromApi("/global-metrics/quotes/latest", { convert });
  }
}

// Export singleton instance
export const coinMarketCapApi = new CoinMarketCapService();

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
