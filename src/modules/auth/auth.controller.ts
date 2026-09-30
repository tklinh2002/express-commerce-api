import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // req.body is already validated and transformed by our validationMiddleware
      const user = await this.authService.register(req.body);
      
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: user,
      });
    } catch (error) {
      // Pass the error to the global errorHandler
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // req.body is validated against LoginDto
      const result = await this.authService.login(req.body);
      
      res.status(200).json({
        status: 'success',
        message: 'User logged in successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

}
