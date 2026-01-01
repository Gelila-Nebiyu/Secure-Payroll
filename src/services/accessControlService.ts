

import { User, Resource, UserRole, SensitivityLevel, SystemState, AccessLog, LogSeverity } from '../types';
import { createUserLog } from './loggingService';

interface AccessResult {
  granted: boolean;
  reason: string;
  policyType: string;
}

// 1. Mandatory Access Control (MAC) Logic
const checkMAC = (user: User, resource: Resource): AccessResult => {
  if (user.clearanceLevel >= resource.sensitivityLevel) {
    return { granted: true, reason: 'MAC: Clearance sufficient.', policyType: 'MAC' };
  }
  return { 
    granted: false, 
    reason: `MAC: User clearance (${SensitivityLevel[user.clearanceLevel]}) is lower than resource sensitivity (${SensitivityLevel[resource.sensitivityLevel]}).`, 
    policyType: 'MAC' 
  };
};

// 2. Discretionary Access Control (DAC) Logic
const checkDAC = (user: User, resource: Resource): AccessResult => {
  if (user._id === resource.ownerId) {
    return { granted: true, reason: 'DAC: User is the resource owner.', policyType: 'DAC' };
  }
  if (resource.accessControlList.includes(user._id)) {
    return { granted: true, reason: 'DAC: User is explicitly listed in Access Control List (ACL).', policyType: 'DAC' };
  }
  return { granted: false, reason: 'DAC: User is not owner and not in ACL.', policyType: 'DAC' };
};

// 3. Role-Based Access Control (RBAC) Logic
const checkRBAC = (user: User, resource: Resource): AccessResult => {
  if (user.role === UserRole.ADMIN) return { granted: true, reason: 'RBAC: Admin has global access.', policyType: 'RBAC' };
  if (user.role === UserRole.UNASSIGNED) return { granted: false, reason: 'RBAC: Role UNASSIGNED has no access permissions.', policyType: 'RBAC' };

  const permissions: Record<UserRole, string[]> = {
    [UserRole.ADMIN]: ['*'],
    [UserRole.HR_MANAGER]: ['PAYROLL_RECORD', 'PERFORMANCE_REVIEW', 'SYSTEM_CONFIG', 'LEAVE_REQUEST'],
    [UserRole.FINANCE_MANAGER]: ['PAYROLL_RECORD', 'SYSTEM_CONFIG'],
    [UserRole.RESOURCE_CREATOR]: ['PAYROLL_RECORD', 'PERFORMANCE_REVIEW'], // Can create/view specific types
    [UserRole.EMPLOYEE]: ['SYSTEM_CONFIG', 'PERFORMANCE_REVIEW'],
    [UserRole.AUDITOR]: ['PAYROLL_RECORD', 'SYSTEM_CONFIG'],
    [UserRole.UNASSIGNED]: []
  };

  const allowedTypes = permissions[user.role];
  if (allowedTypes && (allowedTypes.includes('*') || allowedTypes.includes(resource.type))) {
    return { granted: true, reason: `RBAC: Role ${user.role} permits access to ${resource.type}.`, policyType: 'RBAC' };
  }

  return { granted: false, reason: `RBAC: Role ${user.role} restricts access to ${resource.type}.`, policyType: 'RBAC' };
};

// 4. Rule-Based Access Control (RuBAC) Logic
const checkRuBAC = (user: User, resource: Resource, systemState: SystemState): AccessResult => {
  if (resource.sensitivityLevel >= SensitivityLevel.CONFIDENTIAL) {
    if (systemState.isWeekend) {
      return { granted: false, reason: 'RuBAC: Confidential access denied on weekends.', policyType: 'RuBAC' };
    }
    if (systemState.currentTime < 8 || systemState.currentTime > 20) {
      return { granted: false, reason: 'RuBAC: Confidential access denied outside working hours (08:00 - 20:00).', policyType: 'RuBAC' };
    }
  }
  return { granted: true, reason: 'RuBAC: Environmental conditions met.', policyType: 'RuBAC' };
};

// 5. Attribute-Based Access Control (ABAC) Logic
const checkABAC = (user: User, resource: Resource): AccessResult => {
  if (resource.sensitivityLevel === SensitivityLevel.PUBLIC) {
    return { granted: true, reason: 'ABAC: Resource is Public.', policyType: 'ABAC' };
  }

  // Finance needs to see records from all depts if they are payroll records
  if (user.role === UserRole.FINANCE_MANAGER && resource.type === 'PAYROLL_RECORD') {
    return { granted: true, reason: 'ABAC: Finance override for Payroll.', policyType: 'ABAC' };
  }
  
  // Resource Creators can generally see what they created (handled by DAC), but maybe restricted by department
  if (user.role === UserRole.RESOURCE_CREATOR && user.department === resource.department) {
      return { granted: true, reason: 'ABAC: Creator access within department.', policyType: 'ABAC'};
  }

  if (user.role !== UserRole.ADMIN && user.role !== UserRole.AUDITOR) {
    if (user.department !== resource.department && !resource.accessControlList.includes(user._id)) {
       return { granted: false, reason: `ABAC: User department (${user.department}) does not match resource department (${resource.department}).`, policyType: 'ABAC' };
    }
  }

  return { granted: true, reason: 'ABAC: Attributes match policy.', policyType: 'ABAC' };
};

export const evaluateAccess = (user: User, resource: Resource, systemState: SystemState): AccessLog => {
  let granted = false;
  let reason = '';
  let policyType = '';
  
  // Evaluation Pipeline
  const rubac = checkRuBAC(user, resource, systemState);
  if (!rubac.granted) {
    granted = false; reason = rubac.reason; policyType = rubac.policyType;
  } else {
    const mac = checkMAC(user, resource);
    if (!mac.granted) {
      granted = false; reason = mac.reason; policyType = mac.policyType;
    } else {
      const rbac = checkRBAC(user, resource);
      if (!rbac.granted) {
        granted = false; reason = rbac.reason; policyType = rbac.policyType;
      } else {
        const abac = checkABAC(user, resource);
        const dac = checkDAC(user, resource);
        
        if (abac.granted) {
          granted = true; reason = abac.reason; policyType = abac.policyType;
        } else if (dac.granted) {
          granted = true; reason = dac.reason; policyType = dac.policyType + " (Override)";
        } else {
          granted = false; reason = abac.reason; policyType = abac.policyType;
        }
      }
    }
  }

  // Determine Severity
  let severity = LogSeverity.INFO;
  if (!granted) {
    severity = LogSeverity.WARNING;
    if (resource.sensitivityLevel === SensitivityLevel.TOP_SECRET) {
      severity = LogSeverity.CRITICAL;
    }
  }

  return createUserLog(
    user,
    'READ',
    resource.name,
    resource._id,
    granted,
    reason,
    policyType,
    severity
  );
};