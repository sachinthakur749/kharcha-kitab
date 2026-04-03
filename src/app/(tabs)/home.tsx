import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '../../store/transactionStore';
import { TransactionItem } from '../../components/TransactionItem';
import { getCurrentMonthBS } from '../../utils/dateConverter';
import { Colors } from '../../constants/theme';

export default function DashboardScreen() {
  const { transactions, getByMonth, getBalance } = useTransactionStore();
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

  const avatars = [
    'https://i.pravatar.cc/100?img=5',
    'https://i.pravatar.cc/100?img=11',
    'https://i.pravatar.cc/100?img=3',
    'https://i.pravatar.cc/100?img=12',
    'https://i.pravatar.cc/100?img=9',
  ];

  return (
    <View style={styles.container}>
      {/* Background Teal Curved Wrapper */}
      <View style={styles.topBackground} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greetingText}>Welcome back,</Text>
              <Text style={styles.userNameText}>Kharcha Kitab</Text>
            </View>
            <TouchableOpacity style={styles.bellIconContainer}>
              <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <View style={styles.balanceTitleRow}>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Ionicons name="chevron-up" size={16} color="#FFFFFF" style={{marginLeft: 4}} />
              </View>
              <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.balanceAmount}>NPR {getBalance().toLocaleString()}</Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryBox}>
                <View style={styles.summaryIconText}>
                  <View style={styles.arrowCircle}>
                    <Ionicons name="arrow-down" size={12} color="#438883" />
                  </View>
                  <Text style={styles.summarySubLabel}>Income</Text>
                </View>
                <Text style={styles.summaryAmount}>NPR {monthlyCredits.toLocaleString()}</Text>
              </View>

              <View style={styles.summaryBox}>
                <View style={styles.summaryIconText}>
                  <View style={styles.arrowCircle}>
                    <Ionicons name="arrow-up" size={12} color="#438883" />
                  </View>
                  <Text style={styles.summarySubLabel}>Expenses</Text>
                </View>
                <Text style={styles.summaryAmount}>NPR {monthlyDebits.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Transactions History */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transactions History</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            {recentTransactions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No recent transactions</Text>
              </View>
            ) : (
              recentTransactions.map((txn) => (
                 <TransactionItem key={txn.id} transaction={txn} />
              ))
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: '#438883',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '700',
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
  balanceCard: {
    backgroundColor: '#2E6662',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 30,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryBox: {
    flex: 1,
  },
  summaryIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  arrowCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  summarySubLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222222',
  },
  seeAllText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  transactionsList: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
  },
  emptyText: {
    color: '#666666',
  },
  avatarsScroll: {
    paddingLeft: 20,
    paddingRight: 10, // Avoid trailing cutoff
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
});
