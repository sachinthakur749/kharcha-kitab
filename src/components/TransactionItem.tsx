import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '../types/transaction';
import { formatBSDate } from '../utils/dateConverter';

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
          <Text style={styles.iconText}>{isCredit ? '+' : '-'}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.source}>{transaction.source}</Text>
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  creditIcon: {
    backgroundColor: '#DCFCE7',
  },
  debitIcon: {
    backgroundColor: '#FEE2E2',
  },
  iconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  details: {
    flex: 1,
  },
  source: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  note: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
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
    color: '#EF4444',
  },
  badge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#208AEF',
  },
});
