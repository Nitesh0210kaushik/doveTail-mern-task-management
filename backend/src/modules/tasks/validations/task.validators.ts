import { body, param, query } from 'express-validator';
import { TASK_PRIORITIES, TASK_SORT_FIELDS, TASK_STATUSES } from '../../../constants/task.constants';

const title = body('title').trim().isLength({ min: 2, max: 150 }).withMessage('Title must be between 2 and 150 characters');
const plainText = (value: unknown): boolean => typeof value === 'string' && !/[<>]/.test(value);
const safeTitle = title.custom(plainText).withMessage('HTML tags are not allowed in the title');
const description = body('description')
  .optional({ values: 'falsy' })
  .trim()
  .isLength({ max: 2000 })
  .withMessage('Description cannot exceed 2000 characters')
  .custom(plainText)
  .withMessage('HTML tags are not allowed in the description');
const status = body('status').optional().isIn(TASK_STATUSES).withMessage('Invalid task status');
const priority = body('priority').optional().isIn(TASK_PRIORITIES).withMessage('Invalid task priority');
const dueDate = body('dueDate').isISO8601().withMessage('Due date must be a valid ISO date');

export const createTaskValidator = [safeTitle, description, status, priority, dueDate];
export const updateTaskValidator = [
  param('id').isMongoId().withMessage('Invalid task id'),
  body('title').optional().trim().isLength({ min: 2, max: 150 }).withMessage('Title must be between 2 and 150 characters').custom(plainText).withMessage('HTML tags are not allowed in the title'),
  body('description').optional({ values: 'falsy' }).trim().isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  status,
  priority,
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid ISO date')
];
export const taskIdValidator = [param('id').isMongoId().withMessage('Invalid task id')];
export const listTasksValidator = [
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search cannot exceed 100 characters'),
  query('status').optional().isIn(TASK_STATUSES).withMessage('Invalid task status'),
  query('priority').optional().isIn(TASK_PRIORITIES).withMessage('Invalid task priority'),
  query('sortBy').optional().isIn(TASK_SORT_FIELDS).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Invalid sort order'),
  query('page').optional().isInt({ min: 1, max: 10000 }).toInt().withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be between 1 and 100')
];
