import { Task as PrismaTask } from '@prisma/client';

/**
 * Task type from Prisma
 */
export type Task = PrismaTask;

/**
 * Task creation data (without auto-generated fields)
 */
export interface CreateTaskDto {
  title: string;
  description?: string;
  completed?: boolean;
}

/**
 * Task update data (all fields optional)
 */
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
  message?: string;
}

/**
 * Paginated response for list endpoints
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Error response type
 */
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode?: number;
    details?: any;
    stack?: string;
  };
}