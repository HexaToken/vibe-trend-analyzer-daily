/**
 * Performance utilities for React components
 * Helps identify and fix performance bottlenecks
 */

// Debounce function to prevent excessive API calls
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  }) as T;
};

// Throttle function for scroll/resize events
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
};

// Memory usage tracker for development
export const trackMemoryUsage = (componentName: string) => {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memory = (performance as any).memory;
    console.log(`${componentName} Memory:`, {
      used: Math.round(memory.usedJSHeapSize / 1048576) + 'MB',
      total: Math.round(memory.totalJSHeapSize / 1048576) + 'MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) + 'MB'
    });
  }
};

// Lazy load images with intersection observer
export const lazyLoadImage = (
  img: HTMLImageElement,
  src: string,
  placeholder?: string
) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: '50px' }
  );

  if (placeholder) {
    img.src = placeholder;
  }
  img.classList.add('lazy');
  observer.observe(img);
};