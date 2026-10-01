// src/core/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../exceptions/AppError';

import { logger } from '../logger/winston.logger';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : 'Internal Server Error';

  // Unexpected error, log it for debugging
  if (!(err instanceof AppError)) {
    logger.error(`[UNEXPECTED ERROR] ${req.method} ${req.url} - ${err.message}`, {
      stack: err.stack,
    });
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
