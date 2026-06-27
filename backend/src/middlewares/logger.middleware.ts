// ================================
// Logger Middleware (Morgan + Winston)
// Project: Billing & Inventory Management System
// Sprint: 1.8 — Logging Infrastructure
// ================================
// Morgan HTTP request logs are piped
// through Winston for unified logging.
// ================================

import morgan  from 'morgan';
import { logger } from '../logger';
import { MORGAN_FORMAT } from '../constants/api';

// ================================
// Morgan Stream — pipes to Winston
// ================================
const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// ================================
// HTTP Request Logger
// Uses Morgan format, output via Winston
// ================================
export const loggerMiddleware = morgan(
  MORGAN_FORMAT,
  { stream: morganStream }
);