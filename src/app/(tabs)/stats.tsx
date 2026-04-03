import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactionStore } from '../../store/transactionStore';
import { Card } from '../../components/Card';
import { LineChart } from '../../components/LineChart';
import { getCurrentMonthBS, formatBSDate } from '../../utils/dateConverter';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';

type FilterType = 'day' | 'week';

export default function StatsScreen() {
  const { transactions, getByMonth } = useTransactionStore();
  const { year, month } = getCurrentMonthBS();
  const [filter, setFilter] = useState<FilterType>('week');

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

  // Generate chart data based on filter
  const chartData = useMemo(() => {
    if (filter === 'day') {
      // Last 7 days data
      const last7Days = Array(7).fill(0);
      const today = new Date();

      monthlyTransactions
        .filter((t) => t.type === 'debit')
        .forEach((t) => {
          const txnDate = new Date(t.dateAD);
          const diffDays = Math.floor((today.getTime() - txnDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays < 7) {
            last7Days[6 - diffDays] += t.amount;
          }
        });

      return last7Days;
    } else {
      // Last 4 weeks data
      const last4Weeks = Array(4).fill(0);
      const today = new Date();

      monthlyTransactions
        .filter((t) => t.type === 'debit')
        .forEach((t) => {
          const txnDate = new Date(t.dateAD);
          const diffWeeks = Math.floor((today.getTime() - txnDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
          if (diffWeeks >= 0 && diffWeeks < 4) {
            last4Weeks[3 - diffWeeks] += t.amount;
          }
        });

      return last4Weeks;
    }
  }, [monthlyTransactions, filter]);

  const chartLabels = useMemo(() => {
    if (filter === 'day') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();
      return Array(7)
        .fill(0)
        .map((_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (6 - i));
          return days[date.getDay()];
        });
    } else {
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    }
  }, [filter]);

  const screenWidth = Dimensions.get('window').width - Spacing.md * 2;

  // Calculate summary insights
  const summaryText = useMemo(() => {
    const totalSpending = monthlyDebits;
    const avgDaily = Math.round(totalSpending / 30);
    const topCategory = categorySpending[0];

    if (totalSpending === 0) {
      return 'No spending data available for this month. Start tracking your expenses to see insights.';
    }

    let insight = `You've spent NPR ${totalSpending.toLocaleString()} this month, averaging NPR ${avgDaily.toLocaleString()} per day. `;

    if (topCategory) {
      const percentage = Math.round((topCategory[1] / totalSpending) * 100);
      insight += `${topCategory[0]} is your biggest expense category at ${percentage}% of total spending. `;
    }

    if (monthlyCredits > monthlyDebits) {
      const savings = monthlyCredits - monthlyDebits;
      insight += `Great job! You saved NPR ${savings.toLocaleString()} this month.`;
    } else {
      insight += `Consider reviewing your expenses to increase savings.`;
    }

    return insight;
  }, [monthlyDebits, monthlyCredits, categorySpending]);

  const monthNames = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>{monthNames[month - 1]} {year}</Text>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'day' && styles.filterTabActive]}
            onPress={() => setFilter('day')}
          >
            <Text style={[styles.filterText, filter === 'day' && styles.filterTextActive]}>Day</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'week' && styles.filterTabActive]}
            onPress={() => setFilter('week')}
          >
            <Text style={[styles.filterText, filter === 'week' && styles.filterTextActive]}>Week</Text>
          </TouchableOpacity>
        </View>

        {/* Line Chart Card */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Spending Trend</Text>
            <Text style={styles.chartAmount}>NPR {monthlyDebits.toLocaleString()}</Text>
          </View>
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={screenWidth - Spacing.md * 2}
              height={180}
              color={Colors.danger}
            />
          </View>
          <View style={styles.chartLabels}>
            {chartLabels.map((label, index) => (
              <Text key={index} style={styles.chartLabel}>
                {label}
              </Text>
            ))}
          </View>
        </Card>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Insights</Text>
          <Text style={styles.summaryText}>{summaryText}</Text>
        </Card>

        {/* Income/Expense Summary */}
        <View style={styles.summaryRow}>
          <Card style={styles.summaryItem} variant="income">
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryAmount, styles.creditAmount]}>
              NPR {monthlyCredits.toLocaleString()}
            </Text>
          </Card>
          <Card style={styles.summaryItem} variant="expense">
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={[styles.summaryAmount, styles.debitAmount]}>
              NPR {monthlyDebits.toLocaleString()}
            </Text>
          </Card>
        </View>

        {/* Top Spending Categories */}
        <Card style={styles.topSpendingCard}>
          <Text style={styles.sectionTitle}>Top Spending</Text>
          {categorySpending.length === 0 ? (
            <Text style={styles.emptyText}>No expense data for this month</Text>
          ) : (
            <View style={styles.categoryList}>
              {categorySpending.slice(0, 5).map(([category, amount], index) => {
                const percentage = Math.round((amount / monthlyDebits) * 100);
                const maxAmount = categorySpending[0][1];
                const barWidth = (amount / maxAmount) * 100;

                return (
                  <View key={category} style={styles.categoryItem}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryName}>{category}</Text>
                      <Text style={styles.categoryAmount}>NPR {amount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.categoryBarContainer}>
                      <View style={[styles.categoryBar, { width: `${barWidth}%` }]} />
                    </View>
                    <Text style={styles.categoryPercentage}>{percentage}%</Text>
                  </View>
                );
              })}
            </View>
          )}
        </Card>
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
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
    marginBottom: Spacing.md,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    fontWeight: FontWeight.medium,
  },
  filterTextActive: {
    color: Colors.text.primary,
    fontWeight: FontWeight.semibold,
  },
  chartCard: {
    marginBottom: Spacing.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  chartTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  chartAmount: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.danger,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },
  chartLabel: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    flex: 1,
    textAlign: 'center',
  },
  summaryCard: {
    marginBottom: Spacing.md,
  },
  summaryTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  summaryText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    lineHeight: FontSize.md * 1.5,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
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
  topSpendingCard: {
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
  categoryList: {
    gap: Spacing.md,
  },
  categoryItem: {
    gap: Spacing.xs,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
  },
  categoryAmount: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
  },
  categoryBarContainer: {
    height: 8,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  categoryBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
  },
  categoryPercentage: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'right',
  },
});