import { Request, Response } from 'express'
import prisma from '../config/database'
import { asyncHandler, AppError } from '../middleware/errorHandler'
import { CreatePollDto, UpdatePollDto, VoteDto } from '../types'

// Get all polls with vote counts
export const getAllPolls = asyncHandler(async (req: Request, res: Response) => {
  const polls = await prisma.poll.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          isGuest: true
        }
      },
      options: {
        include: {
          _count: {
            select: { votes: true }
          }
        }
      },
      _count: {
        select: { votes: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  // Include user's vote if authenticated
  const pollsWithUserVote = await Promise.all(
    polls.map(async (poll) => {
      let userVote = null
      if (req.user) {
        userVote = await prisma.vote.findUnique({
          where: {
            userId_pollId: {
              userId: req.user.userId,
              pollId: poll.id
            }
          }
        })
      }
      
      return {
        ...poll,
        totalVotes: poll._count.votes,
        userVote,
        options: poll.options.map(option => ({
          ...option,
          voteCount: option._count.votes
        }))
      }
    })
  )
  
  res.json({ polls: pollsWithUserVote })
})

// Get poll by ID
export const getPollById = asyncHandler(async (req: Request, res: Response) => {
  const pollId = parseInt(req.params.id)
  
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          isGuest: true
        }
      },
      options: {
        include: {
          _count: {
            select: { votes: true }
          }
        }
      },
      _count: {
        select: { votes: true }
      }
    }
  })
  
  if (!poll) {
    throw new AppError(404, 'Poll not found')
  }
  
  // Check if user has voted
  let userVote = null
  if (req.user) {
    userVote = await prisma.vote.findUnique({
      where: {
        userId_pollId: {
          userId: req.user.userId,
          pollId: poll.id
        }
      }
    })
  }
  
  const pollWithResults = {
    ...poll,
    totalVotes: poll._count.votes,
    userVote,
    options: poll.options.map(option => ({
      ...option,
      voteCount: option._count.votes
    }))
  }
  
  res.json({ poll: pollWithResults })
})

// Create new poll (requires authentication)
export const createPoll = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required')
  }
  
  const { question, options }: CreatePollDto = req.body
  
  if (!question || !options || options.length < 2) {
    throw new AppError(400, 'Question and at least 2 options are required')
  }
  
  // Create poll with options
  const poll = await prisma.poll.create({
    data: {
      question,
      authorId: req.user.userId,
      options: {
        create: options.map(text => ({ text }))
      }
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          isGuest: true
        }
      },
      options: true
    }
  })
  
  res.status(201).json({ poll })
})

// Update poll (only by author)
export const updatePoll = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required')
  }
  
  const pollId = parseInt(req.params.id)
  const { question, options }: UpdatePollDto = req.body
  
  // Check if poll exists and user is the author
  const existingPoll = await prisma.poll.findUnique({
    where: { id: pollId }
  })
  
  if (!existingPoll) {
    throw new AppError(404, 'Poll not found')
  }
  
  if (existingPoll.authorId !== req.user.userId) {
    throw new AppError(403, 'Only poll author can update it')
  }
  
  // Update poll
  const updateData: any = {}
  if (question) updateData.question = question
  
  // If options provided, delete old ones and create new ones
  if (options && options.length >= 2) {
    await prisma.pollOption.deleteMany({
      where: { pollId }
    })
    updateData.options = {
      create: options.map(text => ({ text }))
    }
  }
  
  const poll = await prisma.poll.update({
    where: { id: pollId },
    data: updateData,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          isGuest: true
        }
      },
      options: true
    }
  })
  
  res.json({ poll })
})

// Vote on a poll
export const voteOnPoll = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required')
  }
  
  const pollId = parseInt(req.params.id)
  const { optionId }: VoteDto = req.body
  
  if (!optionId) {
    throw new AppError(400, 'Option ID is required')
  }
  
  // Verify poll and option exist
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { options: true }
  })
  
  if (!poll) {
    throw new AppError(404, 'Poll not found')
  }
  
  const option = poll.options.find(opt => opt.id === optionId)
  if (!option) {
    throw new AppError(404, 'Option not found')
  }
  
  // Check if user already voted
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_pollId: {
        userId: req.user.userId,
        pollId
      }
    }
  })
  
  if (existingVote) {
    // Update existing vote
    const vote = await prisma.vote.update({
      where: { id: existingVote.id },
      data: { optionId }
    })
    
    res.json({ vote, message: 'Vote updated' })
  } else {
    // Create new vote
    const vote = await prisma.vote.create({
      data: {
        userId: req.user.userId,
        pollId,
        optionId
      }
    })
    
    res.status(201).json({ vote, message: 'Vote recorded' })
  }
})

// Delete poll (only by author)
export const deletePoll = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required')
  }
  
  const pollId = parseInt(req.params.id)
  
  // Check if poll exists and user is the author
  const poll = await prisma.poll.findUnique({
    where: { id: pollId }
  })
  
  if (!poll) {
    throw new AppError(404, 'Poll not found')
  }
  
  if (poll.authorId !== req.user.userId) {
    throw new AppError(403, 'Only poll author can delete it')
  }
  
  await prisma.poll.delete({
    where: { id: pollId }
  })
  
  res.status(204).send()
})