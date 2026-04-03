import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactionStore } from '../../store/transactionStore';
import { Card } from '../../components/Card';
import { TransactionItem } from '../../components/TransactionItem';
import { getTodayBS, formatBSDate, getCurrentMonthBS } from '../../utils/dateConverter';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';

export default function DashboardScreen() {
  const { transactions, getByMonth, getBalance } = useTransactionStore();
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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Kharcha Kitab</Text>
        <Text style={styles.date}>{formatBSDate(todayBS)}</Text>

        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
            NPR {getBalance().toLocaleString()}
          </Text>
        </Card>

        <View style={styles.summaryRow}>
          <Card style={styles.incomeCard} variant="income">
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryAmount, styles.creditAmount]}>
              + NPR {monthlyCredits.toLocaleString()}
            </Text>
          </Card>
          <Card style={styles.expenseCard} variant="expense">
            <Text style={styles.summaryLabel}>Expenses</Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  header: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    marginBottom: Spacing.md,
  },
  balanceLabel: {
    fontSize: FontSize.md,
    color: Colors.text.primary,
    opacity: 0.8,
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  incomeCard: {
    flex: 1,
  },
  expenseCard: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  summaryAmount: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginTop: Spacing.xs,
  },
  creditAmount: {
    color: Colors.success,
  },
  debitAmount: {
    color: Colors.danger,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.lg,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
