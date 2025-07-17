/**
 * Polygon.io API service with circuit breaker for rate limiting
 */

export interface PolygonTicker {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  cik?: string;
  composite_figi?: string;
  share_class_figi?: string;
  last_updated_utc: string;
}

export interface PolygonTickersResponse {
  results: PolygonTicker[];
  status: string;
  request_id: string;
  count: number;
  next_url?: string;
}

export interface PolygonDividend {
  cash_amount: number;
  currency: string;
  declaration_date: string;
  dividend_type: string;
  ex_dividend_date: string;
  frequency: number;
  pay_date: string;
  record_date: string;
  ticker: string;
}

export interface PolygonDividendsResponse {
  results: PolygonDividend[];
  status: string;
  request_id: string;
  count: number;
  next_url?: string;
}

export interface PolygonQuote {
  ask: number;
  ask_size: number;
  bid: number;
  bid_size: number;
  exchange: number;
  last_quote: {
    timeframe: string;
    timestamp: number;
  };
  participant_timestamp: number;
  sequence_number: number;
  sip_timestamp: number;
  timeframe: string;
  timestamp: number;
}

export interface PolygonQuotesResponse {
  results: PolygonQuote[];
  status: string;
  request_id: string;
  count: number;
  next_url?: string;
}

class PolygonApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PolygonApiError";
  }
}

interface CircuitBreaker {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime: number;
  threshold: number;
  timeout: number;
}

class PolygonApiService {
  private circuitBreaker: CircuitBreaker = {
    isOpen: false,
    failureCount: 0,
    lastFailureTime: 0,
    threshold: 3,
    timeout: 60000, // 1 minute
  };

  private proxyAvailable = true;

  private checkCircuitBreaker(): boolean {
    if (!this.circuitBreaker.isOpen) return true;

    const now = Date.now();
    if (now - this.circuitBreaker.lastFailureTime > this.circuitBreaker.timeout) {
      this.circuitBreaker.isOpen = false;
      this.circuitBreaker.failureCount = 0;
      return true;
    }

    return false;
  }

  private async fetchFromApi<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.checkCircuitBreaker()) {
      throw new PolygonApiError("API temporarily unavailable due to rate limiting");
    }

    try {
      const queryParams = new URLSearchParams(params);
      const url = `/api/proxy/polygon${endpoint}?${queryParams}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new PolygonApiError(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new PolygonApiError(data.error);
      }

      // Reset failure count on success
      this.circuitBreaker.failureCount = 0;
      this.proxyAvailable = true;
      return data;
    } catch (error) {
      // Update circuit breaker on failure
      this.circuitBreaker.failureCount++;
      this.circuitBreaker.lastFailureTime = Date.now();
      
      if (this.circuitBreaker.failureCount >= this.circuitBreaker.threshold) {
        this.circuitBreaker.isOpen = true;
        console.warn("Polygon API circuit breaker opened due to failures");
      }

      if (error instanceof PolygonApiError) {
        throw error;
      }
      throw new PolygonApiError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Get stock tickers from Polygon.io
   */
  async getTickers(
    market: string = "stocks",
    active: boolean = true,
    order: string = "asc",
    limit: number = 100,
    sort: string = "ticker",
  ): Promise<PolygonTickersResponse> {
    return this.fetchFromApi<PolygonTickersResponse>("/tickers", {
      market,
      active: active.toString(),
      order,
      limit: limit.toString(),
      sort,
    });
  }

  /**
   * Get dividend data for a specific ticker
   */
  async getDividends(ticker: string): Promise<PolygonDividendsResponse> {
    return this.fetchFromApi<PolygonDividendsResponse>("/dividends", {
      ticker,
    });
  }

  /**
   * Get real-time quotes for a specific ticker
   */
  async getQuotes(
    ticker: string,
    order: string = "asc",
    limit: number = 10,
    sort: string = "timestamp",
  ): Promise<PolygonQuotesResponse> {
    return this.fetchFromApi<PolygonQuotesResponse>(`/quotes/${ticker}`, {
      order,
      limit: limit.toString(),
      sort,
    });
  }

  /**
   * Check if the service is available
   */
  isAvailable(): boolean {
    return this.proxyAvailable && !this.circuitBreaker.isOpen;
  }

  /**
   * Get circuit breaker status
   */
  getCircuitBreakerStatus() {
    return {
      isOpen: this.circuitBreaker.isOpen,
      failureCount: this.circuitBreaker.failureCount,
      threshold: this.circuitBreaker.threshold,
    };
  }
}

// Export singleton instance
export const polygonApi = new PolygonApiService();