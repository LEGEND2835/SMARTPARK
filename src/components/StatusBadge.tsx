import React from 'react';
import './StatusBadge.css';

export type StatusType =
  | 'available'
  | 'reserved'
  | 'occupied'
  | 'disabled'
  | 'active'
  | 'upcoming'
  | 'completed'
  | 'cancelled'
  | 'paid'
  | 'pending'
  | 'refunded'
  | 'open'
  | 'closed';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
}) => {
  const normalizedStatus = status.toLowerCase() as StatusType;
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`status-badge status-${normalizedStatus} size-${size}`}>
      <span className="status-dot" aria-hidden="true"></span>
      <span className="status-text">{displayLabel}</span>
    </span>
  );
};

export default StatusBadge;
