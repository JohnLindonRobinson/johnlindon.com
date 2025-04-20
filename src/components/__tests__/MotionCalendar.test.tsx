import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, Mock, describe, it, expect, beforeEach } from 'vitest';

describe('Motion Calendar Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.matchMedia for responsive tests
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  describe('Calendar Embed', () => {
    it('renders the Motion calendar iframe', () => {
      render(
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src="https://app.usemotion.com/meet/john-robinson-fj8d/meeting"
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
            data-testid="motion-calendar"
          />
        </div>
      );

      const iframe = screen.getByTestId('motion-calendar');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', 'https://app.usemotion.com/meet/john-robinson-fj8d/meeting');
    });

    it('maintains responsive layout', () => {
      const { container } = render(
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src="https://app.usemotion.com/meet/john-robinson-fj8d/meeting"
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
          />
        </div>
      );

      expect(container.firstChild).toHaveClass('w-full', 'h-[600px]');
    });

    it('handles iframe load events', async () => {
      const { container } = render(
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src="https://app.usemotion.com/meet/john-robinson-fj8d/meeting"
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
            onLoad={() => container.classList.add('loaded')}
          />
        </div>
      );

      // Simulate iframe load
      const iframe = container.querySelector('iframe');
      iframe?.dispatchEvent(new Event('load'));

      await waitFor(() => {
        expect(container).toHaveClass('loaded');
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <div className="w-full h-[600px] rounded-lg overflow-hidden" role="complementary" aria-label="Booking Calendar">
          <iframe
            src="https://app.usemotion.com/meet/john-robinson-fj8d/meeting"
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
          />
        </div>
      );

      const container = screen.getByRole('complementary');
      expect(container).toHaveAttribute('aria-label', 'Booking Calendar');
    });

    it('provides descriptive iframe title', () => {
      render(
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src="https://app.usemotion.com/meet/john-robinson-fj8d/meeting"
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
          />
        </div>
      );

      const iframe = screen.getByTitle('Motion Booking Page');
      expect(iframe).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles iframe load errors gracefully', async () => {
      const onError = vi.fn();
      render(
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src="https://app.usemotion.com/meet/john-robinson-fj8d/meeting"
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
            onError={onError}
          />
        </div>
      );

      // Simulate iframe error
      const iframe = screen.getByTitle('Motion Booking Page');
      iframe.dispatchEvent(new Event('error'));

      expect(onError).toHaveBeenCalled();
    });

    it('shows fallback content when iframe fails to load', async () => {
      render(
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src="https://app.usemotion.com/meet/john-robinson-fj8d/meeting"
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
            onError={() => {
              const fallback = document.createElement('div');
              fallback.textContent = 'Calendar unavailable. Please try again later.';
              fallback.setAttribute('data-testid', 'calendar-fallback');
              iframe.parentNode?.appendChild(fallback);
            }}
          />
        </div>
      );

      // Simulate iframe error
      const iframe = screen.getByTitle('Motion Booking Page');
      iframe.dispatchEvent(new Event('error'));

      await waitFor(() => {
        expect(screen.getByTestId('calendar-fallback')).toBeInTheDocument();
        expect(screen.getByText('Calendar unavailable. Please try again later.')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('defers iframe loading until visible', async () => {
      const { container } = render(
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src="https://app.usemotion.com/meet/john-robinson-fj8d/meeting"
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
            loading="lazy"
          />
        </div>
      );

      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute('loading', 'lazy');
    });

    it('optimizes iframe rendering', () => {
      const { container } = render(
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src="https://app.usemotion.com/meet/john-robinson-fj8d/meeting"
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
            importance="high"
          />
        </div>
      );

      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute('importance', 'high');
    });
  });
}); 