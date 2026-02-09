
import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import * as userController from '../controllers/userController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../../types';

const router = Router();

// Apply global protection and admin authorization
router.use(protect, authorize(UserRole.ADMIN));

// Platform Overview Stats
router.get('/stats', adminController.getSystemStats);

// Merchant & Staff Management (UserController Integration)
router.get('/users/company/:companyId', userController.getUsersByCompany);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.patch('/users/:id/suspend', userController.suspendUser);

// Legacy/Compatibility User Management
router.get('/clients', adminController.getAllUsersWithCounts);
router.patch('/users/:id/status', adminController.toggleUserStatus);

// Session Lifecycle Management
router.get('/sessions', adminController.getAdminSessions);
router.post('/sessions', adminController.createAdminSession);
router.put('/sessions/:id', adminController.updateAdminSession);
router.delete('/sessions/:id', adminController.deleteAdminSession);

// Financial Data Auditing
router.get('/financials', adminController.getAdminFinancials);

// System Audit Logs
router.get('/logs', adminController.getAdminLogs);

export default router;
