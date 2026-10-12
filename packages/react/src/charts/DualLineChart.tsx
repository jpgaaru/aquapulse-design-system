import React, { useState, useRef, useCallback } from 'react';

export interface DataPoint {
  time: string;
  doValue: number;    // Dissolved oxygen (e.g. 6.84)
  tempValue: number;  // Water temp in Celsius (e.g. 28.4)
}

export interface DualLineChartProps {
  title?: string;
  subtitle?: string;
  data: DataPoint[];
  className?: string;
}

export const DualLineChart: React.FC<DualLineChartProps> = ({
  title = 'Synchronized Dissolved Oxygen & Thermal Curve',
  subtitle = 'Dual-Axis Telemetry · Continuous probe synchrony with touch scrubbing',
  data,
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(data.length - 1);
  const containerRef = useRef<HTMLDivElement>(null);

  const W = 620;
  const H = 200;
  const padL = 40;
  const padR = 40;
  const padT = 20;
  const padB = 30;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const minDO = 4.0;
  const maxDO = 8.5;
  const minTemp = 25.0;
  const maxTemp = 32.0;

  const getX = (idx: number) => padL + (idx / (data.length - 1)) * plotW;
  const getYDO = (val: number) => padT + plotH - ((val - minDO) / (maxDO - minDO)) * plotH;
  const getYTemp = (val: number) => padT + plotH - ((val - minTemp) / (maxTemp - minTemp)) * plotH;

  const buildPath = (getYFn: (val: number) => number, key: 'doValue' | 'tempValue') => {
    return data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getYFn(d[key]).toFixed(1)}`)
      .join(' ');
  };

  const doPath = buildPath(getYDO, 'doValue');
  const tempPath = buildPath(getYTemp, 'tempValue');

  // Interactive scrubbing handler
  const handleScrub = useCallback((clientX: number) => {
    if (!containerRef.current || data.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = clientX - rect.left - padL;
    const ratio = Math.max(0, Math.min(1, relX / plotW));
    const closestIdx = Math.round(ratio * (data.length - 1));
    setActiveIndex(closestIdx);
  }, [data.length, plotW]);

  const activeData = activeIndex !== null ? data[activeIndex] : data[data.length - 1];

  return (
    <div className={`viz-card ${className}`.trim()}>
      <div className="viz-card-header">
        <div>
          <div className="viz-card-title">{title}</div>
          {subtitle && <div className="viz-card-sub">{subtitle}</div>}
        </div>
      </div>

      <div
        className="dual-chart-wrap"
        ref={containerRef}
        onMouseMove={(e) => handleScrub(e.clientX)}
        onTouchMove={(e) => {
          if (e.touches[0]) handleScrub(e.touches[0].clientX);
        }}
        onMouseLeave={() => setActiveIndex(data.length - 1)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="dual-chart-svg">
          {/* Horizontal Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padT + pct * plotH;
            return (
              <line
                key={i}
                x1={padL}
                y1={y}
                x2={W - padR}
                y2={y}
                stroke="#e5e5ea"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            );
          })}

          {/* DO Path */}
          <path d={doPath} fill="none" stroke="#00a4b7" strokeWidth="2.5" strokeLinecap="round" />

          {/* Temp Path */}
          <path d={tempPath} fill="none" stroke="#e11d48" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />

          {/* Active Hover Column and Indicator Dots */}
          {activeIndex !== null && (
            <g>
              <line
                x1={getX(activeIndex)}
                y1={padT}
                x2={getX(activeIndex)}
                y2={H - padB}
                stroke="var(--teal-500)"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(activeIndex)}
                cy={getYDO(activeData.doValue)}
                r="5"
                fill="#ffffff"
                stroke="#00a4b7"
                strokeWidth="2.5"
              />
              <circle
                cx={getX(activeIndex)}
                cy={getYTemp(activeData.tempValue)}
                r="4.5"
                fill="#ffffff"
                stroke="#e11d48"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Real-time HUD Indicator */}
        {activeData && (
          <div className="dual-card-hud" style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
            <span><b>Time:</b> {activeData.time}</span>
            <span style={{ color: '#00a4b7' }}><b>DO:</b> {activeData.doValue.toFixed(2)} mg/L</span>
            <span style={{ color: '#e11d48' }}><b>Temp:</b> {activeData.tempValue.toFixed(1)}°C</span>
          </div>
        )}
      </div>
    </div>
  );
};
