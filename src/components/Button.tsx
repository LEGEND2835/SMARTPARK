import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

export interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'tertiary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export type ButtonProps =
  | (BaseButtonProps & { to?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled'>)
  | (BaseButtonProps & { to: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>);

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  className = '',
  icon,
  iconPosition = 'left',
  to,
  ...props
}) => {
  const isActionDisabled = disabled || loading;
  const combinedVariant = variant === 'tertiary' ? 'outline' : variant;
  const combinedClassName = [
    'btn',
    `btn-${combinedVariant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    loading ? 'btn-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : (
        icon && iconPosition === 'left' && <span className="btn-icon btn-icon-left">{icon}</span>
      )}
      <span className="btn-label">{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
    </>
  );

  if (to && !isActionDisabled) {
    return (
      <Link
        to={to}
        className={combinedClassName}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={combinedClassName}
      disabled={isActionDisabled}
      aria-busy={loading ? 'true' : undefined}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
};

export default Button;
