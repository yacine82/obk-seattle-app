
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


const REMINDER_IDENTIFIER = 'obk-jumuah-weekly-reminder';
const FIXED_REMINDER_HOUR = 12;
const FIXED_REMINDER_MINUTE = 0;

export async function scheduleJumuahReminder(
  _khutbahTime: string
): Promise<boolean> {
  if (Platform.OS === "web") return false;

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

  const hour = FIXED_REMINDER_HOUR;
  const minute = FIXED_REMINDER_MINUTE;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(
      'jumuah-reminders',
      {
        name: 'Jumuâ€™ah Reminders',
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
      title: 'Jumuâ€™ah Reminder ðŸ•Œ',
      body:
        'Assalamu Alaikum! OBK Seattle Khutbah begins at 12:30 PM.',
      sound: 'default',
      ...(Platform.OS === 'android'
        ? { channelId: 'jumuah-reminders' }
        : {}),
    },
    
trigger:
  Platform.OS === 'ios'
    ? {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        weekday: 6,
        hour,
        minute,
        second: 0,
        timezone: 'America/Los_Angeles',
        repeats: true,
      }
    : {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 6,
        hour,
        minute,
      },

  });

  return true;
}

export async function cancelJumuahReminder(): Promise<void> {
  if (Platform.OS === "web") return;
  await Notifications.cancelScheduledNotificationAsync(
    REMINDER_IDENTIFIER
  );
}

export async function isJumuahReminderScheduled(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const scheduled =
    await Notifications.getAllScheduledNotificationsAsync();

  return scheduled.some(
    (notification) =>
      notification.identifier === REMINDER_IDENTIFIER
  );
}


export async function syncJumuahReminder(
  _khutbahTime: string
): Promise<boolean> {
  if (Platform.OS === "web") return false;

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

  const hour = FIXED_REMINDER_HOUR;
  const minute = FIXED_REMINDER_MINUTE;

  
 
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
  const updated = await scheduleJumuahReminder(_khutbahTime);

  return updated;
}


export async function getJumuahReminderDetails() {
  if (Platform.OS === "web") return { scheduled: false, trigger: null };
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


