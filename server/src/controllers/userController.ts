import { Request, Response } from 'express'
import prisma from '../config/database'
import { asyncHandler, AppError } from '../middleware/errorHandler'

// Get all users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })
  res.json({ users })
})

// Get user by ID
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) }
  })
  
  if (!user) throw new AppError('User not found', 404)
  res.json({ user })
})

// Create user
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body
  
  if (!name || !email) {
    throw new AppError('Name and email are required', 400)
  }
  
  const user = await prisma.user.create({
    data: { name, email }
  })
  
  res.status(201).json({ user })
})

// Update user
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body
  
  const user = await prisma.user.update({
    where: { id: parseInt(req.params.id) },
    data: { ...(name && { name }), ...(email && { email }) }
  })
  
  res.json({ user })
})

// Delete user
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await prisma.user.delete({
    where: { id: parseInt(req.params.id) }
  })
  
  res.status(204).send()
})

// Get user with posts
//   const user = await prisma.user.findUnique({
//     where: { id: parseInt(req.params.id) },
//     include: { posts: true }
//   })
//   if (!user) throw new AppError('User not found', 404)
//   res.json({ user })
// })