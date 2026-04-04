import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '../../store/transactionStore';
import { bankPatterns } from '../../config/banks.config';
import { useThemeColors } from '../../providers/ThemeProvider';
import { useThemeStore } from '../../store/themeStore';

export default function SettingsScreen() {
  const { colors } = useThemeColors();
  const { themeMode, toggleTheme } = useThemeStore();
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
           <Ionicons name={icon as any} size={20} color={colors.primary} />
        </View>
        <Text style={[styles.listLabel, { color: colors.text.primary }]}>{label}</Text>
      </TouchableOpacity>
      {!isLast && <View style={[styles.divider, { backgroundColor: colors.border.secondary }]} />}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.topBackground, { backgroundColor: colors.primary }]} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Settings</Text>
          <TouchableOpacity style={[styles.bellIconContainer, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Avatar Section */}
          <View style={styles.profileSection}>
            <View style={[styles.avatarBorder, { backgroundColor: colors.background.secondary, borderColor: colors.border.secondary }]}>
              <Ionicons name="person" size={80} color={colors.text.tertiary} style={{marginTop: 10}} />
            </View>
            <Text style={[styles.userName, { color: colors.text.primary }]}>Kharcha Kitab User</Text>
            <Text style={[styles.userHandle, { color: colors.primary }]}>@user</Text>
          </View>

          {/* Appearance */}
          <View style={styles.menuContainer}>
            <View style={styles.appearanceRow}>
              <View style={[styles.listIconContainer, { backgroundColor: colors.background.secondary }]}>
                <Ionicons name="moon" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.listLabel, { color: colors.text.primary, flex: 1 }]}>Dark Mode</Text>
              <Switch
                value={themeMode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border.secondary, true: colors.primaryLight }}
                thumbColor={themeMode === 'dark' ? colors.primary : colors.text.tertiary}
              />
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border.secondary, marginLeft: 20 }]} />
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
             {renderListItem('business', colors.background.secondary, 'Bank Integrations', () => setShowBanksModal(true))}
             {renderListItem('wallet', colors.background.secondary, 'Digital Wallets', () => setShowWalletsModal(true))}
             {renderListItem('lock-closed', colors.background.secondary, 'Data and privacy (Reset)', handleClearData, true)}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Banks Modal */}
      <Modal visible={showBanksModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background.elevated }]}>
            <View style={styles.modalHeader}>
               <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Bank Integrations</Text>
               <TouchableOpacity onPress={() => setShowBanksModal(false)}>
                 <Ionicons name="close" size={24} color={colors.text.secondary} />
               </TouchableOpacity>
            </View>
            <ScrollView style={{maxHeight: 400}}>
              {bankPatterns.map((bank) => (
                <View key={bank.senderId} style={[styles.toggleRow, { borderBottomColor: colors.border.secondary }]}>
                  <Text style={[styles.toggleLabel, { color: colors.text.primary }]}>{bank.name}</Text>
                  <Switch
                    value={enabledBanks.includes(bank.senderId)}
                    onValueChange={() => toggleBank(bank.senderId)}
                    trackColor={{ false: colors.background.secondary, true: colors.primaryLight }}
                    thumbColor={enabledBanks.includes(bank.senderId) ? colors.primary : '#888'}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Wallets Modal */}
      <Modal visible={showWalletsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background.elevated }]}>
            <View style={styles.modalHeader}>
               <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Digital Wallets</Text>
               <TouchableOpacity onPress={() => setShowWalletsModal(false)}>
                 <Ionicons name="close" size={24} color={colors.text.secondary} />
               </TouchableOpacity>
            </View>
            <ScrollView style={{maxHeight: 400}}>
              {Object.entries(walletNames).map(([id, name]) => (
                <View key={id} style={[styles.toggleRow, { borderBottomColor: colors.border.secondary }]}>
                  <Text style={[styles.toggleLabel, { color: colors.text.primary }]}>{name}</Text>
                  <Switch
                    value={enabledWallets.includes(id)}
                    onValueChange={() => toggleWallet(id)}
                    trackColor={{ false: colors.background.secondary, true: colors.primaryLight }}
                    thumbColor={enabledWallets.includes(id) ? colors.primary : '#888'}
                  />
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
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: -50,
    right: -50,
    height: 330,
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
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  bellIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
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
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
    borderWidth: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  appearanceRow: {
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
  },
  divider: {
    height: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
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
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  toggleLabel: {
    fontSize: 16,
  },
});
