
/**
 * RESPONSIBILITY: 
 * Schema for the platform's immutable audit trail.
 * Tracks "Who did what and when" for full governance.
 */

export type SessionLogAction = 
  | 'CREATED' 
  | 'EMPLOYEE_ASSIGNED' 
  | 'STATUS_CHANGED' 
  | 'NOTES_ADDED' 
  | 'COMPLETED';

export interface SessionLog {
  id: string;
  sessionId: string;
  action: SessionLogAction;
  performedBy: string;
  timestamp: string;
  description: string;
  metadata?: any;
}
