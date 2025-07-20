import { useAppStore } from '@/stores/useAppStore';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

interface ApiError {
  message: string;
  status?: number;
  code?: string;
  data?: any;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.defaultTimeout = 10000; // 10 seconds
  }

  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retries = 1,
      retryDelay = 1000,
    } = config;

    const url = `${this.baseUrl}${endpoint}`;
    const requestHeaders = { ...this.defaultHeaders, ...headers };

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...requestConfig,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ApiError({
            message: `Request failed: ${response.statusText}`,
            status: response.status,
            data: await response.text(),
          });
        }

        const data = await response.json();

        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        };
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof ApiError && error.status && error.status < 500) {
          break;
        }

        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
      }
    }

        // Log error and update metrics
    console.error('API request failed:', { endpoint, error: lastError });
    try {
      const store = useAppStore.getState();
      store.updatePerformanceMetrics({
        errorCount: store.performanceMetrics.errorCount + 1,
      });
    } catch (storeError) {
      console.warn('Failed to update metrics:', storeError);
    }

    throw lastError;
  }

  // HTTP methods
  async get<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'DELETE' });
  }

  async patch<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  // Batch requests
  async batchQuotes(symbols: string[]): Promise<ApiResponse<Record<string, any>>> {
    return this.post('/proxy/finnhub/batch-quotes', { symbols });
  }

  async batchCrypto(symbols: string[]): Promise<ApiResponse<any[]>> {
    return this.post('/proxy/coinmarketcap/batch-quotes', { symbols });
  }

  // News endpoints
  async getNews(params?: { category?: string; sources?: string; q?: string }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }
    return this.get(`/proxy/newsapi/top-headlines?${searchParams.toString()}`);
  }

  // Social endpoints
  async getTrendingTopics(woeid?: number): Promise<ApiResponse<any>> {
    return this.get(`/proxy/twitter/trending?woeid=${woeid || 1}`);
  }

  // Sentiment analysis
  async analyzeSentiment(text: string): Promise<ApiResponse<any>> {
    return this.post('/nlp/sentiment', { text });
  }

  async batchSentimentAnalysis(texts: string[]): Promise<ApiResponse<any[]>> {
    return this.post('/nlp/batch-sentiment', { texts });
  }
}

// Custom error class
class ApiError extends Error {
  status?: number;
  code?: string;
  data?: any;

  constructor({ message, status, code, data }: { message: string; status?: number; code?: string; data?: any }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export types for use in components
export type { ApiResponse, ApiError, RequestConfig };

// React hook for API calls
export function useApiClient() {
  return apiClient;
}

// Helper function for handling API errors
export function handleApiError(error: unknown): { message: string; canRetry: boolean } {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      canRetry: !error.status || error.status >= 500,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      canRetry: true,
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    canRetry: true,
  };
}
