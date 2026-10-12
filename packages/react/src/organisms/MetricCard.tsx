import React from 'react';

export interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  subtitle?: string;
  badge?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtitle,
  badge,
  trend,
  className = '',
}) => {
  return (
    <div className={`mcard ${className}`.trim()}>
      <div className="mc-top">
        <span className="mc-lbl">{label}</span>
        {badge}
      </div>
      <div className="mc-val">{value}</div>
      {(subtitle || trend) && (
        <div className="mc-sub">
          {trend && (
            <span
              style={{
                color: trend.isPositive ? 'var(--teal-700)' : 'var(--ruby-text)',
                fontWeight: 600,
                marginRight: '6px',
              }}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
