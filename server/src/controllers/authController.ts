import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../config/database'
import { asyncHandler, AppError } from '../middleware/errorHandler'
import { generateToken } from '../middleware/auth'
import { RegisterDto, LoginDto, GuestDto, ConvertGuestDto } from '../types'

// Register new user with email and password
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password }: RegisterDto = req.body
  
  if (!name || !email || !password) {
    throw new AppError(400, 'Name, email and password are required')
  }
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new AppError(400, 'User already exists with this email')
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)
  
  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      isGuest: false
    }
  })
  
  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    isGuest: user.isGuest
  })
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  
  res.status(201).json({
    user: userWithoutPassword,
    token
  })
})

// Login with email and password
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginDto = req.body
  
  if (!email || !password) {
    throw new AppError(400, 'Email and password are required')
  }
  
  // Find user
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.password) {
    throw new AppError(401, 'Invalid credentials')
  }
  
  // Check if user is guest (shouldn't have been able to set password)
  if (user.isGuest && !user.password) {
    throw new AppError(401, 'Invalid credentials')
  }
  
  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    throw new AppError(401, 'Invalid credentials')
  }
  
  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    isGuest: user.isGuest
  })
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  
  res.json({
    user: userWithoutPassword,
    token
  })
})

// Create guest user (no password)
export const createGuest = asyncHandler(async (req: Request, res: Response) => {
  const { name }: GuestDto = req.body
  
  if (!name) {
    throw new AppError(400, 'Name is required')
  }
  
  // Generate unique guest email
  const guestEmail = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}@guest.local`
  
  // Create guest user
  const user = await prisma.user.create({
    data: {
      name,
      email: guestEmail,
      password: null,
      isGuest: true
    }
  })
  
  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    isGuest: user.isGuest
  })
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  
  res.status(201).json({
    user: userWithoutPassword,
    token
  })
})

// Convert guest user to registered user
export const convertGuest = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: ConvertGuestDto = req.body
  
  if (!req.user) {
    throw new AppError(401, 'Authentication required')
  }
  
  if (!req.user.isGuest) {
    throw new AppError(400, 'User is already registered')
  }
  
  if (!email || !password) {
    throw new AppError(400, 'Email and password are required')
  }
  
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new AppError(400, 'Email already in use')
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)
  
  // Update user
  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: {
      email,
      password: hashedPassword,
      isGuest: false
    }
  })
  
  // Generate new token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    isGuest: user.isGuest
  })
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  
  res.json({
    user: userWithoutPassword,
    token
  })
})

// Get current user
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required')
  }
  
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      name: true,
      email: true,
      isGuest: true,
      createdAt: true,
      updatedAt: true
    }
  })
  
  if (!user) {
    throw new AppError(404, 'User not found')
  }
  
  res.json({ user })
})