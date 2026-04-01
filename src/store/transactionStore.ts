import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types/transaction';

const mmkvStorage: StateStorage = {
  getItem: async (name: string) => {
    const value = await AsyncStorage.getItem(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};

interface TransactionStore {
  transactions: Transaction[];
  enabledBanks: string[];
  enabledWallets: string[];
  hasCompletedOnboarding: boolean;

  addTransaction: (txn: Transaction) => void;
  deleteTransaction: (id: string) => void;
  clearAllTransactions: () => void;
  getByMonth: (year: number, month: number) => Transaction[];
  totalCredits: () => number;
  totalDebits: () => number;
  toggleBank: (bankId: string) => void;
  toggleWallet: (walletId: string) => void;
  setOnboardingComplete: (complete: boolean) => void;
  getBalance: () => number;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      enabledBanks: ['NMB', 'NABIL', 'SBI', 'EBL', 'HBL', 'SBL', 'ADBL', 'NIC', 'GIBL', 'LSB', 'MBL', 'SANIMA', 'CZBIL', 'PBLNE', 'KBL'],
      enabledWallets: ['esewa', 'khalti', 'imepay', 'prabhupay', 'hamropay', 'connectips'],
      hasCompletedOnboarding: false,

      addTransaction: (txn: Transaction) => {
        set((state) => ({
          transactions: [txn, ...state.transactions],
        }));
      },

      deleteTransaction: (id: string) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      clearAllTransactions: () => {
        set({ transactions: [] });
      },

      getByMonth: (year: number, month: number) => {
        const { transactions } = get();
        return transactions.filter((txn) => {
          const parts = txn.dateBS.split('-');
          if (parts.length !== 3) return false;
          const txnYear = parseInt(parts[0], 10);
          const txnMonth = parseInt(parts[1], 10);
          return txnYear === year && txnMonth === month;
        });
      },

      totalCredits: () => {
        const { transactions } = get();
        return transactions
          .filter((txn) => txn.type === 'credit')
          .reduce((sum, txn) => sum + txn.amount, 0);
      },

      totalDebits: () => {
        const { transactions } = get();
        return transactions
          .filter((txn) => txn.type === 'debit')
          .reduce((sum, txn) => sum + txn.amount, 0);
      },

      toggleBank: (bankId: string) => {
        set((state) => {
          const enabled = state.enabledBanks.includes(bankId);
          return {
            enabledBanks: enabled
              ? state.enabledBanks.filter((id) => id !== bankId)
              : [...state.enabledBanks, bankId],
          };
        });
      },

      toggleWallet: (walletId: string) => {
        set((state) => {
          const enabled = state.enabledWallets.includes(walletId);
          return {
            enabledWallets: enabled
              ? state.enabledWallets.filter((id) => id !== walletId)
              : [...state.enabledWallets, walletId],
          };
        });
      },

      setOnboardingComplete: (complete: boolean) => {
        set({ hasCompletedOnboarding: complete });
      },

      getBalance: () => {
        const { totalCredits, totalDebits } = get();
        return totalCredits() - totalDebits();
      },
    }),
    {
      name: 'kharcha-kitab-transactions',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
