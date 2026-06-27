// ================================
// Global Error Middleware
// Project: Billing & Inventory Management System
// Sprint: 1.7 — Global Error Handling
// ================================
// Central error processing pipeline.
// All errors thrown anywhere in the
// application are handled here.
// Must be registered LAST in the pipeline.
// ================================

import { Request, Response, NextFunction } from 'express';
import { AppError }                         from '../utils/app-error';
import { HTTP_STATUS }                      from '../constants/api';
import { config }                           from '../config/environment';

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

  // ================================
  // Default to 500 Internal Error
  // Explicitly typed as number
  // ================================
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message:    string = 'An unexpected error occurred.';

  // ================================
  // Handle Known AppErrors
  // ================================
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message    = err.message;
  }

  // ================================
  // Build Error Response
  // ================================
  const response: ErrorResponse = {
    success:   false,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
  };

  // ================================
  // Include Stack Trace in Development
  // ================================
  if (config.server.isDevelopment) {
    response.stack = err.stack;
  }

  // ================================
  // Log Error to Console
  // ================================
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`);
  console.error(`        Status  : ${statusCode}`);
  console.error(`        Message : ${message}`);

  if (config.server.isDevelopment) {
    console.error(`        Stack   : ${err.stack}`);
  }

  res.status(statusCode).json(response);
};