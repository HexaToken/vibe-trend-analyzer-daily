import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useMoodTheme } from '../../contexts/MoodThemeContext';

interface FinanceMoodGaugeProps {
  title?: string;
  subtitle?: string;
  showBreakdown?: boolean;
  size?: 'small' | 'medium' | 'large';
  apiEndpoint?: string;
}

interface MoodData {
  overall: number;
  stocks: number;
  news: number;
  social: number;
  timestamp: Date;
}

export const FinanceMoodGauge: React.FC<FinanceMoodGaugeProps> = ({
  title = "Market Sentiment",
  subtitle = "Today's sentiment suggests rising investor confidence led by tech earnings.",
  showBreakdown = true,
  size = 'large',
  apiEndpoint = "/api/proxy/stock-sentiment"
}) => {
  const { setMoodScore, themeMode, cardBackground, borderColor } = useMoodTheme();
  const [moodData, setMoodData] = useState<MoodData>({
    overall: 72,
    stocks: 68,
    news: 75,
    social: 74,
    timestamp: new Date()
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMoodScore = async () => {
      setLoading(true);
      try {
        // Simulate API call for now
        const newScore = {
          overall: 60 + Math.random() * 30,
          stocks: 55 + Math.random() * 35,
          news: 50 + Math.random() * 40,
          social: 60 + Math.random() * 25,
          timestamp: new Date(),
        };
        
        setMoodData(newScore);
        setMoodScore(newScore);
      } catch (error) {
        console.error("Failed to fetch mood score:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodScore();
    const interval = setInterval(fetchMoodScore, 30000);
    return () => clearInterval(interval);
  }, [apiEndpoint, setMoodScore]);

  const getMoodLabel = (score: number) => {
    if (score >= 80) return 'Very Bullish';
    if (score >= 70) return 'Bullish';
    if (score >= 60) return 'Optimistic';
    if (score >= 50) return 'Neutral';
    if (score >= 40) return 'Cautious';
    if (score >= 30) return 'Bearish';
    return 'Very Bearish';
  };

  const getGaugeSize = () => {
    switch (size) {
      case 'small': return 'w-32 h-32';
      case 'medium': return 'w-48 h-48';
      default: return 'w-64 h-64';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return 'text-2xl';
      case 'medium': return 'text-3xl';
      default: return 'text-4xl';
    }
  };

  return (
    <div className={`rounded-lg p-8 text-center ${
      themeMode === 'light'
        ? `${cardBackground} border ${borderColor} shadow-[0_2px_8px_rgba(0,0,0,0.06)]`
        : 'finance-card'
    }`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-semibold mb-2 ${themeMode === 'light' ? 'text-[#1C1E21]' : 'text-white'}`}>{title}</h2>
        <p className={`text-sm ${themeMode === 'light' ? 'text-[#444]' : 'text-slate-300'}`}>{subtitle}</p>
      </div>
      
      {/* Mood Score Gauge */}
      <div className="flex justify-center mb-8">
        <div className={`sentiment-gauge ${getGaugeSize()}`}>
          <div className="sentiment-ring">
            <div className="sentiment-inner">
              <div className={`${getTextSize()} font-bold text-white mb-1`}>
                {loading ? "..." : Math.round(moodData.overall)}
              </div>
              <div className="text-sm text-blue-400 font-medium">
                {getMoodLabel(moodData.overall)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Breakdown */}
      {showBreakdown && (
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { label: 'Stocks', value: moodData.stocks, weight: '40%' },
            { label: 'News', value: moodData.news, weight: '30%' },
            { label: 'Forums', value: moodData.social, weight: '30%' }
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000"
                  style={{ width: `${item.value}%` }}
                />
              </div>
              <div className="text-xs text-slate-400">{item.label} {item.weight}</div>
              <div className="text-sm text-white font-medium">{Math.round(item.value)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
