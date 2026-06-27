// ================================
// Utils Barrel File
// Project: Billing & Inventory Management System
// Sprint: 1.9 — Health API
// ================================

export { AppError }                    from './app-error';
export { asyncHandler }                from './async-handler';
export { formatUptime }                from './format-uptime';
export { formatMemory }                from './format-memory';
export type { MemoryStats }            from './format-memory';

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