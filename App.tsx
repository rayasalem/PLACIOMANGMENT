
import React, { useState, useEffect } from 'react';
import { User, UserRole, Session, FinancialStats, FinancialRecord } from './types';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { MarketingAI } from './components/MarketingAI';
import { ManageSubscriptions } from './components/ManageSubscriptions';
import { FinanceDashboard } from './views/admin/FinanceDashboard';
import { ShieldCheck, Command } from 'lucide-react';
import { Language, translations } from './translations';
import { AuthController } from './controllers/AuthController';
import { SessionController } from './controllers/SessionController';
import { FinancialController } from './controllers/FinancialController';
import { apiService } from './services/apiService';

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>('AR');
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tenantUsers, setTenantUsers] = useState<User[]>([]);
  const [financials, setFinancials] = useState<FinancialStats | null>(null);
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);

  const t = translations[lang];

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentUser) {
      // Data fetching via Controllers
      SessionController.fetchSessionsForUser(currentUser).then(setSessions);
      
      if (currentUser.role === UserRole.ADMIN) {
        apiService.getAllUsers().then(users => {
          const companyUsers = users.filter(u => currentUser.companyId === 'GLOBAL' || u.companyId === currentUser.companyId);
          setTenantUsers(companyUsers);
        });
        
        FinancialController.getSummary(currentUser).then(setFinancials);
        FinancialController.getDetailedRecords(currentUser).then(setFinancialRecords);
      }
    }
  }, [currentUser]);

  const onLoginSuccess = (user: User, initialTab: string) => {
    setCurrentUser(user);
    setCurrentTab(AuthController.getInitialTabByRole(user.role));
  };

  const logout = async () => {
    setCurrentUser(null);
    setCurrentTab('dashboard');
    setSessions([]);
    setTenantUsers([]);
    setFinancials(null);
    setFinancialRecords([]);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans">
        <div className="w-20 h-20 bg-indigo-600 rounded-[24px] shadow-2xl flex items-center justify-center mb-8 animate-bounce">
          <Command className="text-white w-10 h-10" />
        </div>
        <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">
          {t.initializing}
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLoginSuccess={onLoginSuccess} />;
  }

  const renderContent = () => {
    switch(currentTab) {
      case 'dashboard':
      case 'sessions':
        return (
          <Dashboard 
            lang={lang} 
            user={currentUser} 
            sessions={sessions} 
            users={tenantUsers}
          />
        );
      case 'finance':
        return (
          <FinanceDashboard 
            lang={lang} 
            financials={financials || undefined} 
            records={financialRecords} 
          />
        );
      case 'marketing':
        return <MarketingAI lang={lang} />;
      case 'subscription':
        return <ManageSubscriptions />;
      default:
        return (
          <div className="py-32 text-center animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-slate-100">
               <ShieldCheck className="w-12 h-12 text-slate-200" />
            </div>
            <h2 className="text-4xl font-black text-slate-200 uppercase tracking-widest">{currentTab} Module</h2>
            <p className="text-slate-400 font-bold mt-2 uppercase text-xs tracking-widest">This feature is currently being deployed to your tenant</p>
          </div>
        );
    }
  };

  return (
    <Layout 
      userRole={currentUser.role} 
      currentTab={currentTab} 
      setTab={setCurrentTab} 
      onLogout={logout}
      lang={lang}
      setLang={setLang}
      userName={currentUser.name}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
