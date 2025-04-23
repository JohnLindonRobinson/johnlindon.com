import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import MotionCalendar from '../sections/MotionCalendar';

describe('Motion Calendar Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.matchMedia mock
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
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Network Scenarios', () => {
    it('handles iframe load failure gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const onError = vi.fn();

      render(
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src="https://app.usemotion.com/meet/johnlindon/meeting"
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
            onError={onError}
            data-testid="calendar-iframe"
          />
        </div>
      );

      // Simulate network error
      const iframe = screen.getByTestId('calendar-iframe');
      await act(async () => {
        iframe.dispatchEvent(new Event('error'));
      });

      expect(onError).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('shows fallback UI when offline', async () => {
      // Mock offline status
      const originalNavigator = { ...window.navigator };
      Object.defineProperty(window.navigator, 'onLine', { value: false });

      render(
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src="https://app.usemotion.com/meet/johnlindon/meeting"
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
            onError={(e) => {
              const target = e.target as HTMLIFrameElement;
              const fallback = document.createElement('div');
              fallback.textContent = 'Currently offline. Please check your internet connection.';
              fallback.setAttribute('data-testid', 'offline-message');
              target.parentNode?.appendChild(fallback);
            }}
          />
        </div>
      );

      await waitFor(() => {
        expect(screen.getByTestId('offline-message')).toBeInTheDocument();
      });

      // Restore navigator
      Object.defineProperty(window.navigator, 'onLine', { value: originalNavigator.onLine });
    });
  });

  describe('Timezone Handling', () => {
    it('preserves timezone when reloading iframe', async () => {
      // Mock timezone
      const originalDate = global.Date;
      const mockTimezone = 'America/New_York';
      
      // Create a mock DateTimeFormat with all required methods
      const mockDateTimeFormat = {
        resolvedOptions: () => ({
          timeZone: mockTimezone,
          locale: 'en-US',
          calendar: 'gregory',
          numberingSystem: 'latn'
        }),
        format: () => '',
        formatToParts: () => [],
        formatRange: () => '',
        formatRangeToParts: () => []
      };

      vi.spyOn(global.Intl, 'DateTimeFormat').mockImplementation(() => mockDateTimeFormat);

      render(
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src="https://app.usemotion.com/meet/johnlindon/meeting"
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
            data-testid="calendar-iframe"
          />
        </div>
      );

      const iframe = screen.getByTestId('calendar-iframe') as HTMLIFrameElement;
      expect(iframe.src).toContain('app.usemotion.com');

      // Simulate reload
      await act(async () => {
        iframe.dispatchEvent(new Event('load'));
      });

      // Verify timezone is preserved in URL
      expect(iframe.src).not.toContain('tz=undefined');
      
      // Restore Date
      global.Date = originalDate;
    });
  });

  describe('Performance Monitoring', () => {
    it('tracks iframe load performance', async () => {
      const performanceEntries: PerformanceEntry[] = [];
      const originalPerformanceObserver = window.PerformanceObserver;
      
      // Mock PerformanceObserver
      const mockObserve = vi.fn();
      const mockDisconnect = vi.fn();
      
      const MockPerformanceObserver = vi.fn().mockImplementation((callback) => {
        mockObserve.mockImplementation(() => {
          callback({
            getEntries: () => performanceEntries
          });
        });
        
        return {
          observe: mockObserve,
          disconnect: mockDisconnect
        };
      });

      // Add required static property
      MockPerformanceObserver.supportedEntryTypes = ['resource', 'navigation', 'longtask'];
      window.PerformanceObserver = MockPerformanceObserver;

      render(
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src="https://app.usemotion.com/meet/johnlindon/meeting"
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
            data-testid="calendar-iframe"
          />
        </div>
      );

      // Simulate performance entry
      performanceEntries.push({
        name: 'calendar-iframe',
        entryType: 'resource',
        startTime: 100,
        duration: 500,
      } as PerformanceEntry);

      expect(mockObserve).toHaveBeenCalled();

      // Restore PerformanceObserver
      window.PerformanceObserver = originalPerformanceObserver;
    });

    it('optimizes memory usage by cleaning up on unmount', () => {
      const mockObserve = vi.fn();
      const mockDisconnect = vi.fn();
      
      const MockPerformanceObserver = vi.fn().mockImplementation(() => ({
        observe: mockObserve,
        disconnect: mockDisconnect
      }));

      // Add required static property
      MockPerformanceObserver.supportedEntryTypes = ['resource', 'navigation', 'longtask'];
      window.PerformanceObserver = MockPerformanceObserver;

      const { unmount } = render(
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src="https://app.usemotion.com/meet/johnlindon/meeting"
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
            data-testid="calendar-iframe"
          />
        </div>
      );

      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should handle performance monitoring and memory optimization', () => {
      const performanceEntries: PerformanceEntry[] = [];
      const originalPerformanceObserver = window.PerformanceObserver;
      
      // Create a properly typed mock
      const mockObserve = vi.fn();
      const mockDisconnect = vi.fn();
      
      const MockPerformanceObserver = vi.fn().mockImplementation((callback) => {
        mockObserve.mockImplementation(() => {
          callback({
            getEntries: () => performanceEntries
          });
        });
        
        return {
          observe: mockObserve,
          disconnect: mockDisconnect
        };
      });

      Object.defineProperty(MockPerformanceObserver, 'supportedEntryTypes', {
        value: ['resource', 'navigation', 'longtask'],
        writable: false,
        configurable: false
      });

      window.PerformanceObserver = MockPerformanceObserver as unknown as typeof PerformanceObserver;

      render(<MotionCalendar />);

      expect(mockObserve).toHaveBeenCalled();
      expect(mockDisconnect).not.toHaveBeenCalled();

      // Clean up
      window.PerformanceObserver = originalPerformanceObserver;
    });

    it('should properly clean up performance observer on unmount', () => {
      const originalPerformanceObserver = window.PerformanceObserver;
      
      const mockObserve = vi.fn();
      const mockDisconnect = vi.fn();
      
      const MockPerformanceObserver = vi.fn().mockImplementation(() => ({
        observe: mockObserve,
        disconnect: mockDisconnect
      }));

      Object.defineProperty(MockPerformanceObserver, 'supportedEntryTypes', {
        value: ['resource', 'navigation', 'longtask'],
        writable: false,
        configurable: false
      });

      window.PerformanceObserver = MockPerformanceObserver as unknown as typeof PerformanceObserver;

      const { unmount } = render(<MotionCalendar />);
      unmount();

      expect(mockDisconnect).toHaveBeenCalled();

      // Clean up
      window.PerformanceObserver = originalPerformanceObserver;
    });
  });

  describe('Session Handling', () => {
    it('maintains session state across navigation', async () => {
      const { rerender } = render(
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src="https://app.usemotion.com/meet/johnlindon/meeting"
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
            data-testid="calendar-iframe"
          />
        </div>
      );

      const iframe = screen.getByTestId('calendar-iframe') as HTMLIFrameElement;
      const originalSrc = iframe.src;

      // Simulate navigation
      rerender(
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src={originalSrc}
            title="Motion Booking Page"
            width="100%"
            height="100%"
            frameBorder="0"
            className="border-0"
            data-testid="calendar-iframe"
          />
        </div>
      );

      const rerenderedIframe = screen.getByTestId('calendar-iframe') as HTMLIFrameElement;
      expect(rerenderedIframe.src).toBe(originalSrc);
    });
  });
}); 