
/**
 * RESPONSIBILITY: 
 * The central engine for logging and performance auditing.
 * Records every state change and provides metrics for Admin views.
 * Seeded with high-density traces to differentiate performance personas.
 */

import { SessionLog, SessionLogAction } from '../models/SessionLog';

export class SessionLogController {
  private static logs: SessionLog[] = [
    // --- AHMED KHALID: High Completion Persona (Ratio: 6 Completions / 7 Events) ---
    { id: 'l-a-1', sessionId: 'sess-ahmad-1', action: 'COMPLETED', description: 'Mission target fulfilled: Q3 Strategy. Verified by Node أحمد خالد', performedBy: 'أحمد خالد', timestamp: new Date().toISOString() },
    { id: 'l-a-2', sessionId: 'sess-ahmad-3', action: 'COMPLETED', description: 'Cloud Resource Planning finalized.', performedBy: 'أحمد خالد', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'l-a-3', sessionId: 'sess-ahmad-4', action: 'COMPLETED', description: 'High-Value Financial Audit closed.', performedBy: 'أحمد خالد', timestamp: new Date(Date.now() - 172800000).toISOString() },
    { id: 'l-a-4', sessionId: 'sess-ahmad-2', action: 'STATUS_CHANGED', description: 'Operational state: InProgress.', performedBy: 'أحمد خالد', timestamp: new Date().toISOString() },
    { id: 'l-a-5', sessionId: 'ext-a-1', action: 'COMPLETED', description: 'Legacy Node Optimization complete.', performedBy: 'أحمد خالد', timestamp: new Date(Date.now() - 300000000).toISOString() },
    { id: 'l-a-6', sessionId: 'ext-a-2', action: 'COMPLETED', description: 'Network Security Patching complete.', performedBy: 'أحمد خالد', timestamp: new Date(Date.now() - 400000000).toISOString() },
    { id: 'l-a-7', sessionId: 'ext-a-3', action: 'COMPLETED', description: 'DB Migration Node verified.', performedBy: 'أحمد خالد', timestamp: new Date(Date.now() - 500000000).toISOString() },

    // --- SARA AL-ABDULLAH: Reliable Balanced Persona (Ratio: 4 Completions / 5 Events) ---
    { id: 'l-s-1', sessionId: 'sess-sara-2', action: 'COMPLETED', description: 'Emergency Support ticket resolved.', performedBy: 'سارة العبدالله', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'l-s-2', sessionId: 'sess-sara-3', action: 'COMPLETED', description: 'UI Sprint fulfillment complete.', performedBy: 'سارة العبدالله', timestamp: new Date(Date.now() - 172800000).toISOString() },
    { id: 'l-s-3', sessionId: 'ext-s-1', action: 'COMPLETED', description: 'Design System Audit complete.', performedBy: 'سارة العبدالله', timestamp: new Date(Date.now() - 250000000).toISOString() },
    { id: 'l-s-4', sessionId: 'ext-s-2', action: 'COMPLETED', description: 'Frontend refactor node verified.', performedBy: 'سارة العبدالله', timestamp: new Date(Date.now() - 350000000).toISOString() },
    { id: 'l-s-5', sessionId: 'sess-sara-1', action: 'NOTES_ADDED', description: 'Technical training syllabus prepared.', performedBy: 'سارة العبدالله', timestamp: new Date().toISOString() },

    // --- FAISAL AL-NASSER: Low Performance / New Persona (Ratio: 1 Completion / 6 Events) ---
    { id: 'l-f-1', sessionId: 'sess-faisal-2', action: 'COMPLETED', description: 'Data Workshop fulfilled (Delayed).', performedBy: 'فيصل الناصر', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'l-f-2', sessionId: 'sess-faisal-1', action: 'CREATED', description: 'Mission initialization.', performedBy: 'فيصل الناصر', timestamp: new Date().toISOString() },
    { id: 'l-f-3', sessionId: 'sess-faisal-3', action: 'CREATED', description: 'InfoSec Audit schedule locked.', performedBy: 'فيصل الناصر', timestamp: new Date().toISOString() },
    { id: 'l-f-4', sessionId: 'sess-faisal-4', action: 'CREATED', description: 'Network Protocol assignment.', performedBy: 'فيصل الناصر', timestamp: new Date().toISOString() },
    { id: 'l-f-5', sessionId: 'sess-faisal-5', action: 'CREATED', description: 'System Hardening node created.', performedBy: 'فيصل الناصر', timestamp: new Date().toISOString() },
    { id: 'l-f-6', sessionId: 'ext-f-1', action: 'STATUS_CHANGED', description: 'Status set to Scheduled (Pending since 48h).', performedBy: 'فيصل الناصر', timestamp: new Date(Date.now() - 172800000).toISOString() }
  ];

  static async logEvent(params: {
    sessionId: string;
    action: SessionLogAction;
    description: string;
    performedBy: string;
    metadata?: any;
  }): Promise<SessionLog> {
    const newLog: SessionLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      sessionId: params.sessionId,
      action: params.action,
      description: params.description,
      performedBy: params.performedBy,
      timestamp: new Date().toISOString(),
      metadata: params.metadata
    };
    
    this.logs.unshift(newLog);
    return newLog;
  }

  static getLogsForSession(sessionId: string): SessionLog[] {
    return this.logs.filter(l => l.sessionId === sessionId);
  }

  static getAllLogs(): SessionLog[] {
    return this.logs;
  }

  /**
   * CORE PERFORMANCE ENGINE: 
   * Tracks and returns the velocity and reliability of each node.
   * Efficiency Index = (Completions / Total Operational Footprint) * 100
   */
  static getPerformanceMetrics(): Record<string, { total: number; completed: number }> {
    const metrics: Record<string, { total: number; completed: number }> = {};
    
    this.logs.forEach(log => {
      if (!metrics[log.performedBy]) metrics[log.performedBy] = { total: 0, completed: 0 };
      
      metrics[log.performedBy].total += 1;
      
      if (log.action === 'COMPLETED') {
        metrics[log.performedBy].completed += 1;
      }
    });
    
    return metrics;
  }
}
