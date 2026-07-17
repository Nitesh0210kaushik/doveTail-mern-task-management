import { Types } from 'mongoose';
import { Task, type TaskDocument } from '../models/Task';
import type { CreateTaskInput, TaskQuery, UpdateTaskInput } from '../types/task.types';

const escapeRegex = (value: string): string => value.replace(/[\^$.*+?()[\]{}|]/g, '\\$&');

export const taskRepository = {
  create(userId: string, input: CreateTaskInput): Promise<TaskDocument> {
    return Task.create({ ...input, user: userId });
  },

  findByIdForUser(taskId: string, userId: string): Promise<TaskDocument | null> {
    return Task.findOne({ _id: taskId, user: userId });
  },

  async findAllForUser(userId: string, query: TaskQuery): Promise<{ tasks: TaskDocument[]; totalRecords: number }> {
    const filter: Record<string, unknown> = { user: new Types.ObjectId(userId) };
    if (query.search) filter.title = { $regex: escapeRegex(query.search), $options: 'i' };
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;

    const page = query.page || 1;
    const limit = query.limit || 10;
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    const [tasks, totalRecords] = await Promise.all([
      Task.find(filter).sort({ [sortBy]: sortOrder }).skip((page - 1) * limit).limit(limit),
      Task.countDocuments(filter)
    ]);
    return { tasks, totalRecords };
  },

  update(taskId: string, userId: string, input: UpdateTaskInput): Promise<TaskDocument | null> {
    return Task.findOneAndUpdate({ _id: taskId, user: userId }, input, { new: true, runValidators: true });
  },

  delete(taskId: string, userId: string): Promise<TaskDocument | null> {
    return Task.findOneAndDelete({ _id: taskId, user: userId });
  }
};
