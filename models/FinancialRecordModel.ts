
/**
 * RESPONSIBILITY: 
 * Handles the ledger entries for income, expenses, and profit calculations per tenant.
 */
export interface FinancialRecord {
  id: string;
  companyId: string;
  sessionId?: string;
  description: string;
  income: number;
  expenses: number;
  netProfit: number;
  createdAt: string;
}
