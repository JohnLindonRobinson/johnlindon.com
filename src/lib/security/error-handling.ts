import { isError } from 'util';

interface ErrorMapping {
  pattern: RegExp;
  message: string;
}

const ERROR_MAPPINGS: ErrorMapping[] = [
  {
    pattern: /ECONNREFUSED|connection.*failed|unable to connect/i,
    message: 'The service is temporarily unavailable. Please try again later.',
  },
  {
    pattern: /invalid.*password|unauthorized|forbidden|invalid.*credentials/i,
    message: 'Authentication failed. Please check your credentials and try again.',
  },
  {
    pattern: /csrf.*token|token.*expired|invalid.*token/i,
    message: 'Your session has expired. Please refresh the page and try again.',
  },
  {
    pattern: /validation.*failed|invalid.*input/i,
    message: 'Please check your input and try again.',
  },
  {
    pattern: /rate.*limit|too.*many.*requests/i,
    message: 'Please wait a moment before trying again.',
  },
];

// Patterns for sensitive data that should be removed from error messages
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /key/i,
  /secret/i,
  /credential/i,
  /auth/i,
  /session/i,
  /ssn/i,
  /social.*security/i,
  /credit.*card/i,
  /card.*number/i,
  /banking/i,
  /account.*number/i,
];

/**
 * Sanitizes an error message by removing or redacting sensitive information
 */
export function sanitizeErrorMessage(message: string): string {
  let sanitized = message;
  
  // Redact potential sensitive information
  SENSITIVE_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  // Remove potential stack traces
  sanitized = sanitized.split('\n')[0];
  
  // Limit length
  return sanitized.slice(0, 200);
}

/**
 * Creates a user-friendly error message from various error types
 */
export function createUserErrorMessage(error: unknown): string {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') {
    return sanitizeErrorMessage(error);
  }
  
  if (isError(error)) {
    return sanitizeErrorMessage(error.message || error.toString());
  }
  
  if (error instanceof Response) {
    return `Request failed with status ${error.status}`;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Securely logs errors with context for debugging while ensuring sensitive data is protected
 */
export function secureErrorLog(error: unknown, context: Record<string, any> = {}): void {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    message: createUserErrorMessage(error),
    originalError: isError(error) ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
    context: JSON.parse(JSON.stringify(context)), // Deep clone to prevent mutations
  };

  // In production, you would want to send this to your logging service
  if (process.env.NODE_ENV === 'development') {
    console.error('[Secure Error Log]', errorInfo);
  }
} 