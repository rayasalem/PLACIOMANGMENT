
import { Session, SessionStatus, UserRole } from '../../types';
import { MOCK_SESSIONS } from '../../mockData';
import { usersDB } from './authController';

// Shared in-memory session store
export let sessionsDB: Session[] = [...MOCK_SESSIONS];

/**
 * Validates if a specialist has an overlapping session
 */
export const validateSessionConflict = (
  specialistId: string, 
  date: string, 
  startTime: string, 
  endTime: string, 
  excludeSessionId?: string
): boolean => {
  return sessionsDB.some(s => 
    s.specialistId === specialistId &&
    s.date === date &&
    s.id !== excludeSessionId &&
    s.status !== SessionStatus.CANCELLED &&
    ((startTime >= s.startTime && startTime < s.endTime) ||
     (endTime > s.startTime && endTime <= s.endTime) ||
     (startTime <= s.startTime && endTime >= s.endTime))
  );
};

export const getSessionsByRole = async (req: any, res: any) => {
  const { id: userId, role, companyId } = req.user;

  // 1. Initial filter by company (Multi-tenancy)
  let filtered = (companyId === 'GLOBAL') 
    ? sessionsDB 
    : sessionsDB.filter(s => s.companyId === companyId);

  // 2. Role-based granular filtering
  if (role === UserRole.SPECIALIST || role === UserRole.EMPLOYEE) {
    filtered = filtered.filter(s => s.specialistId === userId);
  } else if (role === UserRole.USER) {
    filtered = filtered.filter(s => s.clientId === userId);
  }
  // ADMIN with 'GLOBAL' sees all. 
  // ADMIN with specific company sees all company sessions.

  res.json(filtered);
};

export const createSession = async (req: any, res: any) => {
  const { title, specialistId, clientId, date, startTime, endTime, price, notes } = req.body;
  const { companyId, role, id: currentUserId } = req.user;

  // RBAC for Session Creation
  if (role === UserRole.USER && clientId !== currentUserId) {
    return res.status(403).json({ message: 'Clients can only create sessions for themselves.' });
  }
  if ((role === UserRole.SPECIALIST || role === UserRole.EMPLOYEE) && specialistId !== currentUserId) {
    return res.status(403).json({ message: 'Specialists can only schedule for themselves.' });
  }

  const hasConflict = validateSessionConflict(specialistId, date, startTime, endTime);
  if (hasConflict) {
    return res.status(409).json({ message: 'Specialist is unavailable at this time slot.' });
  }

  // Resolve names from database for historical consistency
  const clientUser = usersDB.find(u => u.id === clientId);
  const specialistUser = usersDB.find(u => u.id === specialistId);

  const newSession: Session = {
    id: `sess-${Math.random().toString(36).substr(2, 9)}`,
    title: title || 'New Session',
    clientId,
    clientName: clientUser?.name || 'Client',
    specialistId,
    specialistName: specialistUser?.name || 'Specialist',
    employeeId: specialistId, // Map specialistId to employeeId for consistency
    employeeName: specialistUser?.name || 'Specialist',
    companyId: companyId, // Enforced at creation
    date,
    startTime,
    endTime,
    status: SessionStatus.SCHEDULED,
    notes,
    price: price || 0
  };

  sessionsDB.push(newSession);
  res.status(201).json(newSession);
};

export const updateSession = async (req: any, res: any) => {
  const { id } = req.params;
  const { companyId, role, id: userId } = req.user;
  const updates = req.body;

  const index = sessionsDB.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ message: 'Session not found' });

  const session = sessionsDB[index];

  // Multi-tenancy check
  if (companyId !== 'GLOBAL' && session.companyId !== companyId) {
    return res.status(403).json({ message: 'Unauthorized company access' });
  }

  // RBAC for Updates
  if (role === UserRole.USER && session.clientId !== userId) {
    return res.status(403).json({ message: 'Clients can only edit their own sessions.' });
  }
  if ((role === UserRole.SPECIALIST || role === UserRole.EMPLOYEE) && session.specialistId !== userId) {
    return res.status(403).json({ message: 'Specialists can only edit their own assigned sessions.' });
  }

  // Conflict re-validation if time changes
  if (updates.startTime || updates.endTime || updates.date || updates.specialistId) {
    const checkDate = updates.date || session.date;
    const checkStart = updates.startTime || session.startTime;
    const checkEnd = updates.endTime || session.endTime;
    const checkSpec = updates.specialistId || session.specialistId;

    if (validateSessionConflict(checkSpec, checkDate, checkStart, checkEnd, id)) {
      return res.status(409).json({ message: 'Time conflict detected.' });
    }
  }

  sessionsDB[index] = { ...session, ...updates };
  res.json(sessionsDB[index]);
};

export const deleteSession = async (req: any, res: any) => {
  const { id } = req.params;
  const { companyId, role } = req.user;

  // Only admins can delete
  if (role !== UserRole.ADMIN) {
    return res.status(403).json({ message: 'Insufficient permissions to delete sessions.' });
  }

  const index = sessionsDB.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ message: 'Session not found' });
  
  if (companyId !== 'GLOBAL' && sessionsDB[index].companyId !== companyId) {
    return res.status(403).json({ message: 'Unauthorized company access' });
  }

  sessionsDB.splice(index, 1);
  res.json({ message: 'Session successfully deleted.' });
};
