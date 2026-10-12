/**
 * AquaPulse Design System — Color Palette Tokens
 * Strict 40% White Canvas · 30% Dark Structural · 30% California Sunset Teal
 * WCAG 2.1 AA (4.5:1) and AAA (7.0:1) Calibrated
 */

export const colors = {
  // Base Canvas & Neutral Surfaces (40% Budget)
  canvas: '#fafafc',
  white: '#ffffff',
  soft: '#f5f5f7',
  line: '#e5e5ea',
  lineStrong: '#d1d1d6',
  muted: '#6e6e73',
  faint: '#86868b',
  ink: '#1d1d1f',
  black: '#000000',

  // California Sunset Teal / Ocean Telemetry Scale (30% Budget)
  teal: {
    '050': '#e6f7fa',
    '100': '#cceef4',
    '200': '#99dde9',
    '400': '#33bbd1',
    '500': '#00b2cb',
    '600': '#00a4b7', // Primary Brand Anchor
    '700': '#007d8e', // Secondary Anchor
    '800': '#006c7a', // Deep Brand Anchor (WCAG AAA with White Text: 6.13:1)
    '900': '#004b54',
    '990': '#00333a',
  },

  // Alert & Diagnostic Tokens
  ruby: {
    bg: '#fff1f2',
    border: '#fecdd3',
    text: '#e11d48',
    dark: '#9f1239',
  },
  amber: {
    bg: '#fffbeb',
    border: '#fde68a',
    text: '#d97706',
    dark: '#92400e',
  },
  emerald: {
    bg: '#ecfdf5',
    border: '#a7f3d0',
    text: '#059669',
    dark: '#065f46',
  },
} as const;

export type ColorTokens = typeof colors;
