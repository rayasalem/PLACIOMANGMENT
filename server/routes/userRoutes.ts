
import { Router } from 'express';
import * as userController from '../controllers/userController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../../types';

const router = Router();

// These routes are for personal data access by Specialists and Users
router.use(protect, authorize(UserRole.USER, UserRole.SPECIALIST, UserRole.EMPLOYEE, UserRole.ADMIN));

router.get('/sessions', userController.getUserSessions);
router.get('/profile', userController.getUserProfile);

export default router;
