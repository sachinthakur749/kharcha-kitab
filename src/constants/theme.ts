/**
 * Design tokens for Kharcha Kitab
 * Both light and dark mode palettes
 */

import { Platform } from 'react-native';

export const darkColors = {
  primary: '#438883',
  primaryLight: '#599E99',
  primaryDark: '#387B75',

  secondary: '#8B5CF6',
  secondaryLight: '#A78BFA',
  secondaryDark: '#7C3AED',

  success: '#22C55E',
  successLight: 'rgba(34, 197, 94, 0.15)',

  danger: '#F95B51',
  dangerLight: 'rgba(249, 91, 81, 0.15)',

  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    tertiary: '#94A3B8',
    inverse: '#0F172A',
  },

  background: {
    primary: '#0F172A',
    secondary: '#1E293B',
    tertiary: '#334155',
    elevated: '#1E293B',
  },

  border: {
    primary: '#1E293B',
    secondary: '#334155',
  },

  card: {
    income: '#1E293B',
    expense: '#1E293B',
  },
} as const;

export const lightColors = {
  primary: '#438883',
  primaryLight: '#599E99',
  primaryDark: '#387B75',

  secondary: '#F4F4F5',
  secondaryLight: '#E5E7EB',
  secondaryDark: '#D1D5DB',

  success: '#22C55E',
  successLight: '#DCFCE7',

  danger: '#F95B51',
  dangerLight: '#FEE2E2',

  text: {
    primary: '#222222',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#FFFFFF',
  },

  background: {
    primary: '#FFFFFF',
    secondary: '#F3F4F6',
    tertiary: '#EFEFEF',
    elevated: '#FFFFFF',
  },

  border: {
    primary: '#EFEFEF',
    secondary: '#D1D5DB',
  },

  card: {
    income: '#FFFFFF',
    expense: '#FFFFFF',
  },
} as const;

/**
 * Legacy export — defaults to dark for backward compat with stylesheets.
 * Prefer calling getColors() at render time for proper theme switching.
 */
export const Colors = darkColors;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  '2xl': 24,
  '3xl': 32,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
