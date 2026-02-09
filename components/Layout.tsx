
import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, Users, Calendar, BarChart3, 
  Settings, LogOut, Command, Menu, X
} from 'lucide-react';
import { Language, translations } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  currentTab: string;
  setTab: (tab: string) => void;
  onLogout: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  userName: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, userRole, currentTab, setTab, onLogout, 
  lang, setLang, userName
}) => {
  const t = translations[lang];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard, roles: [UserRole.ADMIN] },
    { id: 'sessions', label: t.sessions, icon: Calendar, roles: [UserRole.ADMIN, UserRole.EMPLOYEE] },
    { id: 'finance', label: t.finance, icon: BarChart3, roles: [UserRole.ADMIN] },
    { id: 'staff', label: t.staff, icon: Users, roles: [UserRole.ADMIN] },
    { id: 'settings', label: t.settings, icon: Settings, roles: [UserRole.ADMIN, UserRole.EMPLOYEE] },
  ].filter(item => item.roles.includes(userRole));

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir={lang === 'AR' ? 'rtl' : 'ltr'}>
      <aside className="w-72 bg-slate-900 hidden lg:flex flex-col fixed inset-y-0 z-50">
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Command className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tighter">Placio<span className="text-indigo-400">.os</span></h1>
          </div>
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                  currentTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-8 border-t border-slate-800">
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all">
              <LogOut className="w-5 h-5" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ms-72 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500"><Menu /></button>
             <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{currentTab}</h2>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setLang(lang === 'AR' ? 'EN' : 'AR')} className="text-xs font-black text-slate-500 hover:text-indigo-600 uppercase tracking-widest">{t.language}</button>
            <div className="flex items-center gap-3 border-l border-slate-200 ps-6">
              <div className="text-right">
                <p className="text-xs font-black text-slate-900 leading-none">{userName}</p>
                <p className="text-[9px] text-indigo-500 font-black uppercase mt-1 tracking-widest">{userRole}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">{userName[0]}</div>
            </div>
          </div>
        </header>
        <div className="p-10 animate-slide-up max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
