import React, { createContext, useContext, ReactNode } from 'react';
import { useThemeStore, ThemeMode } from '../store/themeStore';
import { darkColors, lightColors } from '../constants/theme';

type ThemeColors = typeof darkColors;

type ThemeContextValue = {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: darkColors,
  isDark: true,
  themeMode: 'dark',
});

export function useThemeColors() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark';
  const colors = (isDark ? darkColors : lightColors) as ThemeColors;

  return (
    <ThemeContext.Provider value={{ colors, isDark, themeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
