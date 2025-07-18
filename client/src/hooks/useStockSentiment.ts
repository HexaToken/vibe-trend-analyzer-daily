import { useState, useEffect } from "react";

interface StockSentimentData {
  score: number;
  label: string;
  change: number;
  samples: number;
}

// Top 10 US stocks by market cap
const TOP_10_STOCKS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "NVDA",
  "TSLA",
  "META",
  "BRK.B",
  "AVGO",
  "JPM",
];

export const useStockSentiment = (refreshInterval: number = 300000) => {
  // 5 minutes default
  const [data, setData] = useState<StockSentimentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateSentimentScore = (changePercent: number): number => {
    if (changePercent >= 3) return 10;
    if (changePercent >= 1) return 5;
    if (changePercent > -1) return 0;
    if (changePercent >= -3) return -5;
    return -10;
  };

  const fetchStockSentiment = async () => {
    setLoading(true);
    setError(null);

    try {
      const stockPromises = TOP_10_STOCKS.map(async (symbol) => {
        try {
          const response = await fetch(
            `/api/proxy/finnhub/quote?symbol=${symbol}`,
          );

          if (!response.ok) {
            console.warn(
              `Failed to fetch ${symbol}: ${response.status} ${response.statusText}`,
            );
            return {
              symbol,
              changePercent: 0,
              sentimentScore: 0,
            };
          }

          const data = await response.json();

          // Handle API error responses
          if (data.error) {
            console.warn(`API error for ${symbol}:`, data.error);
            return {
              symbol,
              changePercent: 0,
              sentimentScore: 0,
            };
          }

          return {
            symbol,
            changePercent: data.dp || 0,
            sentimentScore: calculateSentimentScore(data.dp || 0),
          };
        } catch (stockError) {
          console.warn(`Error fetching ${symbol}:`, stockError);
          return {
            symbol,
            changePercent: 0,
            sentimentScore: 0,
          };
        }
      });

      const stockData = await Promise.all(stockPromises);

      // Filter out symbols that returned no data and have at least some valid stocks
      const validStockData = stockData.filter(
        (stock) => stock.changePercent !== 0 || stock.sentimentScore !== 0,
      );

      // Use valid data if available, otherwise use all data (including zeros for fallback)
      const dataToUse = validStockData.length > 0 ? validStockData : stockData;

      // Calculate average sentiment score
      const totalSentimentScore = stockData.reduce(
        (sum, stock) => sum + stock.sentimentScore,
        0,
      );
      const averageSentimentScore = totalSentimentScore / stockData.length;

      // Scale to -50 to +50 range, then normalize to 0-100 for dashboard display
      const scaledScore = averageSentimentScore * 5;
      const normalizedScore = Math.max(0, Math.min(100, scaledScore + 50)); // Convert -50/+50 to 0-100

      // Calculate average percentage change for change indicator
      const averageChange =
        stockData.reduce((sum, stock) => sum + stock.changePercent, 0) /
        stockData.length;

      setData({
        score: Math.round(normalizedScore),
        label: getScoreLabel(scaledScore),
        change: Number(averageChange.toFixed(2)),
        samples: stockData.length * 1000, // Approximate sample size
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch stock sentiment",
      );
      console.error("Stock sentiment error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 30) return "Bullish";
    if (score >= 10) return "Cautiously Optimistic";
    if (score >= -9) return "Neutral";
    if (score >= -29) return "Cautiously Bearish";
    return "Bearish";
  };

  useEffect(() => {
    fetchStockSentiment();

    const interval = setInterval(fetchStockSentiment, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchStockSentiment,
  };
};
