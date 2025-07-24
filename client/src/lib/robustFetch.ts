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
 * Creates a timeout-aware AbortController with proper cleanup
 */
function createTimeoutController(timeoutMs: number): {
  controller: AbortController;
  cleanup: () => void;
} {
  const controller = new AbortController();
  let timeoutId: NodeJS.Timeout | null = null;

  if (timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    }, timeoutMs);
  }

  return {
    controller,
    cleanup: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }
  };
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
    const { controller, cleanup } = createTimeoutController(timeout);

    try {
      // Handle existing signal if provided
      if (fetchOptions.signal) {
        if (fetchOptions.signal.aborted) {
          throw new Error("Request was aborted before starting");
        }

        // Listen for external abort
        fetchOptions.signal.addEventListener('abort', () => {
          controller.abort();
        });
      }

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      // Clear timeout immediately on success
      cleanup();

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
      // Ensure timeout is cleared in case of error
      cleanup();

      lastError = error instanceof Error ? error : new Error(String(error));

      // Handle different types of abort errors more specifically
      if (lastError.name === "AbortError" || lastError.message.includes("aborted")) {
        // Check if it was our timeout or an external abort
        if (controller.signal.aborted) {
          // If we have a reason, use it; otherwise assume timeout
          const reason = (controller.signal as any).reason;
          if (reason) {
            lastError = new Error(`Request aborted: ${reason}`);
          } else {
            // Default to timeout since we control this signal
            lastError = new Error("Request timeout");
          }
        } else {
          // External abort or unknown abort
          lastError = new Error("Request was aborted externally");
        }
      }

      // Catch any remaining "signal is aborted without reason" errors
      if (lastError.message.includes("signal is aborted without reason")) {
        lastError = new Error("Request timeout");
      }

      console.warn(
        `Fetch attempt ${attempt + 1} failed for ${url}:`,
        lastError.message,
      );

      // Don't retry on abort (timeout), external abort, or 4xx errors
      if (
        lastError.message.includes("timeout") ||
        lastError.message.includes("aborted") ||
        (error instanceof FetchError &&
          error.status &&
          error.status >= 400 &&
          error.status < 500)
      ) {
        break;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        console.error(
          `All ${maxRetries + 1} fetch attempts failed for ${url}:`,
          lastError.message,
        );
        break;
      }

      // Wait before retrying with exponential backoff
      const delay = retryDelay * Math.pow(backoffMultiplier, attempt);
      console.warn(`Retrying fetch for ${url} in ${delay}ms...`);
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
