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
      const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=100&convert=USD`, {
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



  const httpServer = createServer(app);

  return httpServer;
}
