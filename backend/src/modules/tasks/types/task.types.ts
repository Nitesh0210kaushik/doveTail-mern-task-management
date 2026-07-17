export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed'] as const;
export const TASK_PRIORITIES = ['Low', 'Medium', 'High'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskSortField = 'dueDate' | 'createdAt';
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
