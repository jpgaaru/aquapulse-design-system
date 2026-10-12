import React from 'react';

export type BadgeVariant = 'soft' | 'solid' | 'dark' | 'ruby' | 'amber' | 'emerald';
export type BeaconStatus = 'live' | 'crit' | 'normal';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  beacon?: BeaconStatus;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'soft',
  beacon,
  children,
  className = '',
  style,
  ...props
}) => {
  const variantClass = variant === 'solid' ? 'badge-solid'
    : variant === 'dark' ? 'badge-dark'
    : variant === 'ruby' ? 'badge-ruby'
    : variant === 'amber' ? 'badge-amber'
    : variant === 'emerald' ? 'badge-emerald'
    : 'badge-soft';

  return (
    <span className={`badge ${variantClass} ${className}`.trim()} style={style} {...props}>
      {beacon && (
        <span className={`beacon beacon-${beacon}`} style={{ marginRight: '6px' }}>
          <span className="beacon-dot" />
        </span>
      )}
      {children}
    </span>
  );
};
