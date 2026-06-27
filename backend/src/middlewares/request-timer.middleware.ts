// ================================
// Request Timer Middleware
// Project: Billing & Inventory Management System
// Sprint: 1.6 — Middleware Infrastructure
// ================================

import { Request, Response, NextFunction } from 'express';

// ================================
// Request Timer Middleware
// Measures total request duration
// Sets X-Response-Time header BEFORE
// response is sent, logs AFTER finish
// ================================
export const requestTimerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  // ================================
  // Override res.json to inject
  // timing header before body is sent
  // ================================
  const originalJson = res.json.bind(res);

  res.json = (body: unknown) => {
    const duration = Date.now() - startTime;
    res.setHeader('X-Response-Time', `${duration}ms`);
    return originalJson(body);
  };

  // ================================
  // Log after response completes
  // ================================
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(
      `[${new Date().toISOString()}] ` +
      `Request-ID: ${req.requestId ?? 'unknown'} | ` +
      `${req.method} ${req.originalUrl} | ` +
      `Duration: ${duration}ms`
    );
  });

  next();
};