import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactionStore } from '../../store/transactionStore';
import { Card } from '../../components/Card';
import { TransactionItem } from '../../components/TransactionItem';
import { getTodayBS, formatBSDate, getCurrentMonthBS } from '../../utils/dateConverter';

export const DashboardScreen: React.FC = () => {
  const { transactions, totalCredits, totalDebits, getBalance, getByMonth } = useTransactionStore();
  const todayBS = getTodayBS();
  const { year, month } = getCurrentMonthBS();
  const monthlyTransactions = useMemo(() => getByMonth(year, month), [year, month, transactions]);

  const monthlyCredits = useMemo(
    () => monthlyTransactions.filter((t) => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0),
    [monthlyTransactions]
  );

  const monthlyDebits = useMemo(
    () => monthlyTransactions.filter((t) => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0),
    [monthlyTransactions]
  );

  const recentTransactions = transactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Kharcha Kitab</Text>

        <Card style={styles.balanceCard}>
          <Text style={styles.todayDate}>{formatBSDate(todayBS)}</Text>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
            NPR {getBalance().toLocaleString()}
          </Text>
        </Card>

        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Income This Month</Text>
            <Text style={[styles.summaryAmount, styles.creditAmount]}>
              + NPR {monthlyCredits.toLocaleString()}
            </Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Expenses This Month</Text>
            <Text style={[styles.summaryAmount, styles.debitAmount]}>
              - NPR {monthlyDebits.toLocaleString()}
            </Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentTransactions.length === 0 ? (
            <Card>
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>
                Transactions will appear here when detected from SMS or notifications
              </Text>
            </Card>
          ) : (
            recentTransactions.map((txn) => (
              <TransactionItem key={txn.id} transaction={txn} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: '#208AEF',
    marginBottom: 16,
  },
  todayDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  creditAmount: {
    color: '#22C55E',
  },
  debitAmount: {
    color: '#EF4444',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
});
