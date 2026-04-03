const fs = require('fs');

const statsContent = `import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactionStore } from '../../store/transactionStore';
import { Card } from '../../components/Card';
import { getCurrentMonthBS } from '../../utils/dateConverter';

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
    const spending = {};
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

        <View style={styles.summaryRow}>
          <Card style={styles.incomeCard}>
            <Text style={styles.cardLabel}>Total Income</Text>
            <Text style={styles.incomeAmount}>
              NPR {monthlyCredits.toLocaleString()}
            </Text>
          </Card>
          <Card style={styles.expenseCard}>
            <Text style={styles.cardLabel}>Total Expenses</Text>
            <Text style={styles.expenseAmount}>
              NPR {monthlyDebits.toLocaleString()}
            </Text>
          </Card>
        </View>

        <Card style={styles.spendingCard}>
          <Text style={styles.sectionTitle}>Your Spending</Text>
          {categorySpending.length === 0 ? (
            <Text style={styles.emptyText}>No expense data for this month</Text>
          ) : (
            <View style={styles.barsContainer}>
              {categorySpending.slice(0, 5).map(([category, amount]) => {
                const percentage = Math.round((amount / maxCategoryAmount) * 100);
                return (
                  <View key={category} style={styles.barItem}>
                    <View style={styles.barHeader}>
                      <Text style={styles.barLabel}>{category}</Text>
                      <Text style={styles.barPercentage}>{percentage}%</Text>
                    </View>
                    <View style={styles.barBackground}>
                      <View
                        style={[
                          styles.barFill,
                          { width: percentage + '%' },
                        ]}
                      />
                    </View>
                    <Text style={styles.barAmount}>NPR {amount.toLocaleString()}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </Card>

        {categorySpending.length > 0 && (
          <Card style={styles.topCategoryCard}>
            <Text style={styles.sectionTitle}>Top Category</Text>
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
    backgroundColor: '#F4F4F5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  incomeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  expenseCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  cardLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  incomeAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#22C55E',
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EF4444',
  },
  spendingCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
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
    gap: 16,
  },
  barItem: {
    marginBottom: 4,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  barPercentage: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '600',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 4,
  },
  barFill: {
    height: 8,
    backgroundColor: '#7C3AED',
    borderRadius: 4,
  },
  barAmount: {
    fontSize: 12,
    color: '#6B7280',
  },
  topCategoryCard: {
    backgroundColor: '#FFFFFF',
  },
  topCategory: {
    alignItems: 'center',
    paddingVertical: 8,
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
`;

fs.writeFileSync('C:/sachin/projects/kharcha-kitab/src/app/(tabs)/stats.tsx', statsContent);
console.log('Stats screen updated with light theme');