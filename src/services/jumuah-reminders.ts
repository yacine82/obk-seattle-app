
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
    getReminderTime,
    isValidTime,
} from './jumuah-schedule';

const REMINDER_IDENTIFIER = 'obk-jumuah-weekly-reminder';

export async function scheduleJumuahReminder(
  khutbahTime: string
): Promise<boolean> {
  if (!isValidTime(khutbahTime)) {
    throw new Error('Invalid Khutbah time.');
  }

  const permission = await Notifications.getPermissionsAsync();

  let status = permission.status;

  if (status !== 'granted') {
    const requested =
      await Notifications.requestPermissionsAsync();

    status = requested.status;
  }

  if (status !== 'granted') {
    return false;
  }

  const reminderTime = getReminderTime(khutbahTime);
  const [hour, minute] = reminderTime.split(':').map(Number);

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(
      'jumuah-reminders',
      {
        name: 'Jumu’ah Reminders',
        importance:
          Notifications.AndroidImportance.HIGH,
        sound: 'default',
      }
    );
  }

  // Cancel only the existing Jumu'ah reminder.
  // Leave unrelated app notifications untouched.
  const scheduled =
    await Notifications.getAllScheduledNotificationsAsync();

  for (const notification of scheduled) {
    if (notification.identifier === REMINDER_IDENTIFIER) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  }

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_IDENTIFIER,
    content: {
      title: 'Jumu’ah Reminder 🕌',
      body:
        'Assalamu Alaikum! Khutbah at OBK Seattle begins in 30 minutes.',
      sound: 'default',
      ...(Platform.OS === 'android'
        ? { channelId: 'jumuah-reminders' }
        : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 6,
      hour,
      minute,
    },
  });

  return true;
}

export async function cancelJumuahReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(
    REMINDER_IDENTIFIER
  );
}

export async function isJumuahReminderScheduled(): Promise<boolean> {
  const scheduled =
    await Notifications.getAllScheduledNotificationsAsync();

  return scheduled.some(
    (notification) =>
      notification.identifier === REMINDER_IDENTIFIER
  );
}


export async function syncJumuahReminder(
  khutbahTime: string
): Promise<boolean> {
  if (!isValidTime(khutbahTime)) {
    throw new Error('Invalid Khutbah time.');
  }

  const scheduled =
    await Notifications.getAllScheduledNotificationsAsync();

  const existing = scheduled.find(
    (notification) =>
      notification.identifier === REMINDER_IDENTIFIER
  );

  // Do not enable reminders without the user's consent.
  if (!existing) {
    return false;
  }

  const reminderTime = getReminderTime(khutbahTime);
  const [hour, minute] = reminderTime.split(':').map(Number);

  
 
  const trigger = existing.trigger;

  // iOS stores weekly notifications as calendar triggers
  // with their time inside dateComponents.
  let isAlreadyCorrect = false;

  if (
    trigger !== null &&
    'dateComponents' in trigger &&
    trigger.dateComponents
  ) {
    
    const components = trigger.dateComponents as {
      weekday?: number;
      hour?: number;
      minute?: number;
    };

    isAlreadyCorrect =
      components.weekday === 6 &&
      components.hour === hour &&
      components.minute === minute &&
      'repeats' in trigger &&
      trigger.repeats === true;
  } else if (
    trigger !== null &&
    'weekday' in trigger &&
    'hour' in trigger &&
    'minute' in trigger
  ) {
    isAlreadyCorrect =
      trigger.weekday === 6 &&
      trigger.hour === hour &&
      trigger.minute === minute;
  }


  if (isAlreadyCorrect) {
    return false;
  }

  // The reminder time has changed.
  // Replace the existing weekly reminder.
  const updated = await scheduleJumuahReminder(khutbahTime);

  return updated;
}


export async function getJumuahReminderDetails() {
  const notifications =
    await Notifications.getAllScheduledNotificationsAsync();

  const reminder = notifications.find(
    (notification) =>
      notification.identifier === REMINDER_IDENTIFIER
  );

  if (!reminder) {
    return {
      scheduled: false,
      trigger: null,
    };
  }

  return {
    scheduled: true,
    trigger: reminder.trigger,
  };
}
