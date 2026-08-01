export type DiligenceCategory =
  | 'TITLE_OWNERSHIP'
  | 'TAXES_LIENS'
  | 'LEGAL_ACCESS'
  | 'ZONING_RESTRICTIONS'
  | 'ENVIRONMENTAL_FLOOD'
  | 'UTILITIES_SEPTIC'
  | 'SURVEY_BOUNDARIES'
  | 'HOA_POA_FEES'
  | 'CLOSING_REQUIREMENTS';

export type DiligenceStatus = 'PENDING' | 'IN_PROGRESS' | 'VERIFIED' | 'FAILED_BLOCKER' | 'EXEMPT';

export interface DueDiligenceItem {
  id: string;
  propertyId: string;
  category: DiligenceCategory;
  title: string;
  description: string;
  status: DiligenceStatus;
  isBlocker: boolean;
  assignedToUser?: string;
  dueDate?: string;
  verificationSource?: string;
  evidenceNotes?: string;
  evidenceFileUrls?: string[];
  reviewedBy?: string;
  reviewedAt?: string;
}
