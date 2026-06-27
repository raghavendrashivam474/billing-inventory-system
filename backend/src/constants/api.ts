// ================================
// API Constants
// Project: Billing & Inventory Management System
// Sprint: 1.6 — Middleware Infrastructure
// ================================

// ================================
// API Versioning
// ================================
export const API_VERSION = 'v1';
export const API_PREFIX  = `/api/${API_VERSION}`;

// ================================
// Application Info
// ================================
export const APP_NAME    = 'Billing & Inventory Management API';
export const APP_VERSION = '0.2.0';

// ================================
// Standard Messages
// ================================
export const MESSAGES = {
  API_RUNNING:    'Billing & Inventory Management API is running.',
  SERVER_HEALTHY: 'Server is healthy.',
  DB_CONNECTED:   'connected',
  DB_SIMULATED:   'simulated',
  NOT_FOUND:      'The requested resource was not found.',
  SERVER_ERROR:   'An unexpected error occurred.',
} as const;

// ================================
// HTTP Status Codes
// ================================
export const HTTP_STATUS = {
  OK:                    200,
  CREATED:               201,
  NO_CONTENT:            204,
  BAD_REQUEST:           400,
  UNAUTHORIZED:          401,
  FORBIDDEN:             403,
  NOT_FOUND:             404,
  CONFLICT:              409,
  UNPROCESSABLE_ENTITY:  422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// ================================
// CORS Configuration
// ================================
export const CORS_CONFIG = {
  ALLOWED_ORIGINS: [
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  ALLOWED_METHODS: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],
  ALLOWED_HEADERS: [
    'Content-Type',
    'Authorization',
    'X-Request-ID',
  ],
  EXPOSE_HEADERS: [
    'X-Request-ID',
    'X-Response-Time',
  ],
} as const;

// ================================
// Request Headers
// ================================
export const HEADERS = {
  REQUEST_ID:    'X-Request-ID',
  RESPONSE_TIME: 'X-Response-Time',
} as const;

// ================================
// Morgan Log Format
// ================================
export const MORGAN_FORMAT =
  ':method :url :status :res[content-length] - :response-time ms';