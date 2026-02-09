
import React, { useState, useEffect } from 'react';
import { Session, SessionStatus, UserRole, User } from '../types';
import { Language, translations } from '../translations';
import { 
  Zap, Calendar, Clock, CheckCircle, 
  MessageSquare, Play, ArrowRight, History, 
  Target, ChevronRight, BarChart3
} from 'lucide-react';
import { SessionController } from '../controllers/SessionController';
import { SessionLogController } from '../controllers/SessionLogController';

interface SpecialistDashboardProps {
  lang: Language;
  sessions: Session[];
  user: User; // Added user prop
}

export const SpecialistDashboard: React.FC<SpecialistDashboardProps> = ({ lang, sessions: initialSessions, user }) => {
  const t = translations[lang];
  const [sessions, setSessions] = useState(initialSessions);

  // Sorting sessions by time
  const sortedSessions = [...sessions].sort((a,b) => a.startTime.localeCompare(b.startTime));
  
  const currentSession = sortedSessions.find(s => s.status === SessionStatus.IN_PROGRESS);
  const nextSession = sortedSessions.find(s => s.status === SessionStatus.SCHEDULED);

  const handleStatusUpdate = async (sessionId: string, status: SessionStatus) => {
    // Fixed: Pass the user object instead of a hardcoded string
    const updated = await SessionController.updateStatus(sessionId, status, user);
    setSessions(prev => prev.map(s => s.id === sessionId ? updated : s));
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{t.welcome}</h2>
          <p className="text-slate-500 font-medium text-lg">Your focus queue for today's operational window.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-black text-slate-900">Efficiency: 94%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Focus */}
        <div className="bg-indigo-600 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
           <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-3 opacity-80">
             <Zap className="w-5 h-5 text-amber-400" /> {t.current_focus}
           </h3>
           
           {currentSession ? (
             <div className="space-y-10 relative z-10">
               <div className="space-y-2">
                 <h4 className="text-4xl font-black leading-tight tracking-tighter">{currentSession.title}</h4>
                 <p className="text-indigo-200 font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {currentSession.startTime} - {currentSession.endTime} • Client: {currentSession.clientName}
                 </p>
               </div>
               <div className="flex gap-4">
                 <button 
                   onClick={() => handleStatusUpdate(currentSession.id, SessionStatus.COMPLETED)}
                   className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                 >
                   Fulfill Session
                 </button>
                 <button className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all">
                    <MessageSquare className="w-5 h-5" />
                 </button>
               </div>
             </div>
           ) : (
             <div className="py-20 text-center opacity-40">
               <Target className="w-12 h-12 mx-auto mb-4" />
               <p className="font-black uppercase tracking-widest">No Active Sessions</p>
             </div>
           )}
        </div>

        {/* Next Step */}
        <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
           <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-3 opacity-80">
             <ArrowRight className="w-5 h-5 text-indigo-400" /> {t.next_step}
           </h3>

           {nextSession ? (
             <div className="space-y-10">
               <div className="space-y-2">
                 <h4 className="text-4xl font-black leading-tight tracking-tighter">{nextSession.title}</h4>
                 <p className="text-slate-400 font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Starts at {nextSession.startTime} • {nextSession.clientName}
                 </p>
               </div>
               <button 
                 onClick={() => handleStatusUpdate(nextSession.id, SessionStatus.IN_PROGRESS)}
                 className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2"
               >
                 Advance to In Progress <ChevronRight className="w-4 h-4" />
               </button>
             </div>
           ) : (
             <div className="py-20 text-center opacity-40">
               <CheckCircle className="w-12 h-12 mx-auto mb-4" />
               <p className="font-black uppercase tracking-widest">Queue Complete</p>
             </div>
           )}
        </div>
      </div>

      {/* Full Daily Agenda */}
      <div className="bg-white rounded-[48px] border border-slate-200 overflow-hidden shadow-sm">
         <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-900 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-600" /> Remaining Agenda
            </h3>
            <span className="badge badge-info">{sessions.length} Tasks Total</span>
         </div>
         <div className="divide-y divide-slate-50">
           {sortedSessions.map(s => (
             <div key={s.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-8">
                   <div className="text-center w-20">
                      <p className="text-2xl font-black text-slate-900">{s.startTime}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration: 1h</p>
                   </div>
                   <div>
                      <p className="font-bold text-slate-900 text-lg leading-tight mb-1">{s.title}</p>
                      <p className="text-sm text-slate-400 font-medium">Client Account: {s.clientName}</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                     s.status === SessionStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                   }`}>
                     {s.status}
                   </span>
                   {s.status === SessionStatus.SCHEDULED && (
                     <button 
                        onClick={() => handleStatusUpdate(s.id, SessionStatus.IN_PROGRESS)}
                        className="p-3 bg-white border border-slate-200 rounded-xl hover:text-indigo-600 transition-all"
                      >
                        <Play className="w-4 h-4" />
                     </button>
                   )}
                </div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};
