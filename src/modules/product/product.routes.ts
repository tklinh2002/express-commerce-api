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
router.get('/', productController.findAll);
router.get('/:id', productController.findOne);

// 2. PROTECTED ROUTES (Admin only)
router.post(
  '/',
  jwtAuthMiddleware,
  rolesMiddleware(UserRole.ADMIN),
  validationMiddleware(CreateProductDto),
  productController.create
);

router.put(
  '/:id',
  jwtAuthMiddleware,
  rolesMiddleware(UserRole.ADMIN),
  validationMiddleware(UpdateProductDto),
  productController.update
);

router.delete(
  '/:id',
  jwtAuthMiddleware,
  rolesMiddleware(UserRole.ADMIN),
  productController.delete
);

export default router;
