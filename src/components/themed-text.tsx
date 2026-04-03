import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, Colors, FontSize, FontWeight } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  return (
    <Text
      style={[
        { color: Colors.text.primary },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    fontWeight: FontWeight.medium,
  },
  smallBold: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    fontWeight: FontWeight.bold,
  },
  default: {
    fontSize: FontSize.md,
    lineHeight: 24,
    fontWeight: FontWeight.medium,
  },
  title: {
    fontSize: 48,
    fontWeight: FontWeight.semibold,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: FontWeight.semibold,
  },
  link: {
    lineHeight: 30,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: FontWeight.bold }) ?? FontWeight.medium,
    fontSize: FontSize.xs,
  },
});
