
/**
 * RESPONSIBILITY: 
 * Defines qualitative data (notes) attached to specific sessions.
 * Records are immutable in the view layer (No deletion supported).
 */

/* Added NoteVisibility enum used in Note Controllers */
export enum NoteVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export interface SessionNote {
  id: string;
  sessionId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  /* Added missing properties for visibility control and role tracking */
  authorRole?: string;
  visibility?: NoteVisibility;
}
