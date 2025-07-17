import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());

// API Keys (in production, these should be environment variables)
const COINMARKETCAP_API_KEY = "a23f6083-9fcc-44d9-b03f-7cee769e3b91";
const NEWSAPI_KEY = "9a45d08310a946bab8d2738f74b69fc5";
const SERPAPI_KEY = process.env.SERPAPI_KEY || "demo_api_key";
const DEEPSEEK_API_KEY = "sk-136ffb5ff6594c4fa91560157ec9a3e7";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// CoinMarketCap Proxy Endpoints
app.get("/api/proxy/coinmarketcap/quotes", async (req, res) => {
  try {
    const { symbol } = req.query;
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("CoinMarketCap API Error:", error);
    res.status(500).json({ error: "Failed to fetch cryptocurrency data" });
  }
});

app.get("/api/proxy/coinmarketcap/listings", async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${limit}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("CoinMarketCap API Error:", error);
    res.status(500).json({ error: "Failed to fetch cryptocurrency listings" });
  }
});

app.get("/api/proxy/coinmarketcap/global-metrics", async (req, res) => {
  try {
    const response = await fetch(
      "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest",
      {
        headers: {
          "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("CoinMarketCap API Error:", error);
    res.status(500).json({ error: "Failed to fetch global metrics" });
  }
});

// NewsAPI Proxy Endpoints
app.get("/api/proxy/newsapi/top-headlines", async (req, res) => {
  try {
    const { category = "business", country = "us", pageSize = 20 } = req.query;
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&apiKey=${NEWSAPI_KEY}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("NewsAPI Error:", error);
    res.status(500).json({ error: "Failed to fetch news headlines" });
  }
});

app.get("/api/proxy/newsapi/everything", async (req, res) => {
  try {
    const { q, pageSize = 20, sortBy = "publishedAt" } = req.query;
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&pageSize=${pageSize}&sortBy=${sortBy}&apiKey=${NEWSAPI_KEY}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("NewsAPI Error:", error);
    res.status(500).json({ error: "Failed to search news" });
  }
});

// SerpAPI Proxy Endpoints
app.get("/api/proxy/serpapi/search", async (req, res) => {
  try {
    const { q, num = 20, gl = "us", hl = "en" } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const url = new URL("https://serpapi.com/search");
    url.searchParams.append("engine", "google_news");
    url.searchParams.append("q", q);
    url.searchParams.append("num", num.toString());
    url.searchParams.append("gl", gl);
    url.searchParams.append("hl", hl);
    url.searchParams.append("api_key", SERPAPI_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check for SerpAPI errors
    if (data.error) {
      throw new Error(data.error);
    }

    res.json(data);
  } catch (error) {
    console.error("SerpAPI Error:", error);
    res.status(500).json({
      error: "Failed to fetch news from SerpAPI",
      details: error.message,
    });
  }
});

// AI Chat endpoints
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Use DeepSeek API for AI responses
    const response = await processAiMessageWithDeepSeek(message);
    res.json(response);
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "Failed to process AI request" });
  }
});

app.post("/api/ai/sentiment", async (req, res) => {
  try {
    const { ticker } = req.body;

    if (!ticker) {
      return res.status(400).json({ error: "Ticker is required" });
    }

    const response = await analyzeSentiment(ticker);
    res.json(response);
  } catch (error) {
    console.error("Sentiment Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze sentiment" });
  }
});

app.post("/api/ai/summarize", async (req, res) => {
  try {
    const { ticker, limit = 10 } = req.body;

    const response = await summarizePosts(ticker, limit);
    res.json(response);
  } catch (error) {
    console.error("Post Summarization Error:", error);
    res.status(500).json({ error: "Failed to summarize posts" });
  }
});

