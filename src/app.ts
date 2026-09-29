import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './core/middlewares/errorHandler';

const app: Application = express();

// 1. Global Middlewares (Similar to NestJS app.use() or global pipes/guards)
app.use(helmet()); // Secure HTTP headers
app.use(cors());   // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests (similar to ValidationPipe payload parsing)
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// 2. Healthcheck Route (Similar to AppController)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is up and running!',
    timestamp: new Date().toISOString()
  });
});

// 3. TODO: Register application routes here (Module routers)

// 4. TODO: Register global error handler (Similar to ExceptionFilter)
app.use(errorHandler);

export default app;
