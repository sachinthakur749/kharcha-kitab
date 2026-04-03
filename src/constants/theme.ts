/**
 * Design tokens extracted from UI mockups
 * Dark theme design system for Kharcha Kitab
 */

import { Platform } from 'react-native';

export const Colors = {
  primary: '#438883', // Exact Teal found in all UI backgrounds
  primaryLight: '#599E99',
  primaryDark: '#387B75',

  secondary: '#F4F4F5',
  secondaryDark: '#E5E7EB',

  success: '#22C55E', // Green for income
  successLight: '#DCFCE7',

  danger: '#F95B51', // Exact Red for expense
  dangerLight: '#FEE2E2',

  text: {
    primary: '#222222', // Dark slate for headers
    secondary: '#666666', // Muted text for dates/labels
    tertiary: '#999999', // Faint text for disabled/inactive
    inverse: '#FFFFFF', // White text
  },

  background: {
    primary: '#FFFFFF',   // Stark white screens/cards
    secondary: '#F3F4F6', // Off-white/gray screen backgrounds
    tertiary: '#EFEFEF',
    elevated: '#FFFFFF',  // Floating cards
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
