import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../exceptions/AppError';

export const jwtAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // 1. Get token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized: No token provided', 401));
  }

  // Extract the token part (Bearer <token>)
  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    
    // 3. Attach decoded user payload to the request (for downstream controllers/middlewares)
    req.user = decoded as any;
    
    next();
  } catch (error) {
    // Token is invalid or expired
    return next(new AppError('Unauthorized: Invalid or expired token', 401));
  }
};
