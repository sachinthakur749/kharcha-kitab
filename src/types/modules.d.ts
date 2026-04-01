declare module 'react-native-get-sms-android' {
  interface SmsFilter {
    box?: 'inbox' | 'sent' | 'draft' | 'outbox' | 'failed' | 'queued';
    read?: number;
    _id?: number;
    address?: string;
    body?: string;
    indexFrom?: number;
    maxCount?: number;
    minDate?: number;
    maxDate?: number;
  }

  const SmsAndroid: {
    list: (
      filter: string,
      fail: (error: string) => void,
      success: (count: number, list: string) => void
    ) => void;
    delete: (id: number, fail: (error: string) => void, success: (res: string) => void) => void;
  };

  export default SmsAndroid;
}

declare module 'react-native-notification-listener' {
  export const RNAndroidNotificationListenerHeadlessJsName: string;

  const RNAndroidNotificationListener: {
    getPermissionStatus: () => Promise<'authorized' | 'denied' | 'unknown'>;
    requestPermission: () => void;
  };

  export default RNAndroidNotificationListener;
}

declare module 'nepali-date-converter' {
  export default class NepaliDate {
    constructor();
    constructor(date: Date);
    constructor(year: number, month: number, day: number);
    format(format: string): string;
    toJsDate(): Date;
    getYear(): number;
    getMonth(): number;
    getDate(): number;
    setMonth(month: number): void;
    setDate(day: number): void;
  }
}
