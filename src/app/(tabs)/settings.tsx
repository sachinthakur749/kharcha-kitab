import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactionStore } from '../../store/transactionStore';
import { bankPatterns } from '../../config/banks.config';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';

export default function SettingsScreen() {
  const {
    enabledBanks,
    enabledWallets,
    toggleBank,
    toggleWallet,
    clearAllTransactions,
    transactions,
    addTransaction,
  } = useTransactionStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [manualAmount, setManualAmount] = useState('');
  const [manualType, setManualType] = useState<'credit' | 'debit'>('debit');
  const [manualNote, setManualNote] = useState('');

  const walletNames = {
    esewa: 'eSewa',
    khalti: 'Khalti',
    imepay: 'IME Pay',
    prabhupay: 'Prabhu Pay',
    hamropay: 'Hamro Pay',
    connectips: 'ConnectIPS',
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all transactions? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => clearAllTransactions(),
        },
      ]
    );
  };

  const handleAddManualTransaction = () => {
    const amount = parseFloat(manualAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    addTransaction({
      id: 'manual-' + Date.now(),
      amount,
      type: manualType,
      source: 'Manual Entry',
      category: 'manual',
      note: manualNote || 'Manual entry',
      dateAD: new Date().toISOString(),
      dateBS: new Date().toISOString().split('T')[0],
      isAuto: false,
    });

    setManualAmount('');
    setManualNote('');
    setShowAddModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Banks</Text>
          {bankPatterns.map((bank) => (
            <View key={bank.senderId} style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{bank.name}</Text>
              <Switch
                value={enabledBanks.includes(bank.senderId)}
                onValueChange={() => toggleBank(bank.senderId)}
                trackColor={{ false: Colors.background.tertiary, true: Colors.primaryLight }}
                thumbColor={enabledBanks.includes(bank.senderId) ? Colors.primary : Colors.text.secondary}
              />
            </View>
          ))}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Digital Wallets</Text>
          {Object.entries(walletNames).map(([id, name]) => (
            <View key={id} style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{name}</Text>
              <Switch
                value={enabledWallets.includes(id)}
                onValueChange={() => toggleWallet(id)}
                trackColor={{ false: Colors.background.tertiary, true: Colors.primaryLight }}
                thumbColor={enabledWallets.includes(id) ? Colors.primary : Colors.text.secondary}
              />
            </View>
          ))}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Manual Entry</Text>
          <Button
            title="Add Transaction"
            onPress={() => setShowAddModal(true)}
            variant="outline"
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Total Transactions</Text>
            <Text style={styles.statsValue}>{transactions.length}</Text>
          </View>
          <Button
            title="Clear All Data"
            onPress={handleClearData}
            variant="danger"
            style={styles.dangerButton}
          />
        </Card>
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Transaction</Text>

            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeButton, manualType === 'debit' && styles.typeButtonActive]}
                onPress={() => setManualType('debit')}
              >
                <Text style={[styles.typeButtonText, manualType === 'debit' && styles.typeButtonTextActive]}>
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, manualType === 'credit' && styles.typeButtonActiveCredit]}
                onPress={() => setManualType('credit')}
              >
                <Text style={[styles.typeButtonText, manualType === 'credit' && styles.typeButtonTextActive]}>
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Amount (NPR)"
              placeholderTextColor={Colors.text.tertiary}
              keyboardType="numeric"
              value={manualAmount}
              onChangeText={setManualAmount}
            />

            <TextInput
              style={styles.input}
              placeholder="Note (optional)"
              placeholderTextColor={Colors.text.tertiary}
              value={manualNote}
              onChangeText={setManualNote}
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowAddModal(false)}
                variant="secondary"
                style={styles.modalButton}
              />
              <Button
                title="Add"
                onPress={handleAddManualTransaction}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  toggleLabel: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statsLabel: {
    fontSize: FontSize.md,
    color: Colors.text.tertiary,
  },
  statsValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  dangerButton: {
    marginTop: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.secondary,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  typeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: Colors.card.expense,
  },
  typeButtonActiveCredit: {
    backgroundColor: Colors.card.income,
  },
  typeButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
  },
  typeButtonTextActive: {
    color: Colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.lg,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    backgroundColor: Colors.background.tertiary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  modalButton: {
    flex: 1,
  },
});
