import { Router } from 'express'
import * as authController from '../controllers/authController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/guest', authController.createGuest)
router.post('/convert-guest', authenticate, authController.convertGuest)
router.get('/me', authenticate, authController.getCurrentUser)

export default router