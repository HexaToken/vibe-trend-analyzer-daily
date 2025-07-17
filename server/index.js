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

    // Simple rule-based AI responses for now
    const response = await processAiMessage(message);
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

// AI Processing Functions
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
  // Mock sentiment analysis - in production, this would use real data
  const sentiments = ["bullish", "bearish", "neutral"];
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  const score = Math.floor(Math.random() * 100);

  const sentimentEmoji =
    sentiment === "bullish" ? "🟢" : sentiment === "bearish" ? "🔴" : "🟡";

  return {
    content: `${sentimentEmoji} **$${ticker} Sentiment Analysis**\n\nCurrent Mood: **${sentiment.toUpperCase()}** (${score}%)\n\nBased on recent social media activity and market discussions, $${ticker} is showing ${sentiment} sentiment. Here's what traders are saying:\n\n• Recent posts show ${sentiment === "bullish" ? "optimistic" : sentiment === "bearish" ? "cautious" : "mixed"} outlook\n• ${sentiment === "bullish" ? "Positive catalysts being discussed" : sentiment === "bearish" ? "Concerns about recent performance" : "Balanced perspectives from the community"}\n• Social volume: ${Math.floor(Math.random() * 1000) + 100} mentions in 24h`,
    suggestions: [
      `View $${ticker} detailed analysis`,
      `Check $${ticker} recent posts`,
      `Add $${ticker} to watchlist`,
      "Analyze another ticker",
    ],
  };
}

async function summarizePosts(ticker, limit = 10) {
  const tickerText = ticker ? ` about $${ticker}` : "";

  return {
    content: `📊 **Post Summary${tickerText}**\n\nHere's a summary of the ${limit} most recent posts${tickerText} from FinTwits:\n\n**Key Themes:**\n• Market volatility discussions\n• Earnings expectations and analysis\n• Technical analysis insights\n• Community sentiment shifts\n\n**Trending Topics:**\n• Options trading strategies\n• Institutional movements\n• Sector rotation discussions\n\n**Overall Sentiment:** Mixed to optimistic with active engagement from the community.`,
    suggestions: [
      ticker ? `View all $${ticker} posts` : "View all recent posts",
      "Get detailed sentiment analysis",
      "Check trending discussions",
      "Summarize different ticker",
    ],
  };
}

async function getWatchlistRecommendations() {
  const tickers = [
    "AAPL",
    "TSLA",
    "MSFT",
    "GOOGL",
    "AMZN",
    "NVDA",
    "AMD",
    "META",
  ];
  const recommended = tickers.slice(0, 3);

  return {
    content: `🎯 **Watchlist Recommendations**\n\nBased on current sentiment trends and market activity, here are some tickers to consider:\n\n${recommended
      .map(
        (ticker, i) =>
          `**${i + 1}. $${ticker}**\n• High social engagement\n• Positive sentiment trend\n• Strong technical indicators\n`,
      )
      .join(
        "\n",
      )}\n\n*These recommendations are based on social sentiment and should not be considered financial advice.*`,
    suggestions: [
      `Analyze $${recommended[0]} sentiment`,
      `Check $${recommended[1]} posts`,
      "View full trending list",
      "Get personalized recommendations",
    ],
  };
}

async function provideHelp(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("dashboard")) {
    return {
      content:
        "📊 **Dashboard Help**\n\nThe Dashboard is your main hub for market insights:\n\n• **Real-time Data**: Live stock prices and crypto values\n• **Sentiment Meters**: Visual sentiment indicators\n• **Quick Stats**: Key market metrics at a glance\n• **News Feed**: Latest financial news\n\nNavigate using the top menu or ask me about specific features!",
      suggestions: [
        "How do I use Analytics?",
        "What's in the Social platform?",
        "How to read sentiment data?",
        "Getting started guide",
      ],
    };
  }

  if (lowerMessage.includes("social") || lowerMessage.includes("fintwits")) {
    return {
      content:
        "💬 **Social Platform Help**\n\nFinTwits is our social trading platform:\n\n• **Feed**: See all community posts and discussions\n• **Watchlist**: Track your favorite tickers\n• **Trending**: Discover what's hot in the market\n• **Rooms**: Join themed discussion groups\n\nYou can interact with posts, follow tickers, and join conversations!",
      suggestions: [
        "How to add to watchlist?",
        "What are trending tickers?",
        "How to join rooms?",
        "Dashboard help",
      ],
    };
  }

  return {
    content:
      "🚀 **Getting Started with MoodMeter**\n\n**Main Features:**\n• **Dashboard**: Real-time market data and sentiment\n• **Social (FinTwits)**: Community trading discussions\n• **Analytics**: Deep market analysis tools\n• **Profile**: Manage your preferences\n\n**Pro Tips:**\n• Use $ before ticker symbols (e.g., $AAPL)\n• Check sentiment before making decisions\n• Follow trending discussions\n• Build your watchlist\n\nWhat specific area would you like help with?",
    suggestions: [
      "How do I use the Dashboard?",
      "What's the Social platform?",
      "How to read Analytics?",
      "Profile and settings help",
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
