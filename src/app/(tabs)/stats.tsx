import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from '../../components/LineChart';
import { useTransactionStore } from '../../store/transactionStore';
import { getCurrentMonthBS } from '../../utils/dateConverter';

export default function StatsScreen() {
  const [filter, setFilter] = useState('Day');
  
  // Real logic kept intact internally for future hook-up
  const { transactions, getByMonth } = useTransactionStore();
  const { year, month } = getCurrentMonthBS();
  const monthlyTransactions = useMemo(() => getByMonth(year, month), [year, month, transactions]);

  // Calculate dynamic weekly/daily data
  const chartData = useMemo(() => {
    if (monthlyTransactions.length === 0) return [100, 200, 300, 400, 500, 600, 700]; // Fallback
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

  const recentTransactions = transactions.filter(t => t.type === 'debit').slice(0, 5);

  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statistics</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="download-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tabsContainer}>
          {['Day', 'Week', 'Month', 'Year'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={[styles.tab, filter === tab && styles.activeTab]}
              onPress={() => setFilter(tab)}
            >
              <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.dropdownContainer}>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Expense</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.chartSection}>
          <LineChart
            data={chartData}
            width={screenWidth}
            height={220}
            color="#438883"
            activeIndex={6} // Highlighting today
          />
          <View style={styles.chartLabels}>
             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((lbl, i) => (
                <Text key={lbl} style={[styles.chartLabelText, i === 6 && styles.activeChartLabelText]}>{lbl}</Text>
             ))}
          </View>
        </View>

        <View style={styles.topSpendingHeader}>
          <Text style={styles.topSpendingTitle}>Top Spending</Text>
          <TouchableOpacity>
             <Ionicons name="swap-vertical" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsList}>
          {recentTransactions.length === 0 ? (
             <Text style={{textAlign: 'center', color: '#666', marginTop: 20}}>No spending data available</Text>
          ) : (
             recentTransactions.map((txn, idx) => (
               <View key={txn.id} style={styles.transactionCard}>
                 <View style={[styles.iconContainerStarbucks, { backgroundColor: idx % 2 === 0 ? '#00704A' : '#FF0000' }]}>
                   <Ionicons name={idx % 2 === 0 ? "cafe" : "play"} size={20} color="#fff" />
                 </View>
                 <View style={styles.transactionInfo}>
                   <Text style={styles.transactionName} numberOfLines={1}>{txn.source}</Text>
                   <Text style={styles.transactionDate}>{new Date(txn.dateAD).toLocaleDateString()}</Text>
                 </View>
                 <Text style={styles.expenseAmountRed}>- $ {txn.amount.toLocaleString()}</Text>
               </View>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerIcon: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
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
  activeTab: {
    backgroundColor: '#438883',
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
    borderColor: '#EFEFEF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  dropdownText: {
    fontSize: 13,
    color: '#666666',
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
  activeChartLabelText: {
    color: '#438883',
    fontWeight: '600',
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
    color: '#222222',
  },
  transactionsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionCardActive: {
    backgroundColor: '#438883',
  },
  iconContainerStarbucks: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00704A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 14,
  },
  iconContainerYoutube: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: '#888888',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textWhiteSoft: {
    color: 'rgba(255,255,255,0.8)',
  },
  expenseAmountRed: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F95B51',
  },
  expenseAmountWhite: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});