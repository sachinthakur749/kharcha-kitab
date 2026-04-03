import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactionStore } from '../../store/transactionStore';
import { Card } from '../../components/Card';
import { getCurrentMonthBS } from '../../utils/dateConverter';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';

export default function StatsScreen() {
  const { transactions, getByMonth } = useTransactionStore();
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

  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {};
    monthlyTransactions
      .filter((t) => t.type === 'debit')
      .forEach((t) => {
        const category = t.category || 'Other';
        spending[category] = (spending[category] || 0) + t.amount;
      });
    return Object.entries(spending).sort((a, b) => b[1] - a[1]);
  }, [monthlyTransactions]);

  const maxCategoryAmount = categorySpending.length > 0 ? categorySpending[0][1] : 0;

  const monthNames = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Statistics</Text>

        <Card style={styles.summaryCard}>
          <Text style={styles.monthLabel}>{monthNames[month - 1]} {year}</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryAmount, styles.creditAmount]}>
                NPR {monthlyCredits.toLocaleString()}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={[styles.summaryAmount, styles.debitAmount]}>
                NPR {monthlyDebits.toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.netContainer}>
            <Text style={styles.netLabel}>Net Savings</Text>
            <Text style={[styles.netAmount, monthlyCredits - monthlyDebits >= 0 ? styles.creditAmount : styles.debitAmount]}>
              NPR {Math.abs(monthlyCredits - monthlyDebits).toLocaleString()}
            </Text>
          </View>
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          {categorySpending.length === 0 ? (
            <Text style={styles.emptyText}>No expense data for this month</Text>
          ) : (
            <View style={styles.barsContainer}>
              {categorySpending.slice(0, 5).map(([category, amount]) => (
                <View key={category} style={styles.barRow}>
                  <Text style={styles.barLabel}>{category}</Text>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        { width: `${(amount / maxCategoryAmount) * 100}%` as const },
                      ]}
                    />
                    <Text style={styles.barValue}>NPR {amount.toLocaleString()}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </Card>

        {categorySpending.length > 0 && (
          <Card style={styles.topCategoryCard}>
            <Text style={styles.sectionTitle}>Top Spending Category</Text>
            <View style={styles.topCategory}>
              <Text style={styles.topCategoryName}>{categorySpending[0][0]}</Text>
              <Text style={styles.topCategoryAmount}>
                NPR {categorySpending[0][1].toLocaleString()}
              </Text>
            </View>
          </Card>
        )}
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
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    marginBottom: Spacing.md,
  },
  monthLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.border.primary,
  },
  summaryLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
  },
  summaryAmount: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  creditAmount: {
    color: Colors.success,
  },
  debitAmount: {
    color: Colors.danger,
  },
  netContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
    alignItems: 'center',
  },
  netLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
  netAmount: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    marginTop: Spacing.xs,
  },
  chartCard: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  barsContainer: {
    gap: Spacing.md,
  },
  barRow: {
    gap: Spacing.xs,
  },
  barLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bar: {
    height: 28,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    minWidth: 4,
  },
  barValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  topCategoryCard: {
    marginBottom: Spacing.md,
  },
  topCategory: {
    alignItems: 'center',
  },
  topCategoryName: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  topCategoryAmount: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.danger,
    marginTop: Spacing.xs,
  },
});
