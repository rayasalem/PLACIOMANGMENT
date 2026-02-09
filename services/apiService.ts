
import { User, UserRole, Session, SessionStatus, PlanType, FinancialRecord, Product, Subscription, SubscriptionStatus, SessionNote, NoteVisibility } from '../types';
import { MOCK_USERS, MOCK_SESSIONS, FINANCIALS, MOCK_FINANCIAL_RECORDS } from '../mockData';

// Mock products to support inventory management components
const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', companyId: 'T-GADGET', userId: 'user-001', name: 'UltraFlow Pro Laptop', description: 'Next-gen silicon chip with 32GB RAM.', price: 1299, category: 'Electronics', image: 'https://picsum.photos/600/400?random=11', status: 'Approved' },
  { id: 'p2', companyId: 'T-GADGET', userId: 'user-001', name: 'SonicBuds v2', description: 'Immersive sound with 50h battery.', price: 199, category: 'Electronics', image: 'https://picsum.photos/600/400?random=12', status: 'Approved' },
  { id: 'p3', companyId: 'T-GADGET', userId: 'user-001', name: 'Nano Tablet Air', description: 'Thinnest tablet on the market.', price: 499, category: 'Electronics', image: 'https://picsum.photos/600/400?random=13', status: 'Pending' }
];

class ApiService {
  private users: User[] = [...MOCK_USERS];
  private sessions: Session[] = [...MOCK_SESSIONS];
  private financialRecords: FinancialRecord[] = [...MOCK_FINANCIAL_RECORDS];
  private products: Product[] = [...MOCK_PRODUCTS];
  private sessionNotes: SessionNote[] = [];
  private subscription: Subscription = {
    id: 'sub-1',
    planType: PlanType.MONTHLY,
    endDate: '2024-12-31',
    price: 29,
    status: SubscriptionStatus.ACTIVE
  };

  constructor() {
    // Basic session persistence simulation
    const savedSessions = localStorage.getItem('placio_sessions');
    if (savedSessions) {
      this.sessions = JSON.parse(savedSessions);
    }
    const savedProducts = localStorage.getItem('placio_products');
    if (savedProducts) {
      this.products = JSON.parse(savedProducts);
    }
    const savedNotes = localStorage.getItem('placio_notes');
    if (savedNotes) {
      this.sessionNotes = JSON.parse(savedNotes);
    }
  }

  private saveState() {
    localStorage.setItem('placio_sessions', JSON.stringify(this.sessions));
    localStorage.setItem('placio_products', JSON.stringify(this.products));
    localStorage.setItem('placio_notes', JSON.stringify(this.sessionNotes));
  }

  /**
   * Prevents overlapping sessions for specialists
   */
  private checkSessionConflict(specialistId: string, date: string, startTime: string, endTime: string, excludeId?: string): boolean {
    return this.sessions.some(s => 
      s.specialistId === specialistId && 
      s.date === date && 
      s.id !== excludeId &&
      // Fix: Use SessionStatus.CANCELLED correctly
      s.status !== SessionStatus.CANCELLED &&
      ((startTime >= s.startTime && startTime < s.endTime) ||
       (endTime > s.startTime && endTime <= s.endTime) ||
       (startTime <= s.startTime && endTime >= s.endTime))
    );
  }

  // Fix: Added generic GET method to resolve errors in CustomerDashboard and ManageSubscriptions
  async get(path: string): Promise<any> {
    if (path === '/sessions') return this.sessions;
    if (path === '/subscription') return this.subscription;
    if (path === '/financials') return FINANCIALS;
    if (path === '/products') return this.products;
    throw new Error(`GET path ${path} not implemented in mock service`);
  }

  // Fix: Added generic PATCH method to resolve errors in AdminUsers and AdminProducts
  async patch(path: string, data: any): Promise<any> {
    if (path.startsWith('/admin/users/') && path.endsWith('/status')) {
      const id = path.split('/')[3];
      const index = this.users.findIndex(u => u.id === id);
      if (index !== -1) {
        this.users[index] = { ...this.users[index], status: data.status };
        return this.users[index];
      }
    }
    if (path.startsWith('/products/') && path.endsWith('/status')) {
      const id = path.split('/')[2];
      const index = this.products.findIndex(p => p.id === id);
      if (index !== -1) {
        this.products[index] = { ...this.products[index], status: data.status };
        this.saveState();
        return this.products[index];
      }
    }
    throw new Error(`PATCH path ${path} not implemented in mock service`);
  }

  // Fix: Added generic DELETE method to resolve error in AdminProducts
  async delete(path: string): Promise<any> {
    if (path.startsWith('/products/')) {
      const id = path.split('/')[2];
      this.products = this.products.filter(p => p.id !== id);
      this.saveState();
      return { message: 'Deleted' };
    }
    throw new Error(`DELETE path ${path} not implemented in mock service`);
  }

