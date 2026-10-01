import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { redisConnection } from '../../config/redis';

export class HealthController {
  // Check the health of the API, Database, and Redis
  public checkHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Check Database connection
      const dbStatus = AppDataSource.isInitialized ? 'Connected' : 'Disconnected';

      // 2. Check Redis connection
      const redisStatus = redisConnection.status === 'ready' ? 'Connected' : 'Disconnected';

      const isHealthy = dbStatus === 'Connected' && redisStatus === 'Connected';

      const healthData = {
        app: 'E-Commerce API is running!',
        database: dbStatus,
        redis: redisStatus,
        uptime: process.uptime(),
      };

      if (isHealthy) {
        // Interceptor will wrap this in { status: 'success', data: ... }
        res.status(200).json(healthData);
      } else {
        res.status(503).json(healthData);
      }
    } catch {
      res.status(500).json({ error: 'Health check failed' });
    }
  };
}
