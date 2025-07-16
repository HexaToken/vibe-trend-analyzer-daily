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

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  sentimentScore: number;
  keyPhrases: string[];
  source: {
    name: string;
    publishedAt: string;
  };
  originalUrl: string;
  whyItMatters: string;
  relatedTrends?: string[];
}

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    headline: "Tech Giants Report Record Quarterly Earnings Amid AI Boom",
    summary: "Major technology companies exceeded analyst expectations this quarter, driven by unprecedented demand for AI-powered services and cloud computing solutions.",
    sentimentScore: 78,
    keyPhrases: ["record earnings", "AI boom", "exceeded expectations", "strong demand", "innovation"],
    source: {
      name: "Financial Times",
      publishedAt: "2024-01-15T14:30:00Z"
    },
    originalUrl: "https://example.com/tech-earnings",
    whyItMatters: "Strong tech earnings indicate market confidence in AI investments, boosting overall economic optimism and driving today's positive sentiment score.",
    relatedTrends: ["AI investment surge", "Cloud computing growth"]
  },
  {
    id: "2", 
    headline: "Global Markets Show Signs of Volatility Amid Interest Rate Uncertainty",
    summary: "Financial markets experienced significant fluctuations as investors await central bank decisions on interest rates, creating uncertainty across major indices.",
    sentimentScore: 32,
    keyPhrases: ["market volatility", "uncertainty", "interest rates", "fluctuations", "investor concern"],
    source: {
      name: "Reuters",
      publishedAt: "2024-01-15T11:45:00Z"
    },
    originalUrl: "https://example.com/market-volatility",
    whyItMatters: "Market uncertainty directly impacts investor confidence and consumer sentiment, contributing to today's mixed mood score readings.",
    relatedTrends: ["Federal Reserve policy", "Global inflation concerns"]
  },
  {
    id: "3",
    headline: "Breakthrough in Renewable Energy Storage Could Transform Climate Goals",
    summary: "Scientists announce a major advancement in battery technology that could solve renewable energy storage challenges, accelerating the transition to clean power.",
    sentimentScore: 85,
    keyPhrases: ["breakthrough", "renewable energy", "climate goals", "battery technology", "clean power"],
    source: {
      name: "Nature",
      publishedAt: "2024-01-15T09:20:00Z"
    },
    originalUrl: "https://example.com/energy-breakthrough",
    whyItMatters: "This technological breakthrough offers hope for addressing climate change, significantly contributing to positive environmental sentiment trends.",
    relatedTrends: ["Green technology investment", "Climate action progress"]
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