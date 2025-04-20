import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';
import Portfolio from '../portfolio/page';
import ContactForm from '@/components/forms/ContactForm';
import Layout from '@/components/Layout';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('Navigation State Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue('/');
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  describe('Portfolio Navigation State', () => {
    it('should maintain filter state during navigation', async () => {
      render(<Portfolio />);
      
      // Apply filters
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await userEvent.click(filterButton);
      
      const webDevFilter = screen.getByRole('checkbox', { name: /web development/i });
      await userEvent.click(webDevFilter);
      
      // Navigate away and back
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await userEvent.click(aboutLink);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/about');
      
      // Simulate back navigation
      (usePathname as jest.Mock).mockReturnValue('/portfolio');
      mockRouter.back();
      
      // Check if filters are preserved
      await waitFor(() => {
        expect(screen.getByRole('checkbox', { name: /web development/i })).toBeChecked();
      });
    });

    it('should update URL with search parameters', async () => {
      render(<Portfolio />);
      
      // Use search
      const searchInput = screen.getByRole('searchbox');
      await userEvent.type(searchInput, 'react');
      
      expect(mockRouter.push).toHaveBeenCalledWith('/portfolio?search=react');
      
      // Apply category filter
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await userEvent.click(filterButton);
      
      const reactFilter = screen.getByRole('checkbox', { name: /react/i });
      await userEvent.click(reactFilter);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/portfolio?search=react&category=react');
    });
  });

  describe('Form State Persistence', () => {
    it('should preserve form data during navigation interruption', async () => {
      render(<ContactForm />);
      
      // Fill form
      const nameInput = screen.getByRole('textbox', { name: /name/i });
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      
      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      
      // Simulate navigation away
      const portfolioLink = screen.getByRole('link', { name: /portfolio/i });
      await userEvent.click(portfolioLink);
      
      // Check for confirmation dialog
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      
      // Cancel navigation
      const stayButton = screen.getByRole('button', { name: /stay/i });
      await userEvent.click(stayButton);
      
      // Verify form data persists
      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
    });
  });

  describe('Loading State Management', () => {
    it('should show loading states during navigation', async () => {
      render(<Layout />);
      
      const portfolioLink = screen.getByRole('link', { name: /portfolio/i });
      await userEvent.click(portfolioLink);
      
      // Check loading indicator
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      
      // Simulate navigation complete
      (usePathname as jest.Mock).mockReturnValue('/portfolio');
      
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
    });

    it('should handle failed navigation gracefully', async () => {
      render(<Layout />);
      
      // Simulate failed navigation
      mockRouter.push.mockRejectedValueOnce(new Error('Navigation failed'));
      
      const errorLink = screen.getByRole('link', { name: /invalid/i });
      await userEvent.click(errorLink);
      
      // Check error handling
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/navigation failed/i);
      });
      
      // Verify current route maintained
      expect(usePathname()).toBe('/');
    });
  });

  describe('Deep Linking', () => {
    it('should handle deep linking with state restoration', async () => {
      // Simulate deep link with search params
      (useSearchParams as jest.Mock).mockReturnValue(
        new URLSearchParams('category=react&search=portfolio')
      );
      (usePathname as jest.Mock).mockReturnValue('/portfolio');
      
      render(<Portfolio />);
      
      // Verify state restored from URL
      await waitFor(() => {
        expect(screen.getByRole('checkbox', { name: /react/i })).toBeChecked();
        expect(screen.getByRole('searchbox')).toHaveValue('portfolio');
      });
    });
  });

  it('maintains form state during navigation', async () => {
    const user = userEvent.setup();
    const TestLayout = ({ children }: { children: ReactNode }) => (
      <Layout>{children}</Layout>
    );
    
    const { rerender } = render(
      <TestLayout>
        <ContactForm />
      </TestLayout>
    );

    // Test form state preservation
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    
    // Simulate navigation
    rerender(
      <TestLayout>
        <ContactForm />
      </TestLayout>
    );

    // Verify form state is preserved
    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
  });

  it('preserves scroll position after navigation', async () => {
    const user = userEvent.setup();
    const TestLayout = ({ children }: { children: ReactNode }) => (
      <Layout>{children}</Layout>
    );
    
    const { rerender } = render(
      <TestLayout>
        <Portfolio />
      </TestLayout>
    );

    // Simulate scrolling
    window.scrollTo(0, 500);
    
    // Simulate navigation
    rerender(
      <TestLayout>
        <Portfolio />
      </TestLayout>
    );

    // Verify scroll position is maintained
    expect(window.scrollY).toBe(500);
  });
}); 