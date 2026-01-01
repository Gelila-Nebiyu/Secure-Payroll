// Mock Crypto Service to simulate "Log Encryption" & Password Hashing
// In a real Node.js app, this would use the 'crypto' module (pbkdf2, randomBytes).

export const generateSignature = (data: any): string => {
  const jsonString = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  // Simulate a long SHA-256 style string
  return `enc_${Math.abs(hash).toString(16).padStart(8, '0')}x92f${Math.random().toString(36).substring(2, 15)}`;
};

export const encryptLogData = (logEntry: any): string => {
  // Simulating encrypting the sensitive parts of the log
  return generateSignature(logEntry);
};

// --- Password Security ---

export const generateSalt = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Simulating a slow hashing function (like bcrypt or Argon2)
export const hashPassword = (password: string, salt: string): string => {
  const combined = password + salt;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  // Return a mocked hash string that looks complex
  return `argon2id$v=19$m=65536,t=3,p=4$${btoa(salt)}$${btoa(hash.toString())}`;
};

export const generateAuthToken = (): string => {
  // Simulate JWT
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ exp: Date.now() + 3600000, iss: "sentinel-payroll" }));
  const signature = Math.random().toString(36).substring(2);
  return `${header}.${payload}.${signature}`;
};

export const validatePasswordStrength = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Minimum 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("At least one number");
  if (!/[!@#$%^&*]/.test(password)) errors.push("At least one special character");
  
  return { valid: errors.length === 0, errors };
};