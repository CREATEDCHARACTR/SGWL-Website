// Fix: Removed circular import of TemplateType from within the same file.
export enum TemplateType {
  PHOTOGRAPHY = 'PHOTOGRAPHY',
  VIDEOGRAPHY = 'VIDEOGRAPHY',
  WEBSITE = 'WEBSITE',
  AI_AGENT = 'AI_AGENT',
  PHOTO_VIDEO_SUBSCRIPTION = 'PHOTO_VIDEO_SUBSCRIPTION',
  GENERAL = 'GENERAL',
}

export enum ContractStatus {
  DRAFT = 'Draft',
  SENT = 'Sent',
  VIEWED = 'Viewed',
  REVISION_REQUESTED = 'Revision Requested',
  PARTIALLY_SIGNED = 'Partially Signed',
  COMPLETED = 'Completed',
  DECLINED = 'Declined',
  EXPIRED = 'Expired',
  ARCHIVED = 'Archived',
}

export enum PartyRole {
  PROVIDER = 'Provider',
  CLIENT = 'Client',
}

export enum AuditEventType {
  CREATED = 'created',
  SENT = 'sent',
  VIEWED = 'viewed',
  OTP_SENT = 'otp_sent',
  OTP_VERIFIED = 'otp_verified',
  SIGNED = 'signed',
  DECLINED = 'declined',
  DOWNLOADED = 'downloaded',
  HASH_VERIFIED = 'hash_verified',
  REVISED = 'revised',
  REVISION_REQUESTED = 'revision_requested',
  ARCHIVED = 'archived',
  UNARCHIVED = 'unarchived',
}

export enum SignatureFieldKind {
  SIGNATURE = 'signature',
  INITIAL = 'initial',
  DATE = 'date',
  TEXT = 'text',
  CHECKBOX = 'checkbox',
}

export enum VariableType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  PERCENTAGE = 'percentage',
}

export enum ReferralSource {
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral',
  GOOGLE = 'Google',
  OTHER = 'Other',
}

export enum SessionStatus {
  CONFIRMED = 'Confirmed',
  PENDING = 'Pending Confirmation',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}

export enum ClientStatus {
  HOT = '🔥 Hot Client',
  ACTIVE = '⭐ Active',
  COLD = '❄️ Cold Client',
  DO_NOT_WORK_WITH = '⛔ Do Not Work With',
}

export enum DoNotWorkWithReason {
  PAYMENT_ISSUES = 'Payment Issues',
  NO_SHOW = 'No-Show',
  DIFFICULT = 'Difficult to Work With',
  UNREASONABLE_DEMANDS = 'Unreasonable Demands',
  OTHER = 'Other',
}

export interface DoNotWorkWithInfo {
  reason: DoNotWorkWithReason;
  details: string;
  amountOwed?: number;
}

export enum NotificationType {
  CONTRACT_UNSIGNED = 'CONTRACT_UNSIGNED',
  CLIENT_UNCONTACTED = 'CLIENT_UNCONTACTED',
  STATUS_CHANGE_SUGGESTION = 'STATUS_CHANGE_SUGGESTION',
  REVISION_REQUESTED = 'REVISION_REQUESTED',
}

export interface Notification {
  id: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string; // ISO String
  title: string;
  message: string;
  clientId?: string;
  contractId?: string;
}

export enum EmailTemplateCategory {
  CONTRACT = 'Contract Messages',
  PAYMENT = 'Payment Messages',
  SESSION = 'Session Messages',
  REENGAGEMENT = 'Re-engagement Messages',
  POST_SESSION = 'Post-Session Messages',
}

export interface EmailTemplate {
  id: string;
  category: EmailTemplateCategory;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

// Invoice Types
export enum InvoiceStatus {
  DRAFT = 'Draft',
  SENT = 'Sent',
  VIEWED = 'Viewed',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
  CANCELLED = 'Cancelled',
}

export enum PaymentMethod {
  CARD = 'Credit/Debit Card',
  ZELLE = 'Zelle',
  CASH = 'Cash',
  CHECK = 'Check',
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number; // quantity * rate
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g., "INV-2024-001"
  clientId: string;
  clientName: string;
  clientEmail: string;
  contractId?: string; // Optional link to contract

  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number; // percentage (e.g., 0 for no tax, 7.5 for 7.5%)
  taxAmount: number;
  total: number;

