import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '../../store/transactionStore';
import { TransactionItem } from '../../components/TransactionItem';
import { Transaction } from '../../types/transaction';
import { Colors } from '../../constants/theme';

type FilterType = 'all' | 'credit' | 'debit';
type FilterPeriod = 'all' | 'today' | 'week' | 'month';

export default function HistoryScreen() {
  const { transactions, getBalance } = useTransactionStore();
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

  const renderHeader = () => (
    <View style={styles.cardHeader}>
      <Text style={styles.cardLabel}>Total Balance</Text>
      <Text style={styles.cardAmount}>$ {getBalance().toLocaleString()}</Text>

      <View style={styles.actionRow}>
        <View style={styles.actionItem}>
          <TouchableOpacity style={styles.actionIcon}>
            <Ionicons name="add" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.actionLabel}>Add</Text>
        </View>
        <View style={styles.actionItem}>
          <TouchableOpacity style={styles.actionIcon}>
            <Ionicons name="scan" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.actionLabel}>Pay</Text>
        </View>
        <View style={styles.actionItem}>
          <TouchableOpacity style={styles.actionIcon}>
            <Ionicons name="send" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.actionLabel}>Send</Text>
        </View>
      </View>

      {/* Embedded Filters representing the tabs from the mockup */}
      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {renderFilterButton('all', typeFilter, 'All', () => setTypeFilter('all'))}
          {renderFilterButton('credit', typeFilter, 'Income', () => setTypeFilter('credit'))}
          {renderFilterButton('debit', typeFilter, 'Expense', () => setTypeFilter('debit'))}
          <View style={{width: 10}} />
          {renderFilterButton('today', periodFilter, 'Today', () => setPeriodFilter('today'))}
          {renderFilterButton('week', periodFilter, 'Week', () => setPeriodFilter('week'))}
          {renderFilterButton('month', periodFilter, 'Month', () => setPeriodFilter('month'))}
          <View style={{width: 20}} />
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Teal Background Curve */}
      <View style={styles.topBackground} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wallet</Text>
          <TouchableOpacity style={styles.bellIconContainer}>
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Massive White Card wrapping the list */}
        <View style={styles.mainCard}>
          {filteredTransactions.length === 0 ? (
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              {renderHeader()}
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No transactions found</Text>
              </View>
            </ScrollView>
          ) : (
            <FlatList
              data={filteredTransactions}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={renderHeader()}
              renderItem={({ item }) => <TransactionItem transaction={item} />}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#387B75', // Matching the teal BG directly
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: '#387B75',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40, // Space before the card
  },
  headerIcon: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bellIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: 30,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontWeight: '500',
  },
  cardAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 30,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 30,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 14,
    color: '#222222',
  },
  filtersWrapper: {
    width: '100%',
    paddingLeft: 20,
    marginBottom: 10,
  },
  filtersScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#222222',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
});
