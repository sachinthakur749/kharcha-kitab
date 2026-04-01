import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactionStore } from '../../store/transactionStore';
import { bankPatterns } from '../../config/banks.config';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

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

  const walletNames: Record<string, string> = {
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
      id: `manual-${Date.now()}`,
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
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Banks</Text>
          {bankPatterns.map((bank) => (
            <View key={bank.senderId} style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{bank.name}</Text>
              <Switch
                value={enabledBanks.includes(bank.senderId)}
                onValueChange={() => toggleBank(bank.senderId)}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={enabledBanks.includes(bank.senderId) ? '#208AEF' : '#F4F4F5'}
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
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={enabledWallets.includes(id) ? '#208AEF' : '#F4F4F5'}
              />
            </View>
          ))}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Manual Entry</Text>
          <Button
            title="Add Transaction"
            onPress={() => setShowAddModal(true)}
            variant="secondary"
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
              keyboardType="numeric"
              value={manualAmount}
              onChangeText={setManualAmount}
              placeholderTextColor="#9CA3AF"
            />

            <TextInput
              style={styles.input}
              placeholder="Note (optional)"
              value={manualNote}
              onChangeText={setManualNote}
              placeholderTextColor="#9CA3AF"
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  toggleLabel: {
    fontSize: 15,
    color: '#374151',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  statsValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  dangerButton: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#FEE2E2',
  },
  typeButtonActiveCredit: {
    backgroundColor: '#DCFCE7',
  },
  typeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
  },
});
