import React, { Suspense } from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Loading } from '@/components/common/Loading';

// Lazy load trading components
const CryptoDashboard = React.lazy(() => import('@/components/crypto/CryptoDashboard'));
const FinnhubDemo = React.lazy(() => import('@/components/FinnhubDemo'));
const YFinanceDemo = React.lazy(() => import('@/components/YFinanceDemo'));
const StockSentimentScoring = React.lazy(() => import('@/components/StockSentimentScoring'));

interface TradingFeatureProps {
  variant: 'crypto' | 'finnhub' | 'yfinance' | 'sentiment-scoring';
}

export const TradingFeature: React.FC<TradingFeatureProps> = ({ variant }) => {
  const renderTrading = () => {
    switch (variant) {
      case 'crypto':
        return <CryptoDashboard />;
      case 'finnhub':
        return <FinnhubDemo />;
      case 'yfinance':
        return <YFinanceDemo />;
      case 'sentiment-scoring':
        return <StockSentimentScoring />;
      default:
        return <CryptoDashboard />;
    }
  };

  return (
    <ErrorBoundary level="page" showDetails={process.env.NODE_ENV === 'development'}>
      <Suspense fallback={<Loading size="lg" text="Loading trading features..." fullScreen />}>
        {renderTrading()}
      </Suspense>
    </ErrorBoundary>
  );
};

export default TradingFeature;
