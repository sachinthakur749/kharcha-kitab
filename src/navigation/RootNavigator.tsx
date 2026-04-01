import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TabNavigator } from './TabNavigator';
import { OnboardingScreen } from '../screens/Onboarding/OnboardingScreen';
import { useTransactionStore } from '../store/transactionStore';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { hasCompletedOnboarding } = useTransactionStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasCompletedOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};
