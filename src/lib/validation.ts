export function validateEmail(email: string): boolean {
  if (!email) return false;
  // More comprehensive email validation regex
  const emailRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
  const trimmedEmail = email.trim();
  if (trimmedEmail !== email) return false; // Reject if had leading/trailing spaces
  if (trimmedEmail.includes('..')) return false; // Reject consecutive dots
  return emailRegex.test(trimmedEmail);
}

/**
 * Sanitizes input by removing potentially malicious content
 * @param input - The input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: unknown): string {
  if (input === null || input === undefined) {
    return '';
  }

  let sanitized = String(input);

  // Remove script tags with content first
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove remaining HTML tags
  sanitized = sanitized.replace(/<[^>]*>?/g, '');
  
  // Remove dangerous patterns
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');

  // Convert newlines and tabs to spaces first
  sanitized = sanitized.replace(/[\n\r\t]/g, ' ');

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

  // Remove SQL keywords selectively
  sanitized = sanitized.replace(/\b(SELECT|DROP|UNION)\b/gi, '');

  // Remove SQL comments while preserving spaces
  sanitized = sanitized.replace(/\/\*.*?\*\//g, ' ');
  sanitized = sanitized.replace(/--\s*/g, ' ');

  // Normalize remaining whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  // Remove quotes at start/end
  sanitized = sanitized.replace(/^["']|["']$/g, '');

  // Limit length to prevent DOS
  return sanitized.slice(0, 5000);
} 