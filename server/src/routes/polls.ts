import { Router } from 'express'
import * as pollController from '../controllers/pollController'
import { authenticate, optionalAuth } from '../middleware/auth'

const router = Router()

// Public routes (optional auth to show user's votes)
router.get('/', optionalAuth, pollController.getAllPolls)
router.get('/:id', optionalAuth, pollController.getPollById)

// Protected routes (require authentication)
router.post('/', authenticate, pollController.createPoll)
router.put('/:id', authenticate, pollController.updatePoll)
router.post('/:id/vote', authenticate, pollController.voteOnPoll)
router.delete('/:id', authenticate, pollController.deletePoll)

export default router