import axios, { AxiosError } from 'axios';
import { Task, CreateTaskDto, UpdateTaskDto, ApiResponse } from '../types';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle network errors
    if (!error.response) {
      throw new Error('Network error: Unable to connect to the server');
    }

    // Handle API errors
    const errorData = error.response.data as any;
    const message = errorData?.error?.message || errorData?.message || 'An unexpected error occurred';
    
    throw new Error(message);
  }
);

/**
 * API Service for Task operations
 */
export const taskApi = {
  /**
   * Get all tasks
   */
  async getTasks(): Promise<Task[]> {
    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks');
    return response.data.data || [];
  },

  /**
   * Get a single task by ID
   */
  async getTaskById(id: string): Promise<Task> {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    if (!response.data.data) {
      throw new Error('Task not found');
    }
    return response.data.data;
  },

  /**
   * Create a new task
   */
  async createTask(data: CreateTaskDto): Promise<Task> {
    const response = await apiClient.post<ApiResponse<Task>>('/tasks', data);
    if (!response.data.data) {
      throw new Error('Failed to create task');
    }
    return response.data.data;
  },

  /**
   * Update an existing task
   */
  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    if (!response.data.data) {
      throw new Error('Failed to update task');
    }
    return response.data.data;
  },

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },
};

// Export individual methods for convenience
export const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = taskApi;

// Export the axios instance for advanced usage
export default apiClient;