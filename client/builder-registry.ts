import React from "react";
import { type RegisteredComponent } from "@builder.io/sdk-react";

// Direct imports for Vite/React setup
import { MoodScoreHero } from "./src/components/builder/MoodScoreHero";
import { TopStocksModule } from "./src/components/builder/TopStocksModule";

// Finance-grade components
import { FinanceMoodGauge } from "./src/components/builder/FinanceMoodGauge";
import { FinanceStockTable } from "./src/components/builder/FinanceStockTable";
import { FinanceNewsFeed } from "./src/components/builder/FinanceNewsFeed";
import { FinanceTrendingTopics } from "./src/components/builder/FinanceTrendingTopics";
import { FinanceMoodChart } from "./src/components/builder/FinanceMoodChart";

// Market Mood page components
import { AIInsightWidget } from "./src/components/builder/AIInsightWidget";
import { SocialBuzzHeatmap } from "./src/components/builder/SocialBuzzHeatmap";
import { TopMoversMarketSentiment } from "./src/components/builder/TopMoversMarketSentiment";
import { MarketMoodControls } from "./src/components/builder/MarketMoodControls";

// Unified Rooms component
import { UnifiedRoomsBuilder } from "./src/components/builder/UnifiedRoomsBuilder";

// Placeholder components for now - you can create these following the same pattern
const NewsFeedModule = () =>
  React.createElement("div", null, "News Feed Module - To be implemented");
const SentimentChart = () =>
  React.createElement("div", null, "Sentiment Chart - To be implemented");
const TrendingTopicsModule = () =>
  React.createElement(
    "div",
    null,
    "Trending Topics Module - To be implemented",
  );
// AIInsightModule is now imported as AIInsightWidget

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
    component: AIInsightWidget,
    name: "AIInsightWidget",
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
      {
        name: "apiEndpoint",
        type: "string",
        defaultValue: "/api/ai/insight",
        required: false,
      },
    ],
    canHaveChildren: false,
  },
  {
    component: SocialBuzzHeatmap,
    name: "SocialBuzzHeatmap",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Social Buzz Heatmap",
        required: false,
      },
      {
        name: "maxTopics",
        type: "number",
        defaultValue: 12,
        required: false,
      },
      {
        name: "platforms",
        type: "string",
        defaultValue: "reddit,twitter,discord",
        required: false,
      },
      {
        name: "autoRefresh",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      {
        name: "apiEndpoint",
        type: "string",
        defaultValue: "/api/social/trending",
        required: false,
      },
    ],
    canHaveChildren: false,
  },
  {
    component: TopMoversMarketSentiment,
    name: "TopMoversMarketSentiment",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Top Movers - Market Sentiment",
        required: false,
      },
      {
        name: "maxStocks",
        type: "number",
        defaultValue: 6,
        required: false,
      },
      {
        name: "showSparklines",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      {
        name: "autoRefresh",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      {
        name: "apiEndpoint",
        type: "string",
        defaultValue: "/api/stocks/top-movers",
        required: false,
      },
    ],
    canHaveChildren: false,
  },
  {
    component: MarketMoodControls,
    name: "MarketMoodControls",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Market Mood Controls",
        required: false,
      },
      {
        name: "showFilters",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      {
        name: "showExport",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
    ],
    canHaveChildren: false,
  },
  // Finance-grade components
  {
    component: FinanceMoodGauge,
    name: "FinanceMoodGauge",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Market Sentiment",
        required: false,
      },
      {
        name: "subtitle",
        type: "string",
        defaultValue: "Today's sentiment suggests rising investor confidence led by tech earnings.",
        required: false,
      },
      {
        name: "showBreakdown",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      {
        name: "size",
        type: "string",
        enum: ["small", "medium", "large"],
        defaultValue: "large",
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
    component: FinanceStockTable,
    name: "FinanceStockTable",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Top Stocks Today",
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
        name: "showVolume",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      {
        name: "autoRefresh",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
    ],
    canHaveChildren: false,
  },
  {
    component: FinanceNewsFeed,
    name: "FinanceNewsFeed",
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
        defaultValue: 5,
        required: false,
      },
      {
        name: "showSentiment",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      {
        name: "showSummary",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      {
        name: "autoRefresh",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      {
        name: "categories",
        type: "string",
        defaultValue: "finance,technology,economy",
        required: false,
      },
    ],
    canHaveChildren: false,
  },
  {
    component: FinanceTrendingTopics,
    name: "FinanceTrendingTopics",
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
        name: "showVolume",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      {
        name: "autoRefresh",
        type: "boolean",
        defaultValue: true,
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
    component: FinanceMoodChart,
    name: "FinanceMoodChart",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "7-Day Mood Trend",
        required: false,
      },
      {
        name: "timeframe",
        type: "string",
        enum: ["1D", "7D", "30D", "1Y"],
        defaultValue: "7D",
        required: false,
      },
      {
        name: "height",
        type: "number",
        defaultValue: 250,
        required: false,
      },
      {
        name: "showControls",
        type: "boolean",
        defaultValue: true,
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
  // Unified Rooms component
  {
    component: UnifiedRoomsBuilder,
    name: "UnifiedRoomsBuilder",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Rooms",
        required: false,
      },
      {
        name: "subtitle",
        type: "string",
        defaultValue: "Join real-time discussions by ticker, sector, and strategy.",
        required: false,
      },
      {
        name: "showSearch",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      {
        name: "showFilters",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      {
        name: "showSort",
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      {
        name: "maxRooms",
        type: "number",
        defaultValue: 8,
        required: false,
      },
    ],
    canHaveChildren: false,
  },
];
