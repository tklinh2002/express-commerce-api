import { Router } from 'express';
import { OrderController } from './order.controller';
import { jwtAuthMiddleware } from '../../core/middlewares/jwtAuth.middleware';

const router = Router();
const orderController = new OrderController();

// SECURITY: All order routes require the user to be logged in
router.use(jwtAuthMiddleware);

// POST /orders/checkout -> Create order from cart
router.post('/checkout', orderController.checkout);

// GET /orders -> Get my order history
router.get('/', orderController.getMyOrders);

// PATCH /orders/:id/cancel -> Cancel order and restore stock
router.patch('/:id/cancel', orderController.cancelOrder);

export default router;
