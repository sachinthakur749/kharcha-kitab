import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { AddTransactionModal } from '../../components/AddTransactionModal';

export default function TabLayout() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background.primary }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.text.tertiary,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'podium' : 'podium-outline'} size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history" // Designed as Wallet
          options={{
            tabBarIcon: ({ focused, color }) => (
              <View style={styles.rightTabPadding}>
                 <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={26} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="settings" // Designed as Profile
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={26} color={color} />
            ),
          }}
        />
      </Tabs>
      
      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)} activeOpacity={0.8}>
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Global Add Manual Entry Modal */}
      <AddTransactionModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
    height: 70,
    elevation: 0,
    shadowOpacity: 0,
  },
  rightTabPadding: {
    // A small bump to push the icon slightly away from the center fab if needed, but flex evenly spaces them by default.
  },
  fabContainer: {
    position: 'absolute',
    bottom: 35,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});