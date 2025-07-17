export interface FinnhubSymbolLookupResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export interface FinnhubSymbolLookupResponse {
  count: number;
  result: FinnhubSymbolLookupResult[];
}

export interface FinnhubQuoteResponse {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

export interface FinnhubCandleResponse {
  c: number[]; // Close prices
  h: number[]; // High prices
  l: number[]; // Low prices
  o: number[]; // Open prices
  s: string; // Status
  t: number[]; // Timestamps
  v: number[]; // Volumes
}

export class FinnhubApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FinnhubApiError";
  }
}

// For backward compatibility during transition
export class PolygonApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PolygonApiError";
  }
}

export class AlphaVantageApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlphaVantageApiError";
  }
}

class FinnhubApiService {
  private baseUrl = "/api/proxy/finnhub";

  private async fetchFromApi<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const queryParams = new URLSearchParams(params);
    const url = `${this.baseUrl}${endpoint}?${queryParams.toString()}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new FinnhubApiError(`Finnhub API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Check for API error messages
    if (data.error) {
      throw new FinnhubApiError(data.error || "Finnhub API error");
    }

    return data;
  }

  /**
   * Search for symbols (symbol lookup)
   */
  async symbolLookup(query: string): Promise<FinnhubSymbolLookupResponse> {
    return this.fetchFromApi<FinnhubSymbolLookupResponse>("/symbol-lookup", {
      query,
    });
  }

  /**
   * Get real-time quote for a symbol
   */
  async getQuote(symbol: string): Promise<FinnhubQuoteResponse> {
    return this.fetchFromApi<FinnhubQuoteResponse>("/quote", {
      symbol,
    });
  }

  /**
   * Get candlestick data for a symbol
   */
  async getCandles(
    symbol: string,
    resolution: string = "D",
    from?: number,
    to?: number
  ): Promise<FinnhubCandleResponse> {
    const params: Record<string, string> = {
      symbol,
      resolution,
    };
    
    if (from) params.from = from.toString();
    if (to) params.to = to.toString();

    return this.fetchFromApi<FinnhubCandleResponse>("/candles", params);
  }
}

export const finnhubApi = new FinnhubApiService();