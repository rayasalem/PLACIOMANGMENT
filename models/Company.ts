
/**
 * RESPONSIBILITY: 
 * Defines the organizational structure for tenants (Merchants/Companies).
 * Handles multi-tenancy isolation markers and subscription plan definitions.
 */

import { PlanType } from './User';

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
