// ================================
// Not Found Middleware
// Project: Billing & Inventory Management System
// Sprint: 1.7 — Global Error Handling
// ================================
// Catches all requests that did not
// match any registered route.
// Must be registered AFTER all routes.
// ================================

import { Request, Response, NextFunction } from 'express';
import { AppError }                         from '../utils/app-error';
import { MESSAGES }                         from '../constants/api';

export const notFoundMiddleware = (
  req:  Request,
  res:  Response,
  next: NextFunction
): void => {
  next(
    AppError.notFound(
      `${MESSAGES.NOT_FOUND} — ${req.method} ${req.originalUrl}`
    )
  );
};