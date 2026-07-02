// Express Request Extension
// Project: Billing & Inventory Management System
// Sprint: 2.2 — Category & Brand CRUD
declare namespace Express {
  interface Request {
    parsedQuery?: unknown;
  }
}