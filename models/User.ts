
/**
 * RESPONSIBILITY: 
 * Defines the schema and roles for platform users. 
 * Strictly limited to ADMIN and EMPLOYEE roles.
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  /* Added missing roles used throughout the application */
  SPECIALIST = 'SPECIALIST',
  USER = 'USER'
}

export enum PlanType {
  FREE = 'FREE',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  companyId: string; 
  status: 'active' | 'suspended';
  createdAt: string;
  storeName?: string;
  profileImage?: string;
  /* Added missing properties for subscription and metadata */
  tier?: PlanType;
  strategicGoal?: string;
  bio?: string;
  category?: string;
  location?: string;
}
