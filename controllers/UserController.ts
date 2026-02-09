
/**
 * RESPONSIBILITY: 
 * Manages the user accounts (Staff and Clients) within a tenant workspace.
 * Handles retrieval, profiling, and lifecycle of tenant-specific user lists.
 */

import { apiService } from '../services/apiService';
import { UserRole } from '../models/User';

export class UserController {
  static async getTenantStaff(companyId: string) {
    const users = await apiService.getAllUsers();
    return users.filter(u => u.companyId === companyId && (u.role === UserRole.SPECIALIST || u.role === UserRole.EMPLOYEE));
  }

  static async getTenantClients(companyId: string) {
    const users = await apiService.getAllUsers();
    return users.filter(u => u.companyId === companyId && u.role === UserRole.USER);
  }
}
