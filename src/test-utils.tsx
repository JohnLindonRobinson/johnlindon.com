import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

interface WrapperProps {
  children: React.ReactNode;
}

/**
 * Custom render function that includes common providers
 * Add any providers needed for testing here (e.g., ThemeProvider, etc.)
 */
function Wrapper({ children }: WrapperProps) {
  return <>{children}</>;
}

function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

/**
 * Creates a user event instance for testing interactions
 */
function setupUserEvent() {
  return userEvent.setup();
}

/**
 * Helper to wait for a condition to be true
 */
function waitFor(callback: () => boolean | Promise<boolean>, timeout = 1000) {
  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now();
    const check = async () => {
      try {
        if (await callback()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Timeout waiting for condition'));
        } else {
          setTimeout(check, 50);
        }
      } catch (error) {
        reject(error);
      }
    };
    check();
  });
}

export * from '@testing-library/react';
export { render, setupUserEvent, waitFor }; 