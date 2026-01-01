// Sensitivity Levels for MAC
export enum SensitivityLevel {
  PUBLIC = 0,
  INTERNAL = 1,
  CONFIDENTIAL = 2,
  TOP_SECRET = 3
}

// User Roles for RBAC
export enum UserRole {
  ADMIN = 'ADMIN',
  HR_MANAGER = 'HR_MANAGER',
  FINANCE_MANAGER = 'FINANCE_MANAGER',
  RESOURCE_CREATOR = 'RESOURCE_CREATOR',
  EMPLOYEE = 'EMPLOYEE',
  AUDITOR = 'AUDITOR',
  UNASSIGNED = 'UNASSIGNED'
}

// Departments for ABAC
export enum Department {
  IT = 'IT',
  HR = 'HR',
  FINANCE = 'FINANCE',
  SALES = 'SALES',
  EXECUTIVE = 'EXECUTIVE',
  GENERAL = 'GENERAL'
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  clearanceLevel: SensitivityLevel;
  avatar: string;
  ipAddress: string;
  passwordHash: string;
  salt: string;
  failedLoginAttempts: number;
  lockoutUntil: number | null;
  mfaEnabled: boolean;
  mfaSecret?: string;
  lastPasswordChange: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  expiresAt: number;
  user: User;
}

export interface LoginResult {
  success: boolean;
  session?: AuthSession;
  error?: string;
  mfaRequired?: boolean;
  tempUser?: User;
  lockoutRemaining?: number;
}

export interface Resource {
  _id: string;
  name: string;
  type: 'PAYROLL_RECORD' | 'PERFORMANCE_REVIEW' | 'LEAVE_REQUEST' | 'SYSTEM_CONFIG';
  content: string;
  ownerId: string;
  sensitivityLevel: SensitivityLevel;
  department: Department;
  accessControlList: string[];
  amount?: number;
  baseSalary?: number;
  tax?: number;
  deductions?: number;
  netPay?: number;
  status?: 'DRAFT' | 'PENDING' | 'PAID' | 'REJECTED';
  dateCreated: string;
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface AccessRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  resourceId: string;
  resourceName: string;
  status: RequestStatus;
  timestamp: string;
}

export enum LogSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export enum EventCategory {
  USER_ACTIVITY = 'USER_ACTIVITY',
  SYSTEM_EVENT = 'SYSTEM_EVENT',
  DATA_BACKUP = 'DATA_BACKUP',
  AUTH_EVENT = 'AUTH_EVENT'
}

export interface AccessLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userIp: string;
  resourceId?: string;
  resourceName?: string;
  action: string;
  granted: boolean;
  denialReason?: string;
  policyTypeTriggered: string;
  severity: LogSeverity;
  eventCategory: EventCategory;
  encryptedSignature: string;
}

export interface Backup {
  id: string;
  timestamp: string;
  totalRecords: number;
  sizeBytes: number;
  encryptedHash: string;
  status: 'SUCCESS' | 'FAILED';
  type: 'AUTOMATIC' | 'MANUAL';
}

export interface SystemState {
  currentTime: number;
  isWeekend: boolean;
}

export interface AccessResult {
  granted: boolean;
  reason: string;
  policyType: string;
}

export interface PolicyBreakdown {
  rubac: AccessResult;
  mac: AccessResult;
  rbac: AccessResult;
  abac: AccessResult;
  dac: AccessResult;
  finalDecision: boolean;
}