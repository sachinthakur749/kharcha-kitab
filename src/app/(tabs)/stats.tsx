import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from '../../components/LineChart';
import { useTransactionStore } from '../../store/transactionStore';
import { getCurrentMonthBS } from '../../utils/dateConverter';
import { TransactionItem } from '../../components/TransactionItem';
import { useThemeColors } from '../../providers/ThemeProvider';

export default function StatsScreen() {
  const { colors } = useThemeColors();
  const [filter, setFilter] = useState('Day');

  const { transactions, getByMonth } = useTransactionStore();
  const { year, month } = getCurrentMonthBS();
  const monthlyTransactions = useMemo(() => getByMonth(year, month), [year, month, transactions]);

  const chartData = useMemo(() => {
    if (monthlyTransactions.length === 0) return [100, 200, 300, 400, 500, 600, 700];
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
    return last7Days.some(v => v > 0) ? last7Days : [100, 200, 300, 400, 500, 600, 700];
  }, [monthlyTransactions]);

  const chartLabels = useMemo(() => {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const todayIdx = new Date().getDay();
    const result = [];
    for(let i=6; i>=0; i--) {
       let idx = todayIdx - i;
       if (idx < 0) idx += 7;
       result.push(days[idx]);
    }
    return result;
  }, []);

  const recentTransactions = transactions.filter(t => t.type === 'debit').slice(0, 5);
  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Analytics</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="download-outline" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tabsContainer}>
          {['Day', 'Week', 'Month', 'Year'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, filter === tab && { backgroundColor: colors.primary }]}
              onPress={() => setFilter(tab)}
            >
              <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.dropdownContainer}>
          <TouchableOpacity style={[styles.dropdown, { borderColor: colors.border.secondary }]}>
            <Text style={[styles.dropdownText, { color: colors.text.secondary }]}>Expense</Text>
            <Ionicons name="chevron-down" size={16} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.chartSection}>
          <LineChart
            data={chartData}
            width={screenWidth}
            height={220}
            color={colors.primary}
            activeIndex={6}
          />
          <View style={styles.chartLabels}>
             {chartLabels.map((lbl, i) => (
                <Text key={lbl + i} style={[styles.chartLabelText, i === 6 && { color: colors.primary }]}>{lbl}</Text>
             ))}
          </View>
        </View>

        <View style={styles.topSpendingHeader}>
          <Text style={[styles.topSpendingTitle, { color: colors.text.primary }]}>Top Spending</Text>
          <TouchableOpacity>
             <Ionicons name="swap-vertical" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsList}>
          {recentTransactions.length === 0 ? (
             <Text style={[styles.noDataText, { color: colors.text.tertiary }]}>No spending data available</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerIcon: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    paddingBottom: 100,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dropdownContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: '500',
  },
  chartSection: {
    marginBottom: 30,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -5,
  },
  chartLabelText: {
    fontSize: 13,
    color: '#999999',
    fontWeight: '500',
  },
  topSpendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  topSpendingTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  transactionsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
