import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '../types/transaction';
import { formatBSDate } from '../utils/dateConverter';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '../constants/theme';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  const isCredit = transaction.type === 'credit';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View style={[styles.icon, isCredit ? styles.creditIcon : styles.debitIcon]}>
          <Text style={[styles.iconText, { color: isCredit ? Colors.success : Colors.danger }]}>
            {isCredit ? '+' : '-'}
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.source} numberOfLines={1}>{transaction.source}</Text>
          {transaction.note && (
            <Text style={styles.note} numberOfLines={1}>{transaction.note}</Text>
          )}
          <Text style={styles.date}>{formatBSDate(transaction.dateBS)}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, isCredit ? styles.creditAmount : styles.debitAmount]}>
          {isCredit ? '+' : '-'} NPR {transaction.amount.toLocaleString()}
        </Text>
        {transaction.isAuto && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AUTO</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.elevated,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  creditIcon: {
    backgroundColor: Colors.card.income,
  },
  debitIcon: {
    backgroundColor: Colors.card.expense,
  },
  iconText: {
    fontSize: 20,
    fontWeight: FontWeight.bold,
  },
  details: {
    flex: 1,
  },
  source: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  note: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  creditAmount: {
    color: Colors.success,
  },
  debitAmount: {
    color: Colors.danger,
  },
  badge: {
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
  },
});
