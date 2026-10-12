import React from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarPresence = 'online' | 'busy' | 'offline';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name: string;
  size?: AvatarSize;
  presence?: AvatarPresence;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  presence,
  className = '',
  style,
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : '';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={`av ${sizeClass} ${className}`.trim()} title={name} style={style} {...props}>
      {src ? (
        <img src={src} alt={name} loading="lazy" />
      ) : (
        <span>{initials}</span>
      )}
      {presence && (
        <span
          className="pres"
          style={{
            backgroundColor:
              presence === 'online' ? '#10b981' : presence === 'busy' ? '#ef4444' : '#9ca3af',
          }}
          aria-label={`Presence: ${presence}`}
        />
      )}
    </div>
  );
};

export interface AvatarStackProps {
  children: React.ReactNode;
  max?: number;
  className?: string;
}

export const AvatarStack: React.FC<AvatarStackProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`av-stack ${className}`.trim()}>
      {children}
    </div>
  );
};
