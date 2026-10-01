// src/core/exceptions/AppError.ts
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Mark this error as an operational error (e.g., bad request, not found)
    // so we can distinguish it from unexpected programming errors.
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
