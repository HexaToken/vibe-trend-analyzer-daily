import type { Express } from "express";
import { createServer, type Server } from "http";
import { spawn } from "child_process";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // API Proxy endpoints for external services

  // NewsAPI proxy
  app.get("/api/proxy/newsapi/top-headlines", async (req, res) => {
    try {
      const apiKey = process.env.NEWSAPI_KEY;

      // If no API key, return fallback data immediately
      if (!apiKey) {
        console.warn("NewsAPI key not configured, returning mock data");
        const mockResponse = {
          status: "ok",
          totalResults: 5,
          articles: [
            {
              source: { id: "reuters", name: "Reuters" },
              author: "John Smith",
              title: "Markets Rally as Tech Earnings Beat Expectations",
              description:
                "Major technology companies reported stronger-than-expected quarterly earnings, driving broad market gains.",
              url: "https://example.com/tech-earnings-rally",
              urlToImage: null,
              publishedAt: new Date(
                Date.now() - Math.random() * 24 * 60 * 60 * 1000,
              ).toISOString(),
              content: "Technology stocks led broader market gains today...",
            },
            {
              source: { id: "bloomberg", name: "Bloomberg" },
              author: "Jane Doe",
              title:
                "Federal Reserve Signals Cautious Approach to Interest Rates",
              description:
                "Central bank officials indicate measured approach to monetary policy amid economic uncertainty.",
              url: "https://example.com/fed-interest-rates",
              urlToImage: null,
              publishedAt: new Date(
                Date.now() - Math.random() * 24 * 60 * 60 * 1000,
              ).toISOString(),
              content: "Federal Reserve officials signaled...",
            },
            {
              source: { id: "cnbc", name: "CNBC" },
              author: "Mike Johnson",
              title: "Cryptocurrency Market Shows Signs of Recovery",
              description:
                "Bitcoin and major altcoins post gains as institutional interest returns to digital assets.",
              url: "https://example.com/crypto-recovery",
              urlToImage: null,
              publishedAt: new Date(
                Date.now() - Math.random() * 24 * 60 * 60 * 1000,
              ).toISOString(),
              content: "The cryptocurrency market showed...",
            },
            {
              source: { id: "financial-times", name: "Financial Times" },
              author: "Sarah Wilson",
              title: "Global Supply Chain Shows Signs of Normalization",
              description:
                "International shipping costs decline as supply chain bottlenecks ease across major trade routes.",
              url: "https://example.com/supply-chain-update",
              urlToImage: null,
              publishedAt: new Date(
                Date.now() - Math.random() * 12 * 60 * 60 * 1000,
              ).toISOString(),
              content: "Supply chain improvements continue...",
            },
            {
              source: {
                id: "wall-street-journal",
                name: "Wall Street Journal",
              },
              author: "David Chen",
              title: "Energy Sector Posts Strong Quarterly Results",
              description:
                "Oil and gas companies report robust earnings as energy demand remains steady amid economic uncertainty.",
              url: "https://example.com/energy-earnings",
              urlToImage: null,
              publishedAt: new Date(
                Date.now() - Math.random() * 6 * 60 * 60 * 1000,
              ).toISOString(),
              content: "The energy sector's performance...",
            },
          ],
        };
        return res.json(mockResponse);
      }

      const { country = "us", category = "business" } = req.query;
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`,
      );
      const data = await response.json();

      // Check if NewsAPI returned an error
      if (data.status === "error") {
        console.warn("NewsAPI returned error:", data.message);
        // Return mock data on API error
        const mockResponse = {
          status: "ok",
          totalResults: 3,
          articles: [
            {
              source: { id: "reuters", name: "Reuters" },
              author: "News Reporter",
              title:
                "Market Update: Trading Continues Amid Economic Uncertainty",
              description:
                "Financial markets show mixed signals as investors await economic indicators.",
              url: "https://example.com/market-update",
              urlToImage: null,
              publishedAt: new Date(
                Date.now() - Math.random() * 24 * 60 * 60 * 1000,
              ).toISOString(),
              content: "Markets continue trading with uncertainty...",
            },
          ],
        };
        return res.json(mockResponse);
      }

      res.json(data);
    } catch (error) {
      console.error("NewsAPI proxy error:", error);
      // Return mock data on network error
      const mockResponse = {
        status: "ok",
        totalResults: 1,
        articles: [
          {
            source: { id: "mock", name: "Mock News" },
            author: "System",
            title: "News Service Temporarily Unavailable",
            description:
              "Using fallback news data while the service is being restored.",
            url: "https://example.com/fallback",
            urlToImage: null,
            publishedAt: new Date().toISOString(),
            content: "News service temporarily unavailable...",
          },
        ],
      };
      res.json(mockResponse);
    }
  });

  app.get("/api/proxy/newsapi/everything", async (req, res) => {
    try {
      const apiKey = process.env.NEWSAPI_KEY;

      // If no API key, return fallback data immediately
      if (!apiKey) {
        console.warn("NewsAPI key not configured, returning mock search data");
        const query = req.query.q || "business";
        const mockResponse = {
          status: "ok",
          totalResults: 2,
          articles: [
            {
              source: { id: "reuters", name: "Reuters" },
              author: "News Reporter",
              title: `Latest developments in ${query}: Market Analysis`,
              description: `Comprehensive analysis of recent ${query} trends and their market impact.`,
              url: `https://example.com/${(query as string).replace(/\s+/g, "-").toLowerCase()}`,
              urlToImage: null,
              publishedAt: new Date(
                Date.now() - Math.random() * 12 * 60 * 60 * 1000,
              ).toISOString(),
              content: `Recent developments in ${query}...`,
            },
            {
              source: { id: "bloomberg", name: "Bloomberg" },
              author: "Market Analyst",
              title: `${query} Outlook: Expert Predictions and Analysis`,
              description: `Industry experts weigh in on the future prospects of ${query} in current market conditions.`,
              url: `https://example.com/${(query as string).replace(/\s+/g, "-").toLowerCase()}-outlook`,
              urlToImage: null,
              publishedAt: new Date(
                Date.now() - Math.random() * 18 * 60 * 60 * 1000,
              ).toISOString(),
              content: `Experts predict that ${query}...`,
            },
          ],
        };
        return res.json(mockResponse);
      }

      const query = req.query.q || "business";
      const pageSize = req.query.pageSize || 20;
      const sortBy = req.query.sortBy || "publishedAt";
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query as string)}&pageSize=${pageSize}&sortBy=${sortBy}&apiKey=${apiKey}`,
      );
      const data = await response.json();

      // Check if NewsAPI returned an error
      if (data.status === "error") {
        console.warn("NewsAPI everything returned error:", data.message);
        // Return mock data on API error
        const mockResponse = {
          status: "ok",
          totalResults: 1,
          articles: [
            {
              source: { id: "mock", name: "Mock Search" },
              author: "System",
              title: `Search results for "${query}" temporarily unavailable`,
              description:
                "Using fallback search data while the service is being restored.",
              url: "https://example.com/search-fallback",
              urlToImage: null,
              publishedAt: new Date().toISOString(),
              content: "Search service temporarily unavailable...",
            },
          ],
        };
        return res.json(mockResponse);
      }

      res.json(data);
    } catch (error) {
      console.error("NewsAPI everything proxy error:", error);
      // Return mock data on network error
      const query = req.query.q || "business";
      const mockResponse = {
        status: "ok",
        totalResults: 1,
        articles: [
          {
            source: { id: "mock", name: "Mock Search" },
            author: "System",
            title: `Network error retrieving "${query}" results`,
            description:
              "Using fallback search data due to network connectivity issues.",
            url: "https://example.com/network-error",
            urlToImage: null,
            publishedAt: new Date().toISOString(),
            content: "Network connectivity temporarily unavailable...",
          },
        ],
      };
      res.json(mockResponse);
    }
  });

  // CoinMarketCap proxy endpoints
  app.get("/api/proxy/coinmarketcap/listings", async (req, res) => {
    try {
      const apiKey = process.env.COINMARKETCAP_API_KEY || "demo_api_key";
      const limit = req.query.limit || 10; // Default to 10 for rate limiting
      const response = await fetch(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=${limit}&convert=USD`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": apiKey,
          },
        },
      );
      const data = await response.json();

      // Check if the API returned an error (e.g., rate limit)
      if (data.status && data.status.error_code !== 0) {
        console.warn("CoinMarketCap API error:", data.status.error_message);
        res.status(429).json({
          status: data.status,
          error: "CoinMarketCap API error: " + data.status.error_message,
        });
        return;
      }

      res.json(data);
    } catch (error) {
      console.error("CoinMarketCap listings proxy error:", error);
      res.status(500).json({
        status: {
          error_code: 500,
          error_message: "Failed to fetch crypto listings",
        },
        error: "Failed to fetch crypto listings",
      });
    }
  });

  app.get("/api/proxy/coinmarketcap/quotes", async (req, res) => {
    try {
      const apiKey = process.env.COINMARKETCAP_API_KEY || "demo_api_key";
      const symbols = req.query.symbols || "BTC,ETH,BNB";
      const response = await fetch(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}&convert=USD`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": apiKey,
          },
        },
      );
      const data = await response.json();

      // Check if the API returned an error (e.g., rate limit)
      if (data.status && data.status.error_code !== 0) {
        console.warn("CoinMarketCap API error:", data.status.error_message);
        res.status(429).json({
          status: data.status,
          error: "CoinMarketCap API error: " + data.status.error_message,
        });
        return;
      }

      res.json(data);
    } catch (error) {
      console.error("CoinMarketCap quotes proxy error:", error);
      res.status(500).json({
        status: {
          error_code: 500,
          error_message: "Failed to fetch crypto quotes",
        },
        error: "Failed to fetch crypto quotes",
      });
    }
  });

  app.get("/api/proxy/coinmarketcap/global-metrics", async (req, res) => {
    try {
      const apiKey = process.env.COINMARKETCAP_API_KEY || "demo_api_key";
      const response = await fetch(
        `https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest?convert=USD`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": apiKey,
          },
        },
      );
      const data = await response.json();

      // Check if the API returned an error (e.g., rate limit)
      if (data.status && data.status.error_code !== 0) {
        console.warn("CoinMarketCap API error:", data.status.error_message);
        res.status(429).json({
          status: data.status,
          error: "CoinMarketCap API error: " + data.status.error_message,
        });
        return;
      }

      res.json(data);
    } catch (error) {
      console.error("CoinMarketCap global metrics proxy error:", error);
      res.status(500).json({
        status: {
          error_code: 500,
          error_message: "Failed to fetch global metrics",
        },
        error: "Failed to fetch global metrics",
      });
    }
  });

  // YFinance proxy endpoints
  app.get("/api/proxy/yfinance/news/latest", async (req, res) => {
    try {
      const { spawn } = await import("child_process");
      const python = spawn("python3", [
        "server/yfinance_service.py",
        "get_market_news",
      ]);

      let output = "";
      let responseHandled = false;

      python.stdout.on("data", (data: any) => {
        output += data.toString();
      });

      python.on("close", (code: number) => {
        if (responseHandled) return;
        responseHandled = true;

        try {
          const lastLine = output.trim().split("\n").pop() || "{}";
          const result = JSON.parse(lastLine);
          res.json(result);
        } catch (e) {
          console.error(
            "YFinance news parse error - Output:",
            output,
            "Error:",
            e,
          );
          // Return structured error response if parsing fails
          res.json({
            error: "YFinance service not available",
            setup_required: true,
            import_error: "Failed to parse Python output",
            instructions:
              "YFinance Python package needs to be installed. Run: pip install yfinance pandas",
            articles: [],
          });
        }
      });

      const timeoutId = setTimeout(() => {
        if (responseHandled) return;
        responseHandled = true;
        python.kill();
        res.status(408).json({ error: "Request timeout" });
      }, 30000);

      // Clear timeout if process completes normally
      python.on("close", () => {
        clearTimeout(timeoutId);
      });
    } catch (error) {
      console.error("YFinance latest news proxy error:", error);
      res.status(500).json({ error: "Failed to fetch YFinance latest news" });
    }
  });

  app.get("/api/proxy/yfinance/news/trending", async (req, res) => {
    try {
      const symbol = (req.query.symbol as string) || "SPY";
      const { spawn } = await import("child_process");
      const python = spawn("python3", [
        "-c",
        `
import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), '.pythonlibs', 'lib', 'python3.11', 'site-packages'))
sys.path.insert(0, os.getcwd())
from server.yfinance_service import yfinance_service
import json
result = yfinance_service.get_stock_news("${symbol}")
print(json.dumps(result))
      `,
      ]);

      let output = "";
      let error = "";
      let responseHandled = false;

      python.stdout.on("data", (data: any) => {
        output += data.toString();
      });

      python.stderr.on("data", (data: any) => {
        error += data.toString();
      });

      python.on("close", (code: number) => {
        if (responseHandled) return;
        responseHandled = true;

        try {
          const lines = output.trim().split("\n");
          const jsonLine = lines[lines.length - 1];
          const result = JSON.parse(jsonLine);
          res.setHeader("Content-Type", "application/json");
          res.json(result);
        } catch (e) {
          console.error(
            "YFinance trending parse error:",
            e,
            "Output:",
            output,
            "Error:",
            error,
          );
          res.status(500).json({
            error: "Failed to parse YFinance trending data",
            debug: { output, error },
          });
        }
      });

      const timeoutId = setTimeout(() => {
        if (responseHandled) return;
        responseHandled = true;
        python.kill();
        res.status(408).json({ error: "Request timeout" });
      }, 30000);

      // Clear timeout if process completes normally
      python.on("close", () => {
        clearTimeout(timeoutId);
      });
    } catch (error) {
      console.error("YFinance trending news proxy error:", error);
      res.status(500).json({ error: "Failed to fetch YFinance trending news" });
    }
  });

  // YFinance setup and diagnosis endpoint
  app.get("/api/proxy/yfinance/status", async (req, res) => {
    try {
      const { spawn } = await import("child_process");
      const python = spawn("python3", [
        "-c",
        `
