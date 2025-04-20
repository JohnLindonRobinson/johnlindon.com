import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '../ContactForm';
import { sanitizeInput } from '@/lib/validation';

// Mock sanitizeInput function
vi.mock('@/lib/validation', () => ({
  sanitizeInput: vi.fn((input: string) => input),
}));

// Mock fetch for default submission handler
global.fetch = vi.fn() as Mock;

describe('ContactForm Component', () => {
  let mockOnSubmit: Mock;

  beforeEach(() => {
    mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    (global.fetch as Mock).mockReset();
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Success' })
    });
    (sanitizeInput as Mock).mockClear();
  });

  it('renders all form fields with labels', () => {
    render(<ContactForm />);

    // Check labels
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();

    // Check submit button
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('updates form fields on user input', () => {
    render(<ContactForm />);

    // Get form inputs
    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    const subjectInput = screen.getByTestId('subject-input');
    const messageInput = screen.getByTestId('message-input');

    // Simulate user input
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });

    // Check if inputs were updated
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(subjectInput).toHaveValue('Test Subject');
    expect(messageInput).toHaveValue('Test Message');
  });

  it('handles successful form submission with default handler', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Success' }),
    });

    render(<ContactForm />);

    // Fill out the form
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('subject-input'), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'Test Message' } });

    // Submit the form
    fireEvent.click(screen.getByTestId('submit-button'));

    // Check loading state
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    // Check if form was reset
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('email-input')).toHaveValue('');
    expect(screen.getByTestId('subject-input')).toHaveValue('');
    expect(screen.getByTestId('message-input')).toHaveValue('');

    // Verify API call
    expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
      }),
    });
  });

  it('handles form submission with custom onSubmit handler', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Fill out the form
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('subject-input'), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'Test Message' } });

    // Submit the form
    fireEvent.click(screen.getByTestId('submit-button'));

    // Check if custom handler was called with correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test Message',
    });

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });
  });

  it('handles submission errors', async () => {
    const errorMessage = 'Failed to send message';
    (global.fetch as Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<ContactForm />);

    // Fill out and submit the form
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('subject-input'), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'Test Message' } });
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
    });

    // Form should not be reset on error
    expect(screen.getByTestId('name-input')).toHaveValue('John Doe');
    expect(screen.getByTestId('email-input')).toHaveValue('john@example.com');
    expect(screen.getByTestId('subject-input')).toHaveValue('Test Subject');
    expect(screen.getByTestId('message-input')).toHaveValue('Test Message');
  });

  it('validates required fields', () => {
    render(<ContactForm />);

    // Try to submit empty form
    fireEvent.click(screen.getByTestId('submit-button'));

    // Check HTML5 validation
    const nameInput = screen.getByTestId('name-input');
    expect(nameInput).toBeInvalid();
    expect(nameInput).toHaveAttribute('required');

    const emailInput = screen.getByTestId('email-input');
    expect(emailInput).toBeInvalid();
    expect(emailInput).toHaveAttribute('required');

    const subjectInput = screen.getByTestId('subject-input');
    expect(subjectInput).toBeInvalid();
    expect(subjectInput).toHaveAttribute('required');

    const messageInput = screen.getByTestId('message-input');
    expect(messageInput).toBeInvalid();
    expect(messageInput).toHaveAttribute('required');
  });

  it('validates email format', () => {
    render(<ContactForm />);

    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    expect(emailInput).toBeInvalid();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('applies custom className', () => {
    render(<ContactForm className="custom-class" />);
    
    const form = screen.getByRole('form');
    expect(form).toHaveClass('custom-class');
  });

  it('sanitizes input before submission', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const unsafeInput = {
      name: '<script>alert("xss")</script>John',
      email: 'john@example.com',
      subject: 'Test <img src=x onerror=alert(1)>',
      message: 'SELECT * FROM users;',
    };

    // Fill out the form with unsafe input
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: unsafeInput.name } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: unsafeInput.email } });
    fireEvent.change(screen.getByTestId('subject-input'), { target: { value: unsafeInput.subject } });
    fireEvent.change(screen.getByTestId('message-input'), { target: { value: unsafeInput.message } });

    // Submit the form
    fireEvent.click(screen.getByTestId('submit-button'));

    // Verify sanitizeInput was called for each field
    expect(sanitizeInput).toHaveBeenCalledWith(unsafeInput.name);
    expect(sanitizeInput).toHaveBeenCalledWith(unsafeInput.subject);
    expect(sanitizeInput).toHaveBeenCalledWith(unsafeInput.message);
    expect(sanitizeInput).toHaveBeenCalledTimes(3); // email is not sanitized
  });

  it('has correct form attributes and role', () => {
    render(<ContactForm />);
    const form = screen.getByRole('form');
    
    expect(form).toHaveAttribute('class', expect.stringContaining('space-y-4'));
    expect(form).toHaveAttribute('novalidate', '');
  });

  describe('Error Handling', () => {
    it('handles network errors', async () => {
      (global.fetch as Mock).mockRejectedValueOnce(new Error('Network error'));
      render(<ContactForm />);

      // Fill and submit form
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John' } });
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByTestId('subject-input'), { target: { value: 'Test' } });
      fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'Message' } });
      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Network error');
      });
    });

    it('handles server validation errors', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid email format' }),
      });

      render(<ContactForm />);

      // Fill and submit form
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John' } });
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'invalid-email' } });
      fireEvent.change(screen.getByTestId('subject-input'), { target: { value: 'Test' } });
      fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'Message' } });
      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid email format');
      });
    });

    it('handles unexpected server errors', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({}), // No error message from server
      });

      render(<ContactForm />);

      // Fill and submit form
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John' } });
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByTestId('subject-input'), { target: { value: 'Test' } });
      fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'Message' } });
      fireEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to send message');
      });
    });
  });
}); 