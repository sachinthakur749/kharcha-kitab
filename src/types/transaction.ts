export type TransactionType = 'credit' | 'debit';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  source: string;
  category: string;
  note?: string;
  dateAD: string;
  dateBS: string;
  isAuto: boolean;
  rawMessage?: string;
}
