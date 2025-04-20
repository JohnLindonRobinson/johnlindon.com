import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import Portfolio from '../portfolio/page';
import Contact from '../contact/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the contact form submission API
const mockSubmit = jest.fn();
jest.mock('@/lib/api', () => ({
  submitContactForm: (...args: any[]) => mockSubmit(...args),
}));

describe('Contact Journey Flow', () => {
  const mockRouter = {
    push: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockRouter.push.mockClear();
    mockSubmit.mockClear();
    // Clear session/local storage
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  // CTA to Contact Form Journey
  describe('CTA to Contact Form', () => {
    it('navigates from portfolio CTA to contact form', async () => {
      const user = userEvent.setup();
      render(<Portfolio />);

      // Find and click the CTA button
      const ctaButton = screen.getByText(/start your project/i);
      await user.click(ctaButton);

      // Verify navigation to contact page
      expect(mockRouter.push).toHaveBeenCalledWith('/contact');
    });

    it('preserves context when navigating from project to contact', async () => {
      const user = userEvent.setup();
      render(<Portfolio />);

      // Click a specific project first
      const projectCard = screen.getByText('TCQuick – E-Commerce Fulfillment Platform')
        .closest('[data-testid="project-card"]');
      await user.click(projectCard!);

      // Then navigate to contact
      render(<Contact />);

      // Verify project context is preserved in contact form
      const projectField = screen.getByLabelText(/project/i);
      expect(projectField).toHaveValue('TCQuick – E-Commerce Fulfillment Platform');
    });
  });

  // Form Interaction Flow
  describe('Form Interaction', () => {
    it('completes form with valid data', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      // Fill out the form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test project inquiry');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Verify submission
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test project inquiry',
      });
    });

    it('handles form validation and error states', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Check validation messages
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();

      // Fill with invalid email
      await user.type(screen.getByLabelText(/email/i), 'invalid-email');
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });

    it('shows loading state during submission', async () => {
      const user = userEvent.setup();
      mockSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 500)));
      render(<Contact />);

      // Fill out the form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');

      // Submit and check loading state
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });
  });

  // Form Submission and Feedback
  describe('Form Submission and Feedback', () => {
    it('shows success message after successful submission', async () => {
      const user = userEvent.setup();
      mockSubmit.mockResolvedValueOnce({ success: true });
      render(<Contact />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Verify success message
      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });
    });

    it('handles submission errors gracefully', async () => {
      const user = userEvent.setup();
      mockSubmit.mockRejectedValueOnce(new Error('Submission failed'));
      render(<Contact />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Verify error message
      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
      });
    });

    it('clears form after successful submission', async () => {
      const user = userEvent.setup();
      mockSubmit.mockResolvedValueOnce({ success: true });
      render(<Contact />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Verify form is cleared
      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveValue('');
        expect(screen.getByLabelText(/email/i)).toHaveValue('');
        expect(screen.getByLabelText(/message/i)).toHaveValue('');
      });
    });
  });

  // Form Data Persistence
  describe('Form Data Persistence', () => {
    it('saves form data to session storage while typing', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      // Type in form fields
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');

      // Verify session storage
      expect(JSON.parse(sessionStorage.getItem('contactForm') || '{}')).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('restores form data from session storage on page load', async () => {
      // Set up session storage
      sessionStorage.setItem('contactForm', JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }));

      render(<Contact />);

      // Verify form fields are populated
      expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
      expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
      expect(screen.getByLabelText(/message/i)).toHaveValue('Test message');
    });
  });
}); 