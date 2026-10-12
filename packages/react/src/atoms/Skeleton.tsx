import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  circle = false,
  className = '',
  style,
  ...props
}) => {
  const customStyle: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
    borderRadius: circle ? '50%' : undefined,
    ...style,
  };

  return (
    <div
      className={`${circle ? 'skeleton-circle' : 'skeleton'} ${className}`.trim()}
      style={customStyle}
      aria-hidden="true"
      {...props}
    />
  );
};
