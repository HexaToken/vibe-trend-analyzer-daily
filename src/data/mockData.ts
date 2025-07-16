// Mock data for MoodMeter sentiment analysis
export interface SentimentSource {
  name: string;
  score: number;
  change: number;
  icon: string;
  samples: number;
}

export interface HistoricalData {
  date: string;
  score: number;
  sources: {
    news: number;
    social: number;
    forums: number;
    stocks: number;
  };
}

export interface VibePhrase {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  source: string;
  influence: number;
}

export const currentMoodScore = 72;

export const sentimentSources: SentimentSource[] = [
  {
    name: "News",
    score: 68,
    change: -3.2,
    icon: "📰",
    samples: 15420
  },
  {
    name: "Social Media",
    score: 75,
    change: 5.8,
    icon: "📱",
    samples: 45230
  },
  {
    name: "Forums",
    score: 71,
    change: 2.1,
    icon: "💬",
    samples: 8760
  },
  {
    name: "Stock Market",
    score: 76,
    change: 8.4,
    icon: "📈",
    samples: 12340
  }
];

export const weeklyTrend: HistoricalData[] = [
  { 
    date: "2025-01-08", 
    score: 65, 
    sources: { news: 62, social: 68, forums: 66, stocks: 64 }
  },
  { 
    date: "2025-01-09", 
    score: 68, 
    sources: { news: 65, social: 71, forums: 68, stocks: 68 }
  },
  { 
    date: "2025-01-10", 
    score: 71, 
    sources: { news: 69, social: 73, forums: 70, stocks: 72 }
  },
  { 
    date: "2025-01-11", 
    score: 69, 
    sources: { news: 66, social: 72, forums: 69, stocks: 69 }
  },
  { 
    date: "2025-01-12", 
    score: 73, 
    sources: { news: 70, social: 76, forums: 72, stocks: 74 }
  },
  { 
    date: "2025-01-13", 
    score: 75, 
    sources: { news: 72, social: 78, forums: 74, stocks: 76 }
  },
  { 
    date: "2025-01-14", 
    score: 72, 
    sources: { news: 68, social: 75, forums: 71, stocks: 76 }
  }
];

export const vibePhrases: VibePhrase[] = [
  {
    text: "breakthrough technology innovation",
    sentiment: "positive",
    source: "Tech News",
    influence: 8.2
  },
  {
    text: "market volatility concerns",
    sentiment: "negative",
    source: "Financial Forums",
    influence: 6.7
  },
  {
    text: "optimistic quarterly projections",
    sentiment: "positive",
    source: "Business News",
    influence: 7.9
  },
  {
    text: "community rallying together",
    sentiment: "positive",
    source: "Social Media",
    influence: 5.4
  },
  {
    text: "regulatory uncertainty ahead",
    sentiment: "negative",
    source: "Policy Forums",
    influence: 4.3
  }
];

export const regions = [
  { name: "Global", code: "GLOBAL" },
  { name: "North America", code: "NA" },
  { name: "Europe", code: "EU" },
  { name: "Asia Pacific", code: "APAC" },
  { name: "Latin America", code: "LATAM" }
];

export const topics = [
  { name: "All Topics", value: "all" },
  { name: "Finance", value: "finance" },
  { name: "Technology", value: "technology" },
  { name: "Politics", value: "politics" },
  { name: "Healthcare", value: "healthcare" },
  { name: "Environment", value: "environment" },
  { name: "Entertainment", value: "entertainment" }
];