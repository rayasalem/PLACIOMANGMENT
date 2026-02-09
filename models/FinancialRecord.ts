
/**
 * RESPONSIBILITY: 
 * Defines financial ledger entries.
 * Handles income, expenses, and net profit tracking for specific tenants.
 */

/* Added Product interface used in MarketingAI and PublicStore */
export interface Product {
  id: string;
  companyId: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  status: 'Approved' | 'Pending';
  views?: number;
  sales?: number;
  createdAt?: string;
}

/* Added Subscription related types used in ManageSubscriptions */
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export interface Subscription {
  id: string;
  planType: any; // Refers to PlanType
  endDate: string;
  price: number;
  status: SubscriptionStatus;
}

/* Added AdminLog interface used in Admin Controllers for system auditing */
export interface AdminLog {
  id: number | string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details: any;
  createdAt: string;
}

export interface FinancialRecord {
  id: string;
  sessionId?: string;
  income: number;
  expenses: number;
  netProfit: number;
  companyId: string;
  createdAt: string;
  description?: string;
}

export interface FinancialStats {
  revenue: number;
  expenses: number;
  profit: number;
  growth: string;
  productivityIndex: number;
}
