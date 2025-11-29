// Shared TypeScript types for the application

export type SecurityLabel = "public" | "internal" | "confidential"
export type UserStatus = "pending" | "active" | "suspended" | "locked"
export type PermissionAction = "create" | "read" | "update" | "delete" | "approve"
export type RequestStatus = "pending" | "approved" | "denied"
export type PolicyEffect = "allow" | "deny"

export interface User {
  id: string
  username: string
  email: string
  phone?: string
  firstName?: string
  lastName?: string
  departmentId?: string
  status: UserStatus
  securityLabel: SecurityLabel
  totpEnabled: boolean
  attributes: Record<string, unknown>
  employmentStatus: string
  location?: string
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: string
  name: string
  description?: string
  isSystemRole: boolean
  createdAt: string
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: PermissionAction
  description?: string
}

export interface PayrollRecord {
  id: string
  employeeId: string
  periodStart: string
  periodEnd: string
  baseSalary: number
  overtimePay: number
  deductions: number
  netSalary: number
  taxInfo: Record<string, unknown>
  labelId: string
  status: string
  createdBy: string
  approvedBy?: string
  approvedAt?: string
  createdAt: string
  updatedAt: string
}

export interface LeaveRequest {
  id: string
  employeeId: string
  leaveType: string
  startDate: string
  endDate: string
  daysRequested: number
  reason?: string
  status: RequestStatus
  approvedBy?: string
  approvedAt?: string
  createdAt: string
}

export interface AuditLog {
  id: string
  userId?: string
  action: string
  resourceType?: string
  resourceId?: string
  result: string
  metadataEncrypted?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export interface Session {
  id: string
  userId: string
  refreshTokenHash: string
  deviceInfo?: Record<string, unknown>
  ipAddress?: string
  expiresAt: string
  createdAt: string
  lastUsedAt: string
}
