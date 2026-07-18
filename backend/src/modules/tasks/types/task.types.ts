import type { TaskPriority, TaskSortField, TaskStatus } from '../../../constants/task.constants';

export type { TaskPriority, TaskSortField, TaskStatus } from '../../../constants/task.constants';
export type SortOrder = 'asc' | 'desc';

export interface CreateTaskInput {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface TaskQuery {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: TaskSortField;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface PaginatedTasks {
  tasks: TaskResponse[];
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}
