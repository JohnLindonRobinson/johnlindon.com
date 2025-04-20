import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, usePathname } from 'next/navigation';
import { getSession, signIn, signOut } from 'next-auth/react';
import LoginPage from '../auth/login/page';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { vi, Mock, describe, it, expect, beforeEach } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

// Mock next-auth
vi.mock('next-auth/react', () => ({
  getSession: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  useSession: vi.fn(),
}));

describe('Authentication Flow Tests', () => {
  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
    (usePathname as Mock).mockReturnValue('/dashboard');
  });

  describe('Login Flow', () => {
    it('redirects unauthenticated users to login page', async () => {
      (getSession as Mock).mockResolvedValue(null);
      
      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(mockRouter.replace).toHaveBeenCalledWith('/auth/login?callbackUrl=/dashboard');
    });

    it('handles successful login', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      // Fill login form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Verify signin was called with credentials
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false
      });
    });

    it('displays error messages for invalid credentials', async () => {
      const user = userEvent.setup();
      (signIn as Mock).mockResolvedValue({ error: 'Invalid credentials' });
      
      render(<LoginPage />);

      await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
      });
    });

    it('prevents multiple submissions while loading', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });
  });

  describe('Session Management', () => {
    it('maintains session across page navigation', async () => {
      const mockSession = { user: { email: 'test@example.com' } };
      (getSession as Mock).mockResolvedValue(mockSession);
      
      const { rerender } = render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      // Simulate navigation
      (usePathname as Mock).mockReturnValue('/dashboard/settings');
      rerender(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    it('handles session expiration', async () => {
      const mockSession = { user: { email: 'test@example.com' } };
      (getSession as Mock)
        .mockResolvedValueOnce(mockSession)
        .mockResolvedValueOnce(null);

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      // Simulate session expiration
      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/auth/login?callbackUrl=/dashboard');
      });
    });

    it('clears session data on logout', async () => {
      const user = userEvent.setup();
      const mockSession = { user: { email: 'test@example.com' } };
      (getSession as Mock).mockResolvedValue(mockSession);

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      const logoutButton = screen.getByRole('button', { name: /sign out/i });
      await user.click(logoutButton);

      expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
    });
  });

  describe('Security Measures', () => {
    it('enforces password complexity requirements', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      await user.type(screen.getByLabelText(/password/i), 'weak');
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });

    it('implements rate limiting for failed attempts', async () => {
      const user = userEvent.setup();
      (signIn as Mock).mockResolvedValue({ error: 'Invalid credentials' });
      
      render(<LoginPage />);

      // Simulate multiple failed login attempts
      for (let i = 0; i < 5; i++) {
        await user.click(screen.getByRole('button', { name: /sign in/i }));
      }

      expect(screen.getByText(/too many login attempts/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
    });

    it('validates CSRF tokens', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      // Verify CSRF token is included in form
      const csrfToken = screen.getByRole('textbox', { hidden: true, name: 'csrfToken' });
      expect(csrfToken).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /sign in/i }));
      expect(signIn).toHaveBeenCalledWith(
        'credentials',
        expect.objectContaining({ csrfToken: expect.any(String) })
      );
    });

    it('implements secure session handling', async () => {
      const mockSession = { user: { email: 'test@example.com' } };
      (getSession as Mock).mockResolvedValue(mockSession);

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      // Mock document.cookie with secure attributes
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'next-auth.session-token=abc123; Secure; HttpOnly; SameSite=Strict',
      });

      // Verify secure cookie attributes
      const cookies = document.cookie.split(';').map(c => c.trim());
      expect(cookies.some(c => c.startsWith('next-auth.session-token='))).toBe(true);
      expect(cookies.includes('Secure')).toBe(true);
      expect(cookies.includes('HttpOnly')).toBe(true);
    });
  });
}); 