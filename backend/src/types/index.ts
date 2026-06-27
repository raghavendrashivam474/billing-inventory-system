// ================================
// Shared Type Definitions
// Project: Billing & Inventory Management System
// ================================

// ================================
// API Response Types
// ================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

// ================================
// Common Types
// ================================
export type ID = number;

export interface TimestampFields {
  createdAt: Date;
  updatedAt: Date;
}