// ================================
// API Constants
// Project: Billing & Inventory Management System
// Sprint: 1.5 — API Foundation
// ================================

// ================================
// API Versioning
// ================================
export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;

// ================================
// Application Info
// ================================
export const APP_NAME = 'Billing & Inventory Management API';
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