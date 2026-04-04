import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '../types/transaction';
import { formatBSDate } from '../utils/dateConverter';
import { useThemeColors } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  const { colors } = useThemeColors();
  const isCredit = transaction.type === 'credit';

  const iconName = isCredit ? 'arrow-down-circle' : 'receipt';

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.background.elevated }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View style={[styles.icon, isCredit ? styles.creditIcon : styles.debitIcon]}>
           <Ionicons name={iconName} size={20} color="#FFFFFF" />
        </View>
        <View style={styles.details}>
          <Text style={[styles.source, { color: colors.text.primary }]} numberOfLines={1}>{transaction.source}</Text>
          <Text style={[styles.date, { color: colors.text.tertiary }]}>{formatBSDate(transaction.dateBS)}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, isCredit ? styles.creditAmount : styles.debitAmount]}>
          {isCredit ? '+' : '-'} NPR {transaction.amount.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  creditIcon: {
    backgroundColor: '#22C55E',
  },
  debitIcon: {
    backgroundColor: '#F95B51',
  },
  details: {
    flex: 1,
  },
  source: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  creditAmount: {
    color: '#22C55E',
  },
  debitAmount: {
    color: '#F95B51',
  },
});
