export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed'] as const;
export const TASK_PRIORITIES = ['Low', 'Medium', 'High'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

export interface TaskFilters {
  search: string;
  status: TaskStatus | '';
  priority: TaskPriority | '';
  sortBy: 'dueDate' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface Pagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface TaskListResponse {
  tasks: Task[];
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}
