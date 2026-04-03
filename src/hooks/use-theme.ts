import { Colors } from '@/constants/theme';

export function useTheme() {
  return {
    background: Colors.background.primary,
    backgroundElement: Colors.background.elevated,
    backgroundSelected: Colors.background.tertiary,
    text: Colors.text.primary,
    textSecondary: Colors.text.secondary,
  };
}
