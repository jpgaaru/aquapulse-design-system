import React, { useState } from 'react';

export interface DonutSegment {
  label: string;
  value: number; // percentage (e.g. 62)
  color: string;
  countLabel?: string;
}

export interface DonutChartProps {
  title?: string;
  subtitle?: string;
  segments: DonutSegment[];
  totalLabel?: string;
  totalValue?: string | number;
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  title = 'Coldstore Capacity Allocation',
  subtitle = 'Storage bay allocation · Interactive arc synchrony',
  segments,
  totalLabel = 'TOTAL CAPACITY',
  totalValue = '100%',
  className = '',
}) => {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);

  const R = 46;
  const C = 2 * Math.PI * R;
  let accumulatedOffset = 0;

  const currentVal = activeSegmentIndex !== null
    ? `${segments[activeSegmentIndex].value}%`
    : totalValue;
  const currentSub = activeSegmentIndex !== null
    ? segments[activeSegmentIndex].label.toUpperCase()
    : totalLabel;

  return (
    <div className={`viz-card ${className}`.trim()}>
      {(title || subtitle) && (
        <div className="viz-card-header">
          <div>
            {title && <div className="viz-card-title">{title}</div>}
            {subtitle && <div className="viz-card-sub">{subtitle}</div>}
          </div>
        </div>
      )}

      <div className="donut-card-inner">
        <div className="donut-svg-wrap">
          <svg viewBox="0 0 120 120">
            {/* Background Track */}
            <circle cx="60" cy="60" r={R} stroke="#f0f0f4" strokeWidth="13" fill="none" />

            {/* Segments */}
            {segments.map((seg, idx) => {
              const l = (seg.value / 100) * C;
              const dashoffset = -accumulatedOffset;
              accumulatedOffset += l;
              const isActive = activeSegmentIndex === idx;

              return (
                <circle
                  key={seg.label}
                  cx="60"
                  cy="60"
                  r={R}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={isActive ? 16 : 13}
                  strokeDasharray={`${l} ${C - l}`}
                  strokeDashoffset={dashoffset}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-width 0.2s, opacity 0.2s',
                    cursor: 'pointer',
                    opacity: activeSegmentIndex === null || isActive ? 1 : 0.6,
                  }}
                  onMouseEnter={() => setActiveSegmentIndex(idx)}
                  onMouseLeave={() => setActiveSegmentIndex(null)}
                />
              );
            })}
          </svg>

          {/* Center HUD */}
          <div className="donut-center-hud">
            <span className="donut-center-num">{currentVal}</span>
            <span className="donut-center-txt">{currentSub}</span>
          </div>
        </div>

        {/* Synchronized Legend */}
        <div className="donut-legend-col">
          {segments.map((seg, idx) => {
            const isActive = activeSegmentIndex === idx;

            return (
              <div
                key={seg.label}
                className={`donut-legend-item ${isActive ? 'active' : ''}`}
                onMouseEnter={() => setActiveSegmentIndex(idx)}
                onMouseLeave={() => setActiveSegmentIndex(null)}
              >
                <div className="dli-label">
                  <span className="dli-dot" style={{ backgroundColor: seg.color }} />
                  {seg.label}
                </div>
                <div className="dli-metrics">
                  {seg.countLabel && <span className="dli-count">{seg.countLabel}</span>}
                  <span className="dli-pct">{seg.value}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
