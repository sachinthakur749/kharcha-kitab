import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../providers/ThemeProvider';
import { AddTransactionModal } from '../../components/AddTransactionModal';

export default function TabLayout() {
  const { colors } = useThemeColors();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text.tertiary,
          tabBarStyle: {
            ...styles.tabBar,
            backgroundColor: colors.background.primary,
            borderTopColor: colors.border.primary,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginBottom: 4,
          },
          tabBarIconStyle: {
            marginBottom: 2,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'analytics' : 'analytics-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'time' : 'time-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Floating Action Button — raised above the tab bar with a clear gap */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]} onPress={() => setShowAddModal(true)} activeOpacity={0.8}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <AddTransactionModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 68,
    paddingTop: 6,
    paddingBottom: 6,
    borderTopWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 42,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
