import { Router } from 'express';
import { login, logout, me, refresh, register } from '../controllers/auth.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { validate } from '../../../middleware/validate.middleware';
import { loginValidator, registerValidator } from '../validations/auth.validators';
import { authRateLimiter } from '../../../middleware/rateLimit.middleware';

const router = Router();

router.post('/register', authRateLimiter, registerValidator, validate, register);
router.post('/login', authRateLimiter, loginValidator, validate, login);
router.get('/me', authenticate, me);
router.post('/refresh', authRateLimiter, refresh);
router.post('/logout', logout);

export default router;
