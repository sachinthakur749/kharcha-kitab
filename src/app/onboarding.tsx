import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTransactionStore } from '../store/transactionStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setOnboardingComplete } = useTransactionStore();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Kharcha Kitab',
      description: 'Your automatic expense tracker for Nepali banks and digital wallets.',
      icon: '💰',
    },
    {
      title: 'SMS Permission',
      description:
        'We need permission to read SMS from your bank to automatically log transactions. This helps track your expenses without manual entry.',
      icon: '📱',
      action: 'Open SMS Settings',
    },
    {
      title: 'Notification Access',
      description:
        'Enable notification access to read push notifications from digital wallets like eSewa, Khalti, and IME Pay.',
      icon: '🔔',
      action: 'Open Settings',
    },
    {
      title: 'All Set!',
      description:
        'Kharcha Kitab is ready to automatically track your income and expenses from SMS and notifications.',
      icon: '✅',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setOnboardingComplete(true);
      router.replace('/home');
    }
  };

  const handleAction = () => {
    Linking.openSettings();
  };

  const step = steps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.icon}>{step.icon}</Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>

        {step.action && (
          <Button
            title={step.action}
            onPress={handleAction}
            variant="secondary"
            style={styles.actionButton}
          />
        )}

        <View style={styles.dots}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentStep && styles.activeDot]}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  actionButton: {
    marginTop: 16,
  },
  dots: {
    flexDirection: 'row',
    marginTop: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#208AEF',
    width: 24,
  },
  footer: {
    padding: 24,
  },
});
