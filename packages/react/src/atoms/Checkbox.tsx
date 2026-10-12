import React, { forwardRef } from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  checked,
  onChange,
  disabled,
  className = '',
  ...props
}, ref) => {
  return (
    <label className={`check ${disabled ? 'disabled' : ''} ${className}`.trim()} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      fontSize: 'var(--t-sm)',
      userSelect: 'none',
    }}>
      <input
        ref={ref}
        type="checkbox"
        className="ckbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
