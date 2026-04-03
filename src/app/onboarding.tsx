import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import { useTransactionStore } from "../store/transactionStore";
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from "../constants/theme";

export default function OnboardingScreen() {
  const router = useRouter();
  const { setOnboardingComplete } = useTransactionStore();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Kharcha Kitab",
      description:
        "Your automatic expense tracker for Nepali banks and digital wallets.",
      icon: "💰",
    },
    {
      title: "SMS Permission",
      description:
        "We need permission to read SMS from your bank to automatically log transactions. This helps track your expenses without manual entry.",
      icon: "📱",
      action: "Open SMS Settings",
    },
    {
      title: "Notification Access",
      description:
        "Enable notification access to read push notifications from digital wallets like eSewa, Khalti, and IME Pay.",
      icon: "🔔",
      action: "Open Settings",
    },
    {
      title: "All Set!",
      description:
        "Kharcha Kitab is ready to automatically track your income and expenses from SMS and notifications.",
      icon: "✅",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setOnboardingComplete(true);
      router.replace("/home");
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
            variant="outline"
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
          title={currentStep === steps.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSize.lg,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    marginTop: Spacing.md,
  },
  dots: {
    flexDirection: "row",
    marginTop: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.background.tertiary,
    marginHorizontal: Spacing.xs,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  footer: {
    padding: Spacing.xl,
  },
});
