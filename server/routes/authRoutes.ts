
import { Router } from 'express';
import * as authController from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', protect, authController.logout); // Logout requires a valid token to identify session
router.post('/refresh', authController.refresh);

export default router;
