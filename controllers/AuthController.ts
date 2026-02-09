
/**
 * RESPONSIBILITY: 
 * Orchestrates user entry, identity verification, and initial routing.
 * Acts as the gatekeeper for system access and role-based landing logic.
 */

import { User, UserRole } from '../models/User';
import { apiService } from '../services/apiService';

export class AuthController {
  static async handleLogin(email: string, pass: string) {
    return await apiService.login(email, pass);
  }

  static getInitialTabByRole(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN: return 'dashboard';
      case UserRole.SPECIALIST: 
      case UserRole.EMPLOYEE: return 'sessions';
      case UserRole.USER: return 'dashboard';
      default: return 'dashboard';
    }
  }
}
