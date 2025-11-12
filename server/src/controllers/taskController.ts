import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { CreateTaskDto, UpdateTaskDto, ApiResponse } from '../types';
import { AppError, asyncHandler } from '../middleware/errorHandler';

/**
 * Get all tasks
 * @route GET /api/tasks
 */
export const getAllTasks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await prisma.task.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      const response: ApiResponse = {
        success: true,
        data: tasks,
        message: `Retrieved ${tasks.length} tasks`,
      };

      res.status(200).json(response);
    } catch (error) {
      next(new AppError(500, 'Failed to retrieve tasks'));
    }
  }
);

/**
 * Get a single task by ID
 * @route GET /api/tasks/:id
 */
export const getTaskById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const taskId = parseInt(id, 10);

      if (isNaN(taskId)) {
        return next(new AppError(400, 'Invalid task ID'));
      }

      const task = await prisma.task.findUnique({
        where: { id: taskId },
      });

      if (!task) {
        return next(new AppError(404, `Task with ID ${taskId} not found`));
      }

      const response: ApiResponse = {
        success: true,
        data: task,
      };

      res.status(200).json(response);
    } catch (error) {
      next(new AppError(500, 'Failed to retrieve task'));
    }
  }
);

/**
 * Create a new task
 * @route POST /api/tasks
 */
export const createTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, completed }: CreateTaskDto = req.body;

      // Validation
      if (!title || title.trim().length === 0) {
        return next(new AppError(400, 'Task title is required'));
      }

      if (title.length > 200) {
        return next(new AppError(400, 'Task title must be less than 200 characters'));
      }

      const task = await prisma.task.create({
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          completed: completed ?? false,
        },
      });

      const response: ApiResponse = {
        success: true,
        data: task,
        message: 'Task created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(new AppError(500, 'Failed to create task'));
    }
  }
);

/**
 * Update an existing task
 * @route PUT /api/tasks/:id
 */
export const updateTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const taskId = parseInt(id, 10);

      if (isNaN(taskId)) {
        return next(new AppError(400, 'Invalid task ID'));
      }

      const { title, description, completed }: UpdateTaskDto = req.body;

      // Check if task exists
      const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
      });

      if (!existingTask) {
        return next(new AppError(404, `Task with ID ${taskId} not found`));
      }

      // Validation
      if (title !== undefined && title.trim().length === 0) {
        return next(new AppError(400, 'Task title cannot be empty'));
      }

      if (title !== undefined && title.length > 200) {
        return next(new AppError(400, 'Task title must be less than 200 characters'));
      }

      // Build update data object
      const updateData: any = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description?.trim() || null;
      if (completed !== undefined) updateData.completed = completed;

      const task = await prisma.task.update({
        where: { id: taskId },
        data: updateData,
      });

      const response: ApiResponse = {
        success: true,
        data: task,
        message: 'Task updated successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(new AppError(500, 'Failed to update task'));
    }
  }
);

/**
 * Delete a task
 * @route DELETE /api/tasks/:id
 */
export const deleteTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const taskId = parseInt(id, 10);

      if (isNaN(taskId)) {
        return next(new AppError(400, 'Invalid task ID'));
      }

      // Check if task exists
      const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
      });

      if (!existingTask) {
        return next(new AppError(404, `Task with ID ${taskId} not found`));
      }

      await prisma.task.delete({
        where: { id: taskId },
      });

      const response: ApiResponse = {
        success: true,
        message: 'Task deleted successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(new AppError(500, 'Failed to delete task'));
    }
  }
);

// ==============================================================================
// COMMON CONTROLLER PATTERNS FOR INTERVIEWS
// ==============================================================================

// --- PAGINATION ---
// export const getPaginatedTasks = asyncHandler(async (req: Request, res: Response) => {
//   const page = parseInt(req.query.page as string) || 1
//   const pageSize = parseInt(req.query.pageSize as string) || 10
//   const skip = (page - 1) * pageSize
//   
//   const [tasks, total] = await Promise.all([
//     prisma.task.findMany({
//       skip,
//       take: pageSize,
//       orderBy: { createdAt: 'desc' }
//     }),
//     prisma.task.count()
//   ])
//   
//   res.json({
//     tasks,
//     pagination: {
//       page,
//       pageSize,
//       total,
//       totalPages: Math.ceil(total / pageSize)
//     }
//   })
// })

// --- SEARCH & FILTERING ---
// export const searchTasks = asyncHandler(async (req: Request, res: Response) => {
//   const { search, completed, sortBy } = req.query
//   
//   const tasks = await prisma.task.findMany({
//     where: {
//       AND: [
//         search ? {
//           OR: [
//             { title: { contains: search as string } },
//             { description: { contains: search as string } }
//           ]
//         } : {},
//         completed !== undefined ? { completed: completed === 'true' } : {}
//       ]
//     },
//     orderBy: sortBy === 'title' ? { title: 'asc' } : { createdAt: 'desc' }
//   })
//   
//   res.json({ tasks })
// })

// --- WITH RELATIONS (JOINS) ---
// export const getTaskWithUser = asyncHandler(async (req: Request, res: Response) => {
//   const task = await prisma.task.findUnique({
//     where: { id: parseInt(req.params.id) },
//     include: {
//       user: {
//         select: { id: true, name: true, email: true }
//       }
//     }
//   })
//   
//   if (!task) throw new AppError(404, 'Task not found')
//   res.json({ task })
// })

// --- BATCH OPERATIONS ---
// export const bulkUpdateTasks = asyncHandler(async (req: Request, res: Response) => {
//   const { taskIds, updates } = req.body
//   
//   const result = await prisma.task.updateMany({
//     where: { id: { in: taskIds } },
//     data: updates
//   })
//   
//   res.json({ message: `Updated ${result.count} tasks` })
// })

// --- TRANSACTIONS (Multiple operations atomically) ---
// export const createTaskWithNotification = asyncHandler(async (req: Request, res: Response) => {
//   const { title, description, userId } = req.body
//   
//   const result = await prisma.$transaction(async (tx) => {
//     const task = await tx.task.create({
//       data: { title, description, userId }
//     })
//     
//     await tx.notification.create({
//       data: {
//         userId,
//         message: `New task created: ${title}`
//       }
//     })
//     
//     return task
//   })
//   
//   res.status(201).json({ task: result })
// })

// --- AGGREGATIONS ---
// export const getTaskStats = asyncHandler(async (req: Request, res: Response) => {
//   const stats = await prisma.task.aggregate({
//     _count: { id: true },
//     _avg: { /* numerical fields */ },
//     _sum: { /* numerical fields */ },
//     where: { completed: true }
//   })
//   
//   const groupedStats = await prisma.task.groupBy({
//     by: ['completed'],
//     _count: { id: true }
//   })
//   
//   res.json({ stats, groupedStats })
// })

// --- SOFT DELETE ---
// export const softDeleteTask = asyncHandler(async (req: Request, res: Response) => {
//   const task = await prisma.task.update({
//     where: { id: parseInt(req.params.id) },
//     data: { deletedAt: new Date() }
//   })
//   
//   res.json({ task })
// })
// 
// // Get only non-deleted tasks
// const tasks = await prisma.task.findMany({
//   where: { deletedAt: null }
// })