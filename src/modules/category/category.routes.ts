import { Router } from 'express';
import { CategoryController } from './category.controller';
import { validationMiddleware } from '../../core/middlewares/validation.middleware';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos/category.dto';
import { jwtAuthMiddleware } from '../../core/middlewares/jwtAuth.middleware';
import { rolesMiddleware } from '../../core/middlewares/roles.middleware';
import { UserRole } from '../auth/entities/User.entity';

const router = Router();
const categoryController = new CategoryController();

// 1. PUBLIC ROUTES (Anyone can view categories)
router.get('/', categoryController.findAll);
router.get('/:id', categoryController.findOne);

// 2. PROTECTED ROUTES (Only ADMIN can modify categories)
// Chain of middlewares: Auth -> Roles -> Validation -> Controller
router.post(
  '/',
  jwtAuthMiddleware,
  rolesMiddleware(UserRole.ADMIN),
  validationMiddleware(CreateCategoryDto),
  categoryController.create
);

router.put(
  '/:id',
  jwtAuthMiddleware,
  rolesMiddleware(UserRole.ADMIN),
  validationMiddleware(UpdateCategoryDto),
  categoryController.update
);

router.delete(
  '/:id',
  jwtAuthMiddleware,
  rolesMiddleware(UserRole.ADMIN),
  categoryController.delete
);

export default router;
