/**
 * AquaPulse Design System — CSS Custom Properties Generator & Injector
 */

import { colors } from './colors.js';
import { typography } from './typography.js';
import { radii } from './radii.js';
import { elevation } from './elevation.js';
import { motion } from './motion.js';

export const cssVariables = `
:root {
  /* Surfaces & Neutrals */
  --canvas: ${colors.canvas};
  --white: ${colors.white};
  --soft: ${colors.soft};
  --line: ${colors.line};
  --line-strong: ${colors.lineStrong};
  --muted: ${colors.muted};
  --faint: ${colors.faint};
  --ink: ${colors.ink};
  --black: ${colors.black};

  /* California Sunset Teal Scale */
  --teal-050: ${colors.teal['050']};
  --teal-100: ${colors.teal['100']};
  --teal-200: ${colors.teal['200']};
  --teal-400: ${colors.teal['400']};
  --teal-500: ${colors.teal['500']};
  --teal-600: ${colors.teal['600']};
  --teal-700: ${colors.teal['700']};
  --teal-800: ${colors.teal['800']};
  --teal-900: ${colors.teal['900']};
  --teal-990: ${colors.teal['990']};

  /* Alerts */
  --ruby-bg: ${colors.ruby.bg};
  --ruby-border: ${colors.ruby.border};
  --ruby-text: ${colors.ruby.text};

  /* Typography */
  --font-sans: ${typography.fonts.sans};
  --font-mono: ${typography.fonts.mono};
  --t-xs: ${typography.sizes.xs};
  --t-sm: ${typography.sizes.sm};
  --t-base: ${typography.sizes.base};
  --t-lg: ${typography.sizes.lg};
  --t-xl: ${typography.sizes.xl};
  --t-2xl: ${typography.sizes['2xl']};

  /* Radii */
  --r-4: ${radii.sm};
  --r-8: ${radii.md};
  --r-12: ${radii.lg};
  --r-16: ${radii.xl};
  --r-20: ${radii['2xl']};
  --pill: ${radii.pill};

  /* Shadows */
  --sh-1: ${elevation.shadows[1]};
  --sh-2: ${elevation.shadows[2]};
  --sh-3: ${elevation.shadows[3]};
  --sh-card: ${elevation.shadows.card};
  --sh-menu: ${elevation.shadows.menu};

  /* Motion */
  --dur-fast: ${motion.durations.fast};
  --dur-normal: ${motion.durations.normal};
  --ease: ${motion.easings.standard};
  --ease-apple-spring: ${motion.easings.appleSpring};
  --ease-out-expo: ${motion.easings.outExpo};
}
`;

export function injectAquaPulseCSS(): void {
  if (typeof document === 'undefined') return;
  const styleId = 'aquapulse-design-tokens';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = cssVariables;
    document.head.appendChild(style);
  }
}
