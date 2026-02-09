
import { Router } from 'express';
import * as sessionController from '../controllers/sessionController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', sessionController.getSessionsByRole);
router.post('/', sessionController.createSession);
router.put('/:id', sessionController.updateSession);
router.delete('/:id', sessionController.deleteSession);

export default router;
