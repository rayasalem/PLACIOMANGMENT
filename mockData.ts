
import { User, UserRole, Session, SessionStatus } from './types';

/**
 * MOCK EMPLOYEES
 * Defined with specific IDs, Roles, and Company associations.
 */
export const MOCK_USERS: User[] = [
  { 
    id: 'admin-1', 
    name: 'فيصل المدير العام', 
    email: 'admin@placio.com', 
    password: '123',
    role: UserRole.ADMIN, 
    status: 'active', 
    createdAt: '2024-01-01',
    companyId: 'GLOBAL'
  },
  { 
    id: 'emp-1', 
    name: 'أحمد خالد', 
    email: 'ahmed@placio.com', 
    role: UserRole.EMPLOYEE, 
    companyId: 'T-GADGET', 
    status: 'active', 
    createdAt: '2024-02-15'
  },
  { 
    id: 'emp-2', 
    name: 'سارة العبدالله', 
    email: 'sara@placio.com', 
    role: UserRole.EMPLOYEE, 
    companyId: 'T-GADGET', 
    status: 'active', 
    createdAt: '2024-03-01'
  },
  { 
    id: 'emp-3', 
    name: 'فيصل الناصر', 
    email: 'faisal@placio.com', 
    role: UserRole.EMPLOYEE, 
    companyId: 'T-GADGET', 
    status: 'active', 
    createdAt: '2024-04-10'
  }
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

/**
 * MOCK SESSIONS
 * Distributed to create performance personas:
 * - Ahmad (High Volume, High Completion)
 * - Sara (Medium Volume, Steady Completion)
 * - Faisal (High Volume, Low Completion / Backlog)
 */
export const MOCK_SESSIONS: Session[] = [
  // --- AHMAD KHALID (The Star Performer) ---
  { 
    id: 'sess-ahmad-1', title: 'Q3 Strategy Analysis', 
    clientId: 'c-101', clientName: 'Fahad Al-Qahtani', 
    employeeId: 'emp-1', employeeName: 'أحمد خالد', 
    specialistId: 'emp-1', specialistName: 'أحمد خالد',
    companyId: 'T-GADGET', date: today, startTime: '09:00', endTime: '10:00', 
    status: SessionStatus.COMPLETED, price: 500, completedAt: today + 'T10:05:00Z'
  },
  { 
    id: 'sess-ahmad-2', title: 'Infrastructure Review', 
    clientId: 'c-102', clientName: 'Noura Al-Saif', 
    employeeId: 'emp-1', employeeName: 'أحمد خالد', 
    specialistId: 'emp-1', specialistName: 'أحمد خالد',
    companyId: 'T-GADGET', date: today, startTime: '11:00', endTime: '12:30', 
    status: SessionStatus.IN_PROGRESS, price: 750
  },
  { 
    id: 'sess-ahmad-3', title: 'Cloud Resource Planning', 
    clientId: 'c-105', clientName: 'Sultan Bin Fahad', 
    employeeId: 'emp-1', employeeName: 'أحمد خالد', 
    specialistId: 'emp-1', specialistName: 'أحمد خالد',
    companyId: 'T-GADGET', date: yesterday, startTime: '10:00', endTime: '11:30', 
    status: SessionStatus.COMPLETED, price: 1200, completedAt: yesterday + 'T11:45:00Z'
  },
  { 
    id: 'sess-ahmad-4', title: 'Financial System Audit', 
    clientId: 'c-108', clientName: 'Al-Nama Bank', 
    employeeId: 'emp-1', employeeName: 'أحمد خالد', 
    specialistId: 'emp-1', specialistName: 'أحمد خالد',
    companyId: 'T-GADGET', date: twoDaysAgo, startTime: '14:00', endTime: '16:00', 
    status: SessionStatus.COMPLETED, price: 3200, completedAt: twoDaysAgo + 'T16:15:00Z'
  },

  // --- SARA AL-ABDULLAH (Reliable Output) ---
  { 
    id: 'sess-sara-1', title: 'Technical Training Session', 
    clientId: 'c-103', clientName: 'Bandar Al-Shammari', 
    employeeId: 'emp-2', employeeName: 'سارة العبدالله', 
    specialistId: 'emp-2', specialistName: 'سارة العبدالله',
    companyId: 'T-GADGET', date: today, startTime: '14:00', endTime: '15:00', 
    status: SessionStatus.SCHEDULED, price: 300
  },
  { 
    id: 'sess-sara-2', title: 'Emergency Tech Support', 
    clientId: 'c-106', clientName: 'Advanced Tech Co', 
    employeeId: 'emp-2', employeeName: 'سارة العبدالله', 
    specialistId: 'emp-2', specialistName: 'سارة العبدالله',
    companyId: 'T-GADGET', date: yesterday, startTime: '13:00', endTime: '14:00', 
    status: SessionStatus.COMPLETED, price: 450, completedAt: yesterday + 'T14:10:00Z'
  },
  { 
    id: 'sess-sara-3', title: 'UI UX Development Sprint', 
    clientId: 'c-109', clientName: 'Salla Store', 
    employeeId: 'emp-2', employeeName: 'سارة العبدالله', 
    specialistId: 'emp-2', specialistName: 'سارة العبدالله',
    companyId: 'T-GADGET', date: twoDaysAgo, startTime: '10:00', endTime: '11:00', 
    status: SessionStatus.COMPLETED, price: 600, completedAt: twoDaysAgo + 'T11:05:00Z'
  },

  // --- FAISAL AL-NASSER (The Bottleneck Persona) ---
  { 
    id: 'sess-faisal-1', title: 'Cyber Security Consultation', 
    clientId: 'c-104', clientName: 'Layla Al-Harbi', 
    employeeId: 'emp-3', employeeName: 'فيصل الناصر', 
    specialistId: 'emp-3', specialistName: 'فيصل الناصر',
    companyId: 'T-GADGET', date: today, startTime: '16:00', endTime: '17:00', 
    status: SessionStatus.SCHEDULED, price: 900
  },
  { 
    id: 'sess-faisal-2', title: 'Data Engineering Workshop', 
    clientId: 'c-107', clientName: 'Riyadh University', 
    employeeId: 'emp-3', employeeName: 'فيصل الناصر', 
    specialistId: 'emp-3', specialistName: 'فيصل الناصر',
    companyId: 'T-GADGET', date: yesterday, startTime: '09:00', endTime: '12:00', 
    status: SessionStatus.COMPLETED, price: 2500, completedAt: yesterday + 'T12:30:00Z'
  },
  { 
    id: 'sess-faisal-3', title: 'Information Security Audit', 
    clientId: 'c-110', clientName: 'Ministry of ICT', 
    employeeId: 'emp-3', employeeName: 'فيصل الناصر', 
    specialistId: 'emp-3', specialistName: 'فيصل الناصر',
    companyId: 'T-GADGET', date: today, startTime: '10:00', endTime: '12:00', 
    status: SessionStatus.SCHEDULED, price: 1500
  },
  { 
    id: 'sess-faisal-4', title: 'Network Protocol Update', 
    clientId: 'c-111', clientName: 'Jeddah Airports', 
    employeeId: 'emp-3', employeeName: 'فيصل الناصر', 
    specialistId: 'emp-3', specialistName: 'فيصل الناصر',
    companyId: 'T-GADGET', date: today, startTime: '13:00', endTime: '14:30', 
    status: SessionStatus.SCHEDULED, price: 1100
  },
  { 
    id: 'sess-faisal-5', title: 'System Hardening Phase 1', 
    clientId: 'c-112', clientName: 'STC Pay', 
    employeeId: 'emp-3', employeeName: 'فيصل الناصر', 
    specialistId: 'emp-3', specialistName: 'فيصل الناصر',
    companyId: 'T-GADGET', date: today, startTime: '17:30', endTime: '19:00', 
    status: SessionStatus.SCHEDULED, price: 800
  }
];

export const FINANCIALS = {
  revenue: 342150,
  expenses: 74200,
  profit: 267950,
  growth: '+28.5%',
  productivityIndex: 94.2
};

export const MOCK_FINANCIAL_RECORDS = [
  { id: 'fin-1', income: 3200, expenses: 150, netProfit: 3050, companyId: 'T-GADGET', createdAt: twoDaysAgo + 'T16:30:00Z', description: 'Settlement: Financial System Audit' },
  { id: 'fin-2', income: 2500, expenses: 400, netProfit: 2100, companyId: 'T-GADGET', createdAt: yesterday + 'T12:30:00Z', description: 'Settlement: Data Engineering Workshop' },
  { id: 'fin-3', income: 1200, expenses: 50, netProfit: 1150, companyId: 'T-GADGET', createdAt: yesterday + 'T11:45:00Z', description: 'Settlement: Cloud Resource Planning' },
  { id: 'fin-4', income: 500, expenses: 20, netProfit: 480, companyId: 'T-GADGET', createdAt: today + 'T10:15:00Z', description: 'Settlement: Q3 Strategy Analysis' }
];
