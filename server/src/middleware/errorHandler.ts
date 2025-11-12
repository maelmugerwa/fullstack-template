import { Request, Response, NextFunction } from "express";

/**
 * Custom Error class with status code
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 * Catches all errors and formats consistent error responses
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default to 500 Internal Server Error
  let statusCode = 500;
  let message = "Internal Server Error";
  let isOperational = false;

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Log error for debugging
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    statusCode,
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
        details: err.message,
      }),
    },
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
