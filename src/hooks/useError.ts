import { useState, useCallback } from 'react';
import { secureErrorLog } from '../lib/security/error-handling';

export interface ErrorState {
  error: Error | string | null;
  context?: Record<string, any>;
}

export function useError(initialError: ErrorState = { error: null }) {
  const [errorState, setErrorState] = useState<ErrorState>(initialError);

  const setError = useCallback((error: Error | string | null, context: Record<string, any> = {}) => {
    if (error) {
      secureErrorLog(error, context);
    }
    setErrorState({ error, context });
  }, []);

  const clearError = useCallback(() => {
    setErrorState({ error: null });
  }, []);

  return {
    error: errorState.error,
    context: errorState.context,
    setError,
    clearError,
    hasError: !!errorState.error,
  };
} 