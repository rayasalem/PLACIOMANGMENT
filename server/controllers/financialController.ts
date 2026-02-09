
import { FinancialRecord, UserRole } from '../../types';
import { MOCK_FINANCIAL_RECORDS } from '../../mockData';

export let financialDB: FinancialRecord[] = [...MOCK_FINANCIAL_RECORDS];

const sumIncome = (records: FinancialRecord[]): number => records.reduce((acc, rec) => acc + (rec.income || 0), 0);
const sumExpenses = (records: FinancialRecord[]): number => records.reduce((acc, rec) => acc + (rec.expenses || 0), 0);

export const calculateIncome = async (req: any, res: any) => {
  const { companyId, role } = req.user;
  
  // Strict Enforcement: Non-GLOBAL users cannot see data outside their companyId
  const targetCompany = (companyId === 'GLOBAL') 
    ? (req.query.companyId || null) 
    : companyId;
  
  const records = targetCompany 
    ? financialDB.filter(r => r.companyId === targetCompany)
    : financialDB;

  const totalIncome = sumIncome(records);
  res.json({ totalIncome, currency: 'USD', recordCount: records.length });
};

export const calculateExpenses = async (req: any, res: any) => {
  const { companyId } = req.user;
  const targetCompany = (companyId === 'GLOBAL') 
    ? (req.query.companyId || null) 
    : companyId;
  
  const records = targetCompany 
    ? financialDB.filter(r => r.companyId === targetCompany)
    : financialDB;

  const totalExpenses = sumExpenses(records);
  res.json({ totalExpenses, currency: 'USD', recordCount: records.length });
};

export const generateFinancialReports = async (req: any, res: any) => {
  const { companyId } = req.user;
  const targetCompany = (companyId === 'GLOBAL') 
    ? (req.query.companyId || null) 
    : companyId;
  
  const records = targetCompany 
    ? financialDB.filter(r => r.companyId === targetCompany)
    : financialDB;

  const totalIncome = sumIncome(records);
  const totalExpenses = sumExpenses(records);
  const netProfit = totalIncome - totalExpenses;

  res.json({
    reportMetadata: {
      generatedAt: new Date().toISOString(),
      scope: targetCompany || 'GLOBAL_SYSTEM',
      currency: 'USD'
    },
    summary: {
      totalIncome,
      totalExpenses,
      netProfit,
      margin: totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(2) + '%' : '0%'
    },
    breakdown: records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  });
};
