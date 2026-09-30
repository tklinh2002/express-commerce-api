// src/core/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../exceptions/AppError';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : 'Internal Server Error';

  // Unexpected error, log it for debugging
  if (!(err instanceof AppError)) {
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
