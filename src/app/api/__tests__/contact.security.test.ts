import { POST } from '../contact/route';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { Headers } from 'next/dist/compiled/@edge-runtime/primitives';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// Mock dependencies
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    contactSubmission: {
      create: vi.fn().mockResolvedValue({ id: 'mock-id' }),
    },
  },
}));

// Mock NextRequest creation helper
const createMockRequest = (options: {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}) => {
  const headers = new Headers(options.headers || {});
  return new NextRequest('http://localhost:3000/api/contact', {
    method: options.method || 'POST',
    headers,
    body: options.body ? JSON.stringify(options.body) : null,
  });
};

describe('Contact API Security Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Input Validation', () => {
    it('rejects requests with missing required fields', async () => {
      const req = createMockRequest({
        body: {
          // Missing required fields
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('required');
    });

    it('rejects requests with invalid email format', async () => {
      const req = createMockRequest({
        body: {
          name: 'Test User',
          email: 'invalid-email',
          subject: 'Test Subject',
          message: 'Test message',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('email');
    });

    it('rejects requests with oversized payloads', async () => {
      const req = createMockRequest({
        body: {
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'a'.repeat(5001), // Exceeds limit
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(413);
      expect(data.error).toContain('too large');
    });
  });

  describe('Rate Limiting', () => {
    it('enforces rate limits per IP', async () => {
      const requests = Array(6).fill(null).map(() => 
        createMockRequest({
          body: {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'Test message',
          },
          headers: {
            'x-forwarded-for': '192.168.1.1',
            'x-csrf-token': 'valid-token-12345678901234567890123456789012',
          },
        })
      );

      let lastResponse: Response | undefined;
      for (const req of requests) {
        lastResponse = await POST(req);
      }

      // Last request should be rate limited
      expect(lastResponse).toBeDefined();
      expect(lastResponse!.status).toBe(429);
      const data = await lastResponse!.json();
      expect(data.error).toContain('too many requests');
    });
  });

  describe('CSRF Protection', () => {
    it('rejects requests without CSRF token', async () => {
      const req = createMockRequest({
        body: {
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test message',
        },
        // Missing CSRF token header
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toContain('CSRF');
    });

    it('validates CSRF token format', async () => {
      const req = createMockRequest({
        body: {
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test message',
        },
        headers: {
          'x-csrf-token': 'invalid-token-format',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toContain('invalid token');
    });
  });

  describe('Headers Security', () => {
    it('sets security headers in response', async () => {
      const req = createMockRequest({
        body: {
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test message',
        },
        headers: {
          'x-csrf-token': 'valid-token-12345678901234567890123456789012',
        },
      });

      const response = await POST(req);
      const headers = response.headers;

      expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(headers.get('X-Frame-Options')).toBe('DENY');
      expect(headers.get('Content-Security-Policy')).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('sanitizes error messages', async () => {
      const req = createMockRequest({
        body: {
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test message',
        },
        headers: {
          'x-csrf-token': 'valid-token-12345678901234567890123456789012',
        },
      });

      // Mock prisma to throw an error
      vi.mocked(prisma.contactSubmission.create).mockRejectedValueOnce(
        new Error('INTERNAL_DB_CONNECTION_STRING_WITH_PASSWORD')
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('An internal error occurred');
      expect(data.error).not.toContain('PASSWORD');
    });

    it('logs errors securely', async () => {
      const req = createMockRequest({
        body: {
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test message',
        },
        headers: {
          'x-csrf-token': 'valid-token-12345678901234567890123456789012',
        },
      });

      const error = new Error('Test error with sensitive@email.com');
      vi.mocked(prisma.contactSubmission.create).mockRejectedValueOnce(error);

      await POST(req);

      expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
        'Contact submission error',
        expect.objectContaining({
          message: expect.not.stringContaining('sensitive@email.com'),
        })
      );
    });
  });
}); 