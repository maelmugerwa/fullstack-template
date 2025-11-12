import { Router, Request, Response } from 'express';
import taskRoutes from './tasks';

const router = Router();

/**
 * Health check endpoint
 * @route GET /health
 */
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Mount task routes
 * All task routes will be available under /api/tasks
 */
router.use('/tasks', taskRoutes);

export default router;