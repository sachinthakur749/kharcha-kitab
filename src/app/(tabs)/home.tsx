import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '../../store/transactionStore';
import { TransactionItem } from '../../components/TransactionItem';
import { getCurrentMonthBS } from '../../utils/dateConverter';
import { useThemeColors } from '../../providers/ThemeProvider';

export default function DashboardScreen() {
  const { colors } = useThemeColors();
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Background Curved Wrapper */}
      <View style={[styles.topBackground, { backgroundColor: colors.background.secondary }]} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.greetingText, { color: colors.text.secondary }]}>Welcome back,</Text>
              <Text style={[styles.userNameText, { color: colors.text.primary }]}>Kharcha Kitab</Text>
            </View>
            <TouchableOpacity style={[styles.bellIconContainer, { backgroundColor: colors.background.secondary }]}>
              <Ionicons name="notifications-outline" size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <View style={[styles.balanceCard, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
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
                    <Ionicons name="arrow-down" size={12} color="#22C55E" />
                  </View>
                  <Text style={styles.summarySubLabel}>Income</Text>
                </View>
                <Text style={styles.summaryAmount}>NPR {monthlyCredits.toLocaleString()}</Text>
              </View>

              <View style={styles.summaryBox}>
                <View style={styles.summaryIconText}>
                  <View style={styles.arrowCircle}>
                    <Ionicons name="arrow-up" size={12} color="#F95B51" />
                  </View>
                  <Text style={styles.summarySubLabel}>Expenses</Text>
                </View>
                <Text style={styles.summaryAmount}>NPR {monthlyDebits.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Transactions History */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Transactions History</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            {recentTransactions.length === 0 ? (
              <View style={[styles.emptyContainer, { backgroundColor: colors.background.secondary }]}>
                <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>No recent transactions</Text>
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
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
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
    marginBottom: 4,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '700',
  },
  bellIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
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
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
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
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  transactionsList: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 14,
  },
});
