import { Router } from 'express';
import { getTasks, createTask, getTaskById, updateTask, deleteTask, toggleTask } from '../controllers/taskController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTask);

export default router;
