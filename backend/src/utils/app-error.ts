// ================================
// AppError — Custom Error Class
// Project: Billing & Inventory Management System
// Sprint: 1.7 — Global Error Handling
// ================================

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: string;

  constructor(
    message: string,
    statusCode: number,
    isOperational: boolean = true
  ) {
    super(message);

    this.name          = 'AppError';
    this.statusCode    = statusCode;
    this.isOperational = isOperational;
    this.timestamp     = new Date().toISOString();

    // Preserve stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  // ================================
  // Static Factory Methods
  // ================================
  static badRequest(message: string): AppError {
    return new AppError(message, 400);
  }

  static unauthorized(message: string): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message: string): AppError {
    return new AppError(message, 403);
  }

  static notFound(message: string): AppError {
    return new AppError(message, 404);
  }

  static conflict(message: string): AppError {
    return new AppError(message, 409);
  }

  static unprocessable(message: string): AppError {
    return new AppError(message, 422);
  }

  static internal(message: string): AppError {
    return new AppError(message, 500, false);
  }
}