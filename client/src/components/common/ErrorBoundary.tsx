import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

interface Props {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'critical';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  private errorCount = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.errorCount++;
    
    // Log error details
    console.error('ErrorBoundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      level: this.props.level || 'component',
      timestamp: new Date().toISOString(),
    });

        // Update performance metrics
    try {
      const store = useAppStore.getState();
      store.updatePerformanceMetrics({
        errorCount: store.performanceMetrics.errorCount + 1,
      });
    } catch (storeError) {
      console.warn('Failed to update error metrics:', storeError);
    }

    // Report to external service (if available)
    this.reportError(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // This would integrate with error reporting services like Sentry
    // For now, we'll just log it
    if (process.env.NODE_ENV === 'production') {
      // In production, you would send this to your error reporting service
      console.warn('Error reported:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: '',
    });
  };

  private handleReload = () => {
    // Only reload if user explicitly confirms and we have tried other recovery methods
    if (confirm('This will reload the entire page. Any unsaved changes will be lost. Continue?')) {
      window.location.reload();
    }
  };

    private handleGoHome = () => {
    try {
      const store = useAppStore.getState();
      store.setActiveSection('moorMeter');
      this.handleRetry();
    } catch (storeError) {
      console.warn('Failed to navigate home:', storeError);
      this.handleRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      const { level = 'component', showDetails = false } = this.props;
      const { error, errorInfo, errorId } = this.state;

      // Critical errors get a full-screen treatment
      if (level === 'critical') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-destructive">Critical Error</CardTitle>
                <CardDescription>
                  The application encountered a critical error and needs to be restarted.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {showDetails && error && (
                  <div className="rounded-md bg-muted p-3">
                    <code className="text-sm text-muted-foreground">
                      {error.message}
                    </code>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Button onClick={this.handleReload} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Restart Application
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Error ID: {errorId}
                </p>
              </CardContent>
            </Card>
          </div>
        );
      }

      // Page-level errors
      if (level === 'page') {
        return (
          <div className="flex items-center justify-center min-h-[400px] p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                  <Bug className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-lg">Page Error</CardTitle>
                <CardDescription>
                  This page encountered an error and couldn't load properly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {showDetails && error && (
                  <div className="rounded-md bg-muted p-3">
                    <code className="text-xs text-muted-foreground">
                      {error.message}
                    </code>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Button onClick={this.handleRetry} variant="default">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button onClick={this.handleGoHome} variant="outline">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Error ID: {errorId}
                </p>
              </CardContent>
            </Card>
          </div>
        );
      }

      // Component-level errors (compact)
      return (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/10">
          <div className="flex items-start gap-3">
            <Bug className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Component Error
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                This component failed to render properly.
              </p>
              {showDetails && error && (
                <div className="mt-2 rounded bg-orange-100 dark:bg-orange-900/30 p-2">
                  <code className="text-xs text-orange-800 dark:text-orange-200">
                    {error.message}
                  </code>
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={this.handleRetry}
                  className="h-7 text-xs"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// HOC for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  level: Props['level'] = 'component',
  showDetails: boolean = process.env.NODE_ENV === 'development'
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary level={level} showDetails={showDetails}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Hook for programmatic error handling
export function useErrorHandler() {

  return React.useCallback((error: Error, context?: string) => {
    console.error('Manual error handled:', error, context);
    
        try {
      const store = useAppStore.getState();
            store.updatePerformanceMetrics({
        errorCount: store.performanceMetrics.errorCount + 1,
      });

      store.addNotification({
        type: 'error',
        title: 'An error occurred',
        message: context || error.message,
      });
    } catch (storeError) {
      console.warn('Failed to handle error:', storeError);
    }
  }, []);
}
