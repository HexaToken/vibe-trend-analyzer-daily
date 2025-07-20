import React, { Suspense } from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Loading } from '@/components/common/Loading';

// Lazy load dashboard components for better performance
const MoorMeterDashboard = React.lazy(() => import('@/components/MoorMeterDashboard'));
const Analytics = React.lazy(() => import('@/components/Analytics'));
const SentimentDashboard = React.lazy(() => import('@/components/SentimentDashboard'));
const HistoricalData = React.lazy(() => import('@/components/HistoricalData'));

interface DashboardFeatureProps {
  variant: 'moorMeter' | 'analytics' | 'sentiment' | 'historical';
}

export const DashboardFeature: React.FC<DashboardFeatureProps> = ({ variant }) => {
  const renderDashboard = () => {
    switch (variant) {
      case 'moorMeter':
        return <MoorMeterDashboard />;
      case 'analytics':
        return <Analytics />;
      case 'sentiment':
        return <SentimentDashboard />;
      case 'historical':
        return <HistoricalData />;
      default:
        return <MoorMeterDashboard />;
    }
  };

  return (
    <ErrorBoundary level="page" showDetails={process.env.NODE_ENV === 'development'}>
      <Suspense fallback={<Loading size="lg" text="Loading dashboard..." fullScreen />}>
        {renderDashboard()}
      </Suspense>
    </ErrorBoundary>
  );
};

export default DashboardFeature;
