import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Encrypts data using AES-256-GCM
 * @param data - Data to encrypt
 * @returns Encrypted data as a base64 string
 */
export async function encryptData(data: any): Promise<string> {
  // Generate a random salt
  const salt = randomBytes(SALT_LENGTH);
  
  // Generate a random IV
  const iv = randomBytes(IV_LENGTH);
  
  // Create encryption key using PBKDF2
  const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'base64');
  
  // Create cipher
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  // Encrypt the data
  const jsonData = JSON.stringify(data);
  const encrypted = Buffer.concat([
    cipher.update(jsonData, 'utf8'),
    cipher.final()
  ]);
  
  // Get auth tag
  const tag = cipher.getAuthTag();
  
  // Combine IV, salt, tag and encrypted data
  const result = Buffer.concat([salt, iv, tag, encrypted]);
  
  // Return as base64
  return result.toString('base64');
}

/**
 * Decrypts data encrypted by encryptData
 * @param encryptedData - Base64 encrypted data
 * @returns Decrypted data
 */
export async function decryptData(encryptedData: string): Promise<any> {
  // Convert from base64
  const buffer = Buffer.from(encryptedData, 'base64');
  
  // Extract the pieces
  const salt = buffer.slice(0, SALT_LENGTH);
  const iv = buffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = buffer.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const encrypted = buffer.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  
  // Create key using PBKDF2
  const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'base64');
  
  // Create decipher
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  // Decrypt the data
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);
  
  // Parse and return the data
  return JSON.parse(decrypted.toString('utf8'));
} 