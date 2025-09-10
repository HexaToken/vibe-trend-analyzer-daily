# Project Overview

This project is a full-stack JavaScript application designed as a multi-section dashboard. Its core purpose is to provide users with a comprehensive platform for financial data analysis, social interaction, and AI-powered insights. Key capabilities include real-time data integration from various financial APIs, sentiment analysis, and an AI chat interface. The project aims to offer a robust and user-friendly experience for monitoring and understanding market dynamics.

## User Preferences

- Language: English
- Communication style: Professional, concise
- Focus: Building functional applications with real data integration

## System Architecture

The application is built as a full-stack JavaScript application.

**Frontend**: Developed with React, TypeScript, Vite, TailwindCSS, and shadcn/ui. Wouter handles client-side routing, and TanStack Query (React Query) manages state. UI/UX design emphasizes a professional finance aesthetic with cool slate blue backgrounds, enhanced text contrast, semantic color coding, and consistent styling across components (e.g., rounded corners, subtle shadows, professional typography). Accessibility (WCAG AA standards) is maintained, and both light and dark modes are fully supported.

**Backend**: Implemented with Express.js and TypeScript, serving both API routes and static files.

**Database**: PostgreSQL with Drizzle ORM for data persistence.

**Authentication**: Handled by Passport.js with session management.

**Technical Implementations**:
- Client/server separation is clearly defined, with API routes prefixed `/api`.
- Environment variables are used for API keys.
- Robust data fetching utilities include retry logic, timeout handling, and exponential backoff.
- NLP models (e.g., spaCy) are integrated for enhanced sentiment analysis, offering multi-model ensembles, entity recognition, and linguistic feature extraction.
- A normalized scoring system is implemented for stock market sentiment analysis.
- Real-time data polling intervals are optimized to reduce API calls and server load (e.g., 3-5 minute intervals for most APIs).
- Error handling is comprehensive, with fallback mechanisms and circuit breaker patterns to prevent API spam.

## External Dependencies

The application integrates with the following external services and APIs:

- **NewsAPI**: For news data.
- **Polygon.io**: For financial data, including dividends.
- **TwelveData**: Used for real-time quotes and watchlist data.
- **Finnhub**: Provides stock market data including symbol lookup, real-time quotes, and historical data.
- **CoinMarketCap**: For cryptocurrency data.
- **YFinance (Yahoo Finance)**: Accesses market news, stock quotes, and sentiment analysis.
- **Instagram API (via `instagrapi`)**: For social platform integration, including user profiles, hashtag search, and trending content.
- **Various Sentiment Analysis APIs**: For analyzing market sentiment.
- **Social Media Platforms**: General integration for social features.
- **spaCy**: For advanced Natural Language Processing (NLP) capabilities.