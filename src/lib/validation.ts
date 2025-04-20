export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Sanitizes input by removing potentially malicious content
 * @param input - The input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: unknown): string {
  // Handle non-string input
  if (input === null || input === undefined) {
    return '';
  }
  const str = String(input);

  // Remove HTML and script tags
  let sanitized = str.replace(/<[^>]*>?/g, '');

  // Remove script injection patterns
  sanitized = sanitized.replace(/javascript:|data:|vbscript:|expression\(|eval\(|on\w+\s*=|document\.|window\./gi, '');

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

  // Remove SQL injection patterns
  sanitized = sanitized.replace(/(\b(select|insert|update|delete|drop|union|exec|declare)\b)|(-{2}|\/\*|\*\/)/gi, '');

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  // Limit length to prevent DOS
  return sanitized.slice(0, 5000);
} 