// ================================
// Logger Module
// Project: Billing & Inventory Management System
// Sprint: 1.8 — Logging Infrastructure
// ================================
// Centralized logger using Winston.
// All application code must use this
// logger — never use console.log()
// ================================

import winston                       from 'winston';
import path                          from 'path';
import { config }                    from '../config/environment';

// ================================
// Log Level Configuration
// development : debug and above
// production  : info and above
// ================================
const LOG_LEVEL = config.server.isDevelopment ? 'debug' : 'info';

// ================================
// Log File Paths
// ================================
const LOG_DIR          = path.join(process.cwd(), 'logs');
const APPLICATION_LOG  = path.join(LOG_DIR, 'application.log');
const ERROR_LOG        = path.join(LOG_DIR, 'error.log');

// ================================
// Custom Log Format — Console
// Colorized and human-readable
// ================================
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length
      ? ` ${JSON.stringify(meta)}`
      : '';
    return `${timestamp} ${level}: ${message}${metaString}`;
  })
);

// ================================
// Custom Log Format — File
// JSON structured for parsing
// ================================
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// ================================
// Winston Logger Instance
// ================================
export const logger = winston.createLogger({
  level: LOG_LEVEL,

  transports: [

    // ================================
    // Console Transport
    // Development: colored output
    // ================================
    new winston.transports.Console({
      format: consoleFormat,
      silent: false,
    }),

    // ================================
    // Application Log
    // All levels — info and above
    // ================================
    new winston.transports.File({
      filename: APPLICATION_LOG,
      format:   fileFormat,
      level:    'info',
    }),

    // ================================
    // Error Log
    // Errors only
    // ================================
    new winston.transports.File({
      filename: ERROR_LOG,
      format:   fileFormat,
      level:    'error',
    }),
  ],
});