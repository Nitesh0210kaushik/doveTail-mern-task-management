import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTasks,
  updateTask as updateTaskRequest
} from '../services/task.service';
import type { Pagination, Task, TaskFilters, TaskInput } from '../features/tasks/types/task.types';

const initialPagination: Pagination = { page: 1, limit: 10, totalRecords: 0, totalPages: 0 };

export function useTasks(filters: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getTasks(filters);
      setTasks(response.data.tasks);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        totalRecords: response.data.totalRecords,
        totalPages: response.data.totalPages
      });
    } catch (requestError: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(requestError)
        ? requestError.response?.data?.message
        : undefined;
      setError(message || 'Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const create = async (input: TaskInput) => {
    await createTaskRequest(input);
    await loadTasks();
  };

  const update = async (taskId: string, input: Partial<TaskInput>) => {
    await updateTaskRequest(taskId, input);
    await loadTasks();
  };

  const remove = async (taskId: string) => {
    await deleteTaskRequest(taskId);
    await loadTasks();
  };

  return { tasks, pagination, loading, error, reload: loadTasks, create, update, remove };
}
