import React, { forwardRef, useId } from 'react';
import { ChevronDownIcon } from './Icons';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      fullWidth = true,
      children,
      className = '',
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    return (
      <div
        className={`smartpark-select-group ${fullWidth ? 'group-full' : ''} ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''} ${className}`.trim()}
      >
        {label && (
          <label htmlFor={selectId} className="smartpark-select-label">
            {label}
            {required && <span className="label-required-indicator" aria-hidden="true"> *</span>}
          </label>
        )}

        <div className="select-wrapper">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className="smartpark-select"
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <span className="select-chevron" aria-hidden="true">
            <ChevronDownIcon size={16} />
          </span>
        </div>

        {error ? (
          <p id={errorId} className="smartpark-select-error" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="smartpark-select-helper">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
