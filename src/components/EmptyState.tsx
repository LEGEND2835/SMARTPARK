import React from 'react';
import Button from './Button';
import './EmptyState.css';

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  to?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction | React.ReactNode;
  compact?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  compact = false,
  className = '',
}) => {
  return (
    <div
      className={`smartpark-empty-state ${compact ? 'is-compact' : ''} ${className}`.trim()}
    >
      {icon && <div className="empty-state-icon-box">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && (
        <div className="empty-state-action">
          {React.isValidElement(action) ? (
            action
          ) : (
            <Button
              to={(action as EmptyStateAction).to}
              onClick={(action as EmptyStateAction).onClick}
              variant={(action as EmptyStateAction).variant || 'primary'}
              icon={(action as EmptyStateAction).icon}
              size={compact ? 'sm' : 'md'}
            >
              {(action as EmptyStateAction).label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
