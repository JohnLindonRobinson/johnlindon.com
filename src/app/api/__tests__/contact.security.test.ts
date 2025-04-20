import { createMocks, RequestMethod } from 'node-mocks-http';
import { POST } from '../contact/route';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

describe('Contact API Security Tests', () => {
  describe('Input Validation', () => {
    it('rejects requests with missing required fields', async () => {
      const { req } = createMocks<NextRequest>({
        method: 'POST' as RequestMethod,
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
      const { req } = createMocks<NextRequest>({
        method: 'POST' as RequestMethod,
        body: {
          name: 'Test User',
          email: 'invalid-email',
          message: 'Test message',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('email');
    });

    it('rejects requests with oversized payloads', async () => {
      const { req } = createMocks<NextRequest>({
        method: 'POST' as RequestMethod,
        body: {
          name: 'Test User',
          email: 'test@example.com',
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
    const mockRateLimit = vi.fn();
    beforeEach(() => {
      mockRateLimit.mockClear();
    });

    it('enforces rate limits per IP', async () => {
      const requests = Array(6).fill(null).map(() => 
        createMocks<NextRequest>({
          method: 'POST' as RequestMethod,
          body: {
            name: 'Test User',
            email: 'test@example.com',
            message: 'Test message',
          },
          headers: {
            'x-forwarded-for': '192.168.1.1',
          },
        })
      );

      for (const { req } of requests) {
        const response = await POST(req);
      }

      // Last request should be rate limited
      const lastResponse = requests[5].res;
      expect(lastResponse.status).toBe(429);
      const data = await lastResponse.json();
      expect(data.error).toContain('too many requests');
    });
  });

  describe('CSRF Protection', () => {
    it('rejects requests without CSRF token', async () => {
      const { req } = createMocks<NextRequest>({
        method: 'POST' as RequestMethod,
        body: {
          name: 'Test User',
          email: 'test@example.com',
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
      const { req } = createMocks<NextRequest>({
        method: 'POST' as RequestMethod,
        body: {
          name: 'Test User',
          email: 'test@example.com',
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
      const { req } = createMocks<NextRequest>({
        method: 'POST' as RequestMethod,
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
        },
        headers: {
          'x-csrf-token': 'valid-token',
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
      const { req } = createMocks<NextRequest>({
        method: 'POST' as RequestMethod,
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
        },
      });

      // Mock an internal error
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(
        new Error('INTERNAL_DB_CONNECTION_STRING_WITH_PASSWORD')
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('An internal error occurred');
      expect(data.error).not.toContain('PASSWORD');
    });

    it('logs errors securely', async () => {
      const mockLogger = vi.fn();
      const error = new Error('Test error');
      
      const { req } = createMocks<NextRequest>({
        method: 'POST' as RequestMethod,
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
        },
      });

      vi.spyOn(global, 'fetch').mockRejectedValueOnce(error);

      const response = await POST(req);

      expect(mockLogger).toHaveBeenCalledWith(
        expect.not.stringContaining('test@example.com')
      );
    });
  });
}); 