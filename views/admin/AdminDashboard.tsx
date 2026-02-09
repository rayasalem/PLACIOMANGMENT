
/**
 * RESPONSIBILITY: 
 * Master view for Administrators.
 * Features: Performance tracking, Complete system timeline, and Session inspection.
 * Optimized for daily time-saving by highlighting today's KPIs and action items.
 */

import React, { useState, useEffect } from 'react';
import { Session, SessionStatus } from '../../models/Session';
import { User, UserRole } from '../../models/User';
import { SessionLog } from '../../models/SessionLog';
import { SessionLogController } from '../../controllers/SessionLogController';
import { 
  Activity, History, Users, ShieldCheck, 
  ArrowUpRight, Zap, Clock, CheckCircle, 
  Eye, TrendingUp, X, MessageSquare, ListTodo, AlertCircle,
  CalendarDays, BarChart3
} from 'lucide-react';
import { SessionNotes } from '../../components/SessionNotes';
import { Language } from '../../translations';

interface AdminDashboardProps {
  sessions: Session[];
  users: User[];
  currentUser: User;
  lang: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ sessions, users, currentUser, lang }) => {
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [view, setView] = useState<'agenda' | 'performance'>('agenda');
  
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date === today);
  const upcomingSessions = sessions.filter(s => s.date > today).sort((a, b) => a.date.localeCompare(b.date));
  
  const pendingToday = todaySessions.filter(s => s.status !== SessionStatus.COMPLETED && s.status !== SessionStatus.CANCELLED);
  const completedToday = todaySessions.filter(s => s.status === SessionStatus.COMPLETED);

  const staff = users.filter(u => u.role === UserRole.EMPLOYEE);
  const performanceMetrics = SessionLogController.getPerformanceMetrics();

  useEffect(() => {
    setLogs(SessionLogController.getAllLogs());
  }, [sessions]);

  const renderSessionList = (sessionArray: Session[], title: string, icon: any) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          {React.createElement(icon, { className: "w-6 h-6 text-indigo-600" })} {title}
        </h3>
        {title === "Today's Agenda" && todaySessions.length > 0 && (
           <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 animate-pulse">
             Operational Window Active
           </span>
        )}
      </div>
      
      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
         <div className="divide-y divide-slate-100">
           {sessionArray.length > 0 ? sessionArray.map(s => (
             <div key={s.id} className={`p-6 flex items-center justify-between hover:bg-slate-50 transition-all ${s.date === today && s.status !== SessionStatus.COMPLETED ? 'bg-indigo-50/30' : ''}`}>
                <div className="flex items-center gap-6">
                   <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black ${s.date === today ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                     <span className="text-[9px] uppercase leading-none mb-1 opacity-60">Time</span>
                     <span className="text-base leading-none">{s.startTime}</span>
                   </div>
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                       <p className="font-bold text-slate-900">{s.title}</p>
                       {s.date === today && s.status === SessionStatus.IN_PROGRESS && (
                         <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" title="In Progress"></span>
                       )}
                     </div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-2">
                       Specialist: <span className="text-slate-600">{s.employeeName}</span> 
                       <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                       Client: <span className="text-slate-600">{s.clientName}</span>
                     </p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${
                     s.status === SessionStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                     s.status === SessionStatus.IN_PROGRESS ? 'bg-amber-50 text-amber-600 border-amber-100' :
                     'bg-slate-50 text-slate-400 border-slate-100'
                   }`}>
                     {s.status}
                   </span>
                   <button 
                    onClick={() => setSelectedSession(s)} 
                    className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm"
                   >
                     <Eye className="w-5 h-5" />
                   </button>
                </div>
             </div>
           )) : (
             <div className="p-20 text-center text-slate-300">
                <ListTodo className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-black uppercase tracking-widest text-xs">No Missions Scheduled</p>
             </div>
           )}
         </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-slide-up">
      {/* High-Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Today's Volume", value: todaySessions.length, icon: ListTodo, color: 'text-indigo-600', subtitle: 'Scheduled missions' },
          { label: 'Pending Now', value: pendingToday.length, icon: AlertCircle, color: 'text-amber-600', subtitle: 'Awaiting action' },
          { label: 'Completed', value: completedToday.length, icon: CheckCircle, color: 'text-emerald-600', subtitle: 'Daily targets' },
          { label: 'Active Staff', value: staff.length, icon: Users, color: 'text-blue-600', subtitle: 'Operational nodes' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm transition-all hover:shadow-lg">
            <div className={`p-3 w-fit mb-4 rounded-2xl bg-slate-50 ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-10 border-b border-slate-100 pb-px mb-8">
        <button 
          onClick={() => setView('agenda')}
          className={`pb-5 text-[11px] font-black uppercase tracking-[0.3em] relative transition-all ${view === 'agenda' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Operational Agenda
          {view === 'agenda' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
        </button>
        <button 
          onClick={() => setView('performance')}
          className={`pb-5 text-[11px] font-black uppercase tracking-[0.3em] relative transition-all ${view === 'performance' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Node Performance
          {view === 'performance' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Work Area */}
        <div className="lg:col-span-8 space-y-12">
          {view === 'agenda' ? (
            <>
              {renderSessionList(todaySessions, "Today's Agenda", Zap)}
              {renderSessionList(upcomingSessions, "Future Missions", CalendarDays)}
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {staff.map(emp => {
                const metrics = performanceMetrics[emp.name] || { completed: 0, total: 0 };
                // Using total logs as a proxy for activity, and completed as the output
                const efficiency = metrics.total > 0 ? Math.round((metrics.completed / (metrics.total / 2)) * 100) : 0;
                
                return (
                  <div key={emp.id} className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-8 transition-all hover:shadow-lg">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-950 rounded-3xl flex items-center justify-center text-2xl font-black text-white shadow-xl">
                        {emp.name[0]}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">{emp.name}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialist Node</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-6 rounded-[32px] text-center border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Logs</p>
                        <p className="text-3xl font-black text-slate-900">{metrics.total}</p>
                      </div>
                      <div className="bg-emerald-50 p-6 rounded-[32px] text-center border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Completions</p>
                        <p className="text-3xl font-black text-emerald-700">{metrics.completed}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Index</p>
                        <p className={`text-sm font-black ${efficiency > 70 ? 'text-indigo-600' : 'text-amber-600'}`}>{Math.min(efficiency, 100)}%</p>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${efficiency > 70 ? 'bg-indigo-600' : 'bg-amber-500'}`} 
                          style={{ width: `${Math.min(efficiency, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Audit Stream */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" /> Operational Audit
          </h3>
          <div className="bg-slate-950 rounded-[40px] p-8 text-white min-h-[500px] max-h-[700px] overflow-y-auto scrollbar-hide border border-slate-800 shadow-2xl">
            <div className="space-y-8 relative">
              {logs.length > 0 ? logs.map((log, i) => (
                <div key={log.id} className="relative pl-6 border-l border-white/10 pb-8 last:pb-0">
                  <div className={`absolute top-0 -left-[5px] w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] ${
                    log.action === 'COMPLETED' ? 'bg-emerald-500' : 'bg-indigo-500'
                  }`}></div>
                  <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">{log.action}</p>
                  <p className="text-xs font-bold text-white/90 leading-relaxed mb-1">{log.description}</p>
                  <p className="text-[8px] text-white/30 font-black uppercase">{log.performedBy} • {new Date(log.timestamp).toLocaleTimeString()}</p>
                </div>
              )) : (
                <div className="p-10 text-center opacity-20">
                  <History className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Logs</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Session Inspector Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in zoom-in-95 duration-500">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[56px] shadow-3xl overflow-hidden relative flex flex-col border border-white/20">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-indigo-600 rounded-[28px] flex items-center justify-center text-white shadow-xl"><Clock className="w-8 h-8" /></div>
                  <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{selectedSession.title}</h3>
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Master Audit ID: {selectedSession.id}</p>
                  </div>
               </div>
               <button onClick={() => setSelectedSession(null)} className="p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
               <div className="p-10 border-r border-slate-100 overflow-y-auto scrollbar-hide space-y-8">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Lifecycle</h4>
                  <div className="space-y-8">
                    {SessionLogController.getLogsForSession(selectedSession.id).length > 0 ? SessionLogController.getLogsForSession(selectedSession.id).map(l => (
                      <div key={l.id} className="pl-6 border-l-2 border-slate-100 space-y-1">
                        <p className="text-[9px] font-black text-indigo-600 uppercase">{l.action}</p>
                        <p className="text-sm font-black text-slate-900">{l.description}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{new Date(l.timestamp).toLocaleString()}</p>
                      </div>
                    )) : (
                      <p className="text-xs font-bold text-slate-400 uppercase italic">No history records found.</p>
                    )}
                  </div>
               </div>
               <div className="bg-slate-50/50 flex flex-col">
                  <div className="flex-1 p-8 overflow-hidden">
                    <SessionNotes sessionId={selectedSession.id} currentUser={currentUser} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
