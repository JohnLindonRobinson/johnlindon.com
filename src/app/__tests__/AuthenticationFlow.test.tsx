import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, usePathname } from 'next/navigation';
import { getSession, signIn, signOut } from 'next-auth/react';
import LoginPage from '../auth/login/page';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  getSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(),
}));

describe('Authentication Flow Tests', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
  });

  describe('Login Flow', () => {
    it('redirects unauthenticated users to login page', async () => {
      (getSession as jest.Mock).mockResolvedValue(null);
      
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
      (signIn as jest.Mock).mockResolvedValue({ error: 'Invalid credentials' });
      
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
      (getSession as jest.Mock).mockResolvedValue(mockSession);
      
      const { rerender } = render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      // Simulate navigation
      (usePathname as jest.Mock).mockReturnValue('/dashboard/settings');
      rerender(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    it('handles session expiration', async () => {
      const mockSession = { user: { email: 'test@example.com' } };
      (getSession as jest.Mock)
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
      (getSession as jest.Mock).mockResolvedValue(mockSession);

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
      (signIn as jest.Mock).mockResolvedValue({ error: 'Invalid credentials' });
      
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
      (getSession as jest.Mock).mockResolvedValue(mockSession);

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      // Verify secure cookie attributes
      const cookies = document.cookie.split(';');
      const sessionCookie = cookies.find(cookie => cookie.includes('next-auth.session-token'));
      expect(sessionCookie).toMatch(/secure/i);
      expect(sessionCookie).toMatch(/httponly/i);
      expect(sessionCookie).toMatch(/samesite=strict/i);
    });
  });
}); 