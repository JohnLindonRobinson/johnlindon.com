import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from 'react-dom/test-utils';
import ContactForm from '../forms/ContactForm';
import '@testing-library/jest-dom';

describe('ContactForm Security Tests', () => {
  const mockFetch = vi.fn();
  const validFormData = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Subject',
    message: 'Test message content'
  };

  beforeEach(() => {
    mockFetch.mockReset();
    vi.clearAllMocks();
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  describe('Form Validation', () => {
    it('requires all fields to be filled', async () => {
      render(<ContactForm />);
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      expect(screen.getByTestId('name-input')).toBeInvalid();
      expect(screen.getByTestId('email-input')).toBeInvalid();
      expect(screen.getByTestId('subject-input')).toBeInvalid();
      expect(screen.getByTestId('message-input')).toBeInvalid();
    });

    it('validates email format', async () => {
      render(<ContactForm />);
      
      const emailInput = screen.getByTestId('email-input');
      await userEvent.type(emailInput, 'invalid-email');
      expect(emailInput).toBeInvalid();
      
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'valid@email.com');
      expect(emailInput).toBeValid();
    });
  });

  describe('Form Submission', () => {
    it('submits form data to the API endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' })
      });

      render(<ContactForm />);

      await userEvent.type(screen.getByTestId('name-input'), validFormData.name);
      await userEvent.type(screen.getByTestId('email-input'), validFormData.email);
      await userEvent.type(screen.getByTestId('subject-input'), validFormData.subject);
      await userEvent.type(screen.getByTestId('message-input'), validFormData.message);

      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(validFormData),
        });
      });
    });

    it('shows loading state during submission', async () => {
      mockFetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<ContactForm />);

      await userEvent.type(screen.getByTestId('name-input'), validFormData.name);
      await userEvent.type(screen.getByTestId('email-input'), validFormData.email);
      await userEvent.type(screen.getByTestId('subject-input'), validFormData.subject);
      await userEvent.type(screen.getByTestId('message-input'), validFormData.message);

      fireEvent.click(screen.getByTestId('submit-button'));

      expect(screen.getByTestId('submit-button')).toHaveTextContent('Sending...');
      expect(screen.getByTestId('submit-button')).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('displays error message on API failure', async () => {
      const errorMessage = 'Failed to send message';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: errorMessage })
      });

      render(<ContactForm />);

      await userEvent.type(screen.getByTestId('name-input'), validFormData.name);
      await userEvent.type(screen.getByTestId('email-input'), validFormData.email);
      await userEvent.type(screen.getByTestId('subject-input'), validFormData.subject);
      await userEvent.type(screen.getByTestId('message-input'), validFormData.message);

      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
      });
    });

    it('displays success message and resets form on successful submission', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' })
      });

      render(<ContactForm />);

      await userEvent.type(screen.getByTestId('name-input'), validFormData.name);
      await userEvent.type(screen.getByTestId('email-input'), validFormData.email);
      await userEvent.type(screen.getByTestId('subject-input'), validFormData.subject);
      await userEvent.type(screen.getByTestId('message-input'), validFormData.message);

      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toHaveTextContent('Message sent successfully');
      });

      expect(screen.getByTestId('name-input')).toHaveValue('');
      expect(screen.getByTestId('email-input')).toHaveValue('');
      expect(screen.getByTestId('subject-input')).toHaveValue('');
      expect(screen.getByTestId('message-input')).toHaveValue('');
    });
  });
}); 