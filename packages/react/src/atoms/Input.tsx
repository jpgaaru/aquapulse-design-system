import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  leadingIcon?: React.ReactNode;
  trailingUnit?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  hint,
  error = false,
  errorMessage,
  required = false,
  leadingIcon,
  trailingUnit,
  className = '',
  disabled,
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const inputClass = `input ${error ? 'err' : ''} ${className}`.trim();

  const renderInput = () => {
    if (leadingIcon || trailingUnit) {
      return (
        <div className="input-wrap">
          {leadingIcon && <span className="leading">{leadingIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={inputClass}
            aria-invalid={error}
            {...props}
          />
          {trailingUnit && <span className="trailing-unit">{trailingUnit}</span>}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        id={inputId}
        disabled={disabled}
        className={inputClass}
        aria-invalid={error}
        {...props}
      />
    );
  };

  return (
    <div className="field-block">
      {label && (
        <label htmlFor={inputId} className="label">
          <span>{label}</span>
          {required && <span className="req">*</span>}
        </label>
      )}
      {renderInput()}
      {hint && !errorMessage && <div className="hint">{hint}</div>}
      {error && errorMessage && (
        <div className="msg err">
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
