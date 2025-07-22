import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'dynamic';

export type MoodState = 'neutral' | 'bearish' | 'bullish' | 'extreme';

interface MoodScore {
  overall: number;
  stocks: number;
  news: number;
  social: number;
  timestamp: Date;
}

interface MoodThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  moodState: MoodState;
  moodScore: MoodScore | null;
  setMoodScore: (score: MoodScore) => void;
  isDynamicMode: boolean;
  currentThemeClasses: string;
  bodyGradient: string;
  accentColor: string;
  glowEffect: string;
  moodEmoji: string;
  moodLabel: string;
}

const MoodThemeContext = createContext<MoodThemeContextType | undefined>(undefined);

const MOOD_RANGES = {
  neutral: { min: -10, max: 10 },
  bearish: { min: -50, max: -11 },
  bullish: { min: 11, max: 50 },
  extreme: { min: -100, max: -51, max2: 51, max3: 100 } // < -50 or > 50
};

const MOOD_THEMES = {
  light: {
    neutral: {
      background: 'bg-[#F4F6F9]',
      bodyGradient: 'from-[#F4F6F9] to-white',
      accentColor: 'from-[#4D7C8A] to-[#607D8B]',
      glowEffect: 'shadow-[0_2px_6px_rgba(0,0,0,0.05)]',
      textPrimary: 'text-[#1E1E1E]',
      textSecondary: 'text-[#4A4A4A]',
      cardBackground: 'bg-white',
      border: 'border-[#E0E0E0]',
    },
    bearish: {
      background: 'bg-[#F4F6F9]',
      bodyGradient: 'from-[#F4F6F9] to-slate-50',
      accentColor: 'from-[#607D8B] to-slate-500',
      glowEffect: 'shadow-[0_2px_6px_rgba(0,0,0,0.05)]',
      textPrimary: 'text-[#1E1E1E]',
      textSecondary: 'text-[#4A4A4A]',
      cardBackground: 'bg-white',
      border: 'border-[#E0E0E0]',
    },
    bullish: {
      background: 'bg-[#F4F6F9]',
      bodyGradient: 'from-[#F4F6F9] to-green-50',
      accentColor: 'from-[#4CAF50] to-green-500',
      glowEffect: 'shadow-[0_2px_6px_rgba(76,175,80,0.1)]',
      textPrimary: 'text-[#1E1E1E]',
      textSecondary: 'text-[#4A4A4A]',
      cardBackground: 'bg-white',
      border: 'border-[#E0E0E0]',
    },
    extreme: {
      background: 'bg-[#F4F6F9]',
      bodyGradient: 'from-[#F4F6F9] to-red-50',
      accentColor: 'from-[#D32F2F] to-red-500',
      glowEffect: 'shadow-[0_2px_6px_rgba(211,47,47,0.1)]',
      textPrimary: 'text-[#1E1E1E]',
      textSecondary: 'text-[#4A4A4A]',
      cardBackground: 'bg-white',
      border: 'border-[#E0E0E0]',
    }
  },
  dark: {
    neutral: {
      background: 'bg-slate-900',
      bodyGradient: 'from-slate-900 via-blue-950 to-slate-900',
      accentColor: 'from-blue-400 to-cyan-400',
      glowEffect: 'shadow-blue-500/20',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
    },
    bearish: {
      background: 'bg-slate-900',
      bodyGradient: 'from-slate-900 via-gray-900 to-slate-900',
      accentColor: 'from-gray-400 to-slate-400',
      glowEffect: 'shadow-gray-500/20',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-400',
    },
    bullish: {
      background: 'bg-slate-900',
      bodyGradient: 'from-slate-900 via-amber-950 to-slate-900',
      accentColor: 'from-amber-400 to-orange-400',
      glowEffect: 'shadow-amber-500/30',
      textPrimary: 'text-amber-100',
      textSecondary: 'text-amber-200',
    },
    extreme: {
      background: 'bg-slate-900',
      bodyGradient: 'from-slate-900 via-purple-950 to-slate-900',
      accentColor: 'from-purple-400 to-pink-400',
      glowEffect: 'shadow-purple-500/40',
      textPrimary: 'text-purple-100',
      textSecondary: 'text-purple-200',
    }
  }
};

const MOOD_EMOJIS = {
  neutral: '😐',
  bearish: '📉',
  bullish: '📈',
  extreme: '🔥'
};

