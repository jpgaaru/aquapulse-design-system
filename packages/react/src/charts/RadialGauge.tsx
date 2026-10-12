import React from 'react';

export interface RadialGaugeProps {
  score: number; // 0 to 100
  title?: string;
  subtitle?: string;
  statusBadge?: string;
  metricLabel?: string;
  className?: string;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({
  score,
  title = 'Real-Time Health Index',
  subtitle = 'Composite metric derived from DO, pH & Salinity',
  statusBadge = 'Optimal Zone · 94.2%',
  metricLabel = 'HEALTH SCORE',
  className = '',
}) => {
  const clampedScore = Math.max(0, Math.min(100, score));
  const cx = 110;
  const cy = 100;
  const r = 70;
  const startAngle = 160;
  const endAngle = 380;
  const totalSweep = endAngle - startAngle; // 220 deg
  const currentAngle = startAngle + (clampedScore / 100) * totalSweep;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const trackStart = { x: cx + r * Math.cos(toRad(startAngle)), y: cy + r * Math.sin(toRad(startAngle)) };
  const trackEnd = { x: cx + r * Math.cos(toRad(endAngle)), y: cy + r * Math.sin(toRad(endAngle)) };
  const fillEnd = { x: cx + r * Math.cos(toRad(currentAngle)), y: cy + r * Math.sin(toRad(currentAngle)) };

  const largeArcFill = (clampedScore / 100) * totalSweep > 180 ? 1 : 0;

  return (
    <div className={`viz-card ${className}`.trim()}>
      <div className="viz-card-header">
        <div>
          <div className="viz-card-title">{title}</div>
          {subtitle && <div className="viz-card-sub">{subtitle}</div>}
        </div>
      </div>

      <div className="gauge-card-inner">
        <div className="gauge-dial-wrap">
          <svg className="gauge-svg-frame" viewBox="0 0 220 132">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00b2cb" />
                <stop offset="100%" stopColor="#006c7a" />
              </linearGradient>
            </defs>

            {/* Track Arc */}
            <path
              d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 1 1 ${trackEnd.x} ${trackEnd.y}`}
              fill="none"
              stroke="#f0f0f4"
              strokeWidth="11"
              strokeLinecap="round"
            />

            {/* Value Arc */}
            <path
              d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${largeArcFill} 1 ${fillEnd.x} ${fillEnd.y}`}
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="11"
              strokeLinecap="round"
              style={{ transition: 'd 0.5s ease-out' }}
            />

            {/* Glowing Knob */}
            <circle
              cx={fillEnd.x}
              cy={fillEnd.y}
              r="7"
              fill="#ffffff"
              stroke="#00a4b7"
              strokeWidth="3.5"
            />
          </svg>

          {/* Center HUD */}
          <div className="gauge-hud-center">
            <span className="gauge-score">{score.toFixed(1)}</span>
            <span className="gauge-label">{metricLabel}</span>
          </div>
        </div>

        {/* Footer Meta Badge */}
        {statusBadge && (
          <div className="gauge-footer-meta">
            <span className="gauge-pill">{statusBadge}</span>
          </div>
        )}
      </div>
    </div>
  );
};
