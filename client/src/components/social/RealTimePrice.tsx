import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuote } from "@/hooks/useAlphaVantage";
import { cn } from "@/lib/utils";

interface RealTimePriceProps {
  symbol: string;
  size?: "sm" | "md" | "lg";
  showRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
}

export const RealTimePrice = ({
  symbol,
  size = "md",
  showRefresh = false,
  refreshInterval = 180000, // 3 minutes
  className,
}: RealTimePriceProps) => {
  const { ticker, loading, error, refetch } = useQuote(symbol, {
    refreshInterval,
    enabled: true,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return {
      change: `${isPositive ? "+" : ""}${change.toFixed(2)}`,
      changePercent: `${isPositive ? "+" : ""}${changePercent.toFixed(2)}%`,
      isPositive,
    };
  };

  const sizeClasses = {
    sm: {
      container: "text-xs",
      price: "text-sm font-semibold",
      change: "text-xs",
      icon: "h-3 w-3",
    },
    md: {
      container: "text-sm",
      price: "text-lg font-bold",
      change: "text-sm",
      icon: "h-4 w-4",
    },
    lg: {
      container: "text-base",
      price: "text-2xl font-bold",
      change: "text-base",
      icon: "h-5 w-5",
    },
  };

  const classes = sizeClasses[size];

  if (loading && !ticker) {
    return (
      <div
        className={cn("flex items-center gap-2", classes.container, className)}
      >
        <Loader2 className={cn("animate-spin", classes.icon)} />
        <span className="text-muted-foreground">Loading ${symbol}...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn("flex items-center gap-2", classes.container, className)}
      >
        <Badge variant="destructive" className="text-xs">
          Error
        </Badge>
        <span className="text-muted-foreground">${symbol}</span>
        {showRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-6 w-6 p-0"
          >
            <RefreshCw
              className={cn("h-3 w-3", isRefreshing && "animate-spin")}
            />
          </Button>
        )}
      </div>
    );
  }

  if (!ticker) {
    return (
      <div
        className={cn("flex items-center gap-2", classes.container, className)}
      >
        <span className="text-muted-foreground">${symbol} - Not found</span>
      </div>
    );
  }

  const { change, changePercent, isPositive } = formatChange(
    ticker.change,
    ticker.changePercent,
  );
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn("flex items-center gap-2", classes.container, className)}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-medium">${symbol}</span>
          <span className={classes.price}>{formatPrice(ticker.price)}</span>
          {showRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="h-6 w-6 p-0"
            >
              <RefreshCw
                className={cn(
                  "h-3 w-3",
                  (isRefreshing || loading) && "animate-spin",
                )}
              />
            </Button>
          )}
        </div>
        <div
          className={cn("flex items-center gap-1", changeColor, classes.change)}
        >
          <TrendIcon className={classes.icon} />
          <span>{change}</span>
          <span>({changePercent})</span>
        </div>
      </div>
    </div>
  );
};

// Compact version for inline use in posts
export const InlinePrice = ({
  symbol,
  className,
}: {
  symbol: string;
  className?: string;
}) => {
  const { ticker, loading, error } = useQuote(symbol, {
    refreshInterval: 180000, // Refresh every 3 minutes for inline prices (Alpha Vantage has lower rate limits)
    enabled: true,
  });

  if (loading || error || !ticker) {
    return <span className={cn("font-medium", className)}>${symbol}</span>;
  }

  const isPositive = ticker.change >= 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="font-medium">${symbol}</span>
      <span className="font-semibold">${ticker.price.toFixed(2)}</span>
      <span className={cn("text-xs", changeColor)}>
        ({isPositive ? "+" : ""}
        {ticker.changePercent.toFixed(2)}%)
      </span>
    </span>
  );
};

// Grid component for displaying multiple stocks
interface StockGridProps {
  symbols: string[];
  className?: string;
}

export const StockGrid = ({ symbols, className }: StockGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className,
      )}
    >
      {symbols.map((symbol) => (
        <div key={symbol} className="p-4 border rounded-lg">
          <RealTimePrice
            symbol={symbol}
            size="md"
            showRefresh={true}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
};
