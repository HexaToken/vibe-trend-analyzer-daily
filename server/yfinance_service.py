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
    IMPORT_ERROR = None
except ImportError as e:
    print(f"Warning: yfinance not available: {e}")
    yf = None
    pd = None
    IMPORT_ERROR = str(e)

class YFinanceService:
    """Service for fetching financial data using yfinance package"""
    
        def __init__(self):
        self.available = yf is not None and pd is not None
        self.import_error = IMPORT_ERROR
        if self.available:
            print("✓ YFinance service initialized successfully")
        else:
            print(f"Warning: YFinance service not available. Import error: {IMPORT_ERROR}")
    
    def is_available(self) -> bool:
        """Check if YFinance service is available"""
        return self.available
    
        def get_stock_news(self, symbol: str = "SPY") -> Dict[str, Any]:
        """Get latest news for a stock symbol"""
        if not self.is_available():
            return {
                "error": "YFinance service not available",
                "setup_required": True,
                "import_error": self.import_error,
                "instructions": "YFinance Python package needs to be installed. Run: pip install yfinance pandas",
                "articles": []
            }
        
        try:
            ticker = yf.Ticker(symbol)
            news = ticker.news
            
            # Process and standardize the data
            processed_articles = []
            for idx, article in enumerate(news[:15]):  # Get top 15 news articles
                if isinstance(article, dict) and article:
                    # YFinance now nests data under 'content' key
                    content = article.get('content', article)
                    if not content or not isinstance(content, dict):
                        continue
                        
                    title = content.get('title', '')
                    
                    # Handle clickThroughUrl safely (can be None)
                    clickthrough = content.get('clickThroughUrl', {})
                    url1 = clickthrough.get('url', '') if clickthrough else ''
                    
                    # Handle canonicalUrl safely (can be None)
                    canonical = content.get('canonicalUrl', {})
                    url2 = canonical.get('url', '') if canonical else ''
                    
                    url = url1 or url2
                    
                    # Handle provider safely (can be None)
                    provider_data = content.get('provider', {})
                    provider = provider_data.get('displayName', 'YFinance') if provider_data else 'YFinance'
                    
                    pub_date = content.get('pubDate', '') or content.get('displayTime', '')
                    
                    if title and url:  # Only include articles with valid title and URL
                        processed_articles.append({
                            "id": f"yf_{symbol}_{idx}_{hash(url) % 1000000}",
                            "headline": title,
                            "url": url,
                            "time": self._format_timestamp(pub_date),
                            "source": provider,
                            "sentiment_score": self._calculate_basic_sentiment(title)
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
            
            for ticker_idx, symbol in enumerate(tickers):
                try:
                    ticker = yf.Ticker(symbol)
                    news = ticker.news
                    
                    for article_idx, article in enumerate(news[:5]):  # Top 5 from each
                        if isinstance(article, dict) and article:
                            # YFinance now nests data under 'content' key
                            content = article.get('content', article)
                            if not content or not isinstance(content, dict):
                                continue
                                
                            title = content.get('title', '')
                            
                            # Handle clickThroughUrl safely (can be None)
                            clickthrough = content.get('clickThroughUrl', {})
                            url1 = clickthrough.get('url', '') if clickthrough else ''
                            
                            # Handle canonicalUrl safely (can be None)
                            canonical = content.get('canonicalUrl', {})
                            url2 = canonical.get('url', '') if canonical else ''
                            
                            url = url1 or url2
                            
                            # Handle provider safely (can be None)
                            provider_data = content.get('provider', {})
                            provider = provider_data.get('displayName', 'YFinance') if provider_data else 'YFinance'
                            
                            pub_date = content.get('pubDate', '') or content.get('displayTime', '')
                            
                            if title and url:  # Only include articles with valid title and URL
                                all_articles.append({
                                    "id": f"yf_market_{ticker_idx}_{article_idx}_{hash(url) % 1000000}",
                                    "headline": title,
                                    "url": url,
                                    "time": self._format_timestamp(pub_date),
                                    "source": provider,
                                    "sentiment_score": self._calculate_basic_sentiment(title),
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
    
    def get_stock_ticker_info(self, symbol: str) -> Dict[str, Any]:
        """Get comprehensive stock ticker information from YFinance"""
        if not self.is_available():
            return {"error": "YFinance service not available"}
        
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            hist = ticker.history(period="5d")
            
            # Basic validation
            if not info or not isinstance(info, dict):
                return {"error": f"No information available for ticker {symbol}"}
            
            # Extract comprehensive ticker information
            ticker_data = {
                "symbol": symbol,
                "company_name": info.get('longName', info.get('shortName', symbol)),
                "sector": info.get('sector', ''),
                "industry": info.get('industry', ''),
                "country": info.get('country', ''),
                "currency": info.get('currency', 'USD'),
                "exchange": info.get('exchange', ''),
                "website": info.get('website', ''),
                "business_summary": info.get('longBusinessSummary', ''),
                
                # Financial metrics
                "market_cap": info.get('marketCap'),
                "enterprise_value": info.get('enterpriseValue'),
                "pe_ratio": info.get('trailingPE'),
                "forward_pe": info.get('forwardPE'),
                "peg_ratio": info.get('pegRatio'),
                "price_to_book": info.get('priceToBook'),
                "price_to_sales": info.get('priceToSalesTrailing12Months'),
                "debt_to_equity": info.get('debtToEquity'),
                "return_on_equity": info.get('returnOnEquity'),
                "return_on_assets": info.get('returnOnAssets'),
                "profit_margin": info.get('profitMargins'),
                "gross_margin": info.get('grossMargins'),
                "operating_margin": info.get('operatingMargins'),
                
                # Dividend information
                "dividend_yield": info.get('dividendYield'),
                "dividend_rate": info.get('dividendRate'),
                "payout_ratio": info.get('payoutRatio'),
                "ex_dividend_date": info.get('exDividendDate'),
                
                # Stock metrics
                "shares_outstanding": info.get('sharesOutstanding'),
                "float_shares": info.get('floatShares'),
                "shares_short": info.get('sharesShort'),
                "short_ratio": info.get('shortRatio'),
                "beta": info.get('beta'),
                "52_week_high": info.get('fiftyTwoWeekHigh'),
                "52_week_low": info.get('fiftyTwoWeekLow'),
                "50_day_average": info.get('fiftyDayAverage'),
                "200_day_average": info.get('twoHundredDayAverage'),
                
                # Volume and trading
                "average_volume": info.get('averageVolume'),
                "average_volume_10days": info.get('averageVolume10days'),
                "bid": info.get('bid'),
                "ask": info.get('ask'),
                "bid_size": info.get('bidSize'),
                "ask_size": info.get('askSize'),
                
                # Revenue and earnings
                "total_revenue": info.get('totalRevenue'),
                "revenue_per_share": info.get('revenuePerShare'),
                "earnings_per_share": info.get('trailingEps'),
                "forward_eps": info.get('forwardEps'),
                "earnings_growth": info.get('earningsGrowth'),
                "revenue_growth": info.get('revenueGrowth'),
                
                # Analyst recommendations
                "recommendation": info.get('recommendationKey', ''),
                "target_high_price": info.get('targetHighPrice'),
                "target_low_price": info.get('targetLowPrice'),
                "target_mean_price": info.get('targetMeanPrice'),
                "number_of_analyst_opinions": info.get('numberOfAnalystOpinions'),
                
                # Additional info
                "full_time_employees": info.get('fullTimeEmployees'),
                "audit_risk": info.get('auditRisk'),
                "board_risk": info.get('boardRisk'),
                "compensation_risk": info.get('compensationRisk'),
                "shareholder_rights_risk": info.get('shareHolderRightsRisk'),
                "overall_risk": info.get('overallRisk'),
                
                # Price data from history
                "current_price": None,
                "price_change": None,
                "price_change_percent": None,
                "volume": None
            }
            
            # Add current price data if available
            if not hist.empty:
                current_price = hist['Close'].iloc[-1]
                prev_price = hist['Close'].iloc[-2] if len(hist) > 1 else current_price
                change = current_price - prev_price
                change_percent = (change / prev_price) * 100 if prev_price != 0 else 0
                
                ticker_data.update({
                    "current_price": float(current_price),
                    "price_change": float(change),
                    "price_change_percent": float(change_percent),
                    "volume": int(hist['Volume'].iloc[-1]) if 'Volume' in hist else 0
                })
            
            return {
                "status": "success",
                "source": "YFinance",
                "symbol": symbol,
                "data": ticker_data
            }
            
        except Exception as e:
            return {"error": f"Failed to fetch ticker info for {symbol}: {str(e)}"}
    
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
            # Handle both ISO string format and Unix timestamp
            if isinstance(timestamp, str):
                # Parse ISO format (e.g., "2025-07-17T15:54:56Z")
                from datetime import timezone
                dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                now = datetime.now(timezone.utc)
                diff = now - dt
                
                if diff.days > 0:
                    return f"{diff.days} days ago"
                elif diff.seconds > 3600:
                    hours = diff.seconds // 3600
                    return f"{hours} hours ago"
                else:
                    minutes = diff.seconds // 60
                    return f"{minutes} minutes ago"
            elif isinstance(timestamp, (int, float)):
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
