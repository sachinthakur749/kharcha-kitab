import 'expo-router/entry';
import { registerNotificationListener } from './src/services/NotificationListener';

// Register the Headless JS task for background notifications.
// This must be called at the very top level of the app.
try {
  registerNotificationListener();
} catch (e) {
  console.warn('[Entry] Failed to register notification listener:', e);
}
