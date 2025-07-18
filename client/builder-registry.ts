import { type RegisteredComponent } from "@builder.io/sdk-react";

// Dynamic imports for Builder.io components
import dynamic from "next/dynamic";

// For Vite/React setup, we'll use dynamic imports differently
const MoodScoreHero = dynamic(() =>
  import("./src/components/builder/MoodScoreHero").then((mod) => ({
    default: mod.MoodScoreHero,
  })),
);

const TopStocksModule = dynamic(() =>
  import("./src/components/builder/TopStocksModule").then((mod) => ({
    default: mod.TopStocksModule,
  })),
);

const NewsFeedModule = dynamic(() =>
  import("./src/components/builder/NewsFeedModule").then((mod) => ({
    default: mod.NewsFeedModule,
  })),
);

const SentimentChart = dynamic(() =>
  import("./src/components/builder/SentimentChart").then((mod) => ({
    default: mod.SentimentChart,
  })),
);

const TrendingTopicsModule = dynamic(() =>
  import("./src/components/builder/TrendingTopicsModule").then((mod) => ({
    default: mod.TrendingTopicsModule,
  })),
);

const AIInsightModule = dynamic(() =>
  import("./src/components/builder/AIInsightModule").then((mod) => ({
    default: mod.AIInsightModule,
  })),
);

export const customComponents: RegisteredComponent[] = [
  {
    component: MoodScoreHero,
    name: "MoodScoreHero",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Today's Market Mood",
        required: false,
      },
      {
        name: "subtitle",
        type: "string",
        defaultValue: "Real-time sentiment analysis powered by AI",
        required: false,
      },
      {
        name: "apiEndpoint",
        type: "string",
        defaultValue: "/api/proxy/stock-sentiment",
        required: false,
      },
    ],
    canHaveChildren: false,
  },
  {
    component: TopStocksModule,
    name: "TopStocksModule",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Top 10 Stocks Today",
        required: false,
      },
      {
        name: "maxStocks",
        type: "number",
        defaultValue: 10,
        required: false,
      },
      {
        name: "showSentiment",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      {
        name: "apiEndpoint",
        type: "string",
        defaultValue: "/api/proxy/finnhub/quote",
        required: false,
      },
    ],
    canHaveChildren: false,
  },
  {
    component: NewsFeedModule,
    name: "NewsFeedModule",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Smart News Feed",
        required: false,
      },
      {
        name: "maxArticles",
        type: "number",
        defaultValue: 10,
        required: false,
      },
      {
        name: "showSentiment",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      {
        name: "apiEndpoint",
        type: "string",
        defaultValue: "/api/proxy/newsapi/top-headlines",
        required: false,
      },
    ],
    canHaveChildren: false,
  },
  {
    component: SentimentChart,
    name: "SentimentChart",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Mood Over Time",
        required: false,
      },
      {
        name: "timeframe",
        type: "string",
        defaultValue: "7D",
        required: false,
      },
      {
        name: "height",
        type: "number",
        defaultValue: 300,
        required: false,
      },
      {
        name: "showLegend",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
    ],
    canHaveChildren: false,
  },
  {
    component: TrendingTopicsModule,
    name: "TrendingTopicsModule",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Trending Topics",
        required: false,
      },
      {
        name: "maxTopics",
        type: "number",
        defaultValue: 5,
        required: false,
      },
      {
        name: "platforms",
        type: "string",
        defaultValue: "reddit,twitter,discord",
        required: false,
      },
    ],
    canHaveChildren: false,
  },
  {
    component: AIInsightModule,
    name: "AIInsightModule",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "AI Market Insight",
        required: false,
      },
      {
        name: "refreshInterval",
        type: "number",
        defaultValue: 300000,
        required: false,
      },
      {
        name: "showConfidence",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
    ],
    canHaveChildren: false,
  },
];
