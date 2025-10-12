# Security Implementation Guide

## Overview

This document outlines the comprehensive security measures implemented in the MoorMeter application to protect against common web vulnerabilities and ensure data integrity.

## Critical Security Features

### 1. Password Security
- **Hashing**: All passwords are hashed using bcrypt with 12 salt rounds before storage
- **No Plaintext Storage**: Passwords are NEVER stored in plaintext
- **Strength Validation**: Enforces minimum 8 characters, at least one number and one letter
- **Implementation**: `server/services/passwordService.ts`

### 2. Authentication & Authorization
- **Session-Based Auth**: Secure session management with Express Session
- **Protected Routes**: Middleware guards (`requireAuth`, `requireGuest`) protect sensitive endpoints
- **Session Security Flags**:
  - `httpOnly: true` - Prevents XSS access to cookies
  - `secure: true` - HTTPS only in production
  - `sameSite: 'lax'` - CSRF protection
  - Custom session name to avoid defaults

### 3. Rate Limiting
Multiple tiers of rate limiting prevent abuse:
- **Authentication Routes**: 5 attempts per 15 minutes (strict)
- **Proxy Endpoints**: 30 requests per 5 minutes (moderate)
- **General API**: 100 requests per 15 minutes (standard)
- **Implementation**: `server/middleware/rateLimiter.ts`

### 4. CORS Protection
- **Restricted Origins**: Only whitelisted origins allowed (no wildcard `*`)
- **Credentials Support**: Properly configured for session cookies
- **Production**: Uses `ALLOWED_ORIGINS` environment variable
- **Development**: Defaults to `http://localhost:5000`

### 5. Security Headers (Helmet.js)
- **Content Security Policy (CSP)**:
  - Development: Allows inline scripts for Vite HMR
  - Production: Strict CSP with NO unsafe-inline or unsafe-eval
- **XSS Protection**: X-XSS-Protection header
- **Clickjacking Prevention**: X-Frame-Options
- **MIME Type Sniffing**: X-Content-Type-Options

### 6. Error Handling
- **Graceful Degradation**: Errors logged but server doesn't crash
- **Safe Error Messages**: Internal errors don't expose stack traces to clients in production
- **Comprehensive Logging**: All errors logged with context for debugging

### 7. Input Validation
- **Zod Schemas**: All user inputs validated with strict Zod schemas
- **Type Safety**: TypeScript + Zod ensures type-safe data flow
- **Sanitization**: Malformed payloads rejected before processing

## Environment Variables

### Required for Production
```bash
SESSION_SECRET=<strong-random-secret>  # REQUIRED - Server exits if not set
ALLOWED_ORIGINS=https://yourdomain.com  # Comma-separated list of allowed origins
```

### Optional API Keys
```bash
NEWSAPI_KEY=<your-key>
POLYGON_API_KEY=<your-key>
FINNHUB_API_KEY=<your-key>
COINMARKETCAP_API_KEY=<your-key>
```

## Security Checklist

### Before Deployment
- [ ] Set strong `SESSION_SECRET` environment variable
- [ ] Configure `ALLOWED_ORIGINS` for production domains
- [ ] Set `NODE_ENV=production`
- [ ] Ensure HTTPS is enabled
- [ ] Review and rotate API keys
- [ ] Run security audit: `npm audit`
- [ ] Test rate limiting functionality
- [ ] Verify CSP in production mode

### Regular Maintenance
- [ ] Update dependencies monthly: `npm update`
- [ ] Review security advisories: `npm audit`
- [ ] Rotate API keys quarterly
- [ ] Monitor rate limit logs for abuse patterns
- [ ] Review session configuration
- [ ] Check for outdated packages: `npm outdated`

## Vulnerability Fixes

### Fixed Critical Issues
1. ✅ **Plaintext Passwords**: Implemented bcrypt hashing
2. ✅ **Unrestricted CORS**: Limited to whitelisted origins
3. ✅ **Server Crashes**: Fixed error handler to prevent crashes
4. ✅ **No Rate Limiting**: Implemented tiered rate limiting
5. ✅ **Session Hijacking**: Added secure session flags
6. ✅ **XSS Vulnerabilities**: Helmet CSP with environment-specific policies
7. ✅ **Input Validation**: Zod validation on all routes
8. ✅ **Missing Auth**: Protected routes with middleware

## API Security

### Authentication Endpoints
```
POST /api/auth/register - Create new user (rate limited: 5/15min)
POST /api/auth/login    - Login user (rate limited: 5/15min)
POST /api/auth/logout   - Logout user (requires auth)
GET  /api/auth/me       - Get current user (requires auth)
```

### Protected Proxy Endpoints
All `/api/proxy/*` endpoints are rate limited (30 requests per 5 minutes) to prevent API quota abuse.

## Best Practices

### For Developers
1. Never log sensitive data (passwords, tokens, session IDs)
2. Always validate user input with Zod schemas
3. Use parameterized queries to prevent SQL injection
4. Keep dependencies updated
5. Follow principle of least privilege
6. Use environment variables for secrets

### For DevOps
1. Use secrets management (AWS Secrets Manager, HashiCorp Vault)
2. Enable HTTPS everywhere
3. Configure firewall rules
4. Set up monitoring and alerting
5. Regular security audits
6. Backup encryption keys

## Incident Response

If a security vulnerability is discovered:
1. Assess severity and impact
2. Patch immediately if critical
3. Rotate affected credentials
4. Notify users if data breach
5. Document lessons learned
6. Update security measures

## Contact

For security issues, please contact the security team immediately.
Do NOT open public issues for security vulnerabilities.

---

Last Updated: October 2025
Security Audit Status: ✅ PASSED
