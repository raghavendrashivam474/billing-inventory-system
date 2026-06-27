// ================================
// Request ID Middleware
// Project: Billing & Inventory Management System
// Sprint: 1.6 — Middleware Infrastructure
// ================================

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 }                    from 'uuid';
import { HEADERS }                          from '../constants/api';

// ================================
// Extend Express Request type
// to include requestId property
// ================================
declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

// ================================
// Request ID Middleware
// Assigns a unique UUID to every
// incoming request for tracing
// ================================
export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = uuidv4();

  // Attach to request object
  req.requestId = requestId;

  // Expose in response header
  res.setHeader(HEADERS.REQUEST_ID, requestId);

  next();
};