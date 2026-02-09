
/**
 * RESPONSIBILITY: 
 * Manages session lifecycle and enforces that every change triggers an audit log.
 * Integrates with FinancialController for automated revenue tracking.
 */

import { Session, SessionStatus } from '../models/Session';
import { User } from '../models/User';
import { apiService } from '../apiService';
import { SessionLogController } from './SessionLogController';
import { FinancialController } from './FinancialController';

export class SessionController {
  
  static async fetchSessionsForUser(user: User): Promise<Session[]> {
    return await apiService.getSessions(user);
  }

  static async createNewSession(sessionData: Partial<Session>, currentUser: User) {
    const session = await apiService.createSession({
      ...sessionData,
      companyId: currentUser.companyId
    });

    await SessionLogController.logEvent({
      sessionId: session.id,
      action: 'CREATED',
      description: `New mission '${session.title}' initialized by ${currentUser.name}`,
      performedBy: currentUser.name,
      metadata: { employeeId: session.employeeId }
    });

    return session;
  }

  static async updateStatus(sessionId: string, newStatus: SessionStatus, currentUser: User) {
    const session = await apiService.updateSessionStatus(sessionId, newStatus, currentUser.id);
    
    await SessionLogController.logEvent({
      sessionId,
      action: 'STATUS_CHANGED',
      description: `Operational state transitioned to ${newStatus} by ${currentUser.name}`,
      performedBy: currentUser.name,
      metadata: { status: newStatus }
    });

    if (newStatus === SessionStatus.COMPLETED) {
      // AUTOMATION: Auto-trigger financial reconciliation
      await FinancialController.recordSessionIncome(session, currentUser);

      await SessionLogController.logEvent({
        sessionId,
        action: 'COMPLETED',
        description: `Mission target fulfilled. Revenue automatically reconciled for node ${currentUser.name}`,
        performedBy: currentUser.name
      });
    }

    return session;
  }

  static async addInternalNote(sessionId: string, content: string, currentUser: User) {
    const note = {
      id: `note-${Date.now()}`,
      sessionId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      content,
      createdAt: new Date().toISOString()
    };
    
    await apiService.addNote(note);
    
    await SessionLogController.logEvent({
      sessionId,
      action: 'NOTES_ADDED',
      description: `Strategic intelligence updated by ${currentUser.name}`,
      performedBy: currentUser.name
    });

    return note;
  }
}
