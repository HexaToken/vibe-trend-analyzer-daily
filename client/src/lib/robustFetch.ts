interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  backoffMultiplier?: number;
}

interface RobustFetchOptions extends RequestInit {
  retry?: RetryOptions;
}

export class FetchError extends Error {
  public readonly status?: number;
  public readonly response?: Response;

  constructor(message: string, status?: number, response?: Response) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.response = response;
  }
}

/**
 * A robust fetch function with retry logic and better error handling
 */
export async function robustFetch(
  url: string,
  options: RobustFetchOptions = {},
): Promise<Response> {
  const { retry = {}, ...fetchOptions } = options;

  const {
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 10000,
    backoffMultiplier = 2,
  } = retry;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // If response is not ok, throw error but don't retry for 4xx errors
      if (!response.ok) {
        const error = new FetchError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response,
        );

        // Don't retry for client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          throw error;
        }

        // For server errors (5xx), we'll retry
        throw error;
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on abort (timeout) or 4xx errors
      if (
        lastError.name === "AbortError" ||
        (error instanceof FetchError &&
          error.status &&
          error.status >= 400 &&
          error.status < 500)
      ) {
        break;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Wait before retrying with exponential backoff
      const delay = retryDelay * Math.pow(backoffMultiplier, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error("Unknown fetch error");
}

/**
 * A robust fetch function that returns JSON with better error handling
 */
export async function robustFetchJson<T = any>(
  url: string,
  options: RobustFetchOptions = {},
): Promise<T> {
  try {
    const response = await robustFetch(url, options);

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new FetchError("Response is not JSON", response.status, response);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof FetchError) {
      throw error;
    }
    throw new FetchError(
      `Failed to fetch JSON from ${url}: ${error}`,
      undefined,
      undefined,
    );
  }
}

/**
 * Utility function to check if an error is a network error that might be worth retrying
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof FetchError) {
    // Retry on 5xx server errors
    return error.status ? error.status >= 500 : true;
  }

  if (error instanceof Error) {
    // Retry on network errors
    return (
      error.name === "TypeError" && error.message.includes("Failed to fetch")
    );
  }

  return false;
}
