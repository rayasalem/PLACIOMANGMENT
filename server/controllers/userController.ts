
import { User, UserRole } from '../../types';
import { usersDB } from './authController';
import { sessionsDB as globalSessionsDB } from './sessionController';

export const getUserSessions = async (req: any, res: any) => {
  const userId = req.user.id;
  const role = req.user.role;
  const companyId = req.user.companyId;

  // Filter by company first
  const userSessions = globalSessionsDB.filter(s => 
    (companyId === 'GLOBAL' || s.companyId === companyId) &&
    ((role === UserRole.SPECIALIST || role === UserRole.EMPLOYEE) ? s.specialistId === userId : s.clientId === userId)
  );
  
  res.json(userSessions);
};

export const getUserProfile = async (req: any, res: any) => {
  const userId = req.user.id;
  const user = usersDB.find(u => u.id === userId);
  
  if (!user) return res.status(404).json({ message: 'Profile not found' });

  const { password, ...safeUser } = user;
  res.json(safeUser);
};

export const createUser = async (req: any, res: any) => {
  const { name, email, password, role, companyId, storeName } = req.body;
  const { companyId: adminCompany } = req.user;

  // Multi-tenancy check: Tenant admins can only create users for their own company
  const finalCompanyId = (adminCompany === 'GLOBAL') ? companyId : adminCompany;

  if (usersDB.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const newUser: User = {
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    password: password || 'Placio@2024',
    role,
    companyId: finalCompanyId,
    status: 'active',
    createdAt: new Date().toISOString(),
    storeName: storeName || `${name}'s Workspace`
  };

  usersDB.push(newUser);
  res.status(201).json(newUser);
};

export const updateUser = async (req: any, res: any) => {
  const { id } = req.params;
  const updates = req.body;
  const { companyId: adminCompany } = req.user;

  const index = usersDB.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ message: 'User not found' });
  
  // Ensure same company or global admin
  if (adminCompany !== 'GLOBAL' && usersDB[index].companyId !== adminCompany) {
    return res.status(403).json({ message: 'Unauthorized to modify this user' });
  }

  delete updates.id;
  delete updates.createdAt;
  delete updates.companyId; // Never allow company migration via normal update

  usersDB[index] = { ...usersDB[index], ...updates };
  res.json(usersDB[index]);
};

export const suspendUser = async (req: any, res: any) => {
  const { id } = req.params;
  const { companyId: adminCompany } = req.user;

  const user = usersDB.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  if (adminCompany !== 'GLOBAL' && user.companyId !== adminCompany) {
    return res.status(403).json({ message: 'Unauthorized suspension' });
  }

  user.status = 'suspended';
  res.json({ message: 'Account suspended', user });
};

export const getUsersByCompany = async (req: any, res: any) => {
  const { companyId } = req.params;
  const { companyId: adminCompany } = req.user;
  
  // Validation: If not global admin, can only query own companyId
  if (adminCompany !== 'GLOBAL' && companyId !== adminCompany) {
    return res.status(403).json({ message: 'Access denied to company data' });
  }

  const filteredUsers = usersDB.filter(u => u.companyId === companyId);
  res.json(filteredUsers);
};
