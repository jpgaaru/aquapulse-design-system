/**
 * AquaPulse Design System — Elevation & Shadows
 */

export const elevation = {
  shadows: {
    none: 'none',
    1: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
    2: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    3: '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
    card: '0 12px 28px -4px rgba(0, 0, 0, 0.05), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
    menu: '0 16px 36px -6px rgba(0, 0, 0, 0.12), 0 6px 16px -3px rgba(0, 0, 0, 0.06)',
    glowTeal: '0 0 20px rgba(0, 164, 183, 0.35)',
  },
} as const;

export type ElevationTokens = typeof elevation;
