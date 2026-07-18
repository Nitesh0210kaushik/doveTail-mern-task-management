import { axiosClient } from '../config/axios.config';
import { ENDPOINTS } from '../constants/endpoints';
import type { Task, TaskFilters, TaskInput, TaskListResponse } from '../features/tasks/types/task.types';

export const getTasks = (filters: TaskFilters) =>
  axiosClient.get<TaskListResponse>(ENDPOINTS.tasks.list, {
    params: {
      search: filters.search || undefined,
      status: filters.status || undefined,
      priority: filters.priority || undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page: filters.page,
      limit: filters.limit
    }
  });

export const getTask = (taskId: string) =>
  axiosClient.get<{ task: Task }>(ENDPOINTS.tasks.byId(taskId));

export const createTask = (input: TaskInput) =>
  axiosClient.post<{ task: Task }>(ENDPOINTS.tasks.create, input);

export const updateTask = (taskId: string, input: Partial<TaskInput>) =>
  axiosClient.patch<{ task: Task }>(ENDPOINTS.tasks.byId(taskId), input);

export const deleteTask = (taskId: string) =>
  axiosClient.delete(ENDPOINTS.tasks.byId(taskId));
