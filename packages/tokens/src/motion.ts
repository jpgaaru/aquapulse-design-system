/**
 * AquaPulse Design System — Motion & Micro-Physics Tokens
 */

export const motion = {
  durations: {
    instant: '0.1s',
    fast: '0.18s',
    normal: '0.28s',
    slow: '0.45s',
  },
  easings: {
    standard: 'cubic-bezier(0.16, 1, 0.3, 1)',
    appleSpring: 'cubic-bezier(0.34, 1.45, 0.64, 1)',
    outExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
  },
} as const;

export type MotionTokens = typeof motion;
