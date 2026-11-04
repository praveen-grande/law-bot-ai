export type Role = 'user' | 'admin' | 'superadmin';

export type SupportedLanguage = 'en' | 'te' | 'hi';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  authProvider: 'google' | 'password';
  preferredLanguage: SupportedLanguage;
  jurisdictionPreference: string;
  theme: 'light' | 'dark' | 'system';
  savedItemsCount: {
    bookmarks: number;
    savedCases: number;
    documents: number;
  };
}

export interface AdminCredential {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'superadmin';
  department: string;
  createdBy: string;
  createdAt: string;
  lastLogin?: string;
  status: 'Active' | 'Suspended';
}

export type DocumentType = 'Act' | 'Rule' | 'Judgment' | 'Notification' | 'Regulation';

export interface LegalSource {
  id: string;
  name: string;
  authority: string;
  domain: string;
  category: 'Legislation' | 'Judiciary' | 'Gazette' | 'Ministry';
  jurisdiction: 'Central' | 'State';
  status: 'Success' | 'Running' | 'Failed' | 'Pending';
  lastSync: string;
  docCount: number;
  syncFrequency: string; // e.g. "Every 10 days"
  notes?: string;
}

export interface StatutorySection {
  id: string;
  actId: string;
  actName: string;
  actYear: number;
  chapterNumber?: string;
  chapterTitle?: string;
  sectionNumber: string;
  title: string;
  statutoryText: string;
  simpleExplanation: string;
  simpleExplanationTe?: string;
  simpleExplanationHi?: string;
  status: 'In Force' | 'Amended' | 'Repealed' | 'Uncertain';
  jurisdiction: 'Central' | 'State';
  punishment?: string;
  keyIngredients: string[];
  relatedSections: string[];
  amendmentHistory?: string[];
  officialSourceUrl: string;
  lastVerifiedDate: string;
}

export interface CourtJudgment {
  id: string;
  caseTitle: string;
  citation: string;
  court: string;
  bench?: string;
  decisionDate: string;
  jurisdiction: 'Central' | 'State';
  state?: string;
  topics: string[];
  sectionsDiscussed: string[];
  aiSummary: string;
  keyHoldings: string[];
  judgmentSnippet: string;
  fullJudgmentUrl: string;
  citedCases: string[];
  bindingPrecedentStatus: string;
  isBookmarked?: boolean;
}

export interface LegalTopic {
  id: string;
  title: string;
  description: string;
  iconName: string;
  totalActs: number;
  totalJudgments: number;
  featuredActs: string[];
  recentUpdates: string;
}

export interface GroundedCitation {
  id: string;
  title: string;
  referenceType: DocumentType;
  authority: string;
  sectionOrPara?: string;
  url: string;
  verified: boolean;
  date?: string;
  relevanceSnippet?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language?: SupportedLanguage;
  sources?: GroundedCitation[];
  keyPoints?: string[];
  detectedIntent?: string;
  clarificationNeeded?: boolean;
  isSimulatedFallback?: boolean;
  modelUsed?: string;
  thinking?: string;
  liked?: boolean;
  disliked?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
  topic?: string;
}

export interface UploadedLegalDocument {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  pageCount: number;
  uploadDate: string;
  parties: {
    sellerOrFirstParty?: string;
    buyerOrSecondParty?: string;
    witnesses?: string[];
  };
  propertyOrSubject?: string;
  agreementDate?: string;
  summary: string;
  extractedClauses: { title: string; text: string; riskNote?: string }[];
  legalReferencesFound: string[];
  extractedRawText: string;
}

export interface FeedbackReport {
  id: string;
  type: 'Incorrect Citation' | 'Outdated Section' | 'Extraction Issue' | 'General Feedback';
  userEmail: string;
  description: string;
  contextUrl?: string;
  status: 'Open' | 'In Review' | 'Resolved';
  submittedAt: string;
  resolutionNotes?: string;
}

export interface SyncJobLog {
  id: string;
  sourceName: string;
  startTime: string;
  finishTime: string;
  status: 'Success' | 'Failed' | 'In Progress';
  newDocs: number;
  updatedDocs: number;
  duplicateDocs: number;
  failedDocs: number;
  details: string;
}

