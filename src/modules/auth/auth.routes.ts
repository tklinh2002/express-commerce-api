import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validationMiddleware } from '../../core/middlewares/validation.middleware';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, default: "Test User" }
 *               email: { type: string, default: "test@example.com" }
 *               password: { type: string, default: "password123" }
 *     responses:
 *       201:
 *         description: User registered successfully
 */
// Route: POST /auth/register
// Use validationMiddleware to validate req.body against RegisterDto
router.post('/register', validationMiddleware(RegisterDto), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, default: "admin@test.com" }
 *               password: { type: string, default: "password123" }
 *     responses:
 *       200:
 *         description: Login successful returns tokens
 */
// Route: POST /auth/login
router.post('/login', validationMiddleware(LoginDto), authController.login);

export default router;
