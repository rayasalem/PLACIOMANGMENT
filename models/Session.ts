
/**
 * RESPONSIBILITY: 
 * Defines the core operational Session entity.
 * Represents a single assignment linked to one responsible employee.
 */

export enum SessionStatus {
  CREATED = 'Created',
  SCHEDULED = 'Scheduled',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  ARCHIVED = 'Archived'
}

export interface Session {
  id: string;
  title: string;
  clientId: string; 
  clientName: string; 
  employeeId: string; // The single source of responsibility
  employeeName: string; 
  specialistId: string;
  specialistName: string;
  companyId: string; 
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: SessionStatus;
  price?: number;
  tags?: string[];
  notes?: string;
  completedAt?: string; // ISO timestamp of fulfillment
}
