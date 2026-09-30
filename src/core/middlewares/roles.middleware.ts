import { Request, Response, NextFunction } from 'express';
import { AppError } from '../exceptions/AppError';
import { UserRole } from '../../modules/auth/entities/User.entity';

// This acts like a decorator factory, taking allowed roles as arguments
export const rolesMiddleware = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    
    // 1. Ensure user is authenticated first
    if (!req.user) {
      return next(new AppError('Unauthorized: User not authenticated', 401));
    }

    // 2. Check if the user's role is in the list of allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden: Insufficient permissions', 403));
    }

    // User has permission, proceed to the controller
    next();
  };
};
