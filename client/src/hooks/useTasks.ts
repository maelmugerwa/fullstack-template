import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types';
import { taskApi } from '../services/api';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (data: CreateTaskDto) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskDto) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
}

/**
 * Custom hook for managing tasks
 * Handles all task CRUD operations and state management
 */
export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all tasks from the API
   */
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskApi.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add a new task
   */
  const addTask = useCallback(async (data: CreateTaskDto) => {
    try {
      setError(null);
      const newTask = await taskApi.createTask(data);
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      console.error('Error creating task:', err);
      throw err;
    }
  }, []);

  /**
   * Update an existing task
   */
  const updateTask = useCallback(async (id: string, data: UpdateTaskDto) => {
    try {
      setError(null);
      const updatedTask = await taskApi.updateTask(id, data);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      console.error('Error updating task:', err);
      throw err;
    }
  }, []);

  /**
   * Delete a task
   */
  const removeTask = useCallback(async (id: string) => {
    try {
      setError(null);
      await taskApi.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      console.error('Error deleting task:', err);
      throw err;
    }
  }, []);

  /**
   * Toggle task completion status
   */
  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      setError(null);
      // Optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );

      await taskApi.updateTask(id, { completed: !task.completed });
    } catch (err) {
      // Revert on error
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === id ? { ...t, completed: task.completed } : t
        )
      );
      const message = err instanceof Error ? err.message : 'Failed to toggle task';
      setError(message);
      console.error('Error toggling task:', err);
      throw err;
    }
  }, [tasks]);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    removeTask,
    toggleTask,
  };
};