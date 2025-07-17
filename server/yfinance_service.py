"""
YFinance Service Integration
Enhanced financial data integration using the yfinance Python package for real-time market data and news
"""

import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import yfinance package
try:
    import yfinance as yf
    import pandas as pd
except ImportError as e:
    print(f"Warning: yfinance not available: {e}")
    yf = None
    pd = None

class YFinanceService:
    """Service for fetching financial data using yfinance package"""
    
    def __init__(self):
        self.available = yf is not None and pd is not None
        if self.available:
            print("✓ YFinance service initialized successfully")
        else:
            print("Warning: YFinance service not available")
    
    def is_available(self) -> bool:
        """Check if YFinance service is available"""
        return self.available
    
    def get_stock_news(self, symbol: str = "SPY") -> Dict[str, Any]:
        """Get latest news for a stock symbol"""
        if not self.is_available():
            return {"error": "YFinance service not available", "articles": []}
        
        try:
            ticker = yf.Ticker(symbol)
            news = ticker.news
            
            # Process and standardize the data
            processed_articles = []
            for article in news[:15]:  # Get top 15 news articles
                if isinstance(article, dict):
                    processed_articles.append({
                        "id": f"yf_{hash(article.get('link', '')) % 1000000}",
                        "headline": article.get('title', ''),
                        "url": article.get('link', ''),
                        "time": self._format_timestamp(article.get('providerPublishTime')),
                        "source": article.get('publisher', 'YFinance'),
                        "sentiment_score": self._calculate_basic_sentiment(article.get('title', ''))
                    })
            
            return {
                "status": "success",
                "source": f"YFinance News for {symbol}",
                "total": len(processed_articles),
                "articles": processed_articles
            }
            
        except Exception as e:
            return {"error": f"Failed to fetch news for {symbol}: {str(e)}", "articles": []}
    
    def get_market_news(self) -> Dict[str, Any]:
        """Get general market news from multiple major tickers"""
        if not self.is_available():
            return {"error": "YFinance service not available", "articles": []}
        
        try:
            # Get news from major market indicators
            tickers = ["SPY", "QQQ", "IWM", "^VIX"]
            all_articles = []
            
            for symbol in tickers:
                try:
                    ticker = yf.Ticker(symbol)
                    news = ticker.news
                    
                    for article in news[:5]:  # Top 5 from each
                        if isinstance(article, dict):
                            all_articles.append({
                                "id": f"yf_market_{hash(article.get('link', '')) % 1000000}",
                                "headline": article.get('title', ''),
                                "url": article.get('link', ''),
                                "time": self._format_timestamp(article.get('providerPublishTime')),
                                "source": article.get('publisher', 'YFinance'),
                                "sentiment_score": self._calculate_basic_sentiment(article.get('title', '')),
                                "symbol": symbol
                            })
                except:
                    continue
            
            # Remove duplicates based on URL
            seen_urls = set()
            unique_articles = []
            for article in all_articles:
                if article['url'] not in seen_urls:
                    seen_urls.add(article['url'])
                    unique_articles.append(article)
            
            return {
                "status": "success",
                "source": "YFinance Market News",
                "total": len(unique_articles),
                "articles": unique_articles[:20]  # Return top 20
            }
            
        except Exception as e:
            return {"error": f"Failed to fetch market news: {str(e)}", "articles": []}
    
    def get_stock_quote(self, symbol: str) -> Dict[str, Any]:
        """Get stock quote from YFinance"""
        if not self.is_available():
            return {"error": "YFinance service not available"}
        
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            hist = ticker.history(period="2d")
            
            if not hist.empty:
                current_price = hist['Close'].iloc[-1]
                prev_price = hist['Close'].iloc[-2] if len(hist) > 1 else current_price
                change = current_price - prev_price
                change_percent = (change / prev_price) * 100 if prev_price != 0 else 0
                
                return {
                    "status": "success",
                    "source": "YFinance",
                    "symbol": symbol,
                    "data": {
                        "price": float(current_price),
                        "change": float(change),
                        "change_percent": float(change_percent),
                        "volume": int(hist['Volume'].iloc[-1]) if 'Volume' in hist else 0,
                        "company_name": info.get('longName', symbol),
                        "market_cap": info.get('marketCap'),
                        "pe_ratio": info.get('trailingPE')
                    }
                }
            else:
                return {"error": f"No quote data found for {symbol}"}
                
        except Exception as e:
            return {"error": f"Failed to fetch quote for {symbol}: {str(e)}"}
    
    def get_enhanced_sentiment_data(self) -> Dict[str, Any]:
        """Get enhanced sentiment analysis based on market news"""
        if not self.is_available():
            return {"error": "YFinance service not available"}
        
        try:
            # Get market news for sentiment analysis
            market_news = self.get_market_news()
            
            if market_news.get("error"):
                return market_news
            
            articles = market_news.get("articles", [])
            if not articles:
                return {"error": "No articles available for sentiment analysis"}
            
            # Calculate sentiment metrics
            sentiment_scores = [article["sentiment_score"] for article in articles]
            avg_sentiment = sum(sentiment_scores) / len(sentiment_scores)
            
            # Normalize to 0-100 scale (YFinance sentiment is typically -1 to 1)
            normalized_score = int((avg_sentiment + 1) * 50)  # Convert -1,1 to 0,100
            
            return {
                "status": "success",
                "source": "YFinance Enhanced via Market News",
                "sentiment_score": normalized_score,
                "article_count": len(articles),
                "raw_sentiment": avg_sentiment,
                "latest_articles": articles[:5],
                "trending_articles": sorted(articles, key=lambda x: x.get('sentiment_score', 0), reverse=True)[:5]
            }
            
        except Exception as e:
            return {"error": f"Failed to calculate sentiment: {str(e)}"}
    
    def _format_timestamp(self, timestamp) -> str:
        """Format timestamp to readable string"""
        if not timestamp:
            return "Recently"
        
        try:
            if isinstance(timestamp, (int, float)):
                dt = datetime.fromtimestamp(timestamp)
                now = datetime.now()
                diff = now - dt
                
                if diff.days > 0:
                    return f"{diff.days} days ago"
                elif diff.seconds > 3600:
                    hours = diff.seconds // 3600
                    return f"{hours} hours ago"
                else:
                    minutes = diff.seconds // 60
                    return f"{minutes} minutes ago"
            return str(timestamp)
        except:
            return "Recently"
    
    def _calculate_basic_sentiment(self, text: str) -> float:
        """Calculate basic sentiment score for text"""
        if not text:
            return 0.0
        
        # Simple sentiment analysis based on keywords
        positive_words = ['gain', 'gains', 'up', 'rise', 'rises', 'bull', 'bullish', 'growth', 'profit', 'profits', 
                         'increase', 'strong', 'buy', 'upgrade', 'outperform', 'beat', 'beats', 'positive', 'good']
        negative_words = ['fall', 'falls', 'down', 'drop', 'drops', 'bear', 'bearish', 'loss', 'losses', 
                         'decrease', 'weak', 'sell', 'downgrade', 'underperform', 'miss', 'misses', 'negative', 'bad']
        
        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count == negative_count:
            return 0.0
        elif positive_count > negative_count:
            return min(1.0, (positive_count - negative_count) * 0.3)
        else:
            return max(-1.0, (positive_count - negative_count) * 0.3)

# Create service instance
yfinance_service = YFinanceService()