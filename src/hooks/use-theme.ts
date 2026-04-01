import { useColorScheme } from 'react-native';

import { Colors, ThemeColor } from '@/constants/theme';

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return {
    background: isDark ? Colors.dark.background : Colors.light.background,
    backgroundElement: isDark ? Colors.dark.backgroundElement : Colors.light.backgroundElement,
    backgroundSelected: isDark ? Colors.dark.backgroundSelected : Colors.light.backgroundSelected,
    text: isDark ? Colors.dark.text : Colors.light.text,
    textSecondary: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary,
  };
}
