import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { LineChart, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FinanceMoodChartProps {
  title?: string;
  timeframe?: '1D' | '7D' | '30D' | '1Y';
  height?: number;
  showControls?: boolean;
  showLegend?: boolean;
  apiEndpoint?: string;
}

interface MoodDataPoint {
  date: string;
  score: number;
  stocks: number;
  news: number;
  social: number;
}

export const FinanceMoodChart: React.FC<FinanceMoodChartProps> = ({
  title = "7-Day Mood Trend",
  timeframe = '7D',
  height = 250,
  showControls = true,
  showLegend = true,
  apiEndpoint = "/api/proxy/mood-history"
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([
    { date: 'Mon', score: 58, stocks: 55, news: 60, social: 59 },
    { date: 'Tue', score: 62, stocks: 58, news: 65, social: 63 },
    { date: 'Wed', score: 55, stocks: 52, news: 57, social: 56 },
    { date: 'Thu', score: 68, stocks: 65, news: 70, social: 69 },
    { date: 'Fri', score: 72, stocks: 70, news: 74, social: 71 },
    { date: 'Sat', score: 69, stocks: 67, news: 71, social: 68 },
    { date: 'Sun', score: 72, stocks: 69, news: 75, social: 72 }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMoodData = async () => {
      setLoading(true);
      try {
        // Generate different data based on timeframe
        let newData: MoodDataPoint[] = [];
        
        switch (selectedTimeframe) {
          case '1D':
            newData = Array.from({ length: 24 }, (_, i) => ({
              date: `${i}:00`,
              score: 50 + Math.random() * 30,
              stocks: 45 + Math.random() * 35,
              news: 40 + Math.random() * 40,
              social: 50 + Math.random() * 25,
            }));
            break;
          case '30D':
            newData = Array.from({ length: 30 }, (_, i) => ({
              date: `${i + 1}`,
              score: 50 + Math.random() * 30,
              stocks: 45 + Math.random() * 35,
              news: 40 + Math.random() * 40,
              social: 50 + Math.random() * 25,
            }));
            break;
          case '1Y':
            newData = Array.from({ length: 12 }, (_, i) => ({
              date: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
              score: 50 + Math.random() * 30,
              stocks: 45 + Math.random() * 35,
              news: 40 + Math.random() * 40,
              social: 50 + Math.random() * 25,
            }));
            break;
          default: // 7D
            newData = [
              { date: 'Mon', score: 58, stocks: 55, news: 60, social: 59 },
              { date: 'Tue', score: 62, stocks: 58, news: 65, social: 63 },
              { date: 'Wed', score: 55, stocks: 52, news: 57, social: 56 },
              { date: 'Thu', score: 68, stocks: 65, news: 70, social: 69 },
              { date: 'Fri', score: 72, stocks: 70, news: 74, social: 71 },
              { date: 'Sat', score: 69, stocks: 67, news: 71, social: 68 },
              { date: 'Sun', score: 72, stocks: 69, news: 75, social: 72 }
            ];
        }
        
        setMoodData(newData);
      } catch (error) {
        console.error("Failed to fetch mood data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [selectedTimeframe, apiEndpoint]);

  const timeframes = [
    { value: '1D', label: '1D' },
    { value: '7D', label: '7D' },
    { value: '30D', label: '30D' },
    { value: '1Y', label: '1Y' }
  ];

  const maxScore = Math.max(...moodData.map(d => d.score));

  return (
    <Card className="finance-card border-0">
      <CardHeader className="border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <LineChart className="w-5 h-5 text-blue-400" />
            {title}
            {loading && (
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            )}
          </CardTitle>
          
          {showControls && (
            <div className="flex gap-2">
              {timeframes.map((tf) => (
                <Button
                  key={tf.value}
                  variant={selectedTimeframe === tf.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(tf.value as any)}
                  className="text-xs h-7 px-3"
                >
                  {tf.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Chart */}
        <div className="relative" style={{ height: `${height}px` }}>
          <div className="h-full flex items-end justify-between gap-2">
            {moodData.map((dataPoint, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group">
                {/* Main Score Bar */}
                <div 
                  className="w-full bg-gradient-to-t from-blue-500/60 to-blue-400/80 rounded-t transition-all duration-500 hover:from-blue-500/80 relative"
                  style={{ height: `${(dataPoint.score / 100) * (height - 60)}px` }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    <div className="font-medium">{dataPoint.date}</div>
                    <div>Overall: {Math.round(dataPoint.score)}</div>
                    {showLegend && (
                      <>
                        <div className="text-green-400">Stocks: {Math.round(dataPoint.stocks)}</div>
                        <div className="text-blue-400">News: {Math.round(dataPoint.news)}</div>
                        <div className="text-purple-400">Social: {Math.round(dataPoint.social)}</div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Date Label */}
                <div className="text-xs text-slate-400 mt-2">{dataPoint.date}</div>
                <div className="text-xs text-white font-medium">{Math.round(dataPoint.score)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full" />
              <span className="text-xs text-slate-400">Overall Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
              <span className="text-xs text-slate-400">Stocks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-300 rounded-full" />
              <span className="text-xs text-slate-400">News</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full" />
              <span className="text-xs text-slate-400">Social</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
