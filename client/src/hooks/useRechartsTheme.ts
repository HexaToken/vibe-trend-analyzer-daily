/* ===== LOCKED RECHARTS THEME HOOK ===== */
/* 🔒 This hook provides locked theme defaults for all Recharts components */
/* Use this to ensure consistent theming across all charts in light mode */

import { useMemo } from 'react';
import { useMoodTheme } from '../contexts/MoodThemeContext';

export const useRechartsTheme = () => {
  const { themeMode } = useMoodTheme();
  
  return useMemo(() => {
    // Only apply locked defaults in light mode
    if (themeMode === 'light') {
      return {
        // Locked color palette
        colors: {
          overallMood: '#3A7AFE',
          stocks: '#22AB94', 
          news: '#7B61FF',
          social: '#F23645',
          positive: '#22AB94',
          negative: '#F23645',
          neutral: '#4B5563',
          gridline: '#EFEFEF',
          axis: '#4B5563',
          background: '#FFFFFF',
          cardBackground: '#FAFAFA',
          border: '#E6E6E6',
          textPrimary: '#1A1A1A',
          textSecondary: '#4B5563',
          textMuted: '#9CA3AF'
        },
        
        // Locked chart defaults
        chartDefaults: {
          strokeWidth: 2.5,
          strokeOpacity: 1,
          fillOpacity: 1,
          gridOpacity: 0.3,
          axisStroke: '#4B5563',
          gridStroke: '#EFEFEF'
        },
        
        // Locked tooltip configuration
        tooltipDefaults: {
          contentStyle: {
            backgroundColor: '#FAFAFA',
            border: '1px solid #E6E6E6',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            color: '#1A1A1A'
          },
          labelStyle: {
            color: '#1A1A1A',
            fontWeight: 600
          },
          itemStyle: {
            color: '#4B5563'
          }
        },
        
        // Locked legend configuration  
        legendDefaults: {
          iconType: 'line' as const,
          wrapperStyle: {
            color: '#4B5563',
            fontSize: '14px',
            fontWeight: 500
          }
        },
        
        // Locked grid configuration
        gridDefaults: {
          stroke: '#EFEFEF',
          strokeOpacity: 0.3,
          strokeWidth: 1
        },
        
        // Locked axis configuration
        axisDefaults: {
          axisLine: {
            stroke: '#4B5563',
            strokeWidth: 1
          },
          tickLine: {
            stroke: '#4B5563',
            strokeWidth: 1
          },
          tick: {
            fill: '#4B5563',
            fontSize: 12,
            fontWeight: 500
          }
        }
      };
    }
    
    // Return null for dark mode (use existing dark theme)
    return null;
  }, [themeMode]);
};

// Helper hook to get locked colors for specific data types
export const useLockedDataColors = () => {
  const theme = useRechartsTheme();
  
  return useMemo(() => {
    if (!theme) return null;
    
    return {
      getSeriesColor: (dataKey: string): string => {
        switch (dataKey.toLowerCase()) {
          case 'overall':
          case 'mood':
          case 'overallmood':
            return theme.colors.overallMood;
          case 'stocks':
          case 'stock':
            return theme.colors.stocks;
          case 'news':
            return theme.colors.news;
          case 'social':
            return theme.colors.social;
          case 'positive':
          case 'bullish':
            return theme.colors.positive;
          case 'negative':
          case 'bearish':
            return theme.colors.negative;
          case 'neutral':
            return theme.colors.neutral;
          default:
            return theme.colors.overallMood;
        }
      },
      
      getSentimentColor: (sentiment: string): string => {
        switch (sentiment.toLowerCase()) {
          case 'positive':
          case 'bullish':
          case 'up':
            return theme.colors.positive;
          case 'negative':
          case 'bearish':
          case 'down':
            return theme.colors.negative;
          case 'neutral':
          case 'sideways':
          default:
            return theme.colors.neutral;
        }
      }
    };
  }, [theme]);
};

// Helper function to get default chart configuration
export const getLockedChartDefaults = (themeMode: string) => {
  if (themeMode !== 'light') return null;

  return {
    strokeWidth: 2.5,
    strokeOpacity: 1,
    fillOpacity: 1,
    colors: {
      overallMood: '#3A7AFE',
      stocks: '#22AB94',
      news: '#7B61FF',
      social: '#F23645',
      positive: '#22AB94',
      negative: '#F23645',
      neutral: '#4B5563'
    }
  };
};