  status: InvoiceStatus;
  dueDate: string; // ISO string
  issuedDate: string; // ISO string

  // Payment tracking
  paymentMethod?: PaymentMethod;
  paidDate?: string; // ISO string
  transactionId?: string; // Receipt/confirmation number

  notes?: string;

  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  auditTrail: AuditEvent[];
}

// Analytics Types
export enum GoalType {
  REVENUE = 'revenue',
  CLIENTS = 'clients',
  SESSIONS = 'sessions',
}

export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export interface Goal {
  id: string;
  type: GoalType;
  name: string;
  target: number;
  timeframe: {
    start: string; // ISO string
    end: string; // ISO string
  };
  status: GoalStatus;
  createdAt: string; // ISO string
}

export type DateRangeFilter = 'month' | 'year' | 'all';

export interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    allTime: number;
    averagePerClient: number;
    trend: Array<{ month: string, revenue: number }>;
    byService: Array<{ name: string; value: number }>;
  };
  clients: {
    total: number;
    newInPeriod: number;
    bySource: Array<{ name: string; count: number }>;
  };
  contracts: {
    active: number;
    pending: number;
  };
  sessions: {
    completedInPeriod: number;
    upcomingInPeriod: number;
  };
  goals: {
    [key: string]: {
      current: number;
      target: number;
    }
  };
}


// Fix: Add SignedPdfMode type for global use to ensure type consistency.
export type SignedPdfMode = 'strict' | 'visual';

export interface ChangeRecord {
  field: string;
  label: string;
  before: any;
  after: any;
}

export interface ContractVersion {
  version: number;
  createdAt: string; // ISO string
  modifiedBy: string; // e.g., "Saul Lowery" or "Client (Jane Doe)"
  changes: ChangeRecord[];
  variables: Record<string, any>;
}

export interface Variable {
  id: string;
  label: string;
  name: string;
  type: VariableType;
}

export interface Clause {
  id: string;
  name: string;
  label: string;
  content: string;
  defaultEnabled: boolean;
}

export interface Template {
  id: string;
  contractType: TemplateType;
  name: string;
  description: string[];
  quickDraftFields?: string[];
  bodyMd: string;
  variables: Variable[];
  questionFlow?: QuestionFlowItem[];
  clauses: Clause[];
  defaultValues: Record<string, any>;
}

export interface ContractClause {
  clause_key: string;
  values: Record<string, any>;
}

export interface ContractParty {
  id: string;
  contractId: string;
  role: PartyRole;
  name: string;
  email: string;
}

export interface SignatureField {
  id: string;
  partyId: string;
  kind: SignatureFieldKind;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RevisionRequest {
  partyId: string;
  message: string;
  createdAt: string; // ISO string
}

export interface ProjectTask {
  id: string;
  text: string;
  status: 'pending' | 'in-progress' | 'completed';
  deadline?: string; // ISO string
}

export interface Client {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
  };
  businessInfo: {
    referralSource?: ReferralSource;
    clientSince: string; // ISO string
    totalRevenue: number;
    contractCount: number;
    lastContact: string; // ISO string
  };
  status: ClientStatus;
  doNotWorkWithInfo?: DoNotWorkWithInfo | null;
  contracts: string[]; // Array of contract IDs
  sessions?: string[]; // Array of session IDs
  notes?: string;
  meta: {
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
    createdBy: string;
  }
}

export interface Session {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  contractId?: string;

  sessionDetails: {
    type: string;
    dateTime: string; // ISO string for start time
    duration: number; // in minutes
    location: string;
    notes?: string;
  };

  googleCalendar?: {
    eventId?: string;
    eventUrl?: string;
    inviteSent: boolean;
    inviteSentAt?: string; // ISO string
  };