import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), '.pythonlibs', 'lib', 'python3.11', 'site-packages'))
sys.path.insert(0, os.getcwd())

try:
    import yfinance as yf
    import pandas as pd
    print("SUCCESS: YFinance and pandas are available")
    print(f"yfinance version: {yf.__version__}")
    print(f"pandas version: {pd.__version__}")

    # Test basic functionality
    ticker = yf.Ticker("AAPL")
    info = ticker.info
    if info:
        print("SUCCESS: YFinance API test passed")
    else:
        print("WARNING: YFinance API test failed - no data returned")
except ImportError as e:
    print(f"ERROR: Import failed - {e}")
except Exception as e:
    print(f"ERROR: YFinance test failed - {e}")
      `,
      ]);

      let output = "";
      let error = "";
      let responseHandled = false;

      python.stdout.on("data", (data: any) => {
        output += data.toString();
      });

      python.stderr.on("data", (data: any) => {
        error += data.toString();
      });

      python.on("close", (code: number) => {
        if (responseHandled) return;
        responseHandled = true;

        const lines = output.trim().split("\n");
        const status = output.includes(
          "SUCCESS: YFinance and pandas are available",
        );

        res.json({
          status: status ? "available" : "not_available",
          code,
          output: lines,
          error: error || null,
          setup_instructions: status
            ? null
            : [
                "Install YFinance and pandas:",
                "pip install yfinance pandas",
                "Or using uv:",
                "uv add yfinance pandas",
              ],
        });
      });

      const timeoutId = setTimeout(() => {
        if (responseHandled) return;
        responseHandled = true;
        python.kill();
        res.status(408).json({
          status: "timeout",
          error: "Diagnosis timeout",
          setup_instructions: [
            "Install YFinance and pandas:",
            "pip install yfinance pandas",
            "Or using uv:",
            "uv add yfinance pandas",
          ],
        });
      }, 15000);

      python.on("close", () => {
        clearTimeout(timeoutId);
      });
    } catch (error) {
      console.error("YFinance status check error:", error);
      res.status(500).json({
        status: "error",
        error: "Failed to check YFinance status",
        setup_instructions: [
          "Install YFinance and pandas:",
          "pip install yfinance pandas",
          "Or using uv:",
          "uv add yfinance pandas",
        ],
      });
    }
  });

  app.get("/api/proxy/yfinance/sentiment", async (req, res) => {
    try {
      const { spawn } = await import("child_process");
      const python = spawn("python3", [
        "server/yfinance_service.py",
        "get_enhanced_sentiment_data",
      ]);

      let output = "";
      let responseHandled = false;

      python.stdout.on("data", (data: any) => {
        output += data.toString();
      });

      python.on("close", (code: number) => {
        if (responseHandled) return;
        responseHandled = true;

        try {
          const lastLine = output.trim().split("\n").pop() || "{}";
          const result = JSON.parse(lastLine);
          res.json(result);
        } catch (e) {
          console.error(
            "YFinance sentiment parse error - Output:",
            output,
            "Error:",
            e,
          );
          // Return structured error response if parsing fails
          res.json({
            error: "YFinance service not available",
            setup_required: true,
            import_error: "Failed to parse Python output",
            instructions:
              "YFinance Python package needs to be installed. Run: pip install yfinance pandas",
          });
        }
      });

      const timeoutId = setTimeout(() => {
        if (responseHandled) return;
        responseHandled = true;
        python.kill();
        res.status(408).json({ error: "Request timeout" });
      }, 30000);

      // Clear timeout if process completes normally
      python.on("close", () => {
        clearTimeout(timeoutId);
      });
    } catch (error) {
      console.error("YFinance sentiment proxy error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch YFinance sentiment data" });
    }
  });

  app.get("/api/proxy/yfinance/ticker", async (req, res) => {
    try {
      const symbol = (req.query.symbol as string) || "AAPL";
      const { spawn } = await import("child_process");
      const python = spawn("python3", [
        "-c",
        `
