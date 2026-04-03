import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactionStore } from '../../store/transactionStore';
import { TransactionItem } from '../../components/TransactionItem';
import { Transaction } from '../../types/transaction';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';

type FilterType = 'all' | 'credit' | 'debit';
type FilterPeriod = 'all' | 'today' | 'week' | 'month';

export default function HistoryScreen() {
  const { transactions } = useTransactionStore();
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [periodFilter, setPeriodFilter] = useState<FilterPeriod>('all');

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (typeFilter !== 'all') {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    if (periodFilter !== 'all') {
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      if (periodFilter === 'today') {
        filtered = filtered.filter((t) => t.dateAD.startsWith(today));
      } else if (periodFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((t) => new Date(t.dateAD) >= weekAgo);
      } else if (periodFilter === 'month') {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter((t) => new Date(t.dateAD) >= monthStart);
      }
    }

    return filtered;
  }, [transactions, typeFilter, periodFilter]);

  const renderFilterButton = (filter: FilterType | FilterPeriod, value: FilterType | FilterPeriod, label: string, onPress: () => void) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === value && styles.filterButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterButtonText, filter === value && styles.filterButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Transaction }) => (
    <TransactionItem transaction={item} />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
      </View>

      <View style={styles.filters}>
        <View style={styles.filterGroup}>
          {renderFilterButton('all', typeFilter, 'All', () => setTypeFilter('all'))}
          {renderFilterButton('credit', typeFilter, 'Income', () => setTypeFilter('credit'))}
          {renderFilterButton('debit', typeFilter, 'Expense', () => setTypeFilter('debit'))}
        </View>
        <View style={styles.filterGroup}>
          {renderFilterButton('all', periodFilter, 'All Time', () => setPeriodFilter('all'))}
          {renderFilterButton('today', periodFilter, 'Today', () => setPeriodFilter('today'))}
          {renderFilterButton('week', periodFilter, 'Week', () => setPeriodFilter('week'))}
          {renderFilterButton('month', periodFilter, 'Month', () => setPeriodFilter('month'))}
        </View>
      </View>

      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No transactions found</Text>
          <Text style={styles.emptySubtext}>
            Try changing the filters or wait for new SMS/notification
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  filters: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterGroup: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.tertiary,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text.secondary,
  },
  filterButtonTextActive: {
    color: Colors.text.primary,
  },
  list: {
    padding: Spacing.md,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
  },
  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
