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