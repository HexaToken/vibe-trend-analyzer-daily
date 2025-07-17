import type { Express } from "express";
import { createServer, type Server } from "http";
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
      const apiKey = process.env.NEWSAPI_KEY || "demo_api_key";
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("NewsAPI proxy error:", error);
      res.status(500).json({ error: "Failed to fetch news data" });
    }
  });

  app.get("/api/proxy/newsapi/everything", async (req, res) => {
    try {
      const apiKey = process.env.NEWSAPI_KEY || "demo_api_key";
      const query = req.query.q || "business";
      const pageSize = req.query.pageSize || 20;
      const sortBy = req.query.sortBy || "publishedAt";
      const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query as string)}&pageSize=${pageSize}&sortBy=${sortBy}&apiKey=${apiKey}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("NewsAPI everything proxy error:", error);
      res.status(500).json({ error: "Failed to fetch news search data" });
    }
  });

  // CoinMarketCap proxy endpoints
  app.get("/api/proxy/coinmarketcap/listings", async (req, res) => {
    try {
      const apiKey = process.env.COINMARKETCAP_API_KEY || "demo_api_key";
      const limit = req.query.limit || 10; // Default to 10 for rate limiting
      const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=${limit}&convert=USD`, {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
        }
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("CoinMarketCap listings proxy error:", error);
      res.status(500).json({ error: "Failed to fetch crypto listings" });
    }
  });

  app.get("/api/proxy/coinmarketcap/quotes", async (req, res) => {
    try {
      const apiKey = process.env.COINMARKETCAP_API_KEY || "demo_api_key";
      const symbols = req.query.symbols || "BTC,ETH,BNB";
      const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}&convert=USD`, {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
        }
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("CoinMarketCap quotes proxy error:", error);
      res.status(500).json({ error: "Failed to fetch crypto quotes" });
    }
  });

  app.get("/api/proxy/coinmarketcap/global-metrics", async (req, res) => {
    try {
      const apiKey = process.env.COINMARKETCAP_API_KEY || "demo_api_key";
      const response = await fetch(`https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest?convert=USD`, {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
        }
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("CoinMarketCap global metrics proxy error:", error);
      res.status(500).json({ error: "Failed to fetch global metrics" });
    }
  });

  // YCNBC proxy endpoints
  app.get("/api/proxy/ycnbc/news/latest", async (req, res) => {
    try {
      const { spawn } = await import('child_process');
      const python = spawn('python3', ['-c', `
import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), '.pythonlibs', 'lib', 'python3.11', 'site-packages'))
sys.path.insert(0, os.getcwd())
from server.ycnbc_service import ycnbc_service
import json
result = ycnbc_service.get_latest_news()
print(json.dumps(result))
      `]);
      
      let output = '';
      python.stdout.on('data', (data: any) => {
        output += data.toString();
      });
      
      python.on('close', (code: number) => {
        try {
          const result = JSON.parse(output.trim().split('\n').pop() || '{}');
          res.json(result);
        } catch (e) {
          res.status(500).json({ error: "Failed to parse YCNBC news data" });
        }
      });
    } catch (error) {
      console.error("YCNBC latest news proxy error:", error);
      res.status(500).json({ error: "Failed to fetch YCNBC latest news" });
    }
  });

  app.get("/api/proxy/ycnbc/sentiment", async (req, res) => {
    try {
      const { spawn } = await import('child_process');
      const python = spawn('python3', ['-c', `
import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), '.pythonlibs', 'lib', 'python3.11', 'site-packages'))
sys.path.insert(0, os.getcwd())
from server.ycnbc_service import ycnbc_service
import json
result = ycnbc_service.get_enhanced_sentiment_data()
print(json.dumps(result))
      `]);
      
      let output = '';
      python.stdout.on('data', (data: any) => {
        output += data.toString();
      });
      
      python.on('close', (code: number) => {
        try {
          const result = JSON.parse(output.trim().split('\n').pop() || '{}');
          res.json(result);
        } catch (e) {
          res.status(500).json({ error: "Failed to parse YCNBC sentiment data" });
        }
      });
    } catch (error) {
      console.error("YCNBC sentiment proxy error:", error);
      res.status(500).json({ error: "Failed to fetch YCNBC sentiment data" });
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
            "Accept": "application/json",
          },
        }
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
        message: error instanceof Error ? error.message : "Unknown error"
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
            "Accept": "application/json",
          },
        }
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
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/proxy/finnhub/candles", async (req, res) => {
    try {
      const { 
        symbol = "AAPL",
        resolution = "D",
        from = Math.floor(Date.now() / 1000) - 86400 * 30, // 30 days ago
        to = Math.floor(Date.now() / 1000)
      } = req.query;
      const apiKey = "d1sgqohr01qkbods878gd1sgqohr01qkbods8790";
      
      const response = await fetch(
        `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`,
        {
          headers: {
            "Accept": "application/json",
          },
        }
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
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
