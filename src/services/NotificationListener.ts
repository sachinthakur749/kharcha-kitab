import { AppRegistry, Platform } from 'react-native';
import { createTransactionFromNotification } from './NotificationParser';
import { useTransactionStore } from '../store/transactionStore';

// Safe check for the native module - use dynamic require to avoid bundler issues
let RNAndroidNotificationListenerHeadlessJsName: string | null = null;
let notificationListenerModule: { RNAndroidNotificationListenerHeadlessJsName: string } | null = null;

if (Platform.OS === 'android') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    notificationListenerModule = require('react-native-notification-listener');
    RNAndroidNotificationListenerHeadlessJsName = notificationListenerModule?.RNAndroidNotificationListenerHeadlessJsName ?? null;
  } catch (e) {
    console.warn('[NotificationListener] Native module not found, background listener will be disabled.');
  }
}

/**
 * Headless JS Task for handling incoming notifications in the background.
 * This runs even when the app is closed.
 */
export const headlessNotificationListener = async ({ notification }: { notification: string }) => {
  if (notification) {
    try {
      const parsedNotification = JSON.parse(notification);
      const { app, title, text, time } = parsedNotification;

      console.log(`[NotificationListener] Received from ${app}: ${title} - ${text}`);

      // Parse the notification into a transaction
      const transaction = createTransactionFromNotification(
        app,
        title || '',
        text || '',
        new Date(parseInt(time ?? Date.now().toString(), 10))
      );

      if (transaction) {
        console.log(`[NotificationListener] Auto-logged transaction: ${transaction.amount} ${transaction.type} from ${transaction.source}`);
        
        // Add to store (this works because Zustand with MMKV is persistent)
        // Note: access the store directly since hooks don't work in Headless JS
        const store = useTransactionStore.getState();
        store.addTransaction(transaction);
      }
    } catch (error) {
      console.error('[NotificationListener] Error processing notification:', error);
    }
  }
};

/**
 * Registers the notification listener.
 * This should be called early in the app lifecycle (e.g., in index.js).
 */
export const registerNotificationListener = () => {
  if (Platform.OS === 'android' && RNAndroidNotificationListenerHeadlessJsName) {
    try {
      AppRegistry.registerHeadlessTask(
        RNAndroidNotificationListenerHeadlessJsName,
        () => headlessNotificationListener
      );
    } catch (e) {
      console.warn('[NotificationListener] Failed to register headless task:', e);
    }
  }
};
