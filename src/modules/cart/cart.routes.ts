import { Router } from 'express';
import { CartController } from './cart.controller';
import { jwtAuthMiddleware } from '../../core/middlewares/jwtAuth.middleware';
import { validationMiddleware } from '../../core/middlewares/validation.middleware';
import { AddToCartDto } from './dtos/cart.dto';

const router = Router();
const cartController = new CartController();

// SECURITY: All cart routes require the user to be logged in
router.use(jwtAuthMiddleware);

// Routes
/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get my cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My active cart
 */
router.get('/', cartController.getCart);
router.post('/', validationMiddleware(AddToCartDto), cartController.addToCart);
router.delete('/items/:itemId', cartController.removeItem);

export default router;
