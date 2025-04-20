import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import Services from '../services/page';
import ServiceDetail from '../services/web-development/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the consultation booking API
const mockBookConsultation = jest.fn();
jest.mock('@/lib/api', () => ({
  bookConsultation: (...args: any[]) => mockBookConsultation(...args),
}));

describe('Service Discovery Flow', () => {
  const mockRouter = {
    push: jest.fn(),
    prefetch: jest.fn(),
    params: {
      serviceId: '',
    },
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockRouter.push.mockClear();
    mockBookConsultation.mockClear();
  });

  // Initial Service Exploration
  describe('Service Category Navigation', () => {
    it('displays all service categories with correct information', async () => {
      render(<Services />);

      // Verify main categories are displayed
      expect(screen.getByText(/web development/i)).toBeInTheDocument();
      expect(screen.getByText(/automation/i)).toBeInTheDocument();
      expect(screen.getByText(/edtech solutions/i)).toBeInTheDocument();
      expect(screen.getByText(/game tools/i)).toBeInTheDocument();

      // Check category descriptions
      expect(screen.getByText(/custom web applications/i)).toBeInTheDocument();
      expect(screen.getByText(/workflow automation/i)).toBeInTheDocument();
    });

    it('allows filtering services by technology', async () => {
      const user = userEvent.setup();
      render(<Services />);

      // Click technology filter
      const reactFilter = screen.getByRole('checkbox', { name: /react/i });
      await user.click(reactFilter);

      // Verify filtered results
      const serviceCards = screen.getAllByTestId('service-card');
      serviceCards.forEach(card => {
        expect(within(card).getByTestId('tech-stack')).toHaveTextContent(/react/i);
      });
    });
  });

  // Pricing Interaction
  describe('Pricing Comparison Interaction', () => {
    it('toggles between monthly and annual pricing', async () => {
      const user = userEvent.setup();
      render(<Services />);

      // Find and click annual toggle
      const annualToggle = screen.getByRole('switch', { name: /annual pricing/i });
      await user.click(annualToggle);

      // Verify annual prices are shown
      const priceElements = screen.getAllByTestId('price-amount');
      priceElements.forEach(price => {
        expect(price).toHaveAttribute('data-billing', 'annual');
      });
    });

    it('highlights price differences on comparison', async () => {
      const user = userEvent.setup();
      render(<Services />);

      // Click compare button
      const compareButton = screen.getByRole('button', { name: /compare plans/i });
      await user.click(compareButton);

      // Verify comparison view
      const comparisonTable = screen.getByTestId('price-comparison');
      expect(comparisonTable).toBeVisible();
      expect(within(comparisonTable).getAllByRole('row')).toHaveLength(10); // Header + 9 features
    });
  });

  // Service Detail Exploration
  describe('Service Details Interaction', () => {
    it('navigates to service detail page and displays full information', async () => {
      const user = userEvent.setup();
      render(<Services />);

      // Click on a service card
      const webDevCard = screen.getByText(/web development/i).closest('[data-testid="service-card"]');
      await user.click(webDevCard!);

      // Verify navigation
      expect(mockRouter.push).toHaveBeenCalledWith('/services/web-development');

      // Render detail page
      mockRouter.params.serviceId = 'web-development';
      render(<ServiceDetail />);

      // Verify detailed content
      expect(screen.getByRole('heading', { name: /web development/i })).toBeInTheDocument();
      expect(screen.getByTestId('tech-stack')).toBeInTheDocument();
      expect(screen.getByTestId('process-timeline')).toBeInTheDocument();
    });

    it('expands service features and benefits', async () => {
      const user = userEvent.setup();
      mockRouter.params.serviceId = 'web-development';
      render(<ServiceDetail />);

      // Find and click feature expansion
      const featureButton = screen.getByRole('button', { name: /view all features/i });
      await user.click(featureButton);

      // Verify expanded content
      const featureList = screen.getByTestId('feature-list');
      expect(featureList).toHaveAttribute('data-expanded', 'true');
      expect(within(featureList).getAllByRole('listitem')).toHaveLength(8);
    });
  });

  // FAQ Interaction
  describe('FAQ Interaction', () => {
    it('expands and collapses FAQ items', async () => {
      const user = userEvent.setup();
      render(<Services />);

      // Find and click FAQ item
      const faqQuestion = screen.getByText(/what is your development process/i);
      await user.click(faqQuestion);

      // Verify expansion
      const answer = screen.getByTestId('faq-answer');
      expect(answer).toBeVisible();
      expect(answer).toHaveAttribute('aria-expanded', 'true');

      // Collapse and verify
      await user.click(faqQuestion);
      expect(answer).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // Consultation Booking
  describe('Consultation Booking Flow', () => {
    it('completes consultation booking process', async () => {
      const user = userEvent.setup();
      mockRouter.params.serviceId = 'web-development';
      render(<ServiceDetail />);

      // Click book consultation
      const bookButton = screen.getByRole('button', { name: /book consultation/i });
      await user.click(bookButton);

      // Fill booking form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/project description/i), 'Need a web app');
      
      // Select time slot
      const timeSlot = screen.getByTestId('time-slot-selector');
      await user.click(within(timeSlot).getByText('10:00 AM'));

      // Submit booking
      await user.click(screen.getByRole('button', { name: /confirm booking/i }));

      // Verify submission
      expect(mockBookConsultation).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        projectDescription: 'Need a web app',
        serviceType: 'web-development',
        timeSlot: expect.any(String),
      });
    });

    it('handles booking validation and errors', async () => {
      const user = userEvent.setup();
      mockRouter.params.serviceId = 'web-development';
      render(<ServiceDetail />);

      // Click book without filling form
      const bookButton = screen.getByRole('button', { name: /book consultation/i });
      await user.click(bookButton);
      await user.click(screen.getByRole('button', { name: /confirm booking/i }));

      // Verify validation messages
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a time slot/i)).toBeInTheDocument();

      // Test failed submission
      mockBookConsultation.mockRejectedValueOnce(new Error('Booking failed'));
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(within(screen.getByTestId('time-slot-selector')).getByText('10:00 AM'));
      await user.click(screen.getByRole('button', { name: /confirm booking/i }));

      // Verify error message
      expect(screen.getByText(/failed to book consultation/i)).toBeInTheDocument();
    });
  });

  // Calendar Integration
  describe('Calendar Integration', () => {
    it('adds consultation to calendar after booking', async () => {
      const user = userEvent.setup();
      mockRouter.params.serviceId = 'web-development';
      mockBookConsultation.mockResolvedValueOnce({ 
        success: true, 
        calendarEvent: { 
          icsFile: 'data:text/calendar,', 
          googleCalendarLink: 'https://calendar.google.com' 
        } 
      });

      render(<ServiceDetail />);

      // Complete booking process
      await user.click(screen.getByRole('button', { name: /book consultation/i }));
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(within(screen.getByTestId('time-slot-selector')).getByText('10:00 AM'));
      await user.click(screen.getByRole('button', { name: /confirm booking/i }));

      // Verify calendar options
      await waitFor(() => {
        expect(screen.getByText(/add to calendar/i)).toBeInTheDocument();
        expect(screen.getByText(/google calendar/i)).toBeInTheDocument();
        expect(screen.getByText(/download ics/i)).toBeInTheDocument();
      });
    });
  });
}); 