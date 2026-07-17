import type { ParamsDictionary } from 'express-serve-static-core';
import type { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiError } from '../../../utils/ApiError';
import { createTask, deleteTask, getTask, listTasks, updateTask } from '../services/task.service';
import type { CreateTaskInput, PaginatedTasks, TaskQuery, TaskResponse, UpdateTaskInput } from '../types/task.types';
import { StatusCodes } from 'http-status-codes';

const getUserId = (req: Request): string => {
  if (!req.user) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authenticated user is required');
  return req.user._id.toString();
};

export const create = asyncHandler(async (
  req: Request<ParamsDictionary, { task: TaskResponse }, CreateTaskInput>,
  res: Response<{ task: TaskResponse }>
) => {
  const task = await createTask(getUserId(req), req.body);
  res.status(StatusCodes.CREATED).json({ task });
});

export const list = asyncHandler(async (req: Request, res: Response<PaginatedTasks>) => {
  const tasks = await listTasks(getUserId(req), req.query as unknown as TaskQuery);
  res.status(StatusCodes.OK).json(tasks);
});

export const get = asyncHandler(async (
  req: Request<ParamsDictionary, { task: TaskResponse }>,
  res: Response<{ task: TaskResponse }>
) => {
  const task = await getTask(getUserId(req), String(req.params.id));
  res.status(StatusCodes.OK).json({ task });
});

export const update = asyncHandler(async (
  req: Request<ParamsDictionary, { task: TaskResponse }, UpdateTaskInput>,
  res: Response<{ task: TaskResponse }>
) => {
  const task = await updateTask(getUserId(req), String(req.params.id), req.body);
  res.status(StatusCodes.OK).json({ task });
});

export const remove = asyncHandler(async (req: Request<ParamsDictionary>, res: Response) => {
  await deleteTask(getUserId(req), String(req.params.id));
  res.status(StatusCodes.NO_CONTENT).send();
});
