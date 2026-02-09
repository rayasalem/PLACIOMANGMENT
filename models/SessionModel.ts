
/**
 * RESPONSIBILITY: 
 * Defines the core business Session entity and status transitions.
 */
import { SessionStatus } from '../types';

export interface Session {
  id: string;
  companyId: string;
  title: string;
  clientId: string;
  clientName: string;
  specialistId: string;
  specialistName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
}
