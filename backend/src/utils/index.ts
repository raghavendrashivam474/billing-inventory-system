// ================================
// Shared Utility Functions
// Project: Billing & Inventory Management System
// ================================

// ================================
// API Response Helpers
// ================================
export const createSuccessResponse = <T>(
  message: string,
  data?: T
) => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
});

export const createErrorResponse = (
  message: string,
  error?: string
) => ({
  success: false,
  message,
  error,
  timestamp: new Date().toISOString(),
});