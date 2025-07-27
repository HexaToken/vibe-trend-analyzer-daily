import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Brain, TrendingUp, TrendingDown, Volume2, ArrowRight, Hash, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useMoodTheme } from '../../contexts/MoodThemeContext';

interface DailyMoodRecapProps {
  className?: string;
  showAudio?: boolean;
}

interface MoodFlip {
  symbol: string;
  from: 'bullish' | 'bearish' | 'neutral';
  to: 'bullish' | 'bearish' | 'neutral';
  change: string;
}

interface TrendingTopic {
  tag: string;
  momentum: number;
  direction: 'up' | 'down';
}

interface TopMover {
  symbol: string;
  mood: 'bullish' | 'bearish';
  change: string;
}

export const DailyMoodRecap: React.FC<DailyMoodRecapProps> = ({
  className,
  showAudio = true
}) => {
  const { themeMode } = useMoodTheme();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMood] = useState({
    overall: 72,
    trend: 'up',
    change: '+4%'
  });

  const [moodSummary] = useState(
    "Market sentiment is up 4% today, leaning bullish after tech earnings surprise."
  );

  const [topMovers] = useState<TopMover[]>([
    { symbol: 'TSLA', mood: 'bullish', change: '+24%' },
    { symbol: 'GOOGL', mood: 'bearish', change: '-8%' },
    { symbol: 'NVDA', mood: 'bullish', change: '+12%' }
  ]);

  const [headlineSummary] = useState(
    "Fed rate talk and AI innovation dominate news sentiment."
  );

  const [trendingTopics] = useState<TrendingTopic[]>([
    { tag: '#AI', momentum: 34, direction: 'up' },
    { tag: '#RateHikes', momentum: 12, direction: 'down' },
    { tag: '#TechEarnings', momentum: 28, direction: 'up' },
    { tag: '#BTC', momentum: 15, direction: 'down' }
  ]);

  const [moodFlip] = useState<MoodFlip>({
    symbol: 'NFLX',
    from: 'bearish',
    to: 'bullish',
    change: '+18%'
  });

  const getSentimentColor = (mood: string) => {
    switch (mood) {
      case 'bullish': return 'text-emerald-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-amber-400';
    }
  };

  const getSentimentBadge = (mood: string) => {
    switch (mood) {
      case 'bullish': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'bearish': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  const getMoodGlow = (mood: number) => {
    if (mood >= 70) return 'shadow-lg shadow-emerald-500/20 border-emerald-500/30';
    if (mood >= 50) return 'shadow-lg shadow-amber-500/20 border-amber-500/30';
    return 'shadow-lg shadow-red-500/20 border-red-500/30';
  };

  const handleAudioToggle = () => {
    setIsPlaying(!isPlaying);
    // In a real app, you'd integrate with a text-to-speech API here
    console.log('Text-to-speech:', isPlaying ? 'stopped' : 'started');
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Section Title */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            themeMode === 'light'
              ? 'bg-gradient-to-r from-[#3F51B5]/20 to-[#9C27B0]/20 shadow-lg shadow-[#3F51B5]/20'
              : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/20'
          }`}>
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className={`text-3xl font-bold ${
            themeMode === 'light'
              ? 'text-[#1E1E1E]'
              : 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent'
          }`}>
            🧠 Daily Mood Recap
          </h2>
        </div>
        <p className={`text-lg ${
          themeMode === 'light' ? 'text-[#374151]' : 'text-gray-300'
        }`}>
          AI-generated summary of today's market emotions, sentiment moves, and trending topics
        </p>
      </div>

      {/* Main Recap Card */}
      <Card className={cn(
        "relative overflow-hidden transition-all duration-500 hover:scale-[1.02]",
        themeMode === 'light'
          ? 'enhanced-card-light border border-[#E0E0E0]'
          : `bg-black/40 backdrop-blur-xl ${getMoodGlow(currentMood.overall)}`,
        getMoodGlow(currentMood.overall)
      )}>
        
        {/* Animated background effect */}
        {themeMode !== 'light' && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 animate-pulse" />
        )}

        <CardHeader className={themeMode === 'light' ? "border-b border-[#E0E0E0]" : "border-b border-purple-500/20"}>
          <CardTitle className={`flex items-center justify-between ${
            themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
          }`}>
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
              <span>AI Market Mood Summary</span>
              <Badge className={cn(
                "animate-pulse",
                currentMood.overall >= 70 
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : currentMood.overall >= 50
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              )}>
                {currentMood.trend === 'up' ? '↗' : '↘'} {currentMood.change}
              </Badge>
            </div>
            
            {showAudio && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleAudioToggle}
                className={`flex items-center gap-2 ${
                  themeMode === 'light'
                    ? 'hover:bg-[#F5F5F5] text-[#1E1E1E]'
                    : 'hover:bg-purple-500/10 text-purple-300'
                }`}
              >
                <Volume2 className={cn("w-4 h-4", isPlaying && "animate-pulse")} />
                {isPlaying ? 'Stop' : 'Listen'}
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          
          {/* Mood Summary */}
          <div className={`p-5 rounded-xl ${
            themeMode === 'light'
              ? 'bg-gradient-to-r from-[#E8EAF6] to-[#F3E5F5] border border-[#E0E0E0]'
              : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            }`}>
              📈 Mood Summary
            </h3>
            <p className={`text-base leading-relaxed ${
              themeMode === 'light' ? 'text-[#374151]' : 'text-gray-300'
            }`}>
              {moodSummary}
            </p>
          </div>

          {/* Top Movers */}
          <div className={`p-5 rounded-xl ${
            themeMode === 'light'
              ? 'bg-gradient-to-r from-[#E8F5E8] to-[#FFF3E0] border border-[#E0E0E0]'
              : 'bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border border-emerald-500/20'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            }`}>
              🔥 Top Mood Movers
            </h3>
            <div className="flex flex-wrap gap-2">
              {topMovers.map((mover, index) => (
                <Badge
                  key={index}
                  className={cn(
                    "text-sm font-medium px-3 py-1",
                    getSentimentBadge(mover.mood)
                  )}
                >
                  ${mover.symbol} → {mover.mood === 'bullish' ? '📈' : '📉'} {mover.change}
                </Badge>
              ))}
            </div>
          </div>

          {/* Headline Summary */}
          <div className={`p-5 rounded-xl ${
            themeMode === 'light'
              ? 'bg-gradient-to-r from-[#E3F2FD] to-[#F1F8E9] border border-[#E0E0E0]'
              : 'bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            }`}>
              📰 News Headlines Summary
            </h3>
            <p className={`text-base ${
              themeMode === 'light' ? 'text-[#374151]' : 'text-gray-300'
            }`}>
              {headlineSummary}
            </p>
          </div>

          {/* Trending Topics */}
          <div className={`p-5 rounded-xl transition-all duration-300 hover:scale-[1.01] ${
            themeMode === 'light'
              ? 'bg-gradient-to-r from-[#FFF3E0] to-[#FCE4EC] border border-[#E0E0E0]'
              : 'bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            }`}>
              🔥 Trending Topics
            </h3>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              {trendingTopics.map((topic, index) => (
                <Badge
                  key={index}
                  className={cn(
                    "text-sm font-medium px-3 py-2 flex items-center justify-center gap-1 transition-all duration-300 hover:scale-105 cursor-pointer",
                    topic.direction === 'up'
                      ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                  )}
                >
                  <Hash className="w-3 h-3" />
                  <span className="truncate">{topic.tag}</span>
                  {topic.direction === 'up' ?
                    <ChevronUp className="w-3 h-3 animate-bounce" /> :
                    <ChevronDown className="w-3 h-3 animate-bounce" />
                  }
                  <span className="font-bold">{topic.momentum}%</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Mood Flip of the Day */}
          <div className={`p-5 rounded-xl ${
            themeMode === 'light'
              ? 'bg-gradient-to-r from-[#F3E5F5] to-[#E8EAF6] border border-[#E0E0E0]'
              : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            }`}>
              🔄 Mood Flip of the Day
            </h3>
            <div className="flex items-center gap-3">
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 font-semibold">
                ${moodFlip.symbol}
              </Badge>
              <span className={`text-sm ${
                themeMode === 'light' ? 'text-[#374151]' : 'text-gray-400'
              }`}>flipped from</span>
              <Badge className={getSentimentBadge(moodFlip.from)}>
                {moodFlip.from}
              </Badge>
              <ArrowRight className="w-4 h-4 text-purple-400" />
              <Badge className={getSentimentBadge(moodFlip.to)}>
                {moodFlip.to}
              </Badge>
              <span className={`text-sm font-semibold ${getSentimentColor(moodFlip.to)}`}>
                {moodFlip.change}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center pt-4">
            <Button 
              className={themeMode === 'light'
                ? "ai-analysis-btn-light hover:opacity-90 px-6 py-3"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3"
              }
            >
              🔍 View Full Mood Breakdown
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyMoodRecap;
