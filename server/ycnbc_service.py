#!/usr/bin/env python3
"""
YCNBC Integration Service for Enhanced Financial Data
Provides CNBC news and market data integration for sentiment analysis
"""

import sys
import os
import json
from typing import Dict, List, Optional, Any

# Add Python libs to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '.pythonlibs', 'lib', 'python3.11', 'site-packages'))

try:
    import ycnbc
except ImportError as e:
    print(f"Warning: ycnbc not available: {e}")
    ycnbc = None

class YCNBCService:
    """Service for fetching CNBC data using ycnbc package"""
    
    def __init__(self):
        self.news_client = None
        self.markets_client = None
        
        if ycnbc:
            try:
                self.news_client = ycnbc.News()
                self.markets_client = ycnbc.Markets()
                print("✓ YCNBC service initialized successfully")
            except Exception as e:
                print(f"Warning: Failed to initialize YCNBC clients: {e}")
    
    def is_available(self) -> bool:
        """Check if YCNBC service is available"""
        return ycnbc is not None and self.news_client is not None
    
    def get_latest_news(self) -> Dict[str, Any]:
        """Get latest CNBC news articles"""
        if not self.is_available():
            return {"error": "YCNBC service not available", "articles": []}
        
        try:
            articles = self.news_client.latest()
            
            # Process and standardize the data
            processed_articles = []
            for article in articles:
                if isinstance(article, dict) and 'headline' in article:
                    processed_articles.append({
                        "id": f"cnbc_{hash(article.get('link', '')) % 1000000}",
                        "headline": article.get('headline', ''),
                        "url": article.get('link', ''),
                        "time": article.get('time'),
                        "source": "CNBC",
                        "sentiment_score": self._calculate_basic_sentiment(article.get('headline', ''))
                    })
            
            return {
                "status": "success",
                "source": "CNBC via ycnbc",
                "total": len(processed_articles),
                "articles": processed_articles
            }
            
        except Exception as e:
            return {"error": f"Failed to fetch CNBC news: {str(e)}", "articles": []}
    
    def get_trending_news(self) -> Dict[str, Any]:
        """Get trending CNBC news articles"""
        if not self.is_available():
            return {"error": "YCNBC service not available", "articles": []}
        
        try:
            articles = self.news_client.trending()
            
            # Process and standardize the data
            processed_articles = []
            for article in articles:
                if isinstance(article, dict) and 'headline' in article:
                    processed_articles.append({
                        "id": f"cnbc_trending_{hash(article.get('link', '')) % 1000000}",
                        "headline": article.get('headline', ''),
                        "url": article.get('link', ''),
                        "time": article.get('time'),
                        "source": "CNBC Trending",
                        "sentiment_score": self._calculate_basic_sentiment(article.get('headline', ''))
                    })
            
            return {
                "status": "success",
                "source": "CNBC Trending via ycnbc",
                "total": len(processed_articles),
                "articles": processed_articles
            }
            
        except Exception as e:
            return {"error": f"Failed to fetch CNBC trending news: {str(e)}", "articles": []}
    
    def get_stock_quote(self, symbol: str) -> Dict[str, Any]:
        """Get stock quote from CNBC data"""
        if not self.is_available():
            return {"error": "YCNBC service not available"}
        
        try:
            quote = self.markets_client.quote_summary(symbol)
            if quote:
                return {
                    "status": "success",
                    "source": "CNBC via ycnbc",
                    "symbol": symbol,
                    "data": quote
                }
            else:
                return {"error": f"No quote data found for {symbol}"}
                
        except Exception as e:
            return {"error": f"Failed to fetch quote for {symbol}: {str(e)}"}
    
    def get_us_markets(self) -> Dict[str, Any]:
        """Get US market data"""
        if not self.is_available():
            return {"error": "YCNBC service not available"}
        
        try:
            markets = self.markets_client.us_markets()
            return {
                "status": "success",
                "source": "CNBC US Markets via ycnbc",
                "total": len(markets) if markets else 0,
                "data": markets or []
            }
        except Exception as e:
            return {"error": f"Failed to fetch US markets: {str(e)}"}
    
    def get_cryptocurrencies(self) -> Dict[str, Any]:
        """Get cryptocurrency data from CNBC"""
        if not self.is_available():
            return {"error": "YCNBC service not available"}
        
        try:
            cryptos = self.markets_client.cryptocurrencies()
            return {
                "status": "success",
                "source": "CNBC Cryptocurrencies via ycnbc",
                "total": len(cryptos) if cryptos else 0,
                "data": cryptos or []
            }
        except Exception as e:
            return {"error": f"Failed to fetch cryptocurrencies: {str(e)}"}
    
    def get_enhanced_sentiment_data(self) -> Dict[str, Any]:
        """Get comprehensive sentiment data combining news and market data"""
        if not self.is_available():
            return {"error": "YCNBC service not available"}
        
        try:
            # Get news sentiment
            latest_news = self.get_latest_news()
            trending_news = self.get_trending_news()
            
            # Calculate overall sentiment score
            all_articles = []
            if latest_news.get("articles"):
                all_articles.extend(latest_news["articles"])
            if trending_news.get("articles"):
                all_articles.extend(trending_news["articles"])
            
            # Calculate weighted sentiment score
            total_sentiment = 0
            article_count = 0
            
            for article in all_articles:
                if article.get("sentiment_score") is not None:
                    total_sentiment += article["sentiment_score"]
                    article_count += 1
            
            avg_sentiment = total_sentiment / article_count if article_count > 0 else 0
            
            # Convert to 0-100 scale for dashboard compatibility
            normalized_sentiment = max(0, min(100, (avg_sentiment + 1) * 50))
            
            return {
                "status": "success",
                "source": "CNBC Enhanced via ycnbc",
                "sentiment_score": round(normalized_sentiment),
                "article_count": article_count,
                "raw_sentiment": round(avg_sentiment, 3),
                "latest_articles": latest_news.get("articles", [])[:5],  # Top 5 latest
                "trending_articles": trending_news.get("articles", [])[:5]  # Top 5 trending
            }
            
        except Exception as e:
            return {"error": f"Failed to generate enhanced sentiment data: {str(e)}"}
    
    def _calculate_basic_sentiment(self, text: str) -> float:
        """Basic sentiment analysis for headlines (-1 to +1)"""
        if not text:
            return 0.0
        
        text_lower = text.lower()
        
        # Positive words/phrases
        positive_indicators = [
            'rise', 'rises', 'gain', 'gains', 'up', 'higher', 'surge', 'jump', 'rally',
            'bull', 'bullish', 'positive', 'strong', 'growth', 'boost', 'upgrade',
            'beat', 'exceeds', 'outperform', 'record', 'profit', 'earnings beat'
        ]
        
        # Negative words/phrases
        negative_indicators = [
            'fall', 'falls', 'drop', 'drops', 'down', 'lower', 'plunge', 'crash',
            'bear', 'bearish', 'negative', 'weak', 'decline', 'loss', 'downgrade',
            'miss', 'misses', 'underperform', 'concern', 'worry', 'risk', 'warning'
        ]
        
        positive_count = sum(1 for word in positive_indicators if word in text_lower)
        negative_count = sum(1 for word in negative_indicators if word in text_lower)
        
        if positive_count == 0 and negative_count == 0:
            return 0.0
        
        # Calculate sentiment score
        total_indicators = positive_count + negative_count
        sentiment = (positive_count - negative_count) / total_indicators
        
        return max(-1.0, min(1.0, sentiment))

# Global service instance
ycnbc_service = YCNBCService()

def get_ycnbc_service() -> YCNBCService:
    """Get the global YCNBC service instance"""
    return ycnbc_service

if __name__ == "__main__":
    # Test the service
    service = YCNBCService()
    
    print("Testing YCNBC Service...")
    print(f"Service available: {service.is_available()}")
    
    if service.is_available():
        print("\nTesting latest news...")
        news = service.get_latest_news()
        print(f"Latest news count: {news.get('total', 0)}")
        
        print("\nTesting enhanced sentiment...")
        sentiment = service.get_enhanced_sentiment_data()
        print(f"Sentiment score: {sentiment.get('sentiment_score', 'N/A')}")
        
        print("\nTesting stock quote (AAPL)...")
        quote = service.get_stock_quote('AAPL')
        print(f"Quote status: {quote.get('status', 'error')}")