  async login(email: string, password: string): Promise<{ user: User, initialTab: string }> {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid email or password");
    
    let initialTab = 'dashboard';
    // Fix: Use UserRole.SPECIALIST and UserRole.EMPLOYEE
    if (user.role === UserRole.SPECIALIST || user.role === UserRole.EMPLOYEE) initialTab = 'sessions';
    
    return { user, initialTab };
  }

  async register(data: { name: string, email: string, password: string, storeName: string }): Promise<{ user: User, initialTab: string }> {
    const existing = this.users.find(u => u.email === data.email);
    if (existing) throw new Error("Email already registered");

    const newUser: User = {
      id: `user-${Math.random().toString(36).substr(2, 5)}`,
      companyId: `T-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      // Fix: Use UserRole.USER
      role: UserRole.USER,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      storeName: data.storeName,
      tier: PlanType.FREE,
      strategicGoal: 'Define your first strategic objective'
    };

    this.users.push(newUser);
    return { user: newUser, initialTab: 'dashboard' };
  }

  async logout(): Promise<void> {
    return Promise.resolve();
  }

  async getSessions(user: User): Promise<Session[]> {
    const tenantSessions = this.sessions.filter(s => s.companyId === user.companyId || user.companyId === 'GLOBAL');
    if (user.role === UserRole.ADMIN) return tenantSessions;
    // Fix: Use UserRole.SPECIALIST and UserRole.EMPLOYEE
    if (user.role === UserRole.SPECIALIST || user.role === UserRole.EMPLOYEE) return tenantSessions.filter(s => s.specialistId === user.id);
    return tenantSessions.filter(s => s.clientId === user.id);
  }

  // Fix: Added userId argument to match controller usage and enforced employee isolation logic
  async updateSessionStatus(sessionId: string, status: SessionStatus, userId: string): Promise<Session> {
    const index = this.sessions.findIndex(s => s.id === sessionId);
    if (index === -1) throw new Error("Session not found");
    
    const session = this.sessions[index];
    const user = this.users.find(u => u.id === userId);

    if (user?.role === UserRole.EMPLOYEE && session.employeeId !== userId) {
      throw new Error("Access Denied: You are not assigned to this session.");
    }

    this.sessions[index] = { ...this.sessions[index], status };
    this.saveState();
    return this.sessions[index];
  }

  // Fix: Added creator argument to match controller signature
  async createSession(sessionData: Partial<Session>, creator: User): Promise<Session> {
    if (sessionData.specialistId && sessionData.date && sessionData.startTime && sessionData.endTime) {
      const conflict = this.checkSessionConflict(
        sessionData.specialistId, 
        sessionData.date, 
        sessionData.startTime, 
        sessionData.endTime
      );
      if (conflict) throw new Error("Time conflict: Specialist already has a session in this slot.");
    }

    const newSession: Session = {
      id: `sess-${Math.random().toString(36).substr(2, 9)}`,
      title: sessionData.title || 'Untitled Consultation',
      clientId: sessionData.clientId || '',
      clientName: sessionData.clientName || 'Private Client',
      employeeId: sessionData.employeeId || '',
      employeeName: sessionData.employeeName || 'Unassigned',
      // Fix: sessionData properties
      specialistId: sessionData.specialistId || '',
      specialistName: sessionData.specialistName || 'Unassigned',
      companyId: creator.companyId || '',
      date: sessionData.date || new Date().toISOString().split('T')[0],
      startTime: sessionData.startTime || '09:00',
      endTime: sessionData.endTime || '10:00',
      status: SessionStatus.SCHEDULED,
      tags: sessionData.tags || []
    };

    this.sessions.push(newSession);
    this.saveState();
    return newSession;
  }

  // --- Session Notes Support ---

  // Fix: getNotes now expects userRole
  async getNotes(sessionId: string, userRole: UserRole): Promise<SessionNote[]> {
    if (userRole === UserRole.USER) return []; // Notes are private to Specialist/Admin
    return this.sessionNotes.filter(n => n.sessionId === sessionId);
  }

  async addNote(note: SessionNote): Promise<SessionNote> {
    this.sessionNotes.push(note);
    this.saveState();
    return note;
  }

  async getFinancials() {
    return FINANCIALS;
  }

  async getFinancialRecords(user: User): Promise<FinancialRecord[]> {
    if (user.companyId === 'GLOBAL') return this.financialRecords;
    return this.financialRecords.filter(r => r.companyId === user.companyId);
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }
}

export const apiService = new ApiService();
