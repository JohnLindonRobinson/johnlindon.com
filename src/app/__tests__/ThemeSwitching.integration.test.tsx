import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTheme } from 'next-themes';

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('Theme Switching Flow', () => {
  const mockTheme = {
    theme: 'light',
    setTheme: jest.fn(),
    systemTheme: 'light',
    themes: ['light', 'dark'],
  };

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue(mockTheme);
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  describe('Theme Toggle Interaction', () => {
    it('should switch theme when toggle is clicked', async () => {
      render(<Layout />);
      const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
      
      await userEvent.click(themeToggle);
      expect(mockTheme.setTheme).toHaveBeenCalledWith('dark');
      
      // Simulate theme change
      (useTheme as jest.Mock).mockReturnValue({ ...mockTheme, theme: 'dark' });
      
      // Verify UI updates
      expect(screen.getByTestId('theme-icon')).toHaveAttribute('data-theme', 'dark');
      expect(document.documentElement).toHaveClass('dark');
    });

    it('should persist theme preference', async () => {
      render(<Layout />);
      const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
      
      await userEvent.click(themeToggle);
      expect(localStorage.getItem('theme')).toBe('dark');
      
      // Unmount and remount to test persistence
      screen.unmount();
      render(<Layout />);
      
      expect(mockTheme.setTheme).toHaveBeenCalledWith('dark');
      expect(screen.getByTestId('theme-icon')).toHaveAttribute('data-theme', 'dark');
    });
  });

  describe('System Theme Integration', () => {
    it('should respect system theme preference initially', async () => {
      // Mock system dark theme
      (useTheme as jest.Mock).mockReturnValue({ ...mockTheme, systemTheme: 'dark' });
      
      render(<Layout />);
      expect(mockTheme.setTheme).toHaveBeenCalledWith('dark');
      expect(screen.getByTestId('theme-icon')).toHaveAttribute('data-theme', 'dark');
    });

    it('should update theme when system preference changes', async () => {
      render(<Layout />);
      
      // Simulate system theme change
      window.matchMedia('(prefers-color-scheme: dark)').matches = true;
      window.dispatchEvent(new Event('change-theme'));
      
      await waitFor(() => {
        expect(mockTheme.setTheme).toHaveBeenCalledWith('dark');
      });
    });
  });

  describe('Theme Transition Effects', () => {
    it('should apply transition classes during theme change', async () => {
      render(<Layout />);
      const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
      
      await userEvent.click(themeToggle);
      expect(document.documentElement).toHaveClass('theme-transition');
      
      // Wait for transition to complete
      await waitFor(() => {
        expect(document.documentElement).not.toHaveClass('theme-transition');
      }, { timeout: 1000 });
    });

    it('should handle rapid theme toggles gracefully', async () => {
      render(<Layout />);
      const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
      
      // Rapid toggles
      await userEvent.click(themeToggle);
      await userEvent.click(themeToggle);
      await userEvent.click(themeToggle);
      
      // Should debounce and only apply final state
      await waitFor(() => {
        expect(mockTheme.setTheme).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Component Theme Inheritance', () => {
    it('should update all themed components on change', async () => {
      render(
        <>
          <Layout />
          <Button variant="primary">Test Button</Button>
          <Card>Test Card</Card>
        </>
      );
      
      const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
      await userEvent.click(themeToggle);
      
      expect(screen.getByRole('button', { name: /test button/i }))
        .toHaveClass('dark:bg-primary-dark');
      expect(screen.getByRole('article'))
        .toHaveClass('dark:bg-card-dark');
    });

    it('should maintain consistent styling during navigation', async () => {
      render(<Layout />);
      
      // Set dark theme
      const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
      await userEvent.click(themeToggle);
      
      // Navigate to different page
      const aboutLink = screen.getByRole('link', { name: /about/i });
      await userEvent.click(aboutLink);
      
      // Theme should persist
      expect(document.documentElement).toHaveClass('dark');
      expect(mockTheme.theme).toBe('dark');
    });
  });
}); 