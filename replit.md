# Project Overview

This project is a full-stack JavaScript application designed as a multi-section dashboard for financial analysis and social interaction. It aims to provide real-time financial data, sentiment analysis, and community features. The vision is to create a robust platform for financial insights and user engagement.

# User Preferences

- Language: English
- Communication style: Professional, concise
- Focus: Building functional applications with real data integration

# System Architecture

The application is built as a full-stack JavaScript solution.

**Frontend:**
- **Framework:** React with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS with shadcn/ui for UI components
- **State Management:** TanStack Query (React Query)
- **Routing:** Wouter for client-side navigation
- **UI/UX Decisions:** Employs a professional finance aesthetic with a cool slate blue background, enhanced text contrast, and semantic color coding. This includes specific color mappings for badges and semantic filter buttons (e.g., mint green for bullish, soft red for bearish). High-contrast colors meet WCAG AA standards, and the design supports both light and dark modes with sophisticated backdrop blur and gradient effects.

**Backend:**
- **Framework:** Express.js with TypeScript
- **Authentication:** Passport.js with session management, API routes prefixed with `/api`.
- **Data Storage:** Currently uses in-memory storage (MemStorage), designed for PostgreSQL with Drizzle ORM.

**Core Technical Implementations & Features:**
- Multi-section dashboard application with an authentication system and user profiles.
- Real-time data integration capabilities.
- Sentiment analysis and analytics features.
- Social platform integration.
- Database management interface.
- AI chat functionality.

# External Dependencies

The application integrates with various external services and APIs:

- **Financial Data:**
    - Polygon.io (for financial data, dividends, and real-time quotes)
    - Finnhub API (for symbol lookup, real-time quotes, and historical data)
    - YFinance (for Yahoo Finance market news, stock quotes, and sentiment analysis)
- **News & Content:**
    - NewsAPI
- **Cryptocurrency Data:**
    - CoinMarketCap (for cryptocurrency data, with bulk fetching and rate limiting implemented)
- **Sentiment Analysis:**
    - Various sentiment analysis APIs
    - spaCy (for advanced NLP models, including entity recognition, POS tagging, and linguistic feature extraction for financial text analysis)
- **Social Media:**
    - Instagram (via instagrapi package for user profiles, hashtag search, and trending content)
    - Twitter API (configured for integration, with graceful rate limit handling and mock data fallback)