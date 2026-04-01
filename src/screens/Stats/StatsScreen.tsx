import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactionStore } from '../../store/transactionStore';
import { Card } from '../../components/Card';
import { getCurrentMonthBS } from '../../utils/dateConverter';

const { width } = Dimensions.get('window');

export const StatsScreen: React.FC = () => {
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
      <ScrollView contentContainerStyle={styles.content}>
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
                        { width: `${(amount / (maxCategoryAmount || 1)) * 100}%` },
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryCard: {
    marginBottom: 16,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
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
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  creditAmount: {
    color: '#22C55E',
  },
  debitAmount: {
    color: '#EF4444',
  },
  netContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  netLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  netAmount: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  chartCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  barsContainer: {
    gap: 12,
  },
  barRow: {
    gap: 8,
  },
  barLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    height: 24,
    backgroundColor: '#208AEF',
    borderRadius: 4,
    minWidth: 4,
  },
  barValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  topCategoryCard: {
    marginBottom: 16,
  },
  topCategory: {
    alignItems: 'center',
  },
  topCategoryName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  topCategoryAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 4,
  },
});
