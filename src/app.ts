import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './core/middlewares/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import categoryRoutes from './modules/category/category.routes';
import productRoutes from './modules/product/product.routes';
import path from 'path';
import uploadRoutes from './modules/upload/upload.routes';
import cartRoutes from './modules/cart/cart.routes';
import orderRoutes from './modules/order/order.routes';
import healthRoutes from './modules/health/health.routes';
import { responseInterceptor } from './core/interceptors/response.interceptor';

const app: Application = express();

// 1. Global Middlewares (Similar to NestJS app.use() or global pipes/guards)
app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests (similar to ValidationPipe payload parsing)
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(responseInterceptor); // Intercept and format all responses globally

// 2. Healthcheck Route (Checking DB, Redis, App)
app.use('/health', healthRoutes);

// 3. TODO: Register application routes here (Module routers)
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
app.use('/upload', uploadRoutes);

// 4. TODO: Register global error handler (Similar to ExceptionFilter)
app.use(errorHandler);

export default app;