app.post("/api/ai/recommendations", async (req, res) => {
  try {
    const response = await getWatchlistRecommendations();
    res.json(response);
  } catch (error) {
    console.error("Recommendations Error:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

// DeepSeek API Integration
async function callDeepSeekAPI(messages) {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    return (
      data.choices[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response."
    );
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    throw error;
  }
}

async function processAiMessageWithDeepSeek(message) {
  const lowerMessage = message.toLowerCase();

  // Check for specific MoodMeter functionality requests
  if (lowerMessage.includes("sentiment") || lowerMessage.includes("mood")) {
    const ticker = extractTicker(message);
    if (ticker) {
      return await analyzeSentimentWithAI(ticker, message);
    }
  }

  if (lowerMessage.includes("summarize") || lowerMessage.includes("summary")) {
    const ticker = extractTicker(message);
    return await summarizePostsWithAI(ticker, message);
  }

  if (
    lowerMessage.includes("recommend") ||
    lowerMessage.includes("watchlist")
  ) {
    return await getWatchlistRecommendationsWithAI(message);
  }

  // For general questions, use DeepSeek with MoodMeter context
  const systemPrompt = `You are the MoodMeter AI assistant, a helpful financial assistant for a social trading platform called MoodMeter.

MoodMeter features:
- Dashboard: Real-time market data, sentiment analysis, and news
- Social Platform (FinTwits): Community discussions about stocks and crypto
- Analytics: Deep market analysis tools
- Sentiment Analysis: Community mood tracking for tickers
- Watchlists: Track favorite stocks and crypto

You should be helpful, concise, and friendly. When users ask about features, guide them appropriately. For financial questions, provide educational information but always remind users to do their own research.

Key capabilities you can help with:
- Explaining MoodMeter features
- Analyzing sentiment for tickers (use $ format like $AAPL)
- Summarizing community posts
- Providing market insights
- Onboarding help

Always be conversational and helpful!`;

  try {
    const aiResponse = await callDeepSeekAPI([
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ]);

    // Generate relevant suggestions based on the response
    const suggestions = generateSuggestions(message, aiResponse);

    return {
      content: aiResponse,
      suggestions: suggestions,
    };
  } catch (error) {
    // Fallback to rule-based response if DeepSeek fails
    return await processAiMessage(message);
  }
}

function generateSuggestions(userMessage, aiResponse) {
  const lowerMessage = userMessage.toLowerCase();
  const lowerResponse = aiResponse.toLowerCase();

  let suggestions = [];

  if (lowerMessage.includes("help") || lowerMessage.includes("start")) {
    suggestions = [
      "What's the sentiment for $AAPL?",
      "How do I use the Dashboard?",
      "Recommend trending stocks",
      "Summarize recent posts",
    ];
  } else if (
    lowerResponse.includes("sentiment") ||
    lowerResponse.includes("mood")
  ) {
    suggestions = [
      "Check $TSLA sentiment",
      "Analyze $BTC mood",
      "What's trending today?",
      "How to read sentiment scores?",
    ];
  } else if (
    lowerResponse.includes("dashboard") ||
    lowerResponse.includes("feature")
  ) {
    suggestions = [
      "Social platform guide",
      "Analytics deep dive",
      "Setting up watchlists",
      "Understanding alerts",
    ];
  } else {
    suggestions = [
      "What's trending today?",
      "How do I use Analytics?",
      "Recommend stocks to watch",
      "Help with MoodMeter features",
    ];
  }

  return suggestions;
}

// AI Processing Functions (Fallback)
async function processAiMessage(message) {
  const lowerMessage = message.toLowerCase();

  // Detect intent and extract entities
  if (lowerMessage.includes("sentiment") || lowerMessage.includes("mood")) {
    const ticker = extractTicker(message);
    if (ticker) {
      return await analyzeSentiment(ticker);
    }
    return {
      content:
        "I can analyze sentiment for specific tickers. Try asking 'What's the sentiment for $AAPL?' or mention any stock ticker with a $ sign.",
      suggestions: [
        "What's the sentiment for $AAPL?",
        "Check $TSLA mood",
        "Analyze $MSFT sentiment",
      ],
    };
  }

  if (lowerMessage.includes("summarize") || lowerMessage.includes("summary")) {
    const ticker = extractTicker(message);
    return await summarizePosts(ticker);
  }

  if (
    lowerMessage.includes("recommend") ||
    lowerMessage.includes("watchlist")
  ) {
    return await getWatchlistRecommendations();
  }

  if (lowerMessage.includes("help") || lowerMessage.includes("how")) {
    return await provideHelp(message);
  }

  if (lowerMessage.includes("trending") || lowerMessage.includes("popular")) {
    return await getTrendingInfo();
  }

  // Default response
  return {
    content:
      "I can help you with:\n\n• Analyzing sentiment for tickers (e.g., 'What's the mood for $AAPL?')\n• Summarizing FinTwits posts\n• Recommending stocks for your watchlist\n• Providing guidance on using MoodMeter\n\nWhat would you like to know?",
    suggestions: [
      "What's the sentiment for $AAPL?",
      "Summarize recent posts",
      "Recommend trending stocks",
      "How do I use the Dashboard?",
    ],
  };
}

function extractTicker(message) {
  const tickerMatch = message.match(/\$([A-Z]+)/);
  return tickerMatch ? tickerMatch[1] : null;
}

async function analyzeSentiment(ticker) {
  // Mock ticker data - in production, this would come from a database
  const mockTickerData = {
    AAPL: {
      sentimentScore: 72,
      bullishCount: 1247,
      bearishCount: 423,
      neutralCount: 156,
      totalPosts: 1826,
      postVolume24h: 342,
      price: 195.25,
      change: 2.75,
      changePercent: 1.43,
    },
    TSLA: {
      sentimentScore: -15,
      bullishCount: 892,
      bearishCount: 1543,
      neutralCount: 298,
      totalPosts: 2733,
      postVolume24h: 567,
      price: 248.5,
      change: -8.25,
      changePercent: -3.21,
    },
    NVDA: {
      sentimentScore: 84,
      bullishCount: 1658,
      bearishCount: 234,
      neutralCount: 187,
      totalPosts: 2079,
      postVolume24h: 423,
      price: 875.25,
      change: 23.5,
      changePercent: 2.76,
    },
    BTC: {
      sentimentScore: 45,
      bullishCount: 2156,
      bearishCount: 1876,
      neutralCount: 432,
      totalPosts: 4464,
      postVolume24h: 892,
      price: 67420.0,
      change: 1250.75,
      changePercent: 1.89,
    },
    ETH: {
      sentimentScore: 12,
      bullishCount: 1324,
      bearishCount: 1789,
      neutralCount: 356,
      totalPosts: 3469,
      postVolume24h: 634,
      price: 3875.5,
      change: -127.25,
      changePercent: -3.18,
    },
  };

  const tickerData = mockTickerData[ticker.toUpperCase()];

  if (!tickerData) {
    return {
      content: `❓ **$${ticker} - Ticker Not Found**\n\nSorry, I don't have sentiment data for $${ticker} yet. \n\nTry one of these popular tickers instead:`,
      suggestions: [
        "What's the sentiment for $AAPL?",
        "Check $TSLA sentiment",
        "Analyze $NVDA mood",
        "Show $BTC sentiment",
      ],
    };
  }

  const {
    sentimentScore,
    bullishCount,
    bearishCount,
    neutralCount,
    totalPosts,
    postVolume24h,
    price,
    change,
    changePercent,
  } = tickerData;

  const sentiment =
    sentimentScore > 20
      ? "bullish"
      : sentimentScore < -20
        ? "bearish"
        : "neutral";
  const sentimentEmoji =
    sentiment === "bullish" ? "🟢" : sentiment === "bearish" ? "🔴" : "🟡";
  const priceEmoji = change >= 0 ? "📈" : "📉";

  const bullishPercentage = ((bullishCount / totalPosts) * 100).toFixed(1);
  const bearishPercentage = ((bearishCount / totalPosts) * 100).toFixed(1);
  const neutralPercentage = ((neutralCount / totalPosts) * 100).toFixed(1);

  return {
    content: `${sentimentEmoji} **$${ticker} Sentiment Analysis**\n\n**Current Mood:** ${sentiment.toUpperCase()} (Score: ${sentimentScore})\n\n${priceEmoji} **Price:** $${price.toLocaleString()} (${change >= 0 ? "+" : ""}${change} | ${changePercent >= 0 ? "+" : ""}${changePercent}%)\n\n**Community Sentiment Breakdown:**\n• 🟢 Bullish: ${bullishCount.toLocaleString()} posts (${bullishPercentage}%)\n• 🔴 Bearish: ${bearishCount.toLocaleString()} posts (${bearishPercentage}%)\n• 🟡 Neutral: ${neutralCount.toLocaleString()} posts (${neutralPercentage}%)\n\n**Social Activity:**\n• Total discussions: ${totalPosts.toLocaleString()}\n• Posts in 24h: ${postVolume24h}\n• Community engagement: ${sentiment === "bullish" ? "High" : sentiment === "bearish" ? "Cautious" : "Moderate"}\n\n${getSentimentInsights(sentiment, sentimentScore, changePercent)}`,
    suggestions: [
      `View $${ticker} detailed chart`,
      `Check recent $${ticker} posts`,
      `Add $${ticker} to watchlist`,
      "Analyze another ticker",
    ],
  };
}

function getSentimentInsights(sentiment, sentimentScore, priceChange) {
  if (sentiment === "bullish") {
    return "**Insights:** Community is optimistic with strong bullish momentum. Positive catalysts and technical indicators are driving conversation.";
  } else if (sentiment === "bearish") {
    return "**Insights:** Community sentiment is cautious with bearish undertones. Recent price action and market concerns are influencing discussions.";
  } else {
    return "**Insights:** Mixed sentiment with balanced views from the community. Traders are waiting for clearer signals before taking positions.";
  }
}

async function summarizePosts(ticker, limit = 10) {
  // Mock posts data - in production, this would come from a database
  const mockPosts = {
    AAPL: [
      "$AAPL breaking above resistance at $195. This AI integration in iOS 18 is a game changer. Expecting $210 by earnings. 🚀",
      "Apple's services revenue continues to impress. The ecosystem is getting stronger every quarter.",
      "Technical analysis shows $AAPL forming a bull flag. Momentum is building for the next leg up.",
    ],
    TSLA: [
      "$TSLA delivery numbers were disappointing. Competition in EV space is heating up. May see a retest of $230 support.",
      "Despite delivery concerns, Tesla's energy business is growing rapidly. Diversification paying off.",
      "Waiting for Elon's next announcement. $TSLA always has surprises up its sleeve.",
    ],
    NVDA: [
      "$NVDA just announced new AI chips. This is huge for the data center market. Revenue guidance raised by 15%.",
      "AI revolution is just getting started and NVIDIA is at the center of it all. Long term bullish.",
      "Data center demand showing no signs of slowing. $NVDA earnings should be massive.",
    ],
    BTC: [
      "$BTC consolidating nicely above $66k support. Bull flag pattern forming on the 4H chart.",
      "Institutional adoption continues. Another major corporation added Bitcoin to treasury.",
      "Halving effects starting to show. Supply shock should drive prices higher in 2024.",
    ],
    ETH: [
      "$ETH gas fees dropping significantly. This L2 adoption is finally paying off.",
      "Ethereum's staking rewards making it attractive for institutional investors.",
      "DeFi summer 2.0 might be starting. Activity picking up across all protocols.",
    ],
  };

  const tickerText = ticker ? ` about $${ticker}` : "";
  let posts = [];
  let keyThemes = [];
  let overallSentiment = "";

  if (ticker && mockPosts[ticker.toUpperCase()]) {
    posts = mockPosts[ticker.toUpperCase()];
    const tickerName =
      {
        AAPL: "Apple",
        TSLA: "Tesla",
        NVDA: "NVIDIA",
        BTC: "Bitcoin",
        ETH: "Ethereum",
      }[ticker.toUpperCase()] || ticker;

    keyThemes = {
      AAPL: [
        "AI integration and iOS 18",
        "Services revenue growth",
        "Technical breakout patterns",
      ],
      TSLA: [
        "Delivery challenges and competition",
        "Energy business diversification",
        "Leadership and innovation",
      ],
      NVDA: [
        "AI chip announcements",
        "Data center demand",
        "Revenue guidance updates",
      ],
      BTC: [
        "Technical consolidation patterns",
        "Institutional adoption",
        "Halving cycle effects",
      ],
      ETH: [
        "Layer 2 scaling solutions",
        "Staking rewards",
        "DeFi ecosystem growth",
      ],
    }[ticker.toUpperCase()] || ["General market discussion"];

    overallSentiment =
      {
        AAPL: "Optimistic with strong technical momentum",
        TSLA: "Mixed with some delivery concerns but long-term bullish",
        NVDA: "Highly bullish on AI revolution",
        BTC: "Cautiously optimistic with institutional support",
        ETH: "Bullish on scaling improvements and DeFi growth",
      }[ticker.toUpperCase()] || "Mixed sentiment";
  } else {
    // General posts across all tickers
    posts = [
      "Market showing resilience despite macro headwinds. Quality names holding up well.",
      "Options flow suggests institutions are positioning for volatility. Interesting times ahead.",
      "Earnings season starting strong. Tech names leading the way with AI narrative.",
    ];
    keyThemes = [
      "Market resilience",
      "Options activity",
      "Earnings expectations",
      "AI sector focus",
    ];
    overallSentiment = "Cautiously optimistic with selective positioning";
  }

  const recentPosts = posts.slice(0, Math.min(limit, posts.length));

  return {
    content: `📊 **Post Summary${tickerText}**\n\nHere's what the community is saying${tickerText}:\n\n**Recent Highlights:**\n${recentPosts.map((post, i) => `${i + 1}. "${post.substring(0, 100)}${post.length > 100 ? "..." : ""}"`).join("\n")}\n\n**Key Themes:**\n${keyThemes.map((theme) => `• ${theme}`).join("\n")}\n\n**Overall Sentiment:** ${overallSentiment}\n\n**Community Engagement:** ${ticker ? "High" : "Moderate"} with active discussions and diverse perspectives.`,
    suggestions: [
      ticker ? `View all $${ticker} posts` : "View trending posts",
      ticker ? `Analyze $${ticker} sentiment` : "Check sentiment analysis",
      "Get watchlist recommendations",
      ticker ? "Summarize different ticker" : "Summarize specific ticker",
    ],
  };
}

async function getWatchlistRecommendations() {
  // Mock trending data with sentiment and technical analysis
  const trendingTickers = [
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      rank: 1,
      sentimentScore: 84,
      trendingScore: 9.8,
      postVolume24h: 423,
      priceChange: 2.76,
      reasons: [
        "Strong AI chip announcements",
        "Data center demand surge",
        "Revenue guidance beat",
      ],
      riskLevel: "Medium",
      timeHorizon: "Short to Medium term",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      rank: 2,
      sentimentScore: 45,
      trendingScore: 9.6,
      postVolume24h: 892,
      priceChange: 1.89,
      reasons: [
        "Institutional adoption increasing",
        "Technical consolidation complete",
        "Halving cycle effects",
      ],
      riskLevel: "High",
      timeHorizon: "Medium to Long term",
    },
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      rank: 3,
      sentimentScore: 72,
      trendingScore: 8.7,
      postVolume24h: 342,
      priceChange: 1.43,
      reasons: [
        "iOS 18 AI integration hype",
        "Services revenue growth",
        "Technical breakout pattern",
      ],
      riskLevel: "Low",
      timeHorizon: "Short to Long term",
    },
  ];

  const topPicks = trendingTickers.slice(0, 3);

  return {
    content:
      `🎯 **Smart Watchlist Recommendations**\n\nBased on sentiment analysis, social volume, and trend patterns:\n\n${topPicks
        .map(
          (ticker, i) =>
            `**${i + 1}. $${ticker.symbol} - ${ticker.name}**\n` +
            `📊 Sentiment: ${ticker.sentimentScore > 50 ? "🟢 Bullish" : ticker.sentimentScore > 0 ? "🟡 Neutral" : "🔴 Bearish"} (${ticker.sentimentScore})\n` +
            `📈 Price: ${ticker.priceChange >= 0 ? "+" : ""}${ticker.priceChange}% (24h)\n` +
            `💬 Social Volume: ${ticker.postVolume24h} posts\n` +
            `⭐ Trending Score: ${ticker.trendingScore}/10\n` +
            `🎯 Key Catalysts:\n${ticker.reasons.map((reason) => `  • ${reason}`).join("\n")}\n` +
            `⚠️ Risk Level: ${ticker.riskLevel}\n` +
            `⏱️ Time Horizon: ${ticker.timeHorizon}\n`,
        )
        .join("\n")}\n` +
      `**Recommendation Criteria:**\n` +
      `• High social engagement (500+ mentions)\n` +
      `• Positive sentiment momentum\n` +
      `• Strong technical indicators\n` +
      `• Upcoming catalysts or news events\n\n` +
      `*Recommendations based on social sentiment analysis. Always do your own research and consider your risk tolerance.*`,
    suggestions: [
      `Analyze $${topPicks[0].symbol} in detail`,
      `Check $${topPicks[1].symbol} recent posts`,
      `Get $${topPicks[2].symbol} price alerts`,
      "View complete trending analysis",
    ],
  };
}

async function provideHelp(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("dashboard")) {
    return {
      content:
        "📊 **Dashboard Guide**\n\nYour main command center for market intelligence:\n\n🎯 **Key Features:**\n• **Real-time Prices**: Live stock & crypto data with price alerts\n• **Sentiment Meters**: Community mood indicators for trending tickers\n• **Market Overview**: Key indices, volume, and volatility metrics\n• **News Integration**: Breaking financial news with sentiment analysis\n• **Quick Actions**: One-click access to trending discussions\n\n💡 **Pro Tips:**\n• Customize your watchlist for personalized insights\n• Use sentiment scores to gauge community mood\n• Set up price alerts for important levels\n• Check news sentiment before major moves\n\n🚀 **Getting Started:**\n1. Add tickers to your watchlist\n2. Monitor sentiment changes\n3. Follow breaking news alerts\n4. Join trending discussions",
      suggestions: [
        "How to customize watchlist?",
        "What are sentiment scores?",
        "How to set price alerts?",
        "Analytics features guide",
      ],
    };
  }

  if (lowerMessage.includes("social") || lowerMessage.includes("fintwits")) {
    return {
      content:
        "💬 **FinTwits Social Guide**\n\nConnect with the trading community:\n\n🏠 **Main Sections:**\n• **Feed**: Real-time posts from traders and investors\n• **Watchlist**: Track posts about your favorite tickers\n• **Trending**: Discover what's hot in the markets\n• **Rooms**: Join topic-specific discussion groups\n• **Analytics**: Deep dive into social sentiment data\n\n✨ **Key Features:**\n• Follow specific tickers with $SYMBOL format\n• Real-time sentiment analysis on all posts\n• Community-driven insights and predictions\n• Direct interaction with verified traders\n• Trending hashtags and topics\n\n🎯 **Best Practices:**\n• Use $TICKER format for stock discussions\n• Engage respectfully with the community\n• Share insights, not just positions\n• Follow verified and experienced traders\n• Check sentiment before major decisions",
      suggestions: [
        "How to follow tickers?",
        "What are verified traders?",
        "How to join rooms?",
        "Understanding sentiment analysis",
      ],
    };
  }

  if (lowerMessage.includes("analytics")) {
    return {
      content:
        "📈 **Analytics Guide**\n\nDeep market analysis tools:\n\n🔍 **Analysis Types:**\n• **Sentiment Analysis**: Community mood tracking for any ticker\n• **Historical Trends**: Price and sentiment correlation over time\n• **Social Volume**: Mentions, engagement, and trending analysis\n• **Comparative Analysis**: Side-by-side ticker comparisons\n• **Prediction Accuracy**: Track community prediction performance\n\n📊 **Key Metrics:**\n• Bullish/Bearish/Neutral sentiment breakdown\n• Social volume vs price correlation\n• Trending score and momentum indicators\n• Community accuracy rates\n• Institutional vs retail sentiment\n\n💡 **How to Use:**\n1. Select tickers for analysis\n2. Choose time frames (1h, 1d, 1w, 1m)\n3. Compare multiple metrics\n4. Export data for further analysis",
      suggestions: [
        "How to compare tickers?",
        "Understanding correlation data?",
        "How to export analytics?",
        "Setting up custom alerts?",
      ],
    };
  }

  if (lowerMessage.includes("watchlist") || lowerMessage.includes("alerts")) {
    return {
      content:
        "⭐ **Watchlist & Alerts Guide**\n\nNever miss important market moves:\n\n📋 **Watchlist Features:**\n• Add unlimited tickers to track\n• Real-time price and sentiment updates\n• Custom categories (Tech, Crypto, etc.)\n• Performance tracking and analytics\n• Quick access to ticker discussions\n\n🔔 **Alert Types:**\n• **Price Alerts**: Set target prices for buy/sell levels\n• **Sentiment Alerts**: Get notified of major mood shifts\n• **Volume Alerts**: Track unusual social activity\n• **News Alerts**: Breaking news for your tickers\n• **Trend Alerts**: When tickers start trending\n\n⚙️ **Setup Instructions:**\n1. Click the star icon next to any ticker\n2. Go to your watchlist in the navigation\n3. Set up custom alerts for each ticker\n4. Choose notification preferences\n5. Monitor real-time updates",
      suggestions: [
        "How to organize watchlists?",
        "Setting up price alerts?",
        "Managing notifications?",
        "Watchlist vs trending?",
      ],
    };
  }

  if (lowerMessage.includes("sentiment") || lowerMessage.includes("mood")) {
    return {
      content:
        "🌡️ **Sentiment Analysis Guide**\n\nUnderstand market psychology:\n\n📊 **Sentiment Scores:**\n• **+100 to +50**: Strong Bullish (🟢)\n• **+49 to +10**: Mild Bullish (🟢)\n• **+9 to -9**: Neutral (🟡)\n• **-10 to -49**: Mild Bearish (🔴)\n• **-50 to -100**: Strong Bearish (🔴)\n\n🧠 **How It Works:**\n• AI analyzes every post mentioning a ticker\n• Natural language processing detects emotional tone\n• Weighted by user credibility and engagement\n• Updated in real-time as new posts arrive\n• Historical tracking shows sentiment trends\n\n💡 **Trading Insights:**\n• Extreme sentiment often signals reversals\n• Sentiment shifts can precede price moves\n• Compare sentiment vs actual price action\n• Use as one factor in trading decisions\n• Community sentiment ≠ guaranteed outcomes",
      suggestions: [
        "How accurate is sentiment?",
        "Best times to check sentiment?",
        "Sentiment vs technical analysis?",
        "Historical sentiment data?",
      ],
    };
  }

  return {
    content:
      "🚀 **MoodMeter Complete Guide**\n\n**🏠 Main Sections:**\n• **Dashboard**: Market overview, news, sentiment meters\n• **Social (FinTwits)**: Community discussions and insights\n• **Analytics**: Deep market and sentiment analysis\n• **Crypto**: Digital asset tracking and analysis\n• **Profile**: Personal settings and preferences\n\n**🎯 Quick Start (5 minutes):**\n1. **Add Tickers**: Click ⭐ to build your watchlist\n2. **Check Sentiment**: Look for 🟢🟡🔴 mood indicators\n3. **Join Discussions**: Engage in $TICKER conversations\n4. **Set Alerts**: Get notified of important moves\n5. **Explore Analytics**: Discover trends and correlations\n\n**💡 Pro Tips:**\n• Use $TICKER format for any stock/crypto symbol\n• Check sentiment before major trading decisions\n• Follow verified traders for quality insights\n• Combine sentiment with technical analysis\n• Set up alerts for your key positions\n\n**🔧 Need Help?**\nJust ask me about any specific feature or say 'help with [topic]'!",
    suggestions: [
      "Dashboard walkthrough",
      "Social platform tour",
      "Analytics deep dive",
      "Sentiment analysis guide",
    ],
  };
}

async function getTrendingInfo() {
  return {
    content:
      "📈 **Trending Now**\n\nHere's what's hot in the markets:\n\n**Top Tickers:**\n• $AAPL - High volume discussions\n• $TSLA - Earnings buzz\n• $NVDA - AI sector focus\n\n**Popular Topics:**\n• #EarningsSeason\n• #TechnicalAnalysis\n• #OptionsTrading\n\n**Market Mood:** Cautiously optimistic with increased volatility discussions.\n\nWant to dive deeper into any of these trends?",
    suggestions: [
      "Analyze $AAPL sentiment",
      "Check earnings discussions",
      "View all trending tickers",
      "Get watchlist recommendations",
    ],
  };
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`📈 CoinMarketCap proxy endpoints available`);
  console.log(`📰 NewsAPI proxy endpoints available`);
  console.log(`🔍 SerpAPI Google News proxy endpoints available`);
});
