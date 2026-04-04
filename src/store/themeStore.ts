import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export type ThemeMode = 'dark' | 'light';

interface ThemeStore {
  themeMode: 'dark' | 'light';
  toggleTheme: () => void;
  setThemeMode: (mode: 'dark' | 'light') => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeMode: 'dark',
      toggleTheme: () => {
        set((state) => ({
          themeMode: state.themeMode === 'dark' ? 'light' : 'dark',
        }));
      },
      setThemeMode: (mode) => {
        set({ themeMode: mode });
      },
    }),
    {
      name: 'kharcha-kitab-theme',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
