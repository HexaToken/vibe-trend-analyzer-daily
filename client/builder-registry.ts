import React from "react";
import { type RegisteredComponent } from "@builder.io/sdk-react";

// Direct imports for Vite/React setup
import { MoodScoreHero } from "./src/components/builder/MoodScoreHero";
import { TopStocksModule } from "./src/components/builder/TopStocksModule";

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
const AIInsightModule = () =>
  React.createElement("div", null, "AI Insight Module - To be implemented");

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
