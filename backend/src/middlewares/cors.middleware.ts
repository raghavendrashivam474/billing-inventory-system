// ================================
// CORS Middleware
// Project: Billing & Inventory Management System
// Sprint: 1.6 — Middleware Infrastructure
// ================================

import cors             from 'cors';
import { CORS_CONFIG }  from '../constants/api';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    if (CORS_CONFIG.ALLOWED_ORIGINS.includes(origin as never)) {
      return callback(null, true);
    }

    return callback(
      new Error(`CORS policy: Origin ${origin} is not allowed.`),
      false
    );
  },
  methods:          [...CORS_CONFIG.ALLOWED_METHODS],
  allowedHeaders:   [...CORS_CONFIG.ALLOWED_HEADERS],
  exposedHeaders:   [...CORS_CONFIG.EXPOSE_HEADERS],
  credentials:      true,
  optionsSuccessStatus: 200,
});