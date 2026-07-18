import { Router } from 'express';
import { login, logout, me, refresh, register } from '../controllers/auth.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { validate } from '../../../middleware/validate.middleware';
import { loginValidator, registerValidator } from '../validations/auth.validators';
import { authRateLimiter } from '../../../middleware/rateLimit.middleware';
import { verifyCsrfToken } from '../../../middleware/csrf.middleware';

const router = Router();

router.get('/csrf', (_req, res) => res.status(200).json({ message: 'CSRF token issued' }));
router.post('/register', authRateLimiter, verifyCsrfToken, registerValidator, validate, register);
router.post('/login', authRateLimiter, verifyCsrfToken, loginValidator, validate, login);
router.get('/me', authenticate, me);
router.post('/refresh', authRateLimiter, verifyCsrfToken, refresh);
router.post('/logout', verifyCsrfToken, logout);

export default router;
