
import React, { useState, useEffect } from 'react';
import { SessionNote, User, NoteVisibility } from '../types';
import { SessionNoteController } from '../controllers/SessionNoteController';
import { MessageSquare, Send, User as UserIcon, Clock, Lock } from 'lucide-react';

interface SessionNotesProps {
  sessionId: string;
  currentUser: User;
}

export const SessionNotes: React.FC<SessionNotesProps> = ({ sessionId, currentUser }) => {
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotes = async () => {
    try {
      const data = await SessionNoteController.getNotesForSession(sessionId, currentUser);
      setNotes(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [sessionId, currentUser]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await SessionNoteController.addNote({
        sessionId,
        authorId: currentUser.id,
        authorName: currentUser.name,
        content: newNoteContent,
        visibility: NoteVisibility.PRIVATE
      });
      setNewNoteContent('');
      await fetchNotes();
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-200">
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-black text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" /> Session Intelligence Notes
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full text-[10px] font-black uppercase text-amber-600">
          <Lock className="w-3 h-3" /> Confidential
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        {notes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
            <MessageSquare className="w-12 h-12" />
            <p className="text-xs font-black uppercase tracking-widest">No observations recorded yet</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-3 h-3 text-indigo-600" />
                  </div>
                  <span className="text-xs font-black text-slate-700">{note.authorName}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                  <Clock className="w-3 h-3" /> {new Date(note.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddNote} className="p-6 bg-white border-t border-slate-100">
        <div className="relative">
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Record internal observation..."
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm transition-all resize-none h-24"
          />
          <button
            type="submit"
            disabled={!newNoteContent.trim() || isSubmitting}
            className="absolute bottom-4 right-4 p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:hover:bg-indigo-600"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
