
/**
 * RESPONSIBILITY: 
 * Operational view for Staff. 
 * Focuses on managing the specific sessions assigned to the logged-in employee.
 */

import React, { useState, useEffect } from 'react';
import { Session, SessionStatus } from '../../models/Session';
import { User } from '../../models/User';
import { SessionController } from '../../controllers/SessionController';
import { 
  Calendar, Play, CheckCircle, Clock, 
  MessageSquare, X, Zap, Target, ChevronRight 
} from 'lucide-react';
import { SessionNotes } from '../../components/SessionNotes';
import { Language } from '../../translations';

interface EmployeeDashboardProps {
  user: User;
  sessions: Session[];
  lang: Language;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user, sessions: initialSessions, lang }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Filter to only show sessions assigned to THIS employee
    setSessions(initialSessions.filter(s => s.employeeId === user.id));
  }, [initialSessions, user.id]);

  const handleUpdate = async (id: string, status: SessionStatus) => {
    const updated = await SessionController.updateStatus(id, status, user);
    setSessions(prev => prev.map(s => s.id === id ? updated : s));
  };

  const currentMission = sessions.find(s => s.status === SessionStatus.IN_PROGRESS);

  return (
    <div className="space-y-8">
      {/* Employee Welcome Banner */}
      <div className="bg-slate-900 p-10 rounded-[40px] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tighter mb-2">Welcome Back, {user.name}</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Active Operational Node • Secure Access Enabled</p>
        </div>
        <div className="relative z-10 flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-3xl">
           <Target className="w-5 h-5 text-indigo-400" />
           <span className="text-xl font-black">{sessions.filter(s => s.status !== SessionStatus.COMPLETED).length} Tasks Pending</span>
        </div>
      </div>

      {currentMission && (
        <div className="bg-indigo-600 text-white p-8 rounded-[40px] shadow-xl flex items-center justify-between animate-pulse">
           <div className="flex items-center gap-6">
              <Zap className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Currently Executing</p>
                <h3 className="text-2xl font-black tracking-tight">{currentMission.title}</h3>
              </div>
           </div>
           <div className="flex gap-4">
              <button onClick={() => setActiveSessionId(currentMission.id)} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20"><MessageSquare className="w-5 h-5" /></button>
              <button onClick={() => handleUpdate(currentMission.id, SessionStatus.COMPLETED)} className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">Fulfill Task</button>
           </div>
        </div>
      )}

      {/* Daily Agenda */}
      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
         <div className="p-8 border-b border-slate-100">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><Calendar className="w-6 h-6 text-indigo-600" /> Your Assigned Missions</h3>
         </div>
         <div className="divide-y divide-slate-50">
           {sessions.map(s => (
             <div key={s.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                <div className="flex items-center gap-8">
                   <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col items-center justify-center font-black">
                      <span className="text-[8px] uppercase text-slate-400">Time</span>
                      <span className="text-lg text-slate-900">{s.startTime}</span>
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{s.title}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Client: {s.clientName}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                     s.status === SessionStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                   }`}>{s.status}</span>
                   {s.status === SessionStatus.SCHEDULED && (
                     <button onClick={() => handleUpdate(s.id, SessionStatus.IN_PROGRESS)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2">
                       <Play className="w-3.5 h-3.5" /> Start
                     </button>
                   )}
                   <button onClick={() => setActiveSessionId(s.id)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"><MessageSquare className="w-5 h-5" /></button>
                </div>
             </div>
           ))}
         </div>
      </div>

      {activeSessionId && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in zoom-in-95 duration-500">
           <div className="bg-white w-full max-w-2xl h-[70vh] rounded-[56px] shadow-3xl overflow-hidden relative">
              <button onClick={() => setActiveSessionId(null)} className="absolute top-6 right-6 p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200"><X className="w-5 h-5" /></button>
              <div className="h-full flex flex-col">
                 <SessionNotes sessionId={activeSessionId} currentUser={user} />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
