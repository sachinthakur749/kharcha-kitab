# Kharcha Kitab — Claude Code Project Guide

## 🧠 Project Overview
**Kharcha Kitab** (खर्च किताब) is an Android-only React Native app that automatically reads SMS from Nepali banks and push notifications from digital wallets to log income/expenses — no manual entry needed.

- **Platform:** Android only (iOS does not support SMS/notification reading)
- **Language:** TypeScript (strict mode)
- **Framework:** React Native with Expo bare workflow
- **Currency:** NPR (Nepali Rupee) everywhere
- **Calendar:** Bikram Sambat (BS) dates in all UI, AD used internally

---

## 🛠️ Tech Stack

| Purpose | Library |
|---|---|
| Framework | React Native (Expo bare workflow) |
| Language | TypeScript (strict) |
| Navigation | React Navigation v6 (Tab + Stack) |
| SMS Reading | react-native-get-sms-android |
| Notification Reading | react-native-notification-listener |
| Local Storage | MMKV |
| State Management | Zustand |
| Charts | Victory Native |
| BS Date Conversion | nepali-date-converter |
| Icons | react-native-vector-icons |

---

## 📁 Folder Structure

```
src/
├── components/         # Reusable UI components (Button, Card, TransactionItem etc.)
├── config/
│   └── banks.config.ts     # All bank/wallet regex patterns — single source of truth
├── navigation/
│   ├── TabNavigator.tsx
│   └── RootNavigator.tsx
├── screens/
│   ├── Onboarding/
│   │   └── OnboardingScreen.tsx   # Permissions setup guide
│   ├── Dashboard/
│   │   └── DashboardScreen.tsx    # Today BS date, balance, recent txns
│   ├── History/
│   │   └── HistoryScreen.tsx      # Filterable transaction list
│   ├── Stats/
│   │   └── StatsScreen.tsx        # Charts, monthly summary
│   └── Settings/
│       └── SettingsScreen.tsx     # Toggle banks/wallets on/off
├── services/
│   ├── SmsParser.ts               # Reads + parses bank SMS
│   └── NotificationParser.ts     # Reads wallet push notifications
├── store/
│   └── transactionStore.ts       # Zustand global store
├── types/
│   └── transaction.ts            # TypeScript interfaces
└── utils/
    └── dateConverter.ts          # BS/AD conversion helpers
```

---

## 📱 Screens (5 Total)

### 1. Onboarding
- Step-by-step guide to grant SMS permission
- Step-by-step guide to enable Accessibility Service for notifications
- Only shown once on first launch

### 2. Dashboard
- Show today's date in BS format
- Total balance (credits - debits)
- This month's income vs expense summary
- Last 5 auto-logged transactions

### 3. Transaction History
- Full list of all transactions
- Filter by: All / Income / Expense
- Filter by: Today / This Week / This Month
- Each item shows: amount, bank/wallet source, BS date, auto/manual badge

### 4. Stats
- Bar chart: spending by category (Food, Transport, Bills etc.)
- Monthly income vs expense comparison
- Top spending category highlight

### 5. Settings
- Toggle individual banks on/off
- Toggle individual wallets on/off
- Option to manually add a transaction
- Clear all data option

---

## 🏦 Supported Banks & Wallets

### Digital Wallets (Notification Listener)
- eSewa
- Khalti (includes IME Pay)
- Prabhu Pay
- Hamro Pay
- ConnectIPS

### Commercial Banks (SMS Reading)
- NMB Bank
- Nabil Bank
- Nepal SBI Bank
- Everest Bank (EBL)
- Himalayan Bank (HBL)
- Siddhartha Bank (SBL)
- ADBL
- NIC Asia Bank
- Global IME Bank (GIBL)
- Laxmi Sunrise Bank (LSB)
- Machhapuchchhre Bank (MBL)
- Sanima Bank
- Citizens Bank (CZBIL)
- Prime Bank (PBLNE)
- Kumari Bank (KBL)

---

## 🔑 Key Config File: banks.config.ts

This is the most important config file. Every bank and wallet has regex patterns here.
**Never hardcode regex patterns inside service files — always reference banks.config.ts.**

Structure:
```typescript
export type TransactionType = 'credit' | 'debit';

export interface BankPattern {
  senderId: string;       // SMS sender ID e.g. "NMB", "NABIL"
  name: string;           // Human readable name
  patterns: {
    debit?: RegExp;
    credit?: RegExp;
    balance?: RegExp;
  };
}

export interface WalletPattern {
  packageName: string;    // Android package name e.g. "com.f1soft.esewa"
  name: string;
  patterns: {
    received?: RegExp;
    sent?: RegExp;
  };
}
```

---

## 🔐 Android Permissions Required

Add to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.READ_SMS" />
<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE" />
```

---

## 💾 Transaction Data Model

```typescript
// src/types/transaction.ts
export interface Transaction {
  id: string;                          // UUID
  amount: number;                      // Always positive
  type: 'credit' | 'debit';
  source: string;                      // Bank/wallet name e.g. "NMB Bank"
  category: string;                    // Auto or user-set
  note?: string;                       // Parsed merchant or user note
  dateAD: string;                      // ISO string — used internally
  dateBS: string;                      // e.g. "2081-05-12" — shown in UI
  isAuto: boolean;                     // true = parsed from SMS/notification
  rawMessage?: string;                 // Original SMS for debugging
}
```

---

## 🧩 State Management (Zustand)

```typescript
// src/store/transactionStore.ts
interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (txn: Transaction) => void;
  deleteTransaction: (id: string) => void;
  getByMonth: (year: number, month: number) => Transaction[];
  totalCredits: () => number;
  totalDebits: () => number;
}
```

---

## 📅 BS Date Rules
- Always display dates in BS format in UI
- Use `nepali-date-converter` for all conversions
- Format: `YYYY-MM-DD` for storage, `Baisakh 12, 2081` for display
- Never show AD dates to the user

---

## ⚡ Development Rules & Preferences
- **Android only** — never add iOS-specific code or conditionals
- **Offline first** — no backend, no API calls, no Firebase
- **No paid services** — everything must be free
- **TypeScript strict mode** — no `any` types, proper interfaces always
- **One responsibility per file** — keep services, components, utils separate
- **Always update banks.config.ts** when adding new bank support — never inline regex
- **Test SMS parsing logic first** before building UI screens
- Use real device for testing — emulators don't support SMS or notifications

---

## 🚀 Build Order (Follow This Sequence)
1. Project scaffold + install all dependencies
2. Folder structure setup
3. `banks.config.ts` with all patterns
4. `transaction.ts` types
5. `SmsParser.ts` service + test with mock SMS strings
6. `NotificationParser.ts` service
7. Zustand store + MMKV persistence
8. Onboarding screen (permissions)
9. Dashboard screen
10. Transaction History screen
11. Stats screen + charts
12. Settings screen
13. UI polish + edge cases
14. Generate APK

---

## 📝 Notes
- Distribute as APK (sideload) — Google Play Store restricts READ_SMS permission
- Sideloading is common in Nepal, not a problem for target users
- Test with real Nepali SIM receiving actual bank SMS for accuracy
- Each bank SMS format can vary slightly — keep regex flexible with optional spaces/punctuation