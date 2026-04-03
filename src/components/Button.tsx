import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    };

    switch (size) {
      case 'sm':
        base.paddingVertical = Spacing.sm;
        base.paddingHorizontal = Spacing.md;
        break;
      case 'lg':
        base.paddingVertical = Spacing.md + 4;
        base.paddingHorizontal = Spacing.xl;
        break;
      default:
        base.paddingVertical = Spacing.md;
        base.paddingHorizontal = Spacing.lg;
    }

    switch (variant) {
      case 'secondary':
        return { ...base, backgroundColor: Colors.background.tertiary };
      case 'danger':
        return { ...base, backgroundColor: Colors.danger };
      case 'outline':
        return { ...base, backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.border.secondary };
      default:
        return { ...base, backgroundColor: Colors.primary };
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontWeight: FontWeight.semibold,
    };

    switch (size) {
      case 'sm':
        base.fontSize = FontSize.sm;
        break;
      case 'lg':
        base.fontSize = FontSize.xl;
        break;
      default:
        base.fontSize = FontSize.md;
    }

    switch (variant) {
      case 'secondary':
        return { ...base, color: Colors.text.primary };
      case 'outline':
        return { ...base, color: Colors.primary };
      default:
        return { ...base, color: Colors.text.primary };
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={Colors.text.primary} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});
