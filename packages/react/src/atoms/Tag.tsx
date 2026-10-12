import React, { useState } from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'teal';
  onDismiss?: () => void;
  children: React.ReactNode;
}

export const Tag: React.FC<TagProps> = ({
  variant = 'default',
  onDismiss,
  children,
  className = '',
  style,
  ...props
}) => {
  const [isDismissing, setIsDismissing] = useState(false);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissing(true);
    setTimeout(() => {
      onDismiss?.();
    }, 180);
  };

  const variantClass = variant === 'teal' ? 'tag-teal' : '';
  const dismissingClass = isDismissing ? 'tag-dismissing' : '';

  return (
    <span
      className={`tag ${variantClass} ${dismissingClass} ${className}`.trim()}
      style={style}
      {...props}
    >
      <span>{children}</span>
      {onDismiss && (
        <button
          type="button"
          className="tag-remove"
          onClick={handleDismiss}
          aria-label="Remove tag"
        >
          ×
        </button>
      )}
    </span>
  );
};
