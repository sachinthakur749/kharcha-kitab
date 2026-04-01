import { walletPatterns, getWalletByPackageName } from '../config/banks.config';
import { Transaction, TransactionType } from '../types/transaction';
import { convertADToBS } from '../utils/dateConverter';
import { v4 as uuidv4 } from 'uuid';

export interface ParsedNotification {
  amount: number;
  type: TransactionType;
  source: string;
  note?: string;
  dateAD: string;
  dateBS: string;
}

export const parseNotification = (
  packageName: string,
  title: string,
  body: string,
  date: Date
): ParsedNotification | null => {
  const wallet = getWalletByPackageName(packageName);

  if (!wallet) {
    return null;
  }

  let amount: number | null = null;
  let type: TransactionType | null = null;

  const receivedMatch = wallet.patterns.received ? body.match(wallet.patterns.received) : null;
  if (receivedMatch && receivedMatch[1]) {
    amount = parseFloat(receivedMatch[1].replace(/,/g, ''));
    type = 'credit';
  }

  const sentMatch = wallet.patterns.sent ? body.match(wallet.patterns.sent) : null;
  if (sentMatch && sentMatch[1]) {
    amount = parseFloat(sentMatch[1].replace(/,/g, ''));
    type = 'debit';
  }

  if (amount === null || type === null) {
    return null;
  }

  return {
    amount,
    type,
    source: wallet.name,
    note: title,
    dateAD: date.toISOString(),
    dateBS: convertADToBS(date),
  };
};

export const createTransactionFromNotification = (
  packageName: string,
  title: string,
  body: string,
  date: Date
): Transaction | null => {
  const parsed = parseNotification(packageName, title, body, date);

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
