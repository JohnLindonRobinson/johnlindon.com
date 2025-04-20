import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import ServicesPage from '@/app/services/page';
import ServiceBookingPage from '@/app/services/book/page';
import BookingConfirmationPage from '@/app/services/confirmation/page';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock date-fns to control date/time in tests
jest.mock('date-fns', () => ({
  format: jest.fn().mockReturnValue('April 20, 2025'),
  addDays: jest.fn().mockImplementation((date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }),
}));

describe('Service Booking Flow', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('Service Selection', () => {
    it('should display available services with pricing', async () => {
      render(<ServicesPage />);
      const services = screen.getAllByRole('article', { name: /service card/i });
      
      expect(services).toHaveLength(4); // Assuming 4 main services
      services.forEach(service => {
        expect(within(service).getByRole('heading')).toBeInTheDocument();
        expect(within(service).getByText(/starting at/i)).toBeInTheDocument();
        expect(within(service).getByRole('button', { name: /book now/i })).toBeInTheDocument();
      });
    });

    it('should filter services by category', async () => {
      render(<ServicesPage />);
      const categoryFilter = screen.getByRole('combobox', { name: /service category/i });
      await userEvent.selectOptions(categoryFilter, 'development');
      
      const services = screen.getAllByRole('article', { name: /service card/i });
      expect(services).toHaveLength(2); // Assuming 2 development services
    });

    it('should navigate to service details', async () => {
      render(<ServicesPage />);
      const firstService = screen.getAllByRole('article', { name: /service card/i })[0];
      await userEvent.click(within(firstService).getByRole('button', { name: /learn more/i }));
      
      expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('/services/'));
    });
  });

  describe('Booking Process', () => {
    it('should select service package and options', async () => {
      render(<ServiceBookingPage serviceId="web-development" />);
      
      // Select package
      const packageSelect = screen.getByRole('radio', { name: /professional package/i });
      await userEvent.click(packageSelect);
      
      // Select add-ons
      const seoAddon = screen.getByRole('checkbox', { name: /seo optimization/i });
      await userEvent.click(seoAddon);
      
      expect(screen.getByText(/total:/i)).toHaveTextContent('$2,499');
    });

    it('should handle consultation scheduling', async () => {
      render(<ServiceBookingPage serviceId="web-development" />);
      
      // Select date
      const dateInput = screen.getByLabelText(/select date/i);
      await userEvent.click(dateInput);
      const futureDate = screen.getByRole('button', { name: /april 25/i });
      await userEvent.click(futureDate);
      
      // Select time
      const timeSelect = screen.getByRole('combobox', { name: /select time/i });
      await userEvent.selectOptions(timeSelect, '14:00');
      
      expect(screen.getByText(/confirmation/i)).toBeInTheDocument();
    });

    it('should validate booking requirements', async () => {
      render(<ServiceBookingPage serviceId="web-development" />);
      const submitButton = screen.getByRole('button', { name: /confirm booking/i });
      
      // Try to submit without required fields
      await userEvent.click(submitButton);
      
      expect(screen.getByText(/please select a package/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a date and time/i)).toBeInTheDocument();
    });
  });

  describe('Contact Information', () => {
    it('should collect client details', async () => {
      render(<ServiceBookingPage serviceId="web-development" />);
      
      // Fill contact form
      await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
      await userEvent.type(screen.getByLabelText(/phone/i), '1234567890');
      await userEvent.type(screen.getByLabelText(/project details/i), 'Need a business website');
      
      expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
    });

    it('should validate contact information', async () => {
      render(<ServiceBookingPage serviceId="web-development" />);
      
      // Submit with invalid email
      await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
      
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  describe('Booking Confirmation', () => {
    it('should display booking summary', async () => {
      render(<BookingConfirmationPage bookingId="123" />);
      
      expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument();
      expect(screen.getByText(/confirmation number/i)).toHaveTextContent('123');
      expect(screen.getByText(/next steps/i)).toBeInTheDocument();
    });

    it('should send confirmation email', async () => {
      const mockSendEmail = jest.fn();
      render(<BookingConfirmationPage bookingId="123" sendEmail={mockSendEmail} />);
      
      await waitFor(() => {
        expect(mockSendEmail).toHaveBeenCalledWith(
          expect.objectContaining({
            subject: expect.stringContaining('Booking Confirmation'),
          })
        );
      });
    });

    it('should allow booking modification', async () => {
      render(<BookingConfirmationPage bookingId="123" />);
      const modifyButton = screen.getByRole('button', { name: /modify booking/i });
      
      await userEvent.click(modifyButton);
      expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('/modify-booking/123'));
    });
  });

  describe('Accessibility and Navigation', () => {
    it('should maintain focus management', async () => {
      render(<ServiceBookingPage serviceId="web-development" />);
      
      // Navigate through form steps
      await userEvent.tab();
      expect(screen.getByLabelText(/service package/i)).toHaveFocus();
      
      await userEvent.tab();
      expect(screen.getByLabelText(/select date/i)).toHaveFocus();
    });

    it('should provide progress indication', async () => {
      render(<ServiceBookingPage serviceId="web-development" />);
      
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '33');
      expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
    });
  });
}); 