import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), '.pythonlibs', 'lib', 'python3.11', 'site-packages'))
sys.path.insert(0, os.getcwd())
from server.yfinance_service import yfinance_service
import json
result = yfinance_service.get_stock_ticker_info("${symbol}")
print(json.dumps(result))
      `,
      ]);

      let output = "";
      let responseHandled = false;

      python.stdout.on("data", (data: any) => {
        output += data.toString();
      });

      python.on("close", (code: number) => {
        if (responseHandled) return;
        responseHandled = true;

        try {
          const result = JSON.parse(output.trim().split("\n").pop() || "{}");
          res.json(result);
        } catch (e) {
          res
            .status(500)
            .json({ error: "Failed to parse YFinance ticker data" });
        }
      });

      const timeoutId = setTimeout(() => {
        if (responseHandled) return;
        responseHandled = true;
        python.kill();
        res.status(408).json({ error: "Request timeout" });
      }, 30000);

      // Clear timeout if process completes normally
      python.on("close", () => {
        clearTimeout(timeoutId);
      });
    } catch (error) {
      console.error("YFinance ticker proxy error:", error);
      res.status(500).json({ error: "Failed to fetch YFinance ticker data" });
    }
  });

  // Instagram API endpoints
  app.get("/api/proxy/instagram/user/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const python = spawn("python3", [
        "server/instagram_service.py",
        "user_info",
        username,
      ]);

      let responseHandled = false;
      let dataBuffer = "";

      python.stdout.on("data", (data) => {
        dataBuffer += data.toString();
      });

      python.stderr.on("data", (data) => {
        console.error("Instagram user API error:", data.toString());
      });

      python.on("close", (code) => {
        if (responseHandled) return;
        responseHandled = true;

        try {
          const result = JSON.parse(dataBuffer.trim());
          if (result.status === "error") {
            res.status(400).json(result);
          } else {
            res.json(result);
          }
        } catch (parseError) {
          console.error("Failed to parse Instagram user data:", parseError);
          res
            .status(500)
            .json({ error: "Failed to parse Instagram user data" });
        }
      });

      const timeoutId = setTimeout(() => {
        if (responseHandled) return;
        responseHandled = true;
        python.kill();
        res.status(408).json({ error: "Request timeout" });
      }, 30000);

      python.on("close", () => {
        clearTimeout(timeoutId);
      });
    } catch (error) {
      console.error("Instagram user proxy error:", error);
      res.status(500).json({ error: "Failed to fetch Instagram user data" });
    }
  });

  app.get("/api/proxy/instagram/hashtag/:hashtag", async (req, res) => {
    try {
      const { hashtag } = req.params;
      const { limit = 20 } = req.query;
      const python = spawn("python3", [
        "server/instagram_service.py",
        "search_hashtag",
        hashtag,
        limit.toString(),
      ]);

      let responseHandled = false;
      let dataBuffer = "";

      python.stdout.on("data", (data) => {
        dataBuffer += data.toString();
      });

      python.stderr.on("data", (data) => {
        console.error("Instagram hashtag API error:", data.toString());
      });

      python.on("close", (code) => {
        if (responseHandled) return;
        responseHandled = true;

        try {
          const result = JSON.parse(dataBuffer.trim());
          if (result.status === "error") {
            res.status(400).json(result);
          } else {
            res.json(result);
          }
        } catch (parseError) {
          console.error("Failed to parse Instagram hashtag data:", parseError);
          res
            .status(500)
            .json({ error: "Failed to parse Instagram hashtag data" });
        }
      });

      const timeoutId = setTimeout(() => {
        if (responseHandled) return;
        responseHandled = true;
        python.kill();
        res.status(408).json({ error: "Request timeout" });
      }, 30000);

      python.on("close", () => {
        clearTimeout(timeoutId);
      });
    } catch (error) {
      console.error("Instagram hashtag proxy error:", error);
      res.status(500).json({ error: "Failed to fetch Instagram hashtag data" });
    }
  });

  app.get("/api/proxy/instagram/trending/finance", async (req, res) => {
    try {
      const python = spawn("python3", [
        "server/instagram_service.py",
        "trending_finance",
      ]);

      let responseHandled = false;
      let dataBuffer = "";

      python.stdout.on("data", (data) => {
        dataBuffer += data.toString();
      });

      python.stderr.on("data", (data) => {
        console.error("Instagram trending API error:", data.toString());
      });

      python.on("close", (code) => {
        if (responseHandled) return;
        responseHandled = true;

        try {
          const result = JSON.parse(dataBuffer.trim());
          if (result.status === "error") {
            res.status(400).json(result);
          } else {
            res.json(result);
          }
        } catch (parseError) {
          console.error("Failed to parse Instagram trending data:", parseError);
          res
            .status(500)
            .json({ error: "Failed to parse Instagram trending data" });
        }
      });

      const timeoutId = setTimeout(() => {
        if (responseHandled) return;
        responseHandled = true;
        python.kill();
        res.status(408).json({ error: "Request timeout" });
      }, 30000);

      python.on("close", () => {
        clearTimeout(timeoutId);
      });
    } catch (error) {
      console.error("Instagram trending proxy error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch Instagram trending data" });
    }
  });

  // spaCy NLP Analysis endpoints
  app.post("/api/nlp/spacy/analyze", async (req, res) => {
    try {
      const { text } = req.body;

      if (!text || typeof text !== "string") {
        return res.status(400).json({
          status: "error",
          error: "invalid_input",
          message: "Please provide valid text for analysis",
        });
      }

      const python = spawn("python3", [
        "server/spacy_nlp_service.py",
        "analyze",
        text,
      ]);

      let responseHandled = false;
      let dataBuffer = "";

      python.stdout.on("data", (data) => {
        dataBuffer += data.toString();
      });

      python.stderr.on("data", (data) => {
        console.error("spaCy NLP error:", data.toString());
      });

      python.on("close", (code) => {
        if (responseHandled) return;
        responseHandled = true;

        try {
          const result = JSON.parse(dataBuffer.trim());
          if (result.status === "error") {
            res.status(400).json(result);
          } else {
            res.json(result);
          }
        } catch (parseError) {
          console.error("Failed to parse spaCy NLP data:", parseError);
          res.status(500).json({ error: "Failed to parse NLP analysis data" });
        }
      });

      const timeoutId = setTimeout(() => {
        if (responseHandled) return;
        responseHandled = true;
        python.kill();
        res.status(408).json({ error: "NLP analysis timeout" });
      }, 15000);

      python.on("close", () => {
        clearTimeout(timeoutId);
      });
    } catch (error) {
      console.error("spaCy NLP proxy error:", error);
      res.status(500).json({ error: "Failed to perform NLP analysis" });
    }
  });

  app.post("/api/nlp/spacy/batch", async (req, res) => {
    try {
      const { texts } = req.body;

      if (!Array.isArray(texts) || texts.length === 0) {
        return res.status(400).json({
          status: "error",
          error: "invalid_input",
          message: "Please provide an array of texts for batch analysis",
        });
      }

      const python = spawn("python3", [
        "server/spacy_nlp_service.py",
        "batch",
        JSON.stringify(texts),
      ]);

      let responseHandled = false;
      let dataBuffer = "";

      python.stdout.on("data", (data) => {
        dataBuffer += data.toString();
      });

      python.stderr.on("data", (data) => {
        console.error("spaCy batch NLP error:", data.toString());
      });

      python.on("close", (code) => {
        if (responseHandled) return;
        responseHandled = true;

        try {
          const result = JSON.parse(dataBuffer.trim());
          if (result.status === "error") {
            res.status(400).json(result);
          } else {
            res.json(result);
          }
        } catch (parseError) {
          console.error("Failed to parse spaCy batch NLP data:", parseError);
          res
            .status(500)
            .json({ error: "Failed to parse batch NLP analysis data" });
        }
      });

      const timeoutId = setTimeout(() => {
        if (responseHandled) return;
        responseHandled = true;
        python.kill();
        res.status(408).json({ error: "Batch NLP analysis timeout" });
      }, 30000);

      python.on("close", () => {
        clearTimeout(timeoutId);
      });
    } catch (error) {
      console.error("spaCy batch NLP proxy error:", error);
      res.status(500).json({ error: "Failed to perform batch NLP analysis" });
    }
  });

  // X/Twitter API endpoints - What's Happening
  app.get("/api/proxy/twitter/trending", async (req, res) => {
    try {
      const bearerToken =
        process.env.TWITTER_BEARER_TOKEN ||
        "766687026-6nvFdqRnFE5MXI9a3nrtBEl08U4sFUK8ZrKBzhFm";

      // Get trending topics for a specific location (1 = worldwide, 23424977 = United States)
      const { woeid = 1 } = req.query;

      const response = await fetch(
        `https://api.twitter.com/1.1/trends/place.json?id=${woeid}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Twitter API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.warn(
        "Twitter trending API failed, using mock data:",
        error.message,
      );
      // Return mock data for rate limits or API issues
      const mockTrending = [
        {
          trends: [
            {
              name: "#Finance",
              url: "",
              query: "#Finance",
              tweet_volume: 125000,
            },
            {
              name: "#StockMarket",
              url: "",
              query: "#StockMarket",
              tweet_volume: 98000,
            },
            { name: "#Crypto", url: "", query: "#Crypto", tweet_volume: 87000 },
            {
              name: "#TradingTips",
              url: "",
              query: "#TradingTips",
              tweet_volume: 45000,
            },
            {
              name: "#Investing",
              url: "",
              query: "#Investing",
              tweet_volume: 67000,
            },
            {
              name: "#Bitcoin",
              url: "",
              query: "#Bitcoin",
              tweet_volume: 156000,
            },
            {
              name: "#MarketNews",
              url: "",
              query: "#MarketNews",
              tweet_volume: 34000,
            },
            {
              name: "#FinTech",
              url: "",
              query: "#FinTech",
              tweet_volume: 28000,
            },
            {
              name: "#WallStreet",
              url: "",
              query: "#WallStreet",
              tweet_volume: 41000,
            },
            {
              name: "#Economy",
              url: "",
              query: "#Economy",
              tweet_volume: 72000,
            },
          ],
        },
      ];
      res.json(mockTrending);
    }
  });

  app.get("/api/proxy/twitter/search/recent", async (req, res) => {
    try {
      const {
        query = "finance OR stocks OR markets OR trading",
        max_results = 20,
      } = req.query;
      const bearerToken =
        process.env.TWITTER_BEARER_TOKEN ||
        "766687026-6nvFdqRnFE5MXI9a3nrtBEl08U4sFUK8ZrKBzhFm";

      const response = await fetch(
        `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query as string)}&max_results=${max_results}&tweet.fields=created_at,public_metrics,context_annotations,entities,author_id&expansions=author_id&user.fields=name,username,verified,public_metrics`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Twitter API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.warn(
        "Twitter search API failed, using mock data:",
        error.message,
      );
      // Return mock data for rate limits or API issues
      const mockSearchResponse = {
        data: [
          {
            id: "mock1",
            text: "Breaking: Major tech stocks surge after positive earnings reports. $AAPL $MSFT $GOOGL showing strong momentum #StockMarket #TechStocks",
            created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            author_id: "mock_user1",
            public_metrics: {
              retweet_count: 245,
              like_count: 1200,
              reply_count: 89,
              quote_count: 34,
            },
            entities: { cashtags: [{ start: 82, end: 87, tag: "AAPL" }] },
          },
          {
            id: "mock2",
            text: "🚨 BREAKING: Federal Reserve hints at potential rate changes. Market volatility expected. #Fed #InterestRates",
            created_at: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
            author_id: "mock_user2",
            public_metrics: {
              retweet_count: 567,
              like_count: 2100,
              reply_count: 123,
              quote_count: 67,
            },
          },
        ],
        includes: {
          users: [
            {
              id: "mock_user1",
              name: "Market Analyst",
              username: "marketpro",
              verified: true,
              public_metrics: {
                followers_count: 45000,
                following_count: 1200,
                tweet_count: 8900,
                listed_count: 234,
              },
            },
            {
              id: "mock_user2",
              name: "Finance News",
              username: "finnews",
              verified: true,
              public_metrics: {
                followers_count: 128000,
                following_count: 890,
                tweet_count: 15600,
                listed_count: 567,
              },
            },
          ],
        },
      };
      res.json(mockSearchResponse);
    }
  });

  // Finnhub API endpoints
  app.get("/api/proxy/finnhub/symbol-lookup", async (req, res) => {
    try {
      const { query = "apple" } = req.query;
      const apiKey = "d1sgqohr01qkbods878gd1sgqohr01qkbods8790";

      const response = await fetch(
        `https://finnhub.io/api/v1/search?q=${query}&token=${apiKey}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Finnhub API error:", error);
      res.status(500).json({
        error: "Failed to fetch symbol lookup",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.get("/api/proxy/finnhub/quote", async (req, res) => {
    try {
      const { symbol = "AAPL" } = req.query;
      const apiKey = "d1sgqohr01qkbods878gd1sgqohr01qkbods8790";

      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Finnhub quote API error:", error);
      res.status(500).json({
        error: "Failed to fetch quote data",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.get("/api/proxy/finnhub/candles", async (req, res) => {
    try {
      const {
        symbol = "AAPL",
        resolution = "D",
        from = Math.floor(Date.now() / 1000) - 86400 * 30, // 30 days ago
        to = Math.floor(Date.now() / 1000),
      } = req.query;
      const apiKey = "d1sgqohr01qkbods878gd1sgqohr01qkbods8790";

      const response = await fetch(
        `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Finnhub candles API error:", error);
      res.status(500).json({
        error: "Failed to fetch candle data",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
