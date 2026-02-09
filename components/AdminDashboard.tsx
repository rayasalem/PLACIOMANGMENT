
import React, { useState, useEffect } from 'react';
import { FinancialStats, Session, SessionStatus, User, FinancialRecord } from '../types';
import { Language, translations } from '../translations';
import { 
  Activity, Wallet, History, Users, 
  ShieldCheck, ArrowUpRight, Zap, 
  Clock, CheckCircle, Archive, Plus, MessageSquare, X, 
  Search, Eye, TrendingUp, Filter, MoreVertical, ListTodo, AlertCircle
} from 'lucide-react';
import { SessionLogController } from '../controllers/SessionLogController';
import { SessionLog } from '../types';
import { SessionNotes } from './SessionNotes';

interface AdminDashboardProps {
  lang: Language;
  users: User[];
  sessions: Session[];
  financials: FinancialStats;
  financialRecords: FinancialRecord[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  lang, sessions, financials, users
}) => {
  const t = translations[lang];
  const [systemLogs, setSystemLogs] = useState<SessionLog[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showInspector, setShowInspector] = useState(false);
  const [activeView, setActiveView] = useState<'pulse' | 'team'>('pulse');

  useEffect(() => {
    setSystemLogs(SessionLogController.getAllLogs());
  }, [sessions]);

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date === today);
  const pendingToday = todaySessions.filter(s => s.status !== SessionStatus.COMPLETED && s.status !== SessionStatus.CANCELLED);
  const completedToday = todaySessions.filter(s => s.status === SessionStatus.COMPLETED);

  const getStatusIcon = (status: SessionStatus) => {
    switch(status) {
      case SessionStatus.COMPLETED: return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case SessionStatus.IN_PROGRESS: return <Zap className="w-4 h-4 text-amber-500" />;
      case SessionStatus.ARCHIVED: return <Archive className="w-4 h-4 text-slate-400" />;
      default: return <Clock className="w-4 h-4 text-indigo-500" />;
    }
  };

  const adminUser = users.find(u => u.role === 'ADMIN');
  const performanceMetrics = SessionLogController.getPerformanceMetrics();

  const handleInspectSession = (session: Session) => {
    setSelectedSession(session);
    setShowInspector(true);
  };

  return (
    <div className="space-y-10 animate-slide-up">
      {/* Dynamic Operational Intelligence - Today's Priority KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: lang === 'AR' ? "إجمالي جلسات اليوم" : "Today's Volume", 
            value: todaySessions.length, 
            icon: ListTodo, 
            color: 'text-indigo-600',
            subtitle: lang === 'AR' ? 'الجلسات المجدولة' : 'Scheduled missions'
          },
          { 
            label: lang === 'AR' ? "جلسات قيد الانتظار" : "Pending Today", 
            value: pendingToday.length, 
            icon: AlertCircle, 
            color: 'text-amber-600',
            subtitle: lang === 'AR' ? 'تتطلب إجراءً فورياً' : 'Awaiting action'
          },
          { 
            label: lang === 'AR' ? "العمليات المكتملة" : "Completed Today", 
            value: completedToday.length, 
            icon: CheckCircle, 
            color: 'text-emerald-600',
            subtitle: lang === 'AR' ? 'تمت بنجاح' : 'Targets achieved'
          },
          { 
            label: lang === 'AR' ? "فريق العمل النشط" : "Active Staff", 
            value: users.filter(u => u.role === 'EMPLOYEE').length, 
            icon: Users, 
            color: 'text-blue-600',
            subtitle: lang === 'AR' ? 'الموظفون المسؤولون' : 'Specialized nodes'
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 bg-slate-50 rounded-2xl ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-10 border-b border-slate-100 pb-px">
        <button 
          onClick={() => setActiveView('pulse')}
          className={`pb-5 text-[11px] font-black uppercase tracking-[0.3em] relative transition-all ${activeView === 'pulse' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {lang === 'AR' ? 'النبض التشغيلي' : 'Operational Pulse'}
          {activeView === 'pulse' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
        </button>
        <button 
          onClick={() => setActiveView('team')}
          className={`pb-5 text-[11px] font-black uppercase tracking-[0.3em] relative transition-all ${activeView === 'team' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {lang === 'AR' ? 'أداء الفريق' : 'Team Performance'}
          {activeView === 'team' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Workspace Area */}
        <div className="lg:col-span-8 space-y-8">
          {activeView === 'pulse' ? (
            <div className="bg-white rounded-[48px] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="relative w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    placeholder={lang === 'AR' ? "بحث في الجلسات..." : "Filter sessions..."} 
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:ring-2 ring-indigo-500/20" 
                  />
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-400"><Filter className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {sessions.length > 0 ? sessions.sort((a,b) => b.date.localeCompare(a.date)).map(s => (
                  <div key={s.id} className={`p-8 flex items-center justify-between hover:bg-slate-50 transition-all group ${s.date === today && s.status !== SessionStatus.COMPLETED ? 'bg-indigo-50/20' : ''}`}>
                    <div className="flex items-center gap-8">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${s.date === today ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {s.startTime}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{s.title}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {s.employeeName}</span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                          <span>Client: {s.clientName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1.5 rounded-full border ${
                        s.status === SessionStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        s.status === SessionStatus.IN_PROGRESS ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>
                        {getStatusIcon(s.status)} {s.status}
                      </span>
                      <button 
                        onClick={() => handleInspectSession(s)}
                        className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="py-24 text-center">
                    <ListTodo className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                    <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No Operational Data Available</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {users.filter(u => u.role === 'EMPLOYEE').map(emp => {
                const stats = performanceMetrics[emp.name] || { completed: 0, total: 0 };
                const efficiency = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                
                return (
                  <div key={emp.id} className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-8 transition-all hover:shadow-lg">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-950 rounded-3xl flex items-center justify-center text-2xl font-black text-white shadow-xl">
                        {emp.name[0]}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">{emp.name}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{emp.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-6 rounded-[32px] text-center border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Operations</p>
                        <p className="text-3xl font-black text-slate-900">{stats.total}</p>
                      </div>
                      <div className="bg-emerald-50 p-6 rounded-[32px] text-center border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Completed</p>
                        <p className="text-3xl font-black text-emerald-700">{stats.completed}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Index</p>
                        <p className={`text-sm font-black ${efficiency > 70 ? 'text-indigo-600' : 'text-amber-600'}`}>{efficiency}%</p>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full shadow-[0_0_10px_rgba(79,70,229,0.2)] transition-all duration-1000 ${efficiency > 70 ? 'bg-indigo-600' : 'bg-amber-500'}`} 
                          style={{ width: `${efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Audit Stream Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <History className="w-6 h-6 text-indigo-600" /> Audit Stream
            </h3>
          </div>
          <div className="bg-slate-950 rounded-[48px] p-8 text-white min-h-[600px] max-h-[800px] overflow-y-auto scrollbar-hide border border-slate-900 shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-950 to-transparent z-10 pointer-events-none"></div>
            <div className="space-y-10 relative z-0 pt-10">
              {systemLogs.length > 0 ? systemLogs.map(log => (
                <div key={log.id} className="relative pl-8 border-l border-white/10 pb-10 last:pb-0">
                  <div className={`absolute top-0 -left-[6px] w-3 h-3 rounded-full border-2 border-slate-950 ${
                    log.action === 'COMPLETED' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 
                    log.action === 'STATUS_CHANGED' ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]' : 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]'
                  }`}></div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                        log.action === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 
                        log.action === 'STATUS_CHANGED' ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {log.action}
                      </span>
                      <p className="text-[9px] text-white/30 font-bold uppercase tracking-tight">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-white/90 leading-snug">{log.description}</p>
                    <div className="flex items-center gap-2 pt-1">
                       <div className="w-5 h-5 bg-white/10 rounded-lg flex items-center justify-center text-[8px] font-black text-white/60">
                         {log.performedBy[0]}
                       </div>
                       <p className="text-[9px] text-white/30 font-bold uppercase tracking-tight">
                         {log.performedBy}
                       </p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-20 mt-40">
                  <TrendingUp className="w-16 h-16 mb-6" />
                  <p className="text-xs font-black uppercase tracking-[0.3em]">Governance Silent</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Session Inspector Modal */}
      {selectedSession && adminUser && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-white w-full max-w-6xl h-[85vh] rounded-[64px] shadow-3xl overflow-hidden relative flex flex-col border border-white/20">
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl">
                     <Clock className="w-10 h-10" />
                  </div>
                  <div>
                     <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{selectedSession.title}</h3>
                     <p className="text-sm text-slate-500 font-medium">Internal Governance View • ID: {selectedSession.id}</p>
                  </div>
               </div>
               <button 
                onClick={() => setSelectedSession(null)}
                className="p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content Grid */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3">
               {/* Lifecycle Timeline */}
               <div className="p-10 border-r border-slate-100 overflow-y-auto scrollbar-hide space-y-10 bg-white">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Evolution Timeline</h4>
                  <div className="space-y-10">
                     {SessionLogController.getLogsForSession(selectedSession.id).map((log) => (
                        <div key={log.id} className="relative pl-8 border-l-2 border-slate-100 last:border-0 pb-10 last:pb-0">
                           <div className="absolute top-0 -left-[11px] w-5 h-5 rounded-full bg-white border-4 border-indigo-600 shadow-sm"></div>
                           <div className="space-y-2">
                              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{log.action}</p>
                              <p className="text-sm font-black text-slate-900">{log.description}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">By {log.performedBy} • {new Date(log.timestamp).toLocaleString()}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Private Intelligence Notes */}
               <div className="lg:col-span-2 overflow-hidden flex flex-col bg-slate-50/30">
                  <div className="flex-1 overflow-hidden p-8">
                     <SessionNotes sessionId={selectedSession.id} currentUser={adminUser} />
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-slate-100 bg-white flex justify-between items-center px-12">
               <div className="flex gap-12">
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned specialist</p>
                     <p className="text-sm font-black text-slate-900">{selectedSession.employeeName}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">State</p>
                     <p className="text-sm font-black text-indigo-600 uppercase">{selectedSession.status}</p>
                  </div>
               </div>
               <button className="px-10 py-4 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all">Export Governance Audit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
