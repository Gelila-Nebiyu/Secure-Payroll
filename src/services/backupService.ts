import { Backup, Resource, User } from '../types';
import { generateSignature } from './cryptoService';

export const createBackup = (resources: Resource[], users: User[], type: 'MANUAL' | 'AUTOMATIC'): Backup => {
  const timestamp = new Date().toISOString();
  
  // Simulate calculating size
  const dataString = JSON.stringify({ resources, users });
  const sizeBytes = new Blob([dataString]).size;
  
  // Encrypt the backup hash
  const encryptedHash = generateSignature(dataString);

  return {
    id: `bk_${Date.now()}`,
    timestamp,
    totalRecords: resources.length + users.length,
    sizeBytes,
    encryptedHash,
    status: 'SUCCESS',
    type
  };
};