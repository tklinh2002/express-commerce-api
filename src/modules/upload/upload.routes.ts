import { Router } from 'express';
import { UploadController } from './upload.controller';
import { uploadMiddleware } from '../../core/middlewares/upload.middleware';
import { jwtAuthMiddleware } from '../../core/middlewares/jwtAuth.middleware';

const router = Router();
const uploadController = new UploadController();

// Route: POST /upload/image
// uploadMiddleware.single('image') acts like FileInterceptor('image') in NestJS
router.post(
  '/image',
  jwtAuthMiddleware, // Must be logged in to upload
  uploadMiddleware.single('image'),
  uploadController.uploadImage
);

export default router;