const MOOD_LABELS = {
  neutral: 'Neutral',
  bearish: 'Bearish',
  bullish: 'Bullish',
  extreme: 'Extreme'
};

const getMoodStateFromScore = (score: number): MoodState => {
  if (score >= MOOD_RANGES.extreme.max2) return 'extreme';
  if (score <= MOOD_RANGES.extreme.max) return 'extreme';
  if (score >= MOOD_RANGES.bullish.min && score <= MOOD_RANGES.bullish.max) return 'bullish';
  if (score >= MOOD_RANGES.bearish.min && score <= MOOD_RANGES.bearish.max) return 'bearish';
  return 'neutral';
};

interface MoodThemeProviderProps {
  children: ReactNode;
}

export const MoodThemeProvider: React.FC<MoodThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('moodThemeMode');
    return (stored as ThemeMode) || 'dynamic';
  });

  const [moodScore, setMoodScore] = useState<MoodScore | null>(null);
  
  const moodState = moodScore ? getMoodStateFromScore(moodScore.overall) : 'neutral';
  const isDynamicMode = themeMode === 'dynamic';

  // Determine effective theme (dark/light) for dynamic mode
  const effectiveTheme = isDynamicMode ? 'dark' : themeMode;
  const currentTheme = MOOD_THEMES[effectiveTheme][moodState];

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('moodThemeMode', themeMode);
  }, [themeMode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (themeMode === 'dark' || isDynamicMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply custom CSS variables for mood theming
    if (isDynamicMode && moodScore) {
      root.style.setProperty('--mood-gradient-from', getMoodGradientColors(moodState).from);
      root.style.setProperty('--mood-gradient-to', getMoodGradientColors(moodState).to);
      root.style.setProperty('--mood-accent', getMoodAccentColor(moodState));
      root.style.setProperty('--mood-glow', getMoodGlowColor(moodState));
    }
  }, [themeMode, moodState, moodScore, isDynamicMode]);

  const value: MoodThemeContextType = {
    themeMode,
    setThemeMode,
    moodState,
    moodScore,
    setMoodScore,
    isDynamicMode,
    currentThemeClasses: `${currentTheme.background} ${currentTheme.textPrimary}`,
    bodyGradient: `bg-gradient-to-br ${currentTheme.bodyGradient}`,
    accentColor: `bg-gradient-to-r ${currentTheme.accentColor}`,
    glowEffect: currentTheme.glowEffect,
    moodEmoji: MOOD_EMOJIS[moodState],
    moodLabel: MOOD_LABELS[moodState],
  };

  return (
    <MoodThemeContext.Provider value={value}>
      {children}
    </MoodThemeContext.Provider>
  );
};

export const useMoodTheme = () => {
  const context = useContext(MoodThemeContext);
  if (context === undefined) {
    throw new Error('useMoodTheme must be used within a MoodThemeProvider');
  }
  return context;
};

// Helper functions for CSS variable generation
const getMoodGradientColors = (mood: MoodState) => {
  switch (mood) {
    case 'bearish':
      return { from: '#1e293b', to: '#374151' }; // slate-800 to gray-700
    case 'bullish':
      return { from: '#451a03', to: '#ea580c' }; // amber-950 to orange-600
    case 'extreme':
      return { from: '#581c87', to: '#db2777' }; // purple-900 to pink-600
    default:
      return { from: '#0f172a', to: '#1e40af' }; // slate-900 to blue-700
  }
};

const getMoodAccentColor = (mood: MoodState) => {
  switch (mood) {
    case 'bearish':
      return '#6b7280'; // gray-500
    case 'bullish':
      return '#f59e0b'; // amber-500
    case 'extreme':
      return '#a855f7'; // purple-500
    default:
      return '#3b82f6'; // blue-500
  }
};

const getMoodGlowColor = (mood: MoodState) => {
  switch (mood) {
    case 'bearish':
      return 'rgba(107, 114, 128, 0.2)'; // gray-500 with opacity
    case 'bullish':
      return 'rgba(245, 158, 11, 0.3)'; // amber-500 with opacity
    case 'extreme':
      return 'rgba(168, 85, 247, 0.4)'; // purple-500 with opacity
    default:
      return 'rgba(59, 130, 246, 0.2)'; // blue-500 with opacity
  }
};
