
import { User, UserRole, Session, SessionStatus, SessionNote, FinancialRecord } from './types';
import { MOCK_USERS, MOCK_SESSIONS, MOCK_FINANCIAL_RECORDS } from './mockData';

class ApiService {
  private users: User[] = [...MOCK_USERS];
  private sessions: Session[] = [...MOCK_SESSIONS];
  private financialRecords: FinancialRecord[] = [...MOCK_FINANCIAL_RECORDS];
  private sessionNotes: SessionNote[] = [];

  constructor() {
    const savedSessions = localStorage.getItem('placio_sessions');
    if (savedSessions) this.sessions = JSON.parse(savedSessions);
    const savedNotes = localStorage.getItem('placio_notes');
    if (savedNotes) this.sessionNotes = JSON.parse(savedNotes);
    const savedFinance = localStorage.getItem('placio_finance');
    if (savedFinance) this.financialRecords = JSON.parse(savedFinance);
  }

  private saveState() {
    localStorage.setItem('placio_sessions', JSON.stringify(this.sessions));
    localStorage.setItem('placio_notes', JSON.stringify(this.sessionNotes));
    localStorage.setItem('placio_finance', JSON.stringify(this.financialRecords));
  }

  public checkSessionConflict(employeeId: string, date: string, startTime: string, endTime: string, excludeId?: string): boolean {
    return this.sessions.some(s => 
      s.employeeId === employeeId && 
      s.date === date && 
      s.id !== excludeId &&
      s.status !== SessionStatus.CANCELLED &&
      ((startTime >= s.startTime && startTime < s.endTime) ||
       (endTime > s.startTime && endTime <= s.endTime) ||
       (startTime <= s.startTime && endTime >= s.endTime))
    );
  }

  async login(email: string, password: string): Promise<{ user: User, initialTab: string }> {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error("Credentials Invalid");
    const initialTab = user.role === UserRole.ADMIN ? 'dashboard' : 'sessions';
    return { user, initialTab };
  }

  async getSessions(user: User): Promise<Session[]> {
    let filtered = this.sessions.filter(s => user.companyId === 'GLOBAL' || s.companyId === user.companyId);
    if (user.role === UserRole.EMPLOYEE) {
      filtered = filtered.filter(s => s.employeeId === user.id);
    }
    return filtered;
  }

  async createSession(sessionData: Partial<Session>): Promise<Session> {
    const newSession: Session = {
      id: `sess-${Math.random().toString(36).substr(2, 9)}`,
      title: sessionData.title || 'Standard Operation',
      clientId: sessionData.clientId || '',
      clientName: sessionData.clientName || 'Private Client',
      employeeId: sessionData.employeeId || '',
      employeeName: sessionData.employeeName || 'Assigned Staff',
      specialistId: sessionData.employeeId || '',
      specialistName: sessionData.employeeName || 'Assigned Staff',
      companyId: sessionData.companyId || 'GLOBAL',
      date: sessionData.date || '',
      startTime: sessionData.startTime || '',
      endTime: sessionData.endTime || '',
      status: SessionStatus.SCHEDULED,
      price: sessionData.price || 0,
      ...sessionData
    } as Session;

    this.sessions.push(newSession);
    this.saveState();
    return newSession;
  }

  async updateSessionStatus(sessionId: string, status: SessionStatus, userId: string): Promise<Session> {
    const idx = this.sessions.findIndex(s => s.id === sessionId);
    if (idx === -1) throw new Error("Session Lost");
    
    const session = this.sessions[idx];
    this.sessions[idx] = { ...session, status };
    this.saveState();
    return this.sessions[idx];
  }

  async getFinancialRecords(user: User): Promise<FinancialRecord[]> {
    if (user.companyId === 'GLOBAL') return this.financialRecords;
    return this.financialRecords.filter(r => r.companyId === user.companyId);
  }

  async addFinancialRecord(record: FinancialRecord): Promise<FinancialRecord> {
    this.financialRecords.push(record);
    this.saveState();
    return record;
  }

  async getNotes(sessionId: string, userRole: any): Promise<SessionNote[]> {
    return this.sessionNotes.filter(n => n.sessionId === sessionId);
  }

  async addNote(note: SessionNote): Promise<SessionNote> {
    this.sessionNotes.push(note);
    this.saveState();
    return note;
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }
}

export const apiService = new ApiService();