export type VerificationStatus = 'Verified' | 'Unverified' | 'Unknown';

export type ProcessingStatus =
  | 'pending'
  | 'extracted'
  | 'chunked'
  | 'indexed'
  | 'failed'
  | 'review-required';

export interface DocumentVersionRecord {
  versionId: string;
  contentHash: string;
  ingestedAt: string;
  amendmentDate?: string;
  commencementDate?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  summaryOfChanges?: string;
  textSnapshot: string;
  statusVerification: VerificationStatus;
}

export interface LegalDocumentMetadata {
  documentId: string;
  officialTitle: string;
  documentType: DocumentType | 'Constitution' | 'Subordinate Legislation' | 'Tribunal Decision' | 'Gazette Notification';
  jurisdiction: 'Central' | 'State' | 'Union Territory';
  stateOrUt?: string;
  actNumber?: string;
  actYear?: number;
  sectionRefs?: string[];
  court?: string;
  caseId?: string;
  citation?: string;
  judgmentDate?: string;
  enactmentDate?: string;
  commencementDate?: string;
  amendmentDates?: string[];
  effectiveFrom?: string;
  effectiveTo?: string;
  repealStatus?: 'In Force' | 'Amended' | 'Repealed' | 'Superseded' | 'Struck Down' | 'Unknown';
  statusVerification: VerificationStatus;
  language: SupportedLanguage | string;
  sourceUrl: string;
  publicationRef?: string;
  contentHash: string;
  ingestedAt: string;
  lastVerifiedAt: string;
  processingStatus: ProcessingStatus;
  versionId: string;
  ocrRequired?: boolean;
  collectionLabel?: string;
  rawText?: string;
  versions: DocumentVersionRecord[];
}

export interface LegalHierarchyNode {
  actName?: string;
  chapter?: string;
  section?: string;
  subsection?: string;
  clause?: string;
  explanation?: string;
  proviso?: string;
  schedule?: string;
  court?: string;
  caseTitle?: string;
  judgmentDate?: string;
  paragraphNumber?: string;
  citedAuthorities?: string[];
}

export interface LegalChunkRecord {
  chunkId: string;
  documentId: string;
  versionId: string;
  text: string;
  sanitizedText: string;
  documentType: LegalDocumentMetadata['documentType'];
  hierarchy: LegalHierarchyNode;
  hierarchyPath: string;
  actName?: string;
  sectionNumber?: string;
  court?: string;
  caseTitle?: string;
  citation?: string;
  jurisdiction: string;
  stateOrUt?: string;
  language: string;
  judgmentDate?: string;
  enactmentDate?: string;
  commencementDate?: string;
  effectiveFrom?: string;
  repealStatus?: string;
  statusVerification: VerificationStatus;
  sourceUrl: string;
  pageOrParaRef?: string;
  contentHash: string;
  embedding: number[];
  embeddingModel: string;
  embeddingVersion: string;
  indexedAt: string;
  isHistoricalVersion?: boolean;
}

export interface SourceRegistryEntry extends LegalSource {
  officialUrl: string;
  coverage: string[];
  accessMethod: 'Official Web Portal' | 'Bulk Dataset Import' | 'Public Gazette Feed' | 'OAI-PMH / API';
  rateLimitRpm: number;
  robotsCompliant: boolean;
  lastCheckedAt: string;
  limitations: string;
}

export interface IngestionJobRecord {
  jobId: string;
  jobType: 'single_import' | 'bulk_dataset_import' | 'scheduled_sync' | 'local_sc_2023_import';
  sourceId: string;
  sourceName: string;
  collectionLabel: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'review-required';
  totalItems: number;
  processedItems: number;
  newDocuments: number;
  updatedVersions: number;
  unchangedSkipped: number;
  failedItems: number;
  chunksCreated: number;
  embeddingsGenerated: number;
  checkpointIndex: number;
  lockedBy?: string;
  retryCount: number;
  startedAt: string;
  finishedAt?: string;
  errorDetails?: string[];
  reviewNotes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: Role | 'system';
  action: string;
  targetId: string;
  status: 'success' | 'warning' | 'error';
  details: string;
}

