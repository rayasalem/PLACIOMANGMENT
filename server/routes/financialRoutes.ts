
import { Router } from 'express';
import * as financialController from '../controllers/financialController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../../types';

const router = Router();

// Financial data is highly sensitive - strictly protect and authorize
router.use(protect);

// Basic stats available to all authenticated users (filtered by companyId automatically)
router.get('/income', financialController.calculateIncome);
router.get('/expenses', financialController.calculateExpenses);

// Detailed reports are restricted to Admins or Merchant Owners (who have specific roles)
router.get('/report', authorize(UserRole.ADMIN, UserRole.USER), financialController.generateFinancialReports);

export default router;
