import { AccessLog, EventCategory, LogSeverity, User } from '../types';
import { encryptLogData } from './cryptoService';

export const createSystemLog = (
  action: any,
  details: string,
  severity: LogSeverity = LogSeverity.INFO
): AccessLog => {
  const logBase = {
    timestamp: new Date().toISOString(),
    userId: 'SYSTEM',
    userName: 'SYSTEM',
    userIp: '127.0.0.1',
    action,
    denialReason: details,
    granted: true,
    policyTypeTriggered: 'SYSTEM',
    severity,
    eventCategory: EventCategory.SYSTEM_EVENT
  };

  return {
    id: Math.random().toString(36).substr(2, 9),
    ...logBase,
    encryptedSignature: encryptLogData(logBase)
  };
};

export const createUserLog = (
  user: User,
  action: any,
  resourceName: string | undefined,
  resourceId: string | undefined,
  granted: boolean,
  details: string,
  policyType: string,
  severity: LogSeverity
): AccessLog => {
  const logBase = {
    timestamp: new Date().toISOString(),
    userId: user._id,
    userName: user.name,
    userIp: user.ipAddress,
    action,
    resourceName,
    resourceId,
    granted,
    denialReason: details,
    policyTypeTriggered: policyType,
    severity,
    eventCategory: EventCategory.USER_ACTIVITY
  };

  return {
    id: Math.random().toString(36).substr(2, 9),
    ...logBase,
    encryptedSignature: encryptLogData(logBase)
  };
};