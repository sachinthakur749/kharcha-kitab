import { bankPatterns, getBankBySenderId, BankPattern } from '../config/banks.config';
import { Transaction, TransactionType } from '../types/transaction';
import { convertADToBS } from '../utils/dateConverter';
import { v4 as uuidv4 } from 'uuid';

export interface ParsedTransaction {
  amount: number;
  type: TransactionType;
  source: string;
  note?: string;
  dateAD: string;
  dateBS: string;
}

export const parseSms = (senderId: string, body: string, date: Date): ParsedTransaction | null => {
  const bank = getBankBySenderId(senderId);

  if (!bank) {
    return null;
  }

  let amount: number | null = null;
  let type: TransactionType | null = null;
  let note: string | undefined;

  const creditMatch = bank.patterns.credit ? body.match(bank.patterns.credit) : null;
  if (creditMatch && creditMatch[1]) {
    amount = parseFloat(creditMatch[1].replace(/,/g, ''));
    type = 'credit';
  }

  const debitMatch = bank.patterns.debit ? body.match(bank.patterns.debit) : null;
  if (debitMatch && debitMatch[1]) {
    amount = parseFloat(debitMatch[1].replace(/,/g, ''));
    type = 'debit';
  }

  if (amount === null || type === null) {
    return null;
  }

  const merchantMatch = body.match(/(?:to|at|from)\s+([A-Za-z0-9\s]+?)(?:\s+on|\s+Rs|$)/i);
  if (merchantMatch && merchantMatch[1]) {
    note = merchantMatch[1].trim();
  }

  return {
    amount,
    type,
    source: bank.name,
    note,
    dateAD: date.toISOString(),
    dateBS: convertADToBS(date),
  };
};

export const createTransactionFromSms = (
  senderId: string,
  body: string,
  date: Date
): Transaction | null => {
  const parsed = parseSms(senderId, body, date);

  if (!parsed) {
    return null;
  }

  return {
    id: uuidv4(),
    ...parsed,
    category: 'auto',
    isAuto: true,
    rawMessage: body,
  };
};

export const testParseSms = (): void => {
  const testCases = [
    {
      senderId: 'NMB',
      body: 'Rs. 5,000.00 credited to your account NMB Mobile Banking on 2024-01-15 by account 1234567890',
      expectedType: 'credit',
      expectedAmount: 5000,
    },
    {
      senderId: 'NABIL',
      body: 'Your account XXXX1234 has been debited by Rs.1,500.00 on 2024-01-15 for purchase at Merchant Name',
      expectedType: 'debit',
      expectedAmount: 1500,
    },
  ];

  testCases.forEach((test, index) => {
    const result = parseSms(test.senderId, test.body, new Date());
    console.log(`Test ${index + 1}:`, result);
    if (result) {
      console.log(`  Amount: ${result.amount === test.expectedAmount ? 'PASS' : 'FAIL'}`);
      console.log(`  Type: ${result.type === test.expectedType ? 'PASS' : 'FAIL'}`);
    } else {
      console.log(`  Result: NULL (parsing failed)`);
    }
  });
};
