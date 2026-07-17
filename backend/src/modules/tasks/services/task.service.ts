import { ApiError } from '../../../utils/ApiError';
import { taskRepository } from '../repositories/task.repository';
import type { TaskDocument } from '../models/Task';
import type { CreateTaskInput, PaginatedTasks, TaskQuery, TaskResponse, UpdateTaskInput } from '../types/task.types';
import { StatusCodes } from 'http-status-codes';

const toTaskResponse = (task: TaskDocument): TaskResponse => ({
  id: task._id.toString(),
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt
});

export const createTask = async (userId: string, input: CreateTaskInput): Promise<TaskResponse> =>
  toTaskResponse(await taskRepository.create(userId, input));

export const getTask = async (userId: string, taskId: string): Promise<TaskResponse> => {
  const task = await taskRepository.findByIdForUser(taskId, userId);
  if (!task) throw new ApiError(StatusCodes.NOT_FOUND, 'Task not found');
  return toTaskResponse(task);
};

export const listTasks = async (userId: string, query: TaskQuery): Promise<PaginatedTasks> => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const { tasks, totalRecords } = await taskRepository.findAllForUser(userId, query);
  return { tasks: tasks.map(toTaskResponse), page, limit, totalRecords, totalPages: Math.ceil(totalRecords / limit) };
};

export const updateTask = async (userId: string, taskId: string, input: UpdateTaskInput): Promise<TaskResponse> => {
  const task = await taskRepository.update(taskId, userId, input);
  if (!task) throw new ApiError(StatusCodes.NOT_FOUND, 'Task not found');
  return toTaskResponse(task);
};

export const deleteTask = async (userId: string, taskId: string): Promise<void> => {
  const task = await taskRepository.delete(taskId, userId);
  if (!task) throw new ApiError(StatusCodes.NOT_FOUND, 'Task not found');
};
