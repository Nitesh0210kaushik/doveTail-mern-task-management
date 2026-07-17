import mongoose, { type Document, type Types } from 'mongoose';
import type { TaskPriority, TaskStatus } from '../types/task.types';

export interface TaskDocument extends Document {
  user: Types.ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema<TaskDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: [true, 'Title is required'], trim: true, minlength: 2, maxlength: 150 },
    description: { type: String, default: '', trim: true, maxlength: 2000 },
    status: { type: String, enum: { values: ['Pending', 'In Progress', 'Completed'], message: 'Invalid task status' }, default: 'Pending', required: true },
    priority: { type: String, enum: { values: ['Low', 'Medium', 'High'], message: 'Invalid task priority' }, default: 'Medium', required: true },
    dueDate: { type: Date, required: [true, 'Due date is required'] }
  },
  { timestamps: true, versionKey: false }
);

taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, status: 1, priority: 1 });

export const Task = mongoose.model<TaskDocument>('Task', taskSchema);
