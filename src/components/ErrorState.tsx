import React from 'react';
import { AlertCircleIcon, RefreshCwIcon } from './Icons';
import Button from './Button';
import './ErrorState.css';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  compact?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  compact = false,
  className = '',
}) => {
  return (
    <div
      className={`smartpark-error-state ${compact ? 'is-compact' : ''} ${className}`.trim()}
      role="alert"
    >
      <div className="error-state-icon-box">
        <AlertCircleIcon size={compact ? 20 : 28} aria-hidden="true" />
      </div>
      <div className="error-state-content">
        <h4 className="error-state-title">{title}</h4>
        <p className="error-state-message">{message}</p>
      </div>
      {onRetry && (
        <div className="error-state-action">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            icon={<RefreshCwIcon size={14} />}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
