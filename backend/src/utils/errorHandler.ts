import { type Request, type Response, type NextFunction } from 'express';

/**
 * Base Application Error Class
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Specialized Error Classes
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict occurred") {
    super(message, 409);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

/**
 * Global Error Handler Middleware
 * Must have 4 arguments for Express to recognize it as an error handler
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
  }

  // Log errors for the developer (you can use a logger like Pino or Winston here)
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error] ${req.method} ${req.path} >> ${message}`);
  }

  return res.status(statusCode).json({
    isSuccess: false, // Keeping consistent with your controllers
    message: message,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};