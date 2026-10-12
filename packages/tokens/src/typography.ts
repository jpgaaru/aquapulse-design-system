/**
 * AquaPulse Design System — Typography Tokens
 */

export const typography = {
  fonts: {
    sans: "'Noto Sans', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    mono: "'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  sizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.45,
    relaxed: 1.6,
  },
} as const;

export type TypographyTokens = typeof typography;
