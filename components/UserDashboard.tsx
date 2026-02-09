
import React, { useState } from 'react';
import { Session, SessionStatus, User } from '../types';
import { Language, translations } from '../translations';
import { 
  Calendar, Clock, ChevronRight, 
  Sparkles, ShieldCheck,
  Video, User as UserIcon, Target, 
  Lightbulb, Zap, Plus, ArrowRight, ArrowUpRight, BarChart
} from 'lucide-react';

interface UserDashboardProps {
  lang: Language;
  user: User;
  sessions: Session[];
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ lang, user, sessions }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingSessions = sessions.filter(s => 
    s.status === SessionStatus.SCHEDULED || s.status === SessionStatus.IN_PROGRESS
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastSessions = sessions.filter(s => 
    s.status === SessionStatus.COMPLETED || s.status === SessionStatus.CANCELLED
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextSession = upcomingSessions[0];

  return (
    <div className="space-y-12 animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
             <span className="badge badge-info !px-3 !py-1">
               {user.tier || 'Enterprise'} Access
             </span>
             <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
             <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
               <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Operational Core Active
             </p>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
            {t.welcome}, <span className="text-indigo-600">{user.name.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg">Harnessing the Placio ecosystem for {user.storeName}.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Calendar className="w-4 h-4" /> Book Expert
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4" /> New Strategic Pulse
          </button>
        </div>
      </div>

      {/* Strategic Goal Banner - Client Centric Customization */}
      <div className="premium-card bg-indigo-600 text-white border-none p-10 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 space-y-4 max-w-2xl">
           <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-indigo-300" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-200">Current Strategic Objective</p>
           </div>
           <h3 className="text-3xl font-black tracking-tight leading-snug">
              {user.strategicGoal || 'Set your primary strategic objective to receive AI-tailored insights.'}
           </h3>
        </div>
        <div className="relative z-10 text-center md:text-right space-y-2">
           <p className="text-5xl font-black tracking-tighter">64%</p>
           <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Execution Progress</p>
           <div className="w-32 h-1.5 bg-white/20 rounded-full mt-4 overflow-hidden">
              <div className="w-[64%] h-full bg-white rounded-full"></div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          {nextSession ? (
            <div className="relative group rounded-[48px] overflow-hidden bg-slate-900/90 text-white p-12 shadow-2xl backdrop-blur-2xl border border-white/10">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="space-y-8 flex-1">
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">
                    <Zap className="w-4 h-4 animate-pulse" /> Immediate Focus Area
                  </div>
                  <h3 className="text-4xl font-black tracking-tight leading-[1.1] text-white">
                    {nextSession.title}
                  </h3>
                  <div className="flex flex-wrap gap-10 text-slate-400 font-black text-[10px] uppercase tracking-[0.15em]">
                    <div className="flex items-center gap-3"><Calendar className="w-4.5 h-4.5 text-indigo-400" /> {nextSession.date}</div>
                    <div className="flex items-center gap-3"><Clock className="w-4.5 h-4.5 text-indigo-400" /> {nextSession.startTime}</div>
                    <div className="flex items-center gap-3"><UserIcon className="w-4.5 h-4.5 text-indigo-400" /> Expert: {nextSession.specialistName}</div>
                  </div>
                </div>
                
                <div className="w-full md:w-auto">
                  <button className="btn-primary w-full md:w-auto !py-6 !px-12 !bg-indigo-600/90 hover:!bg-indigo-500">
                    {nextSession.status === SessionStatus.IN_PROGRESS ? (
                      <><Video className="w-5 h-5" /> Launch Interface</>
                    ) : (
                      <><ArrowUpRight className="w-5 h-5" /> Detailed View</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="premium-card bg-white/30 border-dashed !p-20 text-center flex flex-col items-center gap-6 backdrop-blur-lg">
               <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100"><Calendar className="w-10 h-10 text-slate-200" /></div>
               <h4 className="text-2xl font-black text-slate-900">Ecosystem Cycle Clear</h4>
               <button className="btn-primary">Initialize Interaction</button>
            </div>
          )}

          <div className="space-y-8">
            <div className="flex items-center gap-10 border-b border-white pb-px px-2">
              <button onClick={() => setActiveTab('upcoming')} className={`pb-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'upcoming' ? 'text-slate-900' : 'text-slate-400'}`}>
                Scheduled Pulse <span className="ms-2 opacity-30 text-[8px]">{upcomingSessions.length}</span>
                {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
              </button>
              <button onClick={() => setActiveTab('past')} className={`pb-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'past' ? 'text-slate-900' : 'text-slate-400'}`}>
                Archived Milestones <span className="ms-2 opacity-30 text-[8px]">{pastSessions.length}</span>
                {activeTab === 'past' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
              </button>
            </div>

            <div className="space-y-5">
              {(activeTab === 'upcoming' ? upcomingSessions : pastSessions).map(s => (
                <div key={s.id} className="premium-card !p-8 flex flex-col md:flex-row justify-between items-center gap-8 group">
                  <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50/60 border border-indigo-100/50 flex flex-col items-center justify-center font-black transition-all group-hover:scale-110">
                      <span className="text-[9px] uppercase opacity-40 mb-1.5">{s.date.split('-')[1]}</span>
                      <span className="text-2xl text-indigo-600 leading-none">{s.date.split('-')[2]}</span>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-xl group-hover:text-indigo-600 transition-colors tracking-tight">{s.title}</h4>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5 flex items-center gap-2">
                        <BarChart className="w-3.5 h-3.5 text-indigo-400" /> Focus: {s.tags?.join(', ') || 'General Business'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`badge ${s.status === SessionStatus.COMPLETED ? 'badge-success' : 'badge-info'}`}>
                      {s.status}
                    </span>
                    <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-slate-900 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="premium-card bg-white !p-10 relative overflow-hidden group backdrop-blur-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-4 tracking-tight">
               <Lightbulb className="w-6 h-6 text-indigo-600" /> Strategy Insights
            </h3>
            <div className="space-y-8">
              <div className="p-8 bg-indigo-50/40 rounded-[32px] border border-white">
                 <p className="text-sm font-semibold leading-relaxed text-indigo-900/80 italic">
                   "Based on your regional growth goal, we recommend prioritizing your 'Infrastructure Review' sessions to ensure scalability."
                 </p>
              </div>
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ps-1">Dynamic To-Do</p>
                 {['Approve v2.5 Architecture', 'Sync Tenant Protocols'].map((action, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-white/60 border border-white/80 rounded-2xl hover:border-indigo-200 transition-colors cursor-pointer group/item backdrop-blur-md">
                       <span className="text-xs font-bold text-slate-700">{action}</span>
                       <ArrowRight className="w-4 h-4 text-slate-300 group-hover/item:translate-x-1 group-hover/item:text-indigo-600 transition-all" />
                    </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
