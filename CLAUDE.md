# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Kharcha Kitab — Project Guide

**Kharcha Kitab** (खर्च किताब) is an Android-only React Native app that automatically reads SMS from Nepali banks and push notifications from digital wallets to log income/expenses.

- **Platform:** Android only
- **Language:** TypeScript (strict mode)
- **Framework:** React Native with Expo (bare workflow + file-based routing)
- **Currency:** NPR (Nepali Rupee)
- **Calendar:** Bikram Sambat (BS) dates in UI, AD used internally

## Dev Commands

```bash
npm install              # Install dependencies
npx expo start           # Start dev server
npx expo run:android     # Run on Android device/emulator
npx expo build           # Build production APK
npx expo lint            # Run ESLint
```

No test framework is configured. Use manual testing on a real device (emulators don't support SMS/notifications).

## Architecture

### Navigation (Expo Router)
This project uses **Expo Router v6** with file-based routing. Routes live in `src/app/`:
- `src/app/_layout.tsx` — Root layout with onboarding redirect
- `src/app/onboarding.tsx` — Permission setup (shown once)
- `src/app/(tabs)/_layout.tsx` — Tab navigator
- `src/app/(tabs)/home.tsx` — Dashboard
- `src/app/(tabs)/history.tsx` — Transaction list with filters
- `src/app/(tabs)/stats.tsx` — Statistics screen
- `src/app/(tabs)/settings.tsx` — Bank/wallet toggles

No manual navigator files exist. Don't add `TabNavigator.tsx` or `RootNavigator.tsx`.

### Core Services
- `src/services/SmsParser.ts` — Parses bank SMS using patterns from `banks.config.ts`
- `src/services/NotificationParser.ts` — Parses wallet push notifications
- `src/services/NotificationListener.ts` — Background notification handler
- `src/services/SmsService.ts` — SMS reading service

### State Management
`src/store/transactionStore.ts` uses **Zustand** with AsyncStorage persistence. The store holds transactions, enabled banks/wallets, and onboarding state.

### Config (Single Source of Truth)
`src/config/banks.config.ts` contains all regex patterns for 15 banks and 6 wallets. **Never hardcode bank/wallet regex elsewhere.**

### Date Handling
`src/utils/dateConverter.ts` handles BS/AD conversion. UI always shows BS dates (e.g., "Baisakh 12, 2081"). Storage uses `YYYY-MM-DD` format.

## Supported Sources

**Banks (SMS):** NMB, Nabil, SBI, EBL, HBL, SBL, ADBL, NIC Asia, Global IME, Laxmi Sunrise, Machhapuchchhre, Sanima, Citizens, Prime, Kumari

**Wallets (Notifications):** eSewa, Khalti, IME Pay, Prabhu Pay, Hamro Pay, ConnectIPS

## Key Interfaces

```typescript
// Transaction type — all amounts are positive, type indicates direction
interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  source: string;
  category: string;
  note?: string;
  dateAD: string;       // ISO string for internal use
  dateBS: string;       // YYYY-MM-DD for UI display
  isAuto: boolean;
  rawMessage?: string;
}
```

## Development Rules

- **Android only** — no iOS-specific code
- **Offline first** — no backend, APIs, or Firebase
- **TypeScript strict mode** — no `any` types
- **All bank/wallet patterns in `banks.config.ts`** — never inline regex
- **Real device testing required** — emulators can't simulate SMS or notifications
- **Distribute as APK** — Google Play restricts READ_SMS permission