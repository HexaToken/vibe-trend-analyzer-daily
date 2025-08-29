# Overview

This project is a full-stack JavaScript application designed as a multi-section dashboard for financial data and analytics. Its core purpose is to provide a comprehensive platform for users to access real-time financial information, perform sentiment analysis, manage data, and engage in social interactions related to finance. The application aims to integrate various external APIs to deliver rich, dynamic content, enhancing user experience with features like authentication, AI chat, and a robust UI.

# User Preferences

- Language: English
- Communication style: Professional, concise
- Focus: Building functional applications with real data integration

# System Architecture

The application is built as a full-stack JavaScript solution, emphasizing a clean separation between frontend and backend concerns.

**Frontend:**
- **Technology Stack:** React with TypeScript, Vite for fast development, TailwindCSS for utility-first styling, and shadcn/ui for component library.
- **State Management:** TanStack Query (React Query) for efficient data fetching, caching, and synchronization.
- **Routing:** Wouter for lightweight and flexible client-side routing.
- **UI/UX:** Adheres to a professional fintech aesthetic with a consistent color palette (cool slate blue backgrounds, enhanced text contrast, semantic color coding) and modern styling (rounded corners, subtle shadows, professional typography). It maintains full dark mode support while prioritizing light mode readability. Semantic filter buttons and consistent badge styling are applied application-wide for intuitive user interaction.

**Backend:**
- **Technology Stack:** Express.js with TypeScript.
- **Database:** PostgreSQL, managed with Drizzle ORM for type-safe and efficient data interactions.
- **Authentication:** Implemented using Passport.js with session management, ensuring secure user access. API routes are prefixed with `/api` and protected by authentication middleware.
- **Server Configuration:** The Express server serves both API endpoints and static frontend files on port 5000. Development uses Vite with Hot Module Replacement (HMR), while production serves static files from a build directory.

**Key Features:**
- Multi-section dashboard.
- Robust authentication and user profiles.
- Real-time data integration for news and financial markets.
- Advanced sentiment analysis using NLP models (e.g., spaCy) and rule-based systems.
- Social platform integration.
- Database management interface.
- AI chat functionality.

**Technical Implementations:**
- **Fetch Utility:** `robustFetch.ts` is used for all API calls, incorporating retry logic, timeout handling, and exponential backoff to ensure reliability.
- **NLP Integration:** Utilizes spaCy for comprehensive financial text analysis, including entity recognition, linguistic feature extraction, and a multi-model ensemble for sentiment scoring.
- **Data Polling:** API polling intervals are generally set to 3 minutes (180,000ms) to balance real-time data needs with API rate limits.
- **Error Handling:** Comprehensive error handling is implemented across components and API integrations, including fallbacks for unavailable services or data.

# External Dependencies

The application integrates with various third-party services and APIs to provide its core functionalities:

- **Financial Data:**
    - **Polygon.io:** Used for financial data and dividends.
    - **Finnhub API:** Provides stock market data, including symbol lookup, real-time quotes, and historical data.
    - **YFinance (Yahoo Finance):** Integrated for market news, stock quotes, and enhanced sentiment analysis.
- **News:**
    - **NewsAPI:** Used for fetching news articles.
- **Cryptocurrency Data:**
    - **CoinMarketCap API:** Provides cryptocurrency market data.
- **Social Media:**
    - **Instagram (via `instagrapi`):** Integrated for accessing user profiles, hashtag search, and trending content.
    - **Twitter API:** Configured for integration, with graceful handling of rate limits and mock data fallbacks.
- **Natural Language Processing (NLP):**
    - **spaCy:** Utilized for advanced sentiment analysis and linguistic processing of financial text.
- **Other:**
    - **PostgreSQL:** The chosen database for persistent storage.
    - **Drizzle ORM:** Used for interacting with the PostgreSQL database.