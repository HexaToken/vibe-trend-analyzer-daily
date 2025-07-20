import React, { Suspense } from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Loading } from '@/components/common/Loading';

// Lazy load social components
const SocialPlatform = React.lazy(() => import('@/components/social/SocialPlatform'));
const Community = React.lazy(() => import('@/components/Community'));
const Channels = React.lazy(() => import('@/components/social/Channels'));

interface SocialFeatureProps {
  variant: 'platform' | 'community' | 'channels';
}

export const SocialFeature: React.FC<SocialFeatureProps> = ({ variant }) => {
  const renderSocial = () => {
    switch (variant) {
      case 'platform':
        return <SocialPlatform />;
      case 'community':
        return <Community />;
      case 'channels':
        return <Channels />;
      default:
        return <SocialPlatform />;
    }
  };

  return (
    <ErrorBoundary level="page" showDetails={process.env.NODE_ENV === 'development'}>
      <Suspense fallback={<Loading size="lg" text="Loading social features..." fullScreen />}>
        {renderSocial()}
      </Suspense>
    </ErrorBoundary>
  );
};

export default SocialFeature;
