# Project Overview

## Current Status
**Migration from Lovable to Replit: COMPLETED**
- Project successfully migrated on January 17, 2025
- All dependencies installed and working
- Server running on port 5000
- Client/server separation implemented

## Project Architecture
This is a full-stack JavaScript application with:
- **Frontend**: React with TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session management
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter for client-side routing

## Key Features
- Multi-section dashboard application
- Authentication system with user profiles
- Real-time data integration (NewsAPI, TwelveData, etc.)
- Sentiment analysis and analytics
- Social platform integration
- Database management interface
- AI chat functionality

## Current Configuration
- Server serves both API and static files on port 5000
- Development environment uses Vite with HMR
- Production serves static files from build directory
- In-memory storage currently active (MemStorage)

## Security Notes
- Client/server separation properly implemented
- API routes prefixed with `/api`
- Authentication middleware in place
- Environment variables ready for API keys

## External APIs
The application integrates with multiple external services:
- NewsAPI (currently using mock data)
- Polygon.io (financial data and dividends)
- Various sentiment analysis APIs
- Social media platforms

**Note**: API keys need to be configured for live data integration.

## Recent Changes
- **2025-01-17**: Fixed YFinance integration and server stability issues
  - Resolved server crash due to race condition in response handling
  - Fixed duplicate React keys in YFinance data by improving ID generation
  - Updated YFinance service to handle new nested data structure from API
  - Fixed timestamp handling to properly parse ISO format timestamps
  - Added proper timeout handling for Python processes to prevent hanging
  - Fixed null pointer errors in YFinance data parsing (clickThroughUrl and provider fields can be None)
  - YFinance now properly pulls real market news with correct headlines, URLs, and timestamps
  - SPY Stock-Specific News functionality fully restored and working with 10 articles
  - Added comprehensive stock ticker information functionality with 50+ financial metrics per stock
  - Fixed runtime error in SocialPlatform component where realTimeTickers.find() was being called on object instead of array
- **2025-01-17**: Complete migration from Lovable to Replit
  - Fixed dependency issues (sonner, nanoid)
  - Verified application startup and functionality
  - All core features working with mock data fallbacks
- **2025-01-17**: Replaced Alpha Vantage API with Polygon.io
  - Updated API service to use Polygon.io dividends endpoint
  - Implemented backward compatibility for existing components
  - API Key: ABeiglsv3LqhpieYSQiAYW9c0IhcpzaX
- **2025-01-17**: Fixed CoinMarketCap API excessive requests
  - Implemented circuit breaker pattern to prevent API spam
  - Added proper error handling with fallback mechanisms
  - Created new PolygonDividendsDemo component for dividend data
  - Added component to navigation menu
- **2025-01-17**: Updated API polling intervals to 3 minutes
  - Changed all API refresh intervals from various shorter intervals to 180,000ms (3 minutes)
  - Updated CoinMarketCap hooks: usePopularCryptos, useRealTimeCryptos
  - Updated TwelveData hooks: useRealTimeQuotes, useWatchlistRealTime  
  - Updated stock price components: RealTimePrice, InlinePrice, InlineCryptoPrice
  - Updated NewsAPI components: TopNews, NewsDemo with explicit 3-minute intervals
  - Improved API rate limiting and reduced server load
- **2025-01-17**: Updated popular stocks display to show top 10 only
  - Modified popularStocks array in TwelveDataDemo to include top 10 stocks
  - Updated PostComposer popularTickers to match top 10 stocks
  - Ensured consistent display of exactly 10 popular stocks across all components
- **2025-01-17**: Replaced TwelveDataDemo with PolygonDemo component
  - Removed TwelveDataDemo.tsx and replaced with PolygonDemo.tsx
  - Updated App.tsx routing from "twelvedata" to "polygon"
  - Updated Navigation.tsx to show "Polygon.io API Demo" instead of "Financial APIs Demo"
  - New PolygonDemo integrates Polygon.io API, CoinMarketCap API, and NewsAPI
  - Maintains same functionality: stock quotes, crypto data, dividend information, and news integration
- **2025-01-17**: Replaced PolygonDemo with GoogleFinanceDemo component (REMOVED)
  - Removed PolygonDemo.tsx and replaced with GoogleFinanceDemo.tsx
  - Updated App.tsx routing from "polygon" to "googlefinance"
  - Updated Navigation.tsx to show "Google Finance API Demo"
  - New GoogleFinanceDemo integrates Google Finance API via SerpAPI
  - Added server proxy endpoints for Google Finance, NewsAPI, CoinMarketCap, and SerpAPI
  - Provides comprehensive stock quotes, search, trending stocks, and market data
