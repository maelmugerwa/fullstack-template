import { Router, Request, Response } from 'express'
import userRoutes from './users'
import authRoutes from './auth'
import pollRoutes from './polls'

const router = Router()

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  })
})

// Auth routes
router.use('/auth', authRoutes)

// User routes
router.use('/users', userRoutes)

// Poll routes
router.use('/polls', pollRoutes)

// Root endpoint
router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Fullstack Interview Template API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      polls: '/api/polls'
    }
  })
})

export default router