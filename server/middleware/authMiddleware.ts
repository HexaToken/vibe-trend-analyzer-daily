import { Request, Response, NextFunction } from "express";

/**
 * Middleware to ensure user is authenticated
 * Checks for valid session and user object
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ 
      message: "Authentication required. Please log in to access this resource." 
    });
  }
  next();
}

/**
 * Middleware to check if user is already authenticated
 * Used for routes like login/register where authenticated users shouldn't access
 */
export function requireGuest(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    return res.status(403).json({ 
      message: "Already authenticated. Please log out first." 
    });
  }
  next();
}

/**
 * Optional authentication middleware
 * Allows both authenticated and unauthenticated access
 * Populates req.user if authenticated
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  // Just pass through - session data will be available if exists
  next();
}

// Extend Express Request type to include session userId
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}
