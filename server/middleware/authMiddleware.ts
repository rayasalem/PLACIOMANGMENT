
import { UserRole } from '../../types';

export const protect = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Token structure: access_token_for_[userId]_role_[role]_company_[companyId]
    const payloadParts = token.split('_');
    const userId = payloadParts[3]; 
    const role = payloadParts[5] as UserRole;
    const companyId = payloadParts[7];
    
    req.user = {
      id: userId,
      role: role,
      companyId: companyId
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: Access restricted to [${roles.join(', ')}]` 
      });
    }
    next();
  };
};
