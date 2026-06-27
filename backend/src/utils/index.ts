// ================================
// Utils Barrel File
// Project: Billing & Inventory Management System
// Sprint: 1.7 — Global Error Handling
// ================================

export { AppError }      from './app-error';
export { asyncHandler }  from './async-handler';

// ================================
// API Response Helpers
// ================================
export const createSuccessResponse = <T>(
  message: string,
  data?: T
) => ({
  success:   true,
  message,
  data,
  timestamp: new Date().toISOString(),
});

export const createErrorResponse = (
  message:    string,
  statusCode: number,
  error?:     string
) => ({
  success:    false,
  statusCode,
  message,
  error,
  timestamp:  new Date().toISOString(),
});