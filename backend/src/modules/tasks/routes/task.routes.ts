import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.middleware';
import { validate } from '../../../middleware/validate.middleware';
import { create, get, list, remove, update } from '../controllers/task.controller';
import { createTaskValidator, listTasksValidator, taskIdValidator, updateTaskValidator } from '../validations/task.validators';
import { verifyCsrfToken } from '../../../middleware/csrf.middleware';

const router = Router();

router.use(authenticate);
router.use(verifyCsrfToken);
router.post('/', createTaskValidator, validate, create);
router.get('/', listTasksValidator, validate, list);
router.get('/:id', taskIdValidator, validate, get);
router.patch('/:id', updateTaskValidator, validate, update);
router.delete('/:id', taskIdValidator, validate, remove);

export default router;
