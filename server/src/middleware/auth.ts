import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types'
import { AppError } from './errorHandler'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided')
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    
    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, 'Invalid token'))
    } else {
      next(error)
    }
  }
}

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
      req.user = decoded
    }
    
    next()
  } catch (error) {
    // Invalid token, but that's okay for optional auth
    next()
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required')
  }
  next()
}

export const requireNonGuest = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required')
  }
  
  if (req.user.isGuest) {
    throw new AppError(403, 'Guest users cannot perform this action')
  }
  
  next()
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}