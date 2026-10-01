import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Ensure you have REDIS_HOST=localhost and REDIS_PORT=6379 in your .env file
export const redisConnection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT as string, 10) || 6379,
  // password: process.env.REDIS_PASSWORD || '', // Uncomment if your Redis has a password
  maxRetriesPerRequest: null,
});
