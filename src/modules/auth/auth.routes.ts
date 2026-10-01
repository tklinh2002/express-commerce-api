import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validationMiddleware } from '../../core/middlewares/validation.middleware';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

const router = Router();
const authController = new AuthController();

// Route: POST /auth/register
// Use validationMiddleware to validate req.body against RegisterDto
router.post('/register', validationMiddleware(RegisterDto), authController.register);

// Route: POST /auth/login
router.post('/login', validationMiddleware(LoginDto), authController.login);

export default router;
