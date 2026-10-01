import 'reflect-metadata';
import 'dotenv/config'; // Automatically load environment variables (Similar to ConfigModule.forRoot)
import app from './app';
import { AppDataSource } from './config/data-source';
import './jobs/email.queue';
import './jobs/order.queue';

const PORT = process.env.PORT || 3000;

// Equivalent to bootstrap() in NestJS main.ts
const bootstrap = async () => {
  try {
    await AppDataSource.initialize();
    console.log('📦 Database connected successfully!');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`🩺 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

bootstrap();
