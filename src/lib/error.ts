interface SanitizedError {
  message: string;
  code?: string;
  timestamp: string;
}

export function sanitizeError(error: unknown): SanitizedError {
  const timestamp = new Date().toISOString();

  if (error instanceof Error) {
    // Remove sensitive information from error message
    const sanitizedMessage = error.message
      .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[EMAIL]')
      .replace(/\b(?:\d[ -]*?){13,16}\b/g, '[CARD]')
      .replace(/password|secret|key|token/gi, '[SENSITIVE]');

    return {
      message: sanitizedMessage,
      code: error.name,
      timestamp,
    };
  }

  return {
    message: 'An unknown error occurred',
    timestamp,
  };
} 