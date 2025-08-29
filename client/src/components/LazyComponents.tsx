/**
 * Lazy-loaded components for performance optimization
 * Split heavy components to reduce initial bundle size
 */
import { lazy } from 'react';

// Loading skeletons
export const ChartSkeleton = () => (
  <div className="h-64 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800">
    <div className="h-full flex items-center justify-center">
      <div className="text-sm text-gray-500">Loading chart...</div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      ))}
    </div>
    <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl" />
  </div>
);

export const CryptoSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map(i => (
        <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      ))}
    </div>
  </div>
);

// Lazy loaded heavy components
export const LazyAnalytics = lazy(() => import('./Analytics').then(module => ({ default: module.Analytics })));
export const LazyNeonSenseCryptoDashboard = lazy(() => import('./crypto/NeonSenseCryptoDashboard'));
export const LazyAdvancedTradingChart = lazy(() => import('./finance/AdvancedTradingChart').then(module => ({ default: module.AdvancedTradingChart })));