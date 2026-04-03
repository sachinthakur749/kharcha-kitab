/**
 * Design tokens extracted from UI mockups
 * Dark theme design system for Kharcha Kitab
 */

import { Platform } from 'react-native';

export const Colors = {
  primary: '#4E5BA6',
  primaryLight: '#6B75C4',
  primaryDark: '#3D4887',

  secondary: '#F4F4F5',
  secondaryDark: '#27272A',

  success: '#22C55E',
  successLight: '#1A2E1A',

  danger: '#EF4444',
  dangerLight: '#2E1A1A',

  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    tertiary: '#71717A',
  },

  background: {
    primary: '#09090B',
    secondary: '#18181B',
    tertiary: '#27272A',
    elevated: '#1F1F23',
  },

  border: {
    primary: '#27272A',
    secondary: '#3F3F46',
  },

  card: {
    income: '#1A2E1A',
    expense: '#2E1A1A',
  },
} as const;

export type ThemeColor = keyof typeof Colors;

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
