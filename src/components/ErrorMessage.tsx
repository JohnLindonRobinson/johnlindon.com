import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createUserErrorMessage } from '../lib/security/error-handling';
import { useClickAway } from 'react-use';

interface ErrorMessageProps {
  error: unknown;
  onClose?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onClose,
  className = '',
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  // Handle clicking outside the error message
  useClickAway(ref, () => {
    if (onClose) onClose();
  });

  const message = createUserErrorMessage(error);

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="assertive"
      className={`relative rounded-lg bg-red-50 p-4 text-sm text-red-700 shadow-sm ring-1 ring-red-100 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-grow">
          <p className="font-medium">{message}</p>
        </div>
        
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex shrink-0 items-center justify-center rounded p-1 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            aria-label="Close error message"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}; 