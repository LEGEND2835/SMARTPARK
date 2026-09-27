import React, { forwardRef, useId } from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = '',
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    return (
      <div
        className={`smartpark-input-group ${fullWidth ? 'group-full' : ''} ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''} ${className}`.trim()}
      >
        {label && (
          <label htmlFor={inputId} className="smartpark-input-label">
            {label}
            {required && <span className="label-required-indicator" aria-hidden="true"> *</span>}
          </label>
        )}

        <div className="input-wrapper">
          {leftIcon && <span className="input-icon-left" aria-hidden="true">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`smartpark-input ${leftIcon ? 'with-left-icon' : ''} ${rightIcon ? 'with-right-icon' : ''}`}
            {...props}
          />
          {rightIcon && <span className="input-icon-right" aria-hidden="true">{rightIcon}</span>}
        </div>

        {error ? (
          <p id={errorId} className="smartpark-input-error" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="smartpark-input-helper">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