- **2025-01-17**: Removed SerpAPI integration completely
  - Removed GoogleFinanceDemo.tsx and SerpApiDemo.tsx components
  - Removed useGoogleFinance.ts, useSerpApi.ts hooks
  - Removed googleFinanceApi.ts, serpApi.ts services
  - Removed SerpAPI server proxy endpoints
  - Updated Navigation.tsx to remove Google Finance and SerpAPI menu items
  - Focus back on NewsAPI and CoinMarketCap integrations which are working correctly
- **2025-01-17**: Limited cryptocurrency display to top 10 only
  - Updated CryptoDashboard to fetch and display only top 10 cryptocurrencies by market cap
  - Changed default limit from 100 to 10 in CoinMarketCap API service
  - Updated server proxy endpoint to accept limit parameter for rate limiting
  - Reduced excessive API calls to improve performance and stay within API limits
- **2025-01-17**: Drastically reduced CoinMarketCap API calls
  - Changed all refresh intervals from 1-3 minutes to 5 minutes (300000ms) 
  - Modified CryptoGrid to use single bulk API call instead of individual calls per cryptocurrency
  - Removed duplicate useCryptoQuotes calls in CryptoDashboard 
  - Updated SocialPlatform and other components to use 5-minute refresh intervals
  - Implemented proper bulk data fetching to minimize API request volume
- **2025-01-17**: Replaced Alpha Vantage with Finnhub API integration
  - Removed all Alpha Vantage endpoints, components, and services
  - Created new Finnhub API endpoints: /symbol-lookup, /quote, /candles
  - Implemented FinnhubDemo component with symbol search, real-time quotes, and 3-day price averaging
  - Added useFinnhub hooks with proper rate limiting and error handling
  - Updated navigation menu item to "Finnhub Stock Data"
  - API Key: d1sgqohr01qkbods878gd1sgqohr01qkbods8790
  - Features: Symbol lookup, real-time quotes, 3-day price history calculations
- **2025-01-17**: Implemented Stock Market Sentiment Scoring Module
  - Created StockSentimentScoring component analyzing top 10 US stocks by market cap
  - Implemented normalized scoring system from -50 to +50 based on daily price performance
  - Scoring logic: +3%+ → +10, +1% to +3% → +5, -1% to +1% → 0, -1% to -3% → -5, -3%- → -10
  - Final score calculation: Average across 10 stocks × 5 for -50 to +50 range
  - Sentiment labels: Bullish (+30 to +50), Cautiously Optimistic (+10 to +29), Neutral (-9 to +9), Cautiously Bearish (-10 to -29), Bearish (-30 to -50)
  - Uses real-time Finnhub API data for AAPL, MSFT, GOOGL, AMZN, NVDA, TSLA, META, BRK.B, AVGO, JPM
  - Added menu item "Stock Sentiment Scoring" with comprehensive methodology documentation
- **2025-01-17**: Migrated from YCNBC to YFinance integration
  - Removed ycnbc package and all YCNBC-related components and services
  - Installed yfinance (v0.2.65) Python package for comprehensive Yahoo Finance data access
  - Created YFinanceService with market news, stock quotes, and enhanced sentiment analysis
  - Implemented server proxy endpoints: /api/proxy/yfinance/news/latest, /api/proxy/yfinance/news/trending, /api/proxy/yfinance/sentiment
  - Added YFinanceDemo component with tabs for market news, stock news, and sentiment analysis
  - Updated Dashboard component to use YFinance sentiment data instead of YCNBC
  - Created useYFinance hooks for data fetching with proper error handling and caching
  - YFinance provides news from major market tickers (SPY, QQQ, IWM, VIX) with real-time sentiment scoring
  - Enhanced news sentiment analysis using keyword-based sentiment scoring (-1.0 to +1.0 scale)

## User Preferences
- Language: English
- Communication style: Professional, concise
- Focus: Building functional applications with real data integration

## Next Steps
Ready for development! The foundation is solid and the application can be extended with:
- API key configuration for live data
- Database connection setup
- Feature enhancements
- UI/UX improvements