import React from 'react';
import './LoadingState.css';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading SmartPark data...',
  size = 'md',
  fullPage = false,
  className = '',
}) => {
  return (
    <div
      className={`smartpark-loading-container ${fullPage ? 'is-full-page' : ''} ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <div className={`loading-spinner-ring spinner-${size}`} aria-hidden="true" />
      {message && <p className="loading-message-text">{message}</p>}
    </div>
  );
};

export default LoadingState;
