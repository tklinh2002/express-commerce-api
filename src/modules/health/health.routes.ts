import { Router } from 'express';
import { HealthController } from './health.controller';

const router = Router();
const healthController = new HealthController();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health
 *     description: Returns the health status of the API, Database, and Redis.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System is healthy
 *       503:
 *         description: System is unhealthy
 */
// GET /health -> Check system health
router.get('/', healthController.checkHealth);

export default router;
