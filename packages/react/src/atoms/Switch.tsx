import React from 'react';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  checked,
  onChange,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <label className={`switch-wrap ${disabled ? 'disabled' : ''} ${className}`.trim()} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      userSelect: 'none',
    }}>
      <span className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <i />
      </span>
      {label && (
        <span style={{ fontSize: 'var(--t-sm)', fontWeight: 600 }}>{label}</span>
      )}
    </label>
  );
};
