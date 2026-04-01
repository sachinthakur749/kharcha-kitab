import { PermissionsAndroid, Platform } from 'react-native';
import { createTransactionFromSms } from './SmsParser';
import { useTransactionStore } from '../store/transactionStore';

// Safe check for the native SMS module
let SmsAndroid: any = null;

if (Platform.OS === 'android') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SmsAndroid = require('react-native-get-sms-android').default;
  } catch (e) {
    console.warn('[SmsService] Native SMS module not found. Scan will be disabled.');
  }
}
export const SmsService = {
  /**
   * Requests necessary SMS permissions on Android.
   */
  requestPermissions: async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return false;

    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      ]);

      return (
        granted[PermissionsAndroid.PERMISSIONS.READ_SMS] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn('[SmsService] Error requesting permissions:', err);
      return false;
    }
  },

  /**
   * Scans the SMS inbox for transactions.
   * This is useful for first-time setup or manual sync.
   */
  scanInbox: (hoursBack: number = 24) => {
    const minTimestamp = Date.now() - hoursBack * 60 * 60 * 1000;
    
    const filter = {
      box: 'inbox',
      minDate: minTimestamp,
    };

    if (!SmsAndroid || !SmsAndroid.list) {
      console.warn('[SmsService] SmsAndroid native module not available. Scan skipped.');
      return;
    }

    SmsAndroid.list(
      JSON.stringify(filter),
      (fail: string) => {
        console.error('[SmsService] Failed to list SMS:', fail);
      },
      (count: number, smsList: string) => {
        const messages = JSON.parse(smsList);
        console.log(`[SmsService] Scanned ${count} messages`);

        const { addTransaction, transactions } = useTransactionStore.getState();
        let newCount = 0;

        messages.forEach((msg: any) => {
          // Check if already processed (this is simple, could be improved with unique SMS IDs)
          const isProcessed = transactions.some(t => t.rawMessage === msg.body);
          if (isProcessed) return;

          const transaction = createTransactionFromSms(
            msg.address,
            msg.body,
            new Date(msg.date)
          );

          if (transaction) {
            addTransaction(transaction);
            newCount++;
          }
        });

        console.log(`[SmsService] Auto-logged ${newCount} new transactions from scan`);
      }
    );
  },

  /**
   * Placeholder for real-time listener.
   * Since react-native-get-sms-android doesn't support listening,
   * we can trigger a scan periodically or use a BroadcastReceiver.
   */
  startSync: () => {
    // Initial scan
    SmsService.scanInbox(48); // Scan last 2 days on start

    // Set up periodic scan every 30 minutes as a fallback
    setInterval(() => {
      SmsService.scanInbox(1); // Scan last hour
    }, 30 * 60 * 1000);
  }
};
