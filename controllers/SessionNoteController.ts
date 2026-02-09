
import { SessionNote, NoteVisibility, UserRole, User } from '../types';
import { apiService } from '../services/apiService';
import { SessionLogController } from './SessionLogController';

export class SessionNoteController {
  
  static async getNotesForSession(sessionId: string, user: User): Promise<SessionNote[]> {
    return await apiService.getNotes(sessionId, user.role);
  }

  static async addNote(params: {
    sessionId: string;
    authorId: string;
    authorName: string;
    content: string;
    visibility: NoteVisibility;
  }): Promise<SessionNote> {
    const newNote: SessionNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      sessionId: params.sessionId,
      authorId: params.authorId,
      authorName: params.authorName,
      authorRole: UserRole.EMPLOYEE, // This should be dynamic based on current user in real app
      content: params.content,
      visibility: params.visibility,
      createdAt: new Date().toISOString()
    };

    const savedNote = await apiService.addNote(newNote);

    await SessionLogController.logEvent({
      sessionId: params.sessionId,
      action: 'NOTES_ADDED',
      description: `Session note appended by ${params.authorName}. Content preview: ${params.content.substring(0, 30)}...`,
      performedBy: params.authorName
    });

    return savedNote;
  }
}
