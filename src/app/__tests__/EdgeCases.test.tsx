import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import Portfolio from '../portfolio/page';
import { ReactNode } from 'react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('Edge Cases', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue('/');
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  describe('Navigation Edge Cases', () => {
    it('handles rapid navigation attempts', async () => {
      const user = userEvent.setup();
      render(<Layout><div>Test Content</div></Layout>);

      // Simulate rapid navigation clicks
      const portfolioLink = screen.getByRole('link', { name: /portfolio/i });
      const aboutLink = screen.getByRole('link', { name: /about/i });
      
      await user.click(portfolioLink);
      await user.click(aboutLink);
      await user.click(portfolioLink);

      // Should debounce and only navigate to the last requested route
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenLastCalledWith('/portfolio');
    });

    it('handles navigation with unsaved form data', async () => {
      const user = userEvent.setup();
      render(<Layout><div>Test Content</div></Layout>);

      // Fill a form
      const nameInput = screen.getByRole('textbox', { name: /name/i });
      await user.type(nameInput, 'Test User');

      // Try to navigate away
      const portfolioLink = screen.getByRole('link', { name: /portfolio/i });
      await user.click(portfolioLink);

      // Should show confirmation dialog
      expect(screen.getByRole('dialog')).toHaveTextContent(/unsaved changes/i);

      // Confirm navigation
      const continueButton = screen.getByRole('button', { name: /continue/i });
      await user.click(continueButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/portfolio');
    });

    it('handles browser back/forward navigation with filters', async () => {
      render(<Portfolio />);
      
      // Apply filter and navigate
      const filterInput = screen.getByPlaceholderText(/filter projects/i);
      await userEvent.type(filterInput, 'React');
      
      // Simulate browser back
      mockRouter.back();
      
      // Should restore previous filter state
      await waitFor(() => {
        expect(filterInput).toHaveValue('');
      });
      
      // Simulate browser forward
      mockRouter.forward();
      
      // Should restore filter state
      await waitFor(() => {
        expect(filterInput).toHaveValue('React');
      });
    });
  });

  describe('Error Handling Scenarios', () => {
    it('handles failed route transitions gracefully', async () => {
      render(<Layout><div>Test Content</div></Layout>);
      
      // Simulate navigation error
      mockRouter.push.mockRejectedValueOnce(new Error('Navigation failed'));
      
      const portfolioLink = screen.getByRole('link', { name: /portfolio/i });
      await userEvent.click(portfolioLink);
      
      // Should show error message
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/navigation failed/i);
      });
      
      // Should maintain current route
      expect(usePathname()).toBe('/');
    });

    it('handles invalid deep links', async () => {
      // Simulate invalid query parameters
      (useSearchParams as jest.Mock).mockReturnValue(
        new URLSearchParams('filter=<script>alert("xss")</script>')
      );
      
      render(<Portfolio />);
      
      // Should sanitize and handle invalid filter
      const filterInput = screen.getByPlaceholderText(/filter projects/i);
      expect(filterInput).toHaveValue('alert("xss")');
      
      // Should show filtered results or no results message
      expect(screen.getByTestId('project-grid')).toBeInTheDocument();
    });

    it('handles concurrent navigation requests', async () => {
      const user = userEvent.setup();
      render(<Layout><div>Test Content</div></Layout>);
      
      // Simulate concurrent navigation attempts
      const portfolioLink = screen.getByRole('link', { name: /portfolio/i });
      const aboutLink = screen.getByRole('link', { name: /about/i });
      
      // Click both links almost simultaneously
      await Promise.all([
        user.click(portfolioLink),
        user.click(aboutLink)
      ]);
      
      // Should only process the last navigation
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenLastCalledWith('/about');
    });

    it('handles navigation during data loading', async () => {
      render(<Portfolio />);
      
      // Simulate slow data loading
      jest.useFakeTimers();
      
      // Start navigation
      const filterInput = screen.getByPlaceholderText(/filter projects/i);
      await userEvent.type(filterInput, 'React');
      
      // Navigate away before loading completes
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await userEvent.click(aboutLink);
      
      // Should cancel pending data loading
      jest.runAllTimers();
      
      expect(mockRouter.push).toHaveBeenCalledWith('/about');
      
      jest.useRealTimers();
    });
  });
}); 