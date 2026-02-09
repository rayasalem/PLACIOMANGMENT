
import { User, Product, AdminLog, UserRole, Session, SessionStatus } from '../../types';
import { usersDB } from './authController';
import { mockProducts } from './productController';
import { MOCK_SESSIONS, FINANCIALS } from '../../mockData';
import { sessionsDB as globalSessionsDB } from './sessionController';

let adminLogs: AdminLog[] = [
  { id: 1, adminId: 'admin-001', action: 'SYSTEM_BOOT', targetType: 'PLATFORM', targetId: 'SYSTEM', details: { msg: 'Demo data loaded successfully' }, createdAt: new Date().toISOString() },
  { id: 2, adminId: 'admin-001', action: 'USER_SUSPENDED', targetType: 'USER', targetId: 'user-003', details: { email: 'nour@artisan.com', reason: 'Identity Verification Required' }, createdAt: new Date().toISOString() }
];

export const getSystemStats = async (req: any, res: any) => {
  const { companyId } = req.user;
  
  const relevantUsers = (companyId === 'GLOBAL') ? usersDB : usersDB.filter(u => u.companyId === companyId);
  const relevantProducts = (companyId === 'GLOBAL') ? mockProducts : mockProducts.filter(p => p.companyId === companyId);
  
  res.json({
    totalUsers: relevantUsers.length,
    activeUsers: relevantUsers.filter(u => u.status === 'active').length,
    totalProducts: relevantProducts.length,
    logs: companyId === 'GLOBAL' ? adminLogs.slice(-10).reverse() : [] // Only platform admins see audit logs
  });
};

export const getAllUsersWithCounts = async (req: any, res: any) => {
  const { companyId } = req.user;
  
  const usersWithCounts = usersDB
    .filter(u => u.role !== UserRole.ADMIN && (companyId === 'GLOBAL' || u.companyId === companyId))
    .map(user => ({
      ...user,
      productCount: mockProducts.filter(p => p.userId === user.id).length,
      sessionCount: globalSessionsDB.filter(s => s.clientId === user.id).length
    }));
  res.json(usersWithCounts);
};

export const getAdminSessions = async (req: any, res: any) => {
  const { companyId } = req.user;
  const sessions = (companyId === 'GLOBAL') ? globalSessionsDB : globalSessionsDB.filter(s => s.companyId === companyId);
  res.json(sessions);
};

export const createAdminSession = async (req: any, res: any) => {
  const { companyId: adminCompany } = req.user;
  
  const newSession: Session = {
    ...req.body,
    id: `sess-${Math.random().toString(36).substr(2, 9)}`,
    companyId: adminCompany !== 'GLOBAL' ? adminCompany : req.body.companyId,
    status: req.body.status || SessionStatus.SCHEDULED
  };
  
  globalSessionsDB.push(newSession);
  res.status(201).json(newSession);
};

export const updateAdminSession = async (req: any, res: any) => {
  const { id } = req.params;
  const { companyId: adminCompany } = req.user;
  
  const index = globalSessionsDB.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ message: 'Session not found' });
  
  if (adminCompany !== 'GLOBAL' && globalSessionsDB[index].companyId !== adminCompany) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  globalSessionsDB[index] = { ...globalSessionsDB[index], ...req.body };
  res.json(globalSessionsDB[index]);
};

export const deleteAdminSession = async (req: any, res: any) => {
  const { id } = req.params;
  const { companyId: adminCompany } = req.user;

  const index = globalSessionsDB.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ message: 'Session not found' });
  
  if (adminCompany !== 'GLOBAL' && globalSessionsDB[index].companyId !== adminCompany) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  globalSessionsDB.splice(index, 1);
  res.json({ message: 'Session deleted' });
};

export const toggleUserStatus = async (req: any, res: any) => {
  const { id } = req.params;
  const { status } = req.body;
  const { companyId: adminCompany } = req.user;
  
  const user = usersDB.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  if (adminCompany !== 'GLOBAL' && user.companyId !== adminCompany) {
    return res.status(403).json({ message: 'Unauthorized company access' });
  }

  user.status = status;
  res.json({ message: `User status changed to ${status}`, user });
};

// Fix: Added missing getAdminFinancials controller method used by adminRoutes
export const getAdminFinancials = async (req: any, res: any) => {
  res.json(FINANCIALS);
};

export const getAdminLogs = async (req: any, res: any) => {
  const { companyId } = req.user;
  if (companyId !== 'GLOBAL') return res.status(403).json({ message: 'Platform logs restricted to GLOBAL admins' });
  res.json(adminLogs);
};
