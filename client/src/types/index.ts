/**
 * Task interface matching the backend Prisma model
 */
export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

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