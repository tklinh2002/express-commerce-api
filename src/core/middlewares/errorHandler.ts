// src/core/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../exceptions/AppError';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // If it's a known error thrown by us
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    // Unexpected error, log it for debugging
    console.error('🔥 UNEXPECTED ERROR:', err);
  }

  // Standardized response format for the entire application
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // Include stack trace only in development mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
