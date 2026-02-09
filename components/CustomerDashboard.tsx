
import React, { useState, useEffect } from 'react';
import { Session, SessionStatus } from '../types';
import { apiService } from '../services/apiService';
import { Calendar, History, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { Language, translations } from '../translations';

interface CustomerDashboardProps {
  lang: Language;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ lang }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const t = translations[lang];
  
  useEffect(() => {
    const fetch = async () => {
      const data = await apiService.get('/sessions');
      setSessions(data);
    };
    fetch();
  }, []);

  const upcoming = sessions.filter(s => s.status === SessionStatus.SCHEDULED || s.status === SessionStatus.IN_PROGRESS);
  const past = sessions.filter(s => s.status === SessionStatus.COMPLETED || s.status === SessionStatus.CANCELLED);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center text-3xl font-black border border-white/20">
            {lang === 'AR' ? 'ف' : 'F'}
          </div>
          <div className="text-center md:text-start">
            <h2 className="text-4xl font-black mb-1 tracking-tighter">{t.welcome}، فهد</h2>
            <p className="text-indigo-300 font-bold opacity-80 uppercase text-[10px] tracking-widest">
              {upcoming.length} {t.upcoming_sessions}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 px-2">
            <Calendar className="w-5 h-5 text-indigo-600" /> {t.upcoming_sessions}
          </h3>
          
          <div className="space-y-4">
            {upcoming.map(s => (
              <div key={s.id} className="p-6 bg-white rounded-[32px] border border-slate-50 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center font-black">
                    {s.startTime.split(':')[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{s.title}</p>
                    <p className="text-xs text-slate-400 font-bold">{s.date} • {t.role_specialist}: {s.specialistName}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full ${
                  s.status === SessionStatus.IN_PROGRESS ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  { (t as any)[s.status] || s.status }
                </span>
              </div>
            ))}
            {upcoming.length === 0 && (
              <div className="p-12 text-center text-slate-400 bg-white rounded-[32px] border border-dashed">
                <p className="text-sm font-bold uppercase tracking-widest">No upcoming sessions</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm h-fit">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
            <History className="w-5 h-5 text-slate-400" /> {t.session_history}
          </h3>
          <div className="space-y-6">
            {past.slice(0, 5).map(s => (
              <div key={s.id} className={`relative ${lang === 'AR' ? 'pr-6 border-r-2' : 'pl-6 border-l-2'} border-slate-100 last:border-0 pb-1`}>
                <div className={`absolute top-0 ${lang === 'AR' ? '-right-[7px]' : '-left-[7px]'} w-3 h-3 rounded-full bg-slate-200 border-2 border-white`}></div>
                <p className="text-sm font-bold text-slate-700">{s.title}</p>
                <p className="text-[10px] text-slate-400 font-black uppercase">{s.date}</p>
              </div>
            ))}
            {past.length === 0 && (
              <p className="text-xs text-slate-300 italic text-center py-4">No past sessions recorded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
