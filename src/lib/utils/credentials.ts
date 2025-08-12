import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes, randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production';

/**
 * Generate a secure temporary password
 */
export function generateTempPassword(length: number = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  
  // Ensure at least one character from each set
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a secure login token
 */
export function generateLoginToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Generate a unique session token
 */
export function generateSessionToken(): string {
  return randomUUID();
}

/**
 * Create a JWT token for authentication
 */
export function createJWTToken(payload: any, expiresIn: string = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
}

/**
 * Verify and decode a JWT token
 */
export function verifyJWTToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Generate complete credentials for a new interpreter
 */
export function generateInterpreterCredentials() {
  const tempPassword = generateTempPassword();
  const loginToken = generateLoginToken();
  const tokenExpiry = new Date();
  tokenExpiry.setHours(tokenExpiry.getHours() + 48); // 48 hours to first login
  
  return {
    tempPassword,
    loginToken,
    tokenExpiry,
  };
}
