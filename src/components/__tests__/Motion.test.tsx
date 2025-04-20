import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, Mock, describe, it, expect, beforeEach } from 'vitest';
import { motion, AnimatePresence } from 'framer-motion';
import { MotionConfig } from 'framer-motion';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn().mockImplementation(({ children, ...props }) => (
      <div data-testid="motion-element" {...props}>
        {children}
      </div>
    )),
  },
  AnimatePresence: vi.fn().mockImplementation(({ children }) => <>{children}</>),
  MotionConfig: vi.fn().mockImplementation(({ children }) => <>{children}</>),
}));

describe('Motion Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Animation Tests', () => {
    it('applies correct initial animation properties', () => {
      render(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-testid="fade-in"
        >
          Content
        </motion.div>
      );

      const element = screen.getByTestId('fade-in');
      expect(element).toHaveAttribute('style', expect.stringContaining('opacity: 0'));
    });

    it('handles hover animations', async () => {
      render(
        <motion.div
          whileHover={{ scale: 1.1 }}
          data-testid="hover-element"
        >
          Hover me
        </motion.div>
      );

      const element = screen.getByTestId('hover-element');
      await userEvent.hover(element);
      expect(element).toHaveAttribute('style', expect.stringContaining('transform: scale(1.1)'));
    });

    it('executes exit animations', async () => {
      const { rerender } = render(
        <AnimatePresence>
          <motion.div
            exit={{ opacity: 0 }}
            data-testid="exit-element"
          >
            Content
          </motion.div>
        </AnimatePresence>
      );

      // Trigger exit animation
      rerender(<AnimatePresence />);
      await waitFor(() => {
        expect(screen.queryByTestId('exit-element')).not.toBeInTheDocument();
      });
    });
  });

  describe('Performance Tests', () => {
    it('respects reduced motion preferences', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: true,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      });
      window.matchMedia = mockMatchMedia;

      render(
        <MotionConfig reducedMotion="always">
          <motion.div data-testid="reduced-motion">Content</motion.div>
        </MotionConfig>
      );

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('optimizes animations for performance', async () => {
      const { container } = render(
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          data-testid="performance-element"
        >
          Content
        </motion.div>
      );

      // Check if using transform instead of top/left for better performance
      expect(container.innerHTML).toMatch(/transform:/);
      expect(container.innerHTML).not.toMatch(/top:|left:/);
    });

    it('handles concurrent animations efficiently', async () => {
      render(
        <>
          <motion.div
            animate={{ x: 100 }}
            transition={{ duration: 0.2 }}
            data-testid="concurrent-1"
          >
            Element 1
          </motion.div>
          <motion.div
            animate={{ x: 100 }}
            transition={{ duration: 0.2 }}
            data-testid="concurrent-2"
          >
            Element 2
          </motion.div>
        </>
      );

      const element1 = screen.getByTestId('concurrent-1');
      const element2 = screen.getByTestId('concurrent-2');

      // Both elements should animate simultaneously
      await waitFor(() => {
        expect(element1).toHaveAttribute('style', expect.stringContaining('transform'));
        expect(element2).toHaveAttribute('style', expect.stringContaining('transform'));
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('preserves ARIA attributes during animations', () => {
      render(
        <motion.div
          role="button"
          aria-label="Animated button"
          animate={{ scale: 1.1 }}
          data-testid="accessible-button"
        >
          Click me
        </motion.div>
      );

      const element = screen.getByTestId('accessible-button');
      expect(element).toHaveAttribute('role', 'button');
      expect(element).toHaveAttribute('aria-label', 'Animated button');
    });

    it('maintains focus during animations', async () => {
      render(
        <motion.button
          whileFocus={{ scale: 1.1 }}
          data-testid="focus-button"
        >
          Focus me
        </motion.button>
      );

      const button = screen.getByTestId('focus-button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('respects user motion preferences', () => {
      const mockReducedMotion = vi.fn();
      window.matchMedia = vi.fn().mockReturnValue({
        matches: true,
        addListener: mockReducedMotion,
        removeListener: vi.fn(),
      });

      render(
        <MotionConfig>
          <motion.div data-testid="motion-pref">Content</motion.div>
        </MotionConfig>
      );

      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });
  });

  describe('Integration Tests', () => {
    it('integrates with layout animations', async () => {
      const { rerender } = render(
        <motion.div
          layout
          data-testid="layout-element"
          style={{ width: '100px' }}
        >
          Content
        </motion.div>
      );

      // Change layout
      rerender(
        <motion.div
          layout
          data-testid="layout-element"
          style={{ width: '200px' }}
        >
          Content
        </motion.div>
      );

      const element = screen.getByTestId('layout-element');
      expect(element).toHaveAttribute('style', expect.stringContaining('width: 200px'));
    });

    it('handles gesture animations correctly', async () => {
      render(
        <motion.div
          whileTap={{ scale: 0.95 }}
          data-testid="gesture-element"
        >
          Tap me
        </motion.div>
      );

      const element = screen.getByTestId('gesture-element');
      await userEvent.click(element);
      expect(element).toHaveAttribute('style', expect.stringContaining('transform'));
    });
  });
}); 