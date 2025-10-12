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

**Authentication**: Session-based authentication with bcrypt password hashing, secure session management, and role-based access control.

**Security Architecture** (October 2025 - Comprehensive Security Hardening):
- **Password Security**: bcrypt hashing with 12 salt rounds, strength validation (min 8 chars, letters + numbers required)
- **Session Security**: httpOnly cookies, secure flag in production, sameSite protection, mandatory SESSION_SECRET in production
- **Rate Limiting**: Tiered protection (5/15min auth, 30/5min proxy, 100/15min general API)
- **CORS Protection**: Whitelisted origins only, no wildcard access, credentials support
- **XSS/CSP**: Helmet.js with environment-specific Content Security Policy (strict in production, permissive in dev for Vite)
- **Input Validation**: Zod schemas on all routes, type-safe data flow
- **Error Handling**: Graceful degradation, no server crashes, safe error messages
- **Authentication Guards**: Middleware protection (requireAuth, requireGuest) on sensitive routes

**Technical Implementations**:
- Client/server separation is clearly defined, with API routes prefixed `/api`.
- Environment variables are used for API keys and security secrets.
- Robust data fetching utilities include retry logic, timeout handling, and exponential backoff.
- NLP models (e.g., spaCy) are integrated for enhanced sentiment analysis, offering multi-model ensembles, entity recognition, and linguistic feature extraction.
- A normalized scoring system is implemented for stock market sentiment analysis.
- Real-time data polling intervals are optimized to reduce API calls and server load (e.g., 3-5 minute intervals for most APIs).
- Error handling is comprehensive, with fallback mechanisms and circuit breaker patterns to prevent API spam.
- All security implementations follow OWASP best practices and industry standards.

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