  status: SessionStatus;

  reminders: {
    email24hr: boolean;
    email2hr: boolean;
    sent24hr: boolean;
    sent2hr: boolean;
  };

  meta: {
    createdAt: string; // ISO string
    createdBy: string;
    updatedAt: string; // ISO string
  };
}

export enum GalleryStatus {
  IN_PROGRESS = 'In Progress',
  READY = 'Ready for Review',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
}

export enum GalleryType {
  PROOFING = 'Photography Proofs',
  FINAL = 'Final Delivery',
  REVISION = 'Revision',
  WEBSITE_MILESTONE = 'Website Milestone',
  PORTFOLIO = 'Portfolio',
  OTHER = 'Other',
}

export interface Photo {
  photoId: string;
  filename: string;
  uploadedAt: string; // ISO string
  edited: boolean;
  editedAt?: string; // ISO string
  favorite: boolean;
  url: string; // URL to the image file in Cloud Storage
  // Fix: Add optional `thumbnailUrl` to support gallery grid views.
  thumbnailUrl?: string;
}

export interface ShareSettings {
  shareLink: string;
  customSlug?: string;
  passwordProtected: boolean;
  password?: string;
  expirationDate?: string; // ISO string
  downloadsEnabled: boolean;
  downloadLimit?: number; // null for unlimited
}

export interface AccessLogEntry {
  timestamp: string; // ISO string
  viewerId: string; // could be email or an anonymous ID
  action: 'view' | 'download';
  photosDownloaded?: number; // 'all' or a specific count
}

export interface GalleryAnalytics {
  totalViews: number;
  uniqueViewers: number;
  totalDownloads: number;
  lastAccessed?: string; // ISO string
  accessLog: AccessLogEntry[];
}

export interface Gallery {
  id: string;
  contractId: string;
  clientId: string;

  galleryInfo: {
    name: string;
    description: string;
    type: GalleryType;
    status: GalleryStatus;
    publishedAt?: string; // ISO string
    createdAt: string; // ISO string
    deliveryUrl?: string;
    instructions?: string;
  };

  photos?: Photo[];

  photoCounts: {
    total: number;
    edited: number;
  };

  shareSettings: ShareSettings;
  analytics: GalleryAnalytics;

  meta: {
    createdBy: string;
    lastModified: string; // ISO string
  };
}


export interface Contract {
  id: string;
  orgId: string;
  clientId?: string;
  contractType: TemplateType;
  title: string;
  clientName: string;
  clientEmail: string;
  status: ContractStatus;
  variables: Record<string, any>;
  fieldValues?: Record<string, string>;
  clauses: ContractClause[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  parties: ContractParty[];
  signatureFields: SignatureField[];
  auditTrail?: AuditEvent[];
  version: number;
  history?: ContractVersion[];
  revisionRequests?: RevisionRequest[];
  nextSteps?: ProjectTask[];
  requirements?: ProjectTask[];
  followUps?: ProjectTask[];
  pdfUrl?: string; // URL to the final, signed PDF if it exists
  galleryIds?: string[];
  delivery?: {
    googleDriveUrl?: string;
    heroImageUrl?: string;
    deliveredAt?: string; // ISO string
    emailSent?: boolean;
  };
}

export interface AuditEvent {
  id: string;
  eventType: AuditEventType;
  createdAt: string; // ISO string
  ip: string;
  userAgent: string;
  meta?: Record<string, any>;
}

export interface ClauseDefinition {
  key: string;
  title: string;
  service_types: TemplateType[];
  body_md: string;
  requires_followup_bool: boolean;
  followup_prompt?: string;
}

export interface QuestionFlowItem {
  key: string;
  question: string;
  required: boolean;
  enumOptions?: string[];
  default?: any;
  condition?: (values: Record<string, any>) => boolean;
}

export interface AddonCommand {
  command: string;
  followupKeys: string[];
  followupQuestions: string[];
  action: (values: Record<string, any>) => Record<string, any>;
}