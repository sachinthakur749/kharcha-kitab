import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '../store/transactionStore';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const AddTransactionModal: React.FC<Props> = ({ visible, onClose }) => {
  const { addTransaction } = useTransactionStore();
  
  const [manualAmount, setManualAmount] = useState('');
  const [manualType, setManualType] = useState<'credit' | 'debit'>('debit');
  const [manualNote, setManualNote] = useState('');

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
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Transaction</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.typeSelector}>
            <TouchableOpacity 
              style={[styles.typeButton, manualType === 'debit' && styles.typeButtonActiveExpense]} 
              onPress={() => setManualType('debit')}
            >
              <Text style={[styles.typeButtonText, manualType === 'debit' && styles.textWhite]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.typeButton, manualType === 'credit' && styles.typeButtonActiveIncome]} 
              onPress={() => setManualType('credit')}
            >
              <Text style={[styles.typeButtonText, manualType === 'credit' && styles.textWhite]}>Income</Text>
            </TouchableOpacity>
          </View>

          <TextInput 
            style={styles.input} 
            placeholder="Amount (NPR)" 
            keyboardType="numeric" 
            value={manualAmount} 
            onChangeText={setManualAmount} 
            placeholderTextColor="#999"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Note (optional)" 
            value={manualNote} 
            onChangeText={setManualNote} 
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleAddManualTransaction}>
            <Text style={styles.submitText}>Save Transaction</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
  },
  closeBtn: {
    padding: 4,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
  },
  typeButtonActiveExpense: {
    backgroundColor: '#F95B51',
  },
  typeButtonActiveIncome: {
    backgroundColor: '#22C55E',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#222222',
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  submitBtn: {
    backgroundColor: '#387B75',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#387B75',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
