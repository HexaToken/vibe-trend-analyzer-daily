import { useEffect, useRef, useCallback } from 'react';

/**
 * Performance monitoring hooks for React components
 */

// Debounce hook to prevent excessive API calls
export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T => {
  const debounceRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: any[]) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// Throttle hook for scroll/resize events
export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  limit: number
): T => {
  const inThrottle = useRef<boolean>(false);

  const throttledCallback = useCallback(
    (...args: any[]) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    },
    [callback, limit]
  ) as T;

  return throttledCallback;
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    
    if (process.env.NODE_ENV === 'development') {
      const renderTime = Date.now() - startTime.current;
      if (renderTime > 16) { // More than one frame (60fps)
        console.warn(`${componentName} slow render: ${renderTime}ms (render #${renderCount.current})`);
      }
    }
    
    startTime.current = Date.now();
  });

  const trackInteraction = useCallback((action: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} interaction: ${action}`);
    }
  }, [componentName]);

  return { trackInteraction };
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
) => {
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => callback(entry.isIntersecting),
      { rootMargin: '50px', ...options }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [callback, options]);

  return targetRef;
};