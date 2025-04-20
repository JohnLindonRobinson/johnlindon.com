import { renderHook, act } from '@testing-library/react';
import { useError } from '@/hooks/useError';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('useError Hook', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with null error state', () => {
    const { result } = renderHook(() => useError());
    
    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBeFalsy();
    expect(result.current.context).toBeUndefined();
  });

  it('should set error with context', () => {
    const { result } = renderHook(() => useError());
    const testError = new Error('Test error');
    const testContext = { userId: '123' };

    act(() => {
      result.current.setError(testError, testContext);
    });

    expect(result.current.error).toBe(testError);
    expect(result.current.hasError).toBeTruthy();
    expect(result.current.context).toEqual(testContext);
  });

  it('should clear error state', () => {
    const { result } = renderHook(() => useError({
      error: new Error('Initial error'),
      context: { test: true }
    }));

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBeFalsy();
    expect(result.current.context).toBeUndefined();
  });

  it('should handle string errors', () => {
    const { result } = renderHook(() => useError());
    const errorMessage = 'String error message';

    act(() => {
      result.current.setError(errorMessage);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.hasError).toBeTruthy();
  });

  it('should log errors when error logging is enabled', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    const { result } = renderHook(() => useError());
    const testError = new Error('Test error');

    act(() => {
      result.current.setError(testError);
    });

    expect(consoleSpy).toHaveBeenCalled();
  });
}); 