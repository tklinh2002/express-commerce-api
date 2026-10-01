import { Request, Response, NextFunction } from 'express';

/**
 * Standardize API Response globally (Similar to TransformInterceptor in NestJS)
 * This middleware intercepts the res.json method to ensure all responses follow a uniform structure:
 * {
 *    status: "success" | "error",
 *    data: any,
 *    timestamp: "..."
 * }
 */
export const responseInterceptor = (req: Request, res: Response, next: NextFunction) => {
  // Store the original res.json method
  const originalJson = res.json;

  // Override res.json
  res.json = function (body: unknown) {
    // 1. If the response is already formatted properly (e.g. from ErrorHandler or old controllers), skip wrapping
    if (body && typeof body === 'object' && ('status' in (body as Record<string, unknown>))) {
      return originalJson.call(this, body);
    }

    // 2. Wrap the response in our standard format
    const formattedResponse = {
      status: res.statusCode >= 400 ? 'error' : 'success',
      data: body,
      timestamp: new Date().toISOString(),
    };

    // 3. Call the original json method with the new formatted data
    return originalJson.call(this, formattedResponse);
  };

  next();
};
