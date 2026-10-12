/**
 * AquaPulse Design System — Radii & Geometry Tokens
 */

export const radii = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  pill: '9999px',
} as const;

export type RadiiTokens = typeof radii;
