export interface AlphaVantageTimeSeriesData {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

export interface AlphaVantageMetaData {
  "1. Information": string;
  "2. Symbol": string;
  "3. Last Refreshed": string;
  "4. Output Size": string;
  "5. Time Zone": string;
}

export interface AlphaVantageResponse {
  "Meta Data": AlphaVantageMetaData;
  "Time Series (Daily)": Record<string, AlphaVantageTimeSeriesData>;
}

export interface AlphaVantageError {
  "Error Message"?: string;
  "Note"?: string;
}

export class AlphaVantageApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlphaVantageApiError";
  }
}

// For backward compatibility during transition
export class PolygonApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PolygonApiError";
  }
}

class AlphaVantageApiService {
  private baseUrl = "/api/proxy/alphavantage";

  private async fetchFromApi<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const queryParams = new URLSearchParams(params);
    const url = `${this.baseUrl}${endpoint}?${queryParams.toString()}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Check for API error messages
    if (data["Error Message"] || data["Note"]) {
      throw new AlphaVantageApiError(data["Error Message"] || data["Note"] || "Alpha Vantage API error");
    }

    return data;
  }

  /**
   * Get daily time series data for a stock symbol
   */
  async getTimeSeriesDaily(symbol: string): Promise<AlphaVantageResponse> {
    return this.fetchFromApi<AlphaVantageResponse>("/timeseries", {
      function: "TIME_SERIES_DAILY",
      symbol,
    });
  }

  /**
   * Get intraday time series data for a stock symbol
   */
  async getTimeSeriesIntraday(symbol: string, interval: string = "5min"): Promise<AlphaVantageResponse> {
    return this.fetchFromApi<AlphaVantageResponse>("/timeseries", {
      function: "TIME_SERIES_INTRADAY",
      symbol,
      interval,
    });
  }
}

export const alphaVantageApi = new AlphaVantageApiService();