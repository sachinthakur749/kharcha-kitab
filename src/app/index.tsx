import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useTransactionStore } from '../store/transactionStore';

export default function Index() {
  const { hasCompletedOnboarding } = useTransactionStore();

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/home" />;
}
