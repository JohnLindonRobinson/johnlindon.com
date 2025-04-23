import { useEffect, useRef } from 'react';

interface PerformanceData {
  loadTime: number;
  resourceSize: number;
}

const MotionCalendar = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    // Setup performance monitoring
    if (typeof PerformanceObserver !== 'undefined') {
      observerRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'resource' && entry.name.includes('usemotion.com')) {
            const performanceData: PerformanceData = {
              loadTime: entry.duration,
              resourceSize: (entry as PerformanceResourceTiming).encodedBodySize,
            };
            console.debug('Calendar Performance:', performanceData);
          }
        });
      });

      observerRef.current.observe({ entryTypes: ['resource'] });
    }

    // Cleanup observer on unmount
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Get user's timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const baseUrl = 'https://app.usemotion.com/meet/johnlindon/meeting';
  const calendarUrl = new URL(baseUrl);
  calendarUrl.searchParams.set('tz', timezone);

  const handleError = (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
    const target = e.target as HTMLIFrameElement;
    
    // Create fallback message element
    const fallback = document.createElement('div');
    fallback.className = 'p-4 text-center text-gray-700 dark:text-gray-300';
    
    if (!navigator.onLine) {
      fallback.textContent = 'Currently offline. Please check your internet connection.';
      fallback.setAttribute('data-testid', 'offline-message');
    } else {
      fallback.textContent = 'Unable to load calendar. Please try refreshing the page.';
    }

    // Replace iframe with fallback message
    target.parentNode?.appendChild(fallback);
    target.style.display = 'none';
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden">
      <iframe
        ref={iframeRef}
        src={calendarUrl.toString()}
        title="Motion Booking Page"
        width="100%"
        height="100%"
        frameBorder="0"
        className="border-0"
        onError={handleError}
        data-testid="calendar-iframe"
      />
    </div>
  );
};

export default MotionCalendar; 