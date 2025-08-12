import React, { useState } from 'react';
import { Brain, BarChart3, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import { cn } from '../lib/utils';

interface AIAnalysisSectionProps {
  onExplainMood?: () => void;
  onViewAnalytics?: () => void;
  className?: string;
}

export const AIAnalysisSection: React.FC<AIAnalysisSectionProps> = ({
  onExplainMood,
  onViewAnalytics,
  className
}) => {
  const { themeMode } = useMoodTheme();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const handleExplainMood = () => {
    onExplainMood?.();
  };

  const handleViewAnalytics = () => {
    onViewAnalytics?.();
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden",
        themeMode === 'light'
          ? 'bg-white border-[#E0E0E0] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
          : 'border-purple-500/20 backdrop-blur-xl',
        className
      )}
      style={{
        backgroundColor: themeMode === 'light' ? '#FFFFFF' : '#12121E'
      }}
    >
      <CardHeader className="pb-4">
        <CardTitle className={cn(
          "flex items-center gap-2 text-lg font-medium",
          themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
        )}>
          <Sparkles className="w-5 h-5 text-purple-500" />
          AI Analysis
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Explain Today's Mood Button */}
          <Button
            onClick={handleExplainMood}
            onMouseEnter={() => setHoveredButton('mood')}
            onMouseLeave={() => setHoveredButton(null)}
            className={cn(
              "relative h-14 flex-1 max-w-[350px] rounded-2xl border-0 text-white font-bold",
              "transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2",
              hoveredButton === 'mood' ? 'scale-[1.03]' : 'scale-100'
            )}
            style={{
              background: hoveredButton === 'mood' 
                ? 'linear-gradient(to right, #FF6BB3, #FF8CC8)' 
                : 'linear-gradient(to right, #FF4C9A, #FF7EB3)',
              boxShadow: '0 0 8px rgba(255, 110, 180, 0.5)',
            }}
          >
            <Brain className="w-5 h-5 mr-2" />
            Explain Today's Mood
          </Button>

          {/* View Detailed Analytics Button */}
          <Button
            onClick={handleViewAnalytics}
            onMouseEnter={() => setHoveredButton('analytics')}
            onMouseLeave={() => setHoveredButton(null)}
            className={cn(
              "relative h-14 flex-1 max-w-[350px] rounded-2xl border-0 text-white font-bold",
              "transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2",
              hoveredButton === 'analytics' ? 'scale-[1.03]' : 'scale-100'
            )}
            style={{
              background: hoveredButton === 'analytics' 
                ? 'linear-gradient(to right, #5DB8FF, #7DCFFF)' 
                : 'linear-gradient(to right, #4DA8FF, #6CCEFF)',
              boxShadow: '0 0 8px rgba(76, 203, 255, 0.5)',
            }}
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            View Detailed Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAnalysisSection;
