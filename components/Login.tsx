
import React, { useState } from 'react';
import { 
  ShieldCheck, Mail, Lock, ArrowRight, Loader2, 
  Zap, Command, Globe, Star
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { User } from '../types';
import { Language, translations } from '../translations';

interface LoginProps {
  onLoginSuccess: (user: User, initialTab: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [lang, setLang] = useState<Language>('AR');
  const t = translations[lang];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { user, initialTab } = await apiService.login(email, password);
      onLoginSuccess(user, initialTab);
    } catch (err: any) {
      setError(err.message || "Identity validation error.");
    } finally {
      setLoading(false);
    }
  };

  const personas = [
    { name: lang === 'AR' ? 'مالك العمل' : 'Business Owner', email: 'admin@placio.com', pass: '123', icon: ShieldCheck, role: 'Admin' },
    { name: lang === 'AR' ? 'موظف أخصائي' : 'Specialist Staff', email: 'ahmed@placio.com', pass: '123', icon: Star, role: 'Employee' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans overflow-hidden relative" dir={lang === 'AR' ? 'rtl' : 'ltr'}>
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-indigo-600/20 blur-[140px] rounded-full"></div>
      
      <div className="hidden lg:flex lg:w-1/3 relative flex-col justify-between p-20 text-white z-10 border-r border-white/5">
         <div className="flex items-center gap-4 mb-20">
            <Command className="w-10 h-10 text-indigo-500 shadow-2xl" />
            <span className="text-2xl font-black tracking-tighter">Placio.os</span>
         </div>
         <h2 className="text-6xl font-black leading-[0.95] tracking-tighter mb-10">The Core of <span className="text-indigo-400">Scale.</span></h2>
         <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Dual-Role Enterprise Node</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 z-20">
         <div className="w-full max-w-lg bg-white/5 backdrop-blur-3xl p-12 rounded-[56px] border border-white/10 shadow-2xl">
            <div className="mb-12 text-center">
               <h1 className="text-4xl font-black text-white tracking-tighter mb-2">{t.welcome}</h1>
               <p className="text-slate-500 text-sm font-medium">Verify your organizational credentials.</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Identity</label>
                  <input 
                    type="email" required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500"
                    placeholder="email@placio.os"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Credential</label>
                  <input 
                    type="password" required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500"
                    placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                  />
               </div>
               {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}
               <button 
                 type="submit" disabled={loading}
                 className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20"
               >
                  {loading ? <Loader2 className="animate-spin" /> : <>Authorize Access <ArrowRight className="w-4 h-4" /></>}
               </button>
            </form>

            <div className="mt-12 grid grid-cols-2 gap-4">
               {personas.map(p => (
                 <button 
                    key={p.email} onClick={() => { setEmail(p.email); setPassword(p.pass); }}
                    className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group text-center"
                 >
                    <p.icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                    <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate">{p.name}</p>
                 </button>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
