import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '../../store/transactionStore';
import { bankPatterns } from '../../config/banks.config';

export default function SettingsScreen() {
  const {
    enabledBanks,
    enabledWallets,
    toggleBank,
    toggleWallet,
    clearAllTransactions,
    transactions,
  } = useTransactionStore();

  const [showBanksModal, setShowBanksModal] = useState(false);
  const [showWalletsModal, setShowWalletsModal] = useState(false);

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
      `Are you sure you want to delete all ${transactions.length} transactions? This action cannot be undone.`,
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

  const renderListItem = (icon: string, bg: string, label: string, onPress: () => void, isLast?: boolean) => (
    <View>
      <TouchableOpacity style={styles.listItem} onPress={onPress}>
        <View style={[styles.listIconContainer, { backgroundColor: bg }]}>
           <Ionicons name={icon as any} size={20} color="#387B75" />
        </View>
        <Text style={styles.listLabel}>{label}</Text>
      </TouchableOpacity>
      {!isLast && <View style={styles.divider} />}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Background Curve extending down */}
      <View style={styles.topBackground} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.bellIconContainer}>
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Avatar Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarBorder}>
              <Ionicons name="person" size={80} color="#C4C4C4" style={{marginTop: 10}} />
            </View>
            <Text style={styles.userName}>Kharcha Kitab User</Text>
            <Text style={styles.userHandle}>@user</Text>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
             {renderListItem('business', '#F3F4F6', 'Bank Integrations', () => setShowBanksModal(true))}
             {renderListItem('wallet', '#F3F4F6', 'Digital Wallets', () => setShowWalletsModal(true))}
             {renderListItem('lock-closed', '#F3F4F6', 'Data and privacy (Reset)', handleClearData, true)}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Banks Modal */}
      <Modal visible={showBanksModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>Bank Integrations</Text>
               <TouchableOpacity onPress={() => setShowBanksModal(false)}>
                 <Ionicons name="close" size={24} color="#666" />
               </TouchableOpacity>
            </View>
            <ScrollView style={{maxHeight: 400}}>
              {bankPatterns.map((bank) => (
                <View key={bank.senderId} style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>{bank.name}</Text>
                  <Switch value={enabledBanks.includes(bank.senderId)} onValueChange={() => toggleBank(bank.senderId)} trackColor={{ false: '#F3F4F6', true: '#599E99' }} thumbColor={enabledBanks.includes(bank.senderId) ? '#387B75' : '#888'} />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Wallets Modal */}
      <Modal visible={showWalletsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>Digital Wallets</Text>
               <TouchableOpacity onPress={() => setShowWalletsModal(false)}>
                 <Ionicons name="close" size={24} color="#666" />
               </TouchableOpacity>
            </View>
            <ScrollView style={{maxHeight: 400}}>
              {Object.entries(walletNames).map(([id, name]) => (
                <View key={id} style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>{name}</Text>
                  <Switch value={enabledWallets.includes(id)} onValueChange={() => toggleWallet(id)} trackColor={{ false: '#F3F4F6', true: '#599E99' }} thumbColor={enabledWallets.includes(id) ? '#387B75' : '#888'} />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
    left: -50,
    right: -50,
    height: 330,
    backgroundColor: '#387B75',
    borderBottomLeftRadius: 300,
    borderBottomRightRadius: 300,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 20,
  },
  headerIcon: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
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
  content: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#387B75',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  listIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  listLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222222',
  },
  divider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginLeft: 60,
  },
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
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
  typeButtonActive: {
    backgroundColor: '#F95B51',
  },
  typeButtonActiveCredit: {
    backgroundColor: '#22C55E',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  typeButtonTextActive: {
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
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#444444',
  },
});
