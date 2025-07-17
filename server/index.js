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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`📈 CoinMarketCap proxy endpoints available`);
  console.log(`📰 NewsAPI proxy endpoints available`);
});
