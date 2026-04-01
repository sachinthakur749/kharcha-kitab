export type TransactionType = 'credit' | 'debit';

export interface BankPattern {
  senderId: string;
  name: string;
  patterns: {
    debit?: RegExp;
    credit?: RegExp;
    balance?: RegExp;
  };
}

export interface WalletPattern {
  packageName: string;
  name: string;
  patterns: {
    received?: RegExp;
    sent?: RegExp;
  };
}

export const bankPatterns: BankPattern[] = [
  {
    senderId: 'NMB',
    name: 'NMB Bank',
    patterns: {
      credit: /credited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      debit: /debited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    senderId: 'NABIL',
    name: 'Nabil Bank',
    patterns: {
      credit: /credited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      debit: /debited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    senderId: 'SBI',
    name: 'Nepal SBI Bank',
    patterns: {
      credit: /credited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      debit: /debited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    senderId: 'EBL',
    name: 'Everest Bank (EBL)',
    patterns: {
      credit: /credited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      debit: /debited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    senderId: 'HBL',
    name: 'Himalayan Bank (HBL)',
    patterns: {
      credit: /credited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      debit: /debited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    senderId: 'SBL',
    name: 'Siddhartha Bank (SBL)',
    patterns: {
      credit: /credited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      debit: /debited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    senderId: 'ADBL',
    name: 'ADBL',
    patterns: {
      credit: /credited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      debit: /debited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    senderId: 'NIC',
    name: 'NIC Asia Bank',
    patterns: {
      credit: /credited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      debit: /debited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    senderId: 'GIBL',
    name: 'Global IME Bank (GIBL)',
    patterns: {
      credit: /credited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      debit: /debited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    senderId: 'LSB',
    name: 'Laxmi Sunrise Bank (LSB)',
    patterns: {
      credit: /credited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      debit: /debited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    senderId: 'MBL',
    name: 'Machhapuchchhre Bank (MBL)',
    patterns: {
      credit: /credited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      debit: /debited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    senderId: 'SANIMA',
    name: 'Sanima Bank',
    patterns: {
      credit: /credited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      debit: /debited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    senderId: 'CZBIL',
    name: 'Citizens Bank (CZBIL)',
    patterns: {
      credit: /credited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      debit: /debited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    senderId: 'PBLNE',
    name: 'Prime Bank (PBLNE)',
    patterns: {
      credit: /credited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      debit: /debited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    senderId: 'KBL',
    name: 'Kumari Bank (KBL)',
    patterns: {
      credit: /credited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      debit: /debited.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
];

export const walletPatterns: WalletPattern[] = [
  {
    packageName: 'com.f1soft.esewa',
    name: 'eSewa',
    patterns: {
      received: /received.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      sent: /sent.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    packageName: 'com.khalti',
    name: 'Khalti',
    patterns: {
      received: /received.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      sent: /sent.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    packageName: 'com.imepay',
    name: 'IME Pay',
    patterns: {
      received: /received.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      sent: /sent.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    packageName: 'com.prabhupay',
    name: 'Prabhu Pay',
    patterns: {
      received: /received.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      sent: /sent.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    packageName: 'com.hamropay',
    name: 'Hamro Pay',
    patterns: {
      received: /received.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      sent: /sent.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
  {
    packageName: 'com.connectips',
    name: 'ConnectIPS',
    patterns: {
      received: /received.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
      sent: /sent.*Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    },
  },
];

export const getBankBySenderId = (senderId: string): BankPattern | undefined => {
  return bankPatterns.find((bank) =>
    senderId.toUpperCase().includes(bank.senderId)
  );
};

export const getWalletByPackageName = (packageName: string): WalletPattern | undefined => {
  return walletPatterns.find((wallet) =>
    packageName.includes(wallet.packageName)
  );
};
