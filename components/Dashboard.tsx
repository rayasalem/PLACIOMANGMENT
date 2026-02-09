
/**
 * RESPONSIBILITY: 
 * Routes the user to the correct View based on their STAFF Role.
 * Enforces strict Admin vs Employee separation.
 */

import React from 'react';
import { User, UserRole } from '../models/User';
import { Session } from '../models/Session';
import { AdminDashboard } from '../views/admin/AdminDashboard';
import { EmployeeDashboard } from '../views/employee/EmployeeDashboard';
import { Language } from '../translations';

interface DashboardProps {
  user: User;
  sessions: Session[];
  users: User[]; 
  lang: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, sessions, users, lang }) => {
  if (user.role === UserRole.ADMIN) {
    return <AdminDashboard sessions={sessions} users={users} currentUser={user} lang={lang} />;
  }

  // Fallback for all other staff types (EMPLOYEE)
  return <EmployeeDashboard user={user} sessions={sessions} lang={lang} />;
};
