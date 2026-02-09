
import React, { useState, useEffect } from 'react';
import { Session, SessionStatus, User } from '../types';
import { Language, translations } from '../translations';
import { Calendar, Play, CheckCircle, Clock, ChevronRight, Zap, Target, MessageSquare, X } from 'lucide-react';
import { SessionController } from '../controllers/SessionController';
import { SessionNotes } from './SessionNotes';

interface EmployeeDashboardProps {
  lang: Language;
  user: User;
  sessions: Session[];
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ lang, user, sessions: initialSessions }) => {
  const t = translations[lang];
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    setSessions(initialSessions.filter(s => s.employeeId === user.id));
  }, [initialSessions, user.id]);

  const handleUpdateStatus = async (sessionId: string, status: SessionStatus) => {
    try {
      const updated = await SessionController.updateStatus(sessionId, status, user);
      setSessions(prev => prev.map(s => s.id === sessionId ? updated : s));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const currentSession = sessions.find(s => s.status === SessionStatus.IN_PROGRESS);

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="bg-indigo-600 p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tight mb-2">{t.welcome}, {user.name.split(' ')[0]}</h2>
          <p className="text-indigo-100 font-medium opacity-80">
            {sessions.filter(s => s.status !== SessionStatus.COMPLETED && s.status !== SessionStatus.ARCHIVED).length} tasks in your focus queue.
          </p>
        </div>
      </div>

      {currentSession && (
        <div className="bg-slate-900 text-white p-8 rounded-[32px] border border-white/10 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center animate-pulse">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em] mb-1">Active Operation</p>
              <h4 className="text-xl font-bold">{currentSession.title}</h4>
              <p className="text-xs text-slate-400">Client: {currentSession.clientName}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setSelectedSessionId(currentSession.id)}
              className="p-3 bg-white/10 border border-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleUpdateStatus(currentSession.id, SessionStatus.COMPLETED)}
              className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
            >
              Fulfill Mission
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-lg flex items-center gap-2 text-slate-900">
            <Calendar className="w-5 h-5 text-indigo-600" /> Operational Agenda
          </h3>
          <span className="badge badge-info">{sessions.length} Assigned</span>
        </div>

        <div className="divide-y divide-slate-50">
          {sessions.map((session) => (
            <div key={session.id} className="p-8 hover:bg-slate-50/5 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                  <div className="text-center min-w-[60px]">
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">{session.startTime}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{session.date}</p>
                  </div>
                  <div className="w-px h-10 bg-slate-200 hidden md:block"></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{session.title}</h4>
                    <p className="text-sm text-slate-400 flex items-center gap-2 font-medium">
                      <Target className="w-3.5 h-3.5" /> {session.clientName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`badge ${
                    session.status === SessionStatus.COMPLETED ? 'badge-success' : 
                    session.status === SessionStatus.SCHEDULED ? 'badge-info' : 'badge-warning'
                  }`}>
                    {session.status}
                  </span>
                  <button 
                    onClick={() => setSelectedSessionId(session.id)}
                    className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  {session.status === SessionStatus.SCHEDULED && (
                    <button 
                      onClick={() => handleUpdateStatus(session.id, SessionStatus.IN_PROGRESS)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Execute
                    </button>
                  )}
                  <button className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:text-slate-600 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="p-24 text-center">
               <Clock className="w-12 h-12 text-slate-100 mx-auto mb-4" />
               <p className="font-black text-slate-300 uppercase tracking-[0.2em] text-sm">No tasks assigned to your node</p>
            </div>
          )}
        </div>
      </div>

      {selectedSessionId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl h-[80vh] rounded-[48px] shadow-3xl overflow-hidden relative flex flex-col">
            <button 
              onClick={() => setSelectedSessionId(null)}
              className="absolute top-6 right-6 p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex-1 overflow-hidden">
               <SessionNotes sessionId={selectedSessionId} currentUser={user} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
