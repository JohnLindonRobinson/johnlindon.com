import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../forms/ContactForm';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

// Reset mocks before each test
beforeEach(() => {
  mockFetch.mockReset();
  vi.clearAllMocks();
});

describe('ContactForm Security Tests', () => {
  describe('Input Sanitization', () => {
    test('prevents XSS in name field', async () => {
      const xssPayload = '<script>alert("xss")</script>';
      render(<ContactForm />);
      
      const nameInput = screen.getByLabelText(/name/i);
      await userEvent.type(nameInput, xssPayload);
      
      const submitButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
        const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(requestBody.name).not.toContain('<script>');
        expect(requestBody.name).toBe(xssPayload.replace(/<[^>]*>/g, ''));
      });
    });

    test('prevents SQL injection in message field', async () => {
      const sqlPayload = "DROP TABLE users; --";
      render(<ContactForm />);
      
      const messageInput = screen.getByLabelText(/message/i);
      await userEvent.type(messageInput, sqlPayload);
      
      const submitButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
        const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(requestBody.message).toBe(sqlPayload); // Should be escaped at API level
        expect(requestBody.message).not.toContain(';');
      });
    });

    test('validates email format strictly', async () => {
      const invalidEmails = [
        'test@.com',
        '@domain.com',
        'test@domain.',
        'test@domain',
        '<script>@domain.com',
        'test+injection@domain.com'
      ];

      render(<ContactForm />);
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /send/i });

      for (const email of invalidEmails) {
        await userEvent.clear(emailInput);
        await userEvent.type(emailInput, email);
        fireEvent.click(submitButton);

        await waitFor(() => {
          expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Rate Limiting', () => {
    test('prevents rapid form submissions', async () => {
      render(<ContactForm />);
      const submitButton = screen.getByRole('button', { name: /send/i });

      // Fill form with valid data
      await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/message/i), 'Test message');

      // Attempt multiple rapid submissions
      for (let i = 0; i < 5; i++) {
        fireEvent.click(submitButton);
      }

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(screen.getByText(/please wait/i)).toBeInTheDocument();
      });
    });
  });

  describe('CSRF Protection', () => {
    test('includes CSRF token in form submission', async () => {
      render(<ContactForm />);
      
      await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/message/i), 'Test message');

      const submitButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
        const requestHeaders = mockFetch.mock.calls[0][1].headers;
        expect(requestHeaders['X-CSRF-Token']).toBeDefined();
      });
    });
  });

  describe('Data Validation', () => {
    test('enforces maximum length limits', async () => {
      render(<ContactForm />);
      
      const longString = 'a'.repeat(1001);
      await userEvent.type(screen.getByLabelText(/message/i), longString);

      const submitButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/message too long/i)).toBeInTheDocument();
      });
    });

    test('validates required fields', async () => {
      render(<ContactForm />);
      
      const submitButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/message is required/i)).toBeInTheDocument();
      });
    });

    test('sanitizes special characters in all fields', async () => {
      const specialChars = '<>&"\'/\\';
      render(<ContactForm />);
      
      await userEvent.type(screen.getByLabelText(/name/i), specialChars);
      await userEvent.type(screen.getByLabelText(/email/i), `test${specialChars}@example.com`);
      await userEvent.type(screen.getByLabelText(/message/i), specialChars);

      const submitButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
        const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(requestBody.name).not.toContain('<');
        expect(requestBody.name).not.toContain('>');
        expect(requestBody.email).toBe('test@example.com');
        expect(requestBody.message).not.toContain('<');
        expect(requestBody.message).not.toContain('>');
      });
    });
  });

  describe('Error Handling', () => {
    test('handles network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      render(<ContactForm />);
      
      await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/message/i), 'Test message');

      const submitButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/unable to send message/i)).toBeInTheDocument();
        expect(screen.getByText(/please try again/i)).toBeInTheDocument();
      });
    });

    test('handles server errors with appropriate messages', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' })
      });

      render(<ContactForm />);
      
      await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/message/i), 'Test message');

      const submitButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/unable to send message/i)).toBeInTheDocument();
        expect(screen.getByText(/please try again later/i)).toBeInTheDocument();
      });
    });
  });
}); 