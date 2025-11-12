import { Router, Request, Response } from 'express'
import userRoutes from './users'

const router = Router()

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  })
})

// User routes
router.use('/users', userRoutes)

// Root endpoint
router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Fullstack Interview Template API',
    endpoints: {
      health: '/api/health',
      users: '/api/users'
    }
  })
})

export default router