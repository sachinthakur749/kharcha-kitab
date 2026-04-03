import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'income' | 'expense';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'default' }) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'income':
        return Colors.card.income;
      case 'expense':
        return Colors.card.expense;
      default:
        return Colors.background.elevated;
    }
  };

  return <View style={[styles.card, { backgroundColor: getBackgroundColor() }, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
});
