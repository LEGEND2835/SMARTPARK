import React from 'react';
import { useTranslation } from '../i18n';
import {
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
  AlertCircleIcon,
} from './Icons';
import './StatusBadge.css';

export type StatusType =
  | 'available'
  | 'unavailable'
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
  | 'closed'
  | 'maintenance';

export interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  showIcon = false,
  className = '',
}) => {
  const { t } = useTranslation();
  const normalizedStatus = status.toLowerCase().trim() as StatusType;
  const statusKey = `status.${normalizedStatus}`;
  const localizedStatus = t(statusKey);
  const displayLabel = label || (localizedStatus !== statusKey ? localizedStatus : status.charAt(0).toUpperCase() + status.slice(1));

  const renderIcon = () => {
    if (!showIcon) {
      return <span className="status-dot" aria-hidden="true" />;
    }

    switch (normalizedStatus) {
      case 'available':
      case 'active':
      case 'paid':
      case 'open':
      case 'completed':
        return <CheckCircle2Icon size={size === 'sm' ? 12 : 14} className="status-icon" aria-hidden="true" />;
      case 'upcoming':
      case 'pending':
      case 'reserved':
        return <ClockIcon size={size === 'sm' ? 12 : 14} className="status-icon" aria-hidden="true" />;
      case 'cancelled':
      case 'occupied':
      case 'unavailable':
      case 'closed':
        return <XCircleIcon size={size === 'sm' ? 12 : 14} className="status-icon" aria-hidden="true" />;
      case 'disabled':
      case 'maintenance':
      case 'refunded':
      default:
        return <AlertCircleIcon size={size === 'sm' ? 12 : 14} className="status-icon" aria-hidden="true" />;
    }
  };

  return (
    <span
      className={`status-badge status-${normalizedStatus} size-${size} ${className}`.trim()}
      role="status"
    >
      {renderIcon()}
      <span className="status-text">{displayLabel}</span>
    </span>
  );
};

export default StatusBadge;
