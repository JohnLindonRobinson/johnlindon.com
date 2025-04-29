import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Contact from '../page';

// Mock fetch
global.fetch = jest.fn();

describe('Contact Page', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  it('renders contact page with all sections and icons', () => {
    render(<Contact />);

    // Check main heading and intro text
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(
      screen.getByText("Let's discuss how I can help with your project")
    ).toBeInTheDocument();
    expect(screen.getByText('05 — CONTACT')).toBeInTheDocument();

    // Check contact information section with icons
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('john@johnlindon.com')).toBeInTheDocument();
    expect(screen.getByText('github.com/JohnLindonRobinson')).toBeInTheDocument();
    expect(screen.getByText('linkedin.com/in/johnlindonrobinson')).toBeInTheDocument();
    
    // Verify icons are present
    const envelopeIcons = screen.getAllByTestId('envelope-icon');
    expect(envelopeIcons.length).toBeGreaterThan(0);
    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
    expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();

    // Check schedule section with calendar icon
    expect(screen.getByText('Schedule a Call')).toBeInTheDocument();
    expect(screen.getByText('📅 Book a Meeting')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();

    // Check response time with clock icon
    expect(screen.getByText('Typical response time: 24 hours')).toBeInTheDocument();
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();

    // Check form elements and chat icon
    expect(screen.getByText('Send a Message')).toBeInTheDocument();
    expect(screen.getByTestId('chat-icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '💬 Let\'s Talk' })).toBeInTheDocument();
  });

  it('handles form submission successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Success' }),
    });

    render(<Contact />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Subject'), {
      target: { value: 'Test Subject' },
    });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Test Message' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: '💬 Let\'s Talk' }));

    // Check loading state
    expect(screen.getByRole('button', { name: '💬 Let\'s Talk' })).toBeDisabled();

    // Check success message
    await waitFor(() => {
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    });

    // Verify form was reset
    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Email')).toHaveValue('');
    expect(screen.getByLabelText('Subject')).toHaveValue('');
    expect(screen.getByLabelText('Message')).toHaveValue('');

    // Verify API call
    expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
      }),
    });
  });

  it('handles form submission errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to send message'));

    render(<Contact />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Subject'), {
      target: { value: 'Test Subject' },
    });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Test Message' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: '💬 Let\'s Talk' }));

    // Check error message
    await waitFor(() => {
      expect(screen.getByText('Failed to send message')).toBeInTheDocument();
    });

    // Form should not be reset on error
    expect(screen.getByLabelText('Name')).toHaveValue('Test User');
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
    expect(screen.getByLabelText('Subject')).toHaveValue('Test Subject');
    expect(screen.getByLabelText('Message')).toHaveValue('Test Message');
  });

  it('validates required fields', async () => {
    render(<Contact />);

    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: '💬 Let\'s Talk' }));

    // Check that fetch wasn't called
    expect(global.fetch).not.toHaveBeenCalled();

    // Check HTML5 validation
    const nameInput = screen.getByLabelText('Name');
    expect(nameInput).toBeInvalid();
    expect(nameInput).toHaveAttribute('required');

    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toBeInvalid();
    expect(emailInput).toHaveAttribute('required');

    const subjectInput = screen.getByLabelText('Subject');
    expect(subjectInput).toBeInvalid();
    expect(subjectInput).toHaveAttribute('required');

    const messageInput = screen.getByLabelText('Message');
    expect(messageInput).toBeInvalid();
    expect(messageInput).toHaveAttribute('required');
  });

  it('validates email format', () => {
    render(<Contact />);

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    expect(emailInput).toBeInvalid();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('has correct social links with proper attributes', () => {
    render(<Contact />);

    const githubLink = screen.getByText('github.com/JohnLindonRobinson').closest('a');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/JohnLindonRobinson');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    const linkedinLink = screen.getByText('linkedin.com/in/johnlindonrobinson').closest('a');
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://linkedin.com/in/johnlindonrobinson'
    );
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');

    const emailLink = screen.getByText('john@johnlindon.com').closest('a');
    expect(emailLink).toHaveAttribute('href', 'mailto:john@johnlindon.com');
  });

  it('has correct styling classes for visual elements', () => {
    render(<Contact />);

    // Check card backgrounds
    const cards = screen.getAllByRole('region');
    cards.forEach(card => {
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('border');
    });

    // Check form input styling
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toHaveClass('rounded-lg');
      expect(input).toHaveClass('transition-colors');
    });

    // Check button styling
    const submitButton = screen.getByRole('button', { name: '💬 Let\'s Talk' });
    expect(submitButton).toHaveClass('bg-purple-600');
    expect(submitButton).toHaveClass('hover:scale-[1.02]');
    expect(submitButton).toHaveClass('transition-all');
  });
}); 