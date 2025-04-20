import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { encryptData, decryptData } from '@/lib/security/encryption';
import { sanitizeErrorMessage } from '@/lib/security/error-handling';
import { SecureForm } from '@/components/forms/SecureForm';
import { ErrorBoundary } from '@/components/ErrorBoundary';

describe('Client-Side Security', () => {
  describe('Local Storage Security', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should not store sensitive data in localStorage', () => {
      // Attempt to store sensitive data
      localStorage.setItem('password', 'test123');
      localStorage.setItem('token', 'bearer-token');
      localStorage.setItem('creditCard', '4111-1111-1111-1111');

      // Check that our security middleware prevents this
      expect(localStorage.getItem('password')).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('creditCard')).toBeNull();
    });

    it('should only allow whitelisted keys in localStorage', () => {
      // Allowed keys
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('language', 'en');
      localStorage.setItem('cookieConsent', 'true');

      expect(localStorage.getItem('theme')).toBe('dark');
      expect(localStorage.getItem('language')).toBe('en');
      expect(localStorage.getItem('cookieConsent')).toBe('true');
    });

    it('should enforce size limits on localStorage items', () => {
      const largeData = 'x'.repeat(1024 * 1024); // 1MB
      expect(() => {
        localStorage.setItem('largeItem', largeData);
      }).toThrow();
    });
  });

  describe('Form Data Security', () => {
    it('should encrypt sensitive form data before transmission', async () => {
      const mockSubmit = jest.fn();
      render(<SecureForm onSubmit={mockSubmit} />);

      // Fill form with sensitive data
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/message/i), 'Test message');

      // Submit form
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      // Check that data was encrypted before submission
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          email: expect.not.stringContaining('test@example.com'),
          message: expect.not.stringContaining('Test message'),
        })
      );
    });

    it('should properly decrypt encrypted form data', async () => {
      const testData = { email: 'test@example.com', message: 'Test message' };
      const encrypted = await encryptData(testData);
      const decrypted = await decryptData(encrypted);

      expect(decrypted).toEqual(testData);
    });

    it('should sanitize form inputs against XSS', async () => {
      const mockSubmit = jest.fn();
      render(<SecureForm onSubmit={mockSubmit} />);

      const xssScript = '<script>alert("xss")</script>';
      await userEvent.type(screen.getByLabelText(/message/i), xssScript);
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.not.stringContaining('<script>'),
        })
      );
    });
  });

  describe('Error Handling Security', () => {
    it('should sanitize error messages for display', () => {
      const sensitiveError = new Error('Error connecting to DB: password=123');
      const sanitizedMessage = sanitizeErrorMessage(sensitiveError);

      expect(sanitizedMessage).not.toContain('password');
      expect(sanitizedMessage).toMatch(/Error connecting to DB/);
    });

    it('should not expose stack traces in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Test error');
      render(
        <ErrorBoundary>
          <div>{(() => { throw error })()}</div>
        </ErrorBoundary>
      );

      expect(screen.queryByText(/stack trace/i)).not.toBeInTheDocument();
      expect(screen.queryByText(error.stack || '')).not.toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('should log errors securely without sensitive data', () => {
      const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
      const sensitiveError = new Error('Failed login for user@example.com with password123');

      // Trigger error logging
      render(
        <ErrorBoundary>
          <div>{(() => { throw sensitiveError })()}</div>
        </ErrorBoundary>
      );

      expect(mockConsoleError).toHaveBeenCalled();
      const loggedError = mockConsoleError.mock.calls[0][0];
      
      expect(loggedError).not.toContain('user@example.com');
      expect(loggedError).not.toContain('password123');
      
      mockConsoleError.mockRestore();
    });
  });

  describe('Clean Error Messages', () => {
    it('should display user-friendly error messages', async () => {
      const technicalError = new Error('ECONNREFUSED: Unable to connect to database at postgres://user:pass@localhost:5432/db');
      render(
        <ErrorBoundary>
          <div>{(() => { throw technicalError })()}</div>
        </ErrorBoundary>
      );

      expect(screen.getByText(/unable to connect to the service/i)).toBeInTheDocument();
      expect(screen.queryByText(/postgres/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/user:pass/i)).not.toBeInTheDocument();
    });

    it('should handle different types of errors appropriately', () => {
      const errors = [
        { input: new Error('Database connection timeout'), expected: /service is temporarily unavailable/i },
        { input: new Error('Invalid password for user admin'), expected: /authentication failed/i },
        { input: new Error('CSRF token mismatch'), expected: /session expired/i },
      ];

      errors.forEach(({ input, expected }) => {
        render(
          <ErrorBoundary>
            <div>{(() => { throw input })()}</div>
          </ErrorBoundary>
        );

        expect(screen.getByText(expected)).toBeInTheDocument();
      });
    });
  });
}); 