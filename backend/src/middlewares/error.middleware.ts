// ================================
// Global Error Middleware
// Project: Billing & Inventory Management System
// Sprint: 1.8 — Logging Infrastructure
// ================================

import { Request, Response, NextFunction } from 'express';
import { AppError }                         from '../utils/app-error';
import { HTTP_STATUS }                      from '../constants/api';
import { config }                           from '../config/environment';
import { logger }                           from '../logger';

// ================================
// Error Response Interface
// ================================
interface ErrorResponse {
  success:    boolean;
  statusCode: number;
  message:    string;
  timestamp:  string;
  stack?:     string;
}

// ================================
// Global Error Handler
// ================================
export const errorMiddleware = (
  err:  Error | AppError,
  req:  Request,
  res:  Response,
  next: NextFunction
): void => {

  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message:    string = 'An unexpected error occurred.';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message    = err.message;
  }

  // ================================
  // Log Error via Winston
  // ================================
  logger.error(`${req.method} ${req.originalUrl}`, {
    statusCode,
    message,
    requestId: req.requestId ?? 'unknown',
    stack:     config.server.isDevelopment ? err.stack : undefined,
  });

  // ================================
  // Build Error Response
  // ================================
  const response: ErrorResponse = {
    success:   false,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
  };

  if (config.server.isDevelopment) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};