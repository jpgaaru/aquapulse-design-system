import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'primary-deep' | 'secondary' | 'ghost' | 'dark' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'secondary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  className = '',
  disabled,
  style,
  ...props
}, ref) => {
  const baseClasses = 'btn';
  const variantClass = variant === 'primary' ? 'btn-primary'
    : variant === 'primary-deep' ? 'btn-primary-deep'
    : variant === 'dark' ? 'btn-dark'
    : variant === 'ghost' ? 'btn-ghost'
    : variant === 'danger' ? 'btn-danger'
    : 'btn-secondary';
  
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const fullWidthStyle: React.CSSProperties = fullWidth ? { width: '100%', justifyContent: 'center' } : {};

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`.trim()}
      style={{ ...fullWidthStyle, ...style }}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" aria-hidden="true" style={{
          width: '14px',
          height: '14px',
          border: '2px solid currentColor',
          borderRightColor: 'transparent',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'spin 0.6s linear infinite'
        }} />
      ) : iconLeft}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  );
});

Button.displayName = 'Button';
