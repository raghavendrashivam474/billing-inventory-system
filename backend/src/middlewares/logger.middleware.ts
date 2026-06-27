// ================================
// Logger Middleware (Morgan)
// Project: Billing & Inventory Management System
// Sprint: 1.6 — Middleware Infrastructure
// ================================

import morgan          from 'morgan';
import { MORGAN_FORMAT } from '../constants/api';

// ================================
// Development Logger
// Logs every HTTP request with
// method, URL, status, and response time
// ================================
export const loggerMiddleware = morgan(MORGAN_FORMAT);