import { body } from 'express-validator';

const email = body('email')
  .trim()
  .isEmail()
  .withMessage('Please provide a valid email')
  .normalizeEmail();

const password = body('password')
  .isString()
  .withMessage('Password must be a string')
  .isLength({ min: 8, max: 128 })
  .withMessage('Password must be between 8 and 128 characters');

export const registerValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters'),
  email,
  password
];

export const loginValidator = [email, password];
