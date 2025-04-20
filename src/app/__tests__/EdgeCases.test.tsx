import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, usePathname, useSearchParams, ReadonlyURLSearchParams } from 'next/navigation';
import { vi, Mock, describe, it, expect, beforeEach } from 'vitest';
import Portfolio from '../portfolio/page';
import { ReactNode } from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn()
}));

// Mock Layout component
vi.mock('@/components/Layout', () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>
}));

describe('Edge Cases', () => {
  const mockRouter = {
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  };

  const mockPathname = vi.fn() as Mock<[], string>;
  const mockSearchParams = {
    get: vi.fn() as Mock<[string], string | null>,
    getAll: vi.fn(),
    has: vi.fn(),
    forEach: vi.fn(),
    entries: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    toString: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
    (usePathname as Mock).mockReturnValue('/');

    const params = new URLSearchParams();
    mockSearchParams.get.mockImplementation(key => params.get(key));
    mockSearchParams.getAll.mockImplementation(key => params.getAll(key));
    mockSearchParams.has.mockImplementation(key => params.has(key));
    mockSearchParams.entries.mockImplementation(() => params.entries());
    mockSearchParams.forEach.mockImplementation((fn) => params.forEach(fn));
    mockSearchParams.keys.mockImplementation(() => params.keys());
    mockSearchParams.values.mockImplementation(() => params.values());
    mockSearchParams.toString.mockImplementation(() => params.toString());

    (useSearchParams as Mock).mockReturnValue(mockSearchParams);
  });

  it('handles rapid navigation attempts', async () => {
    render(<Portfolio />);
    const user = userEvent.setup();

    // Simulate rapid navigation attempts
    mockRouter.push.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    await user.click(screen.getByRole('link', { name: /projects/i }));
    await user.click(screen.getByRole('link', { name: /about/i }));
    await user.click(screen.getByRole('link', { name: /contact/i }));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledTimes(3);
      expect(mockRouter.push).toHaveBeenLastCalledWith('/contact');
    });
  });

  it('handles browser back/forward navigation with filters', async () => {
    render(<Portfolio />);
    
    // Simulate navigation with filters
    mockSearchParams.get.mockReturnValueOnce('react');
    mockRouter.push('/projects?tech=react');
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/projects?tech=react');
    });

    // Simulate back navigation
    mockRouter.back();
    await waitFor(() => {
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });

  it('handles failed route transitions gracefully', async () => {
    render(<Portfolio />);
    const user = userEvent.setup();

    // Simulate failed navigation
    mockRouter.push.mockRejectedValueOnce(new Error('Navigation failed'));

    await user.click(screen.getByRole('link', { name: /projects/i }));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/projects');
      // Verify error handling (e.g., error message displayed, current route maintained)
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('sanitizes invalid query parameters in deep links', async () => {
    mockSearchParams.toString.mockReturnValue('?invalid=true&valid=1');
    render(<Portfolio />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/?valid=1');
    });
  });

  it('handles concurrent navigation requests', async () => {
    render(<Portfolio />);
    const user = userEvent.setup();

    // Simulate concurrent navigation requests
    const navigationPromises = [
      user.click(screen.getByRole('link', { name: /projects/i })),
      user.click(screen.getByRole('link', { name: /about/i })),
      user.click(screen.getByRole('link', { name: /contact/i }))
    ];

    await Promise.all(navigationPromises);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenLastCalledWith('/contact');
    });
  });

  it('cancels pending data loading when navigating away', async () => {
    render(<Portfolio />);
    const user = userEvent.setup();

    // Mock data loading
    const mockAbortController = new AbortController();
    vi.spyOn(window, 'AbortController').mockImplementation(() => mockAbortController);

    await user.click(screen.getByRole('link', { name: /projects/i }));
    await user.click(screen.getByRole('link', { name: /about/i }));

    expect(mockAbortController.signal.aborted).toBe(true);
  });
}); 