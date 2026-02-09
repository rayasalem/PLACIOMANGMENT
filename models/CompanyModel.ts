
/**
 * RESPONSIBILITY: 
 * Handles Company/Tenant data structures and multi-tenancy isolation rules.
 */
import { PlanType } from '../types';

export interface Company {
  id: string;
  name: string;
  plan: PlanType;
  isActive: boolean;
  createdAt: string;
}

export const validateTenantAccess = (targetCompanyId: string, userCompanyId: string): boolean => {
  return userCompanyId === 'GLOBAL' || targetCompanyId === userCompanyId;
};
