/**
 * RESPONSIBILITY: 
 * Defines the schema for session history tracking. 
 * Every significant mutation in a session's lifecycle must be recorded here.
 */

export type SessionLogAction = 
  | 'CREATED' 
  | 'SPECIALIST_ASSIGNED' 
  | 'STATUS_CHANGED' 
  | 'NOTES_ADDED' 
  | 'COMPLETED';

export interface SessionLog {
  id: string;           // Unique log identifier
  sessionId: string;    // Reference to the parent session
  action: SessionLogAction; 
  performedBy: string;  // Name or ID of the user who performed the action
  timestamp: string;    // ISO string of the event time
  description: string;  // Human-readable summary of the event
  metadata?: any;       // Optional structured data (e.g., status: "Scheduled" -> "InProgress")
}
