// ================================
// Async Handler Utility
// Project: Billing & Inventory Management System
// Sprint: 1.7 — Global Error Handling
// ================================
// Wraps async route handlers to automatically
// forward errors to Express error middleware.
// Eliminates repetitive try-catch in controllers.
// ================================

import { Request, Response, NextFunction } from 'express';

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = (fn: AsyncRouteHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};