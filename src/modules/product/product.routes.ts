import { Router } from 'express';
import { ProductController } from './product.controller';
import { validationMiddleware } from '../../core/middlewares/validation.middleware';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';
import { jwtAuthMiddleware } from '../../core/middlewares/jwtAuth.middleware';
import { rolesMiddleware } from '../../core/middlewares/roles.middleware';
import { UserRole } from '../auth/entities/User.entity';

const router = Router();
const productController = new ProductController();

// 1. PUBLIC ROUTES (Search, filter, paginate, view details)
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of products with pagination
 */
router.get('/', productController.findAll);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product details
 */
router.get('/:id', productController.findOne);

// 2. PROTECTED ROUTES (Admin only)
router.post(
  '/',
  jwtAuthMiddleware,
  rolesMiddleware(UserRole.ADMIN),
  validationMiddleware(CreateProductDto),
  productController.create,
);

router.put(
  '/:id',
  jwtAuthMiddleware,
  rolesMiddleware(UserRole.ADMIN),
  validationMiddleware(UpdateProductDto),
  productController.update,
);

router.delete('/:id', jwtAuthMiddleware, rolesMiddleware(UserRole.ADMIN), productController.delete);

export default router;
