
import { User, UserRole } from '../../types';

export const usersDB: User[] = [
  { 
    id: 'admin-1', 
    companyId: 'GLOBAL', 
    name: 'فيصل المدير العام', 
    email: 'admin@placio.com',
    password: '123',
    role: UserRole.ADMIN, 
    status: 'active', 
    createdAt: '2024-01-01'
  },
  {
    id: 'emp-1',
    companyId: 'T-GADGET',
    name: 'أحمد خالد',
    email: 'ahmed@placio.com',
    password: '123',
    role: UserRole.EMPLOYEE,
    status: 'active',
    createdAt: '2024-02-10'
  }
];

export const redirectByRole = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'dashboard';
    case UserRole.EMPLOYEE:
      return 'sessions';
    default:
      return 'dashboard';
  }
};

const generateTokens = (user: User) => {
  return {
    accessToken: `access_token_for_${user.id}_role_${user.role}_company_${user.companyId}`,
    refreshToken: `refresh_token_for_${user.id}`
  };
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;
  const user = usersDB.find(u => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
  }

  const initialTab = redirectByRole(user.role);

  res.json({ 
    user, 
    initialTab,
    ...generateTokens(user) 
  });
};

export const logout = async (req: any, res: any) => {
  res.json({ message: 'Logged out successfully' });
};

export const register = async (req: any, res: any) => {
  const { name, email, password } = req.body;
  if (usersDB.find(u => u.email === email)) return res.status(400).json({ message: 'User already exists' });

  const newCompanyId = `T-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  const newUser: User = {
    id: `user-${Math.random().toString(36).substr(2, 5)}`,
    companyId: newCompanyId,
    name,
    email,
    password,
    role: UserRole.EMPLOYEE, // Default new reg to employee
    status: 'active',
    createdAt: new Date().toISOString()
  };

  usersDB.push(newUser);
  res.status(201).json({ 
    user: newUser, 
    initialTab: redirectByRole(newUser.role),
    ...generateTokens(newUser) 
  });
};

export const refresh = async (req: any, res: any) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });
  const userId = refreshToken.split('_for_')[1];
  const user = usersDB.find(u => u.id === userId);
  if (!user) return res.status(403).json({ message: 'Invalid refresh token' });
  res.json({ ...generateTokens(user) });
};
