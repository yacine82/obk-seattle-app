
export type OBKPrayerTime = {
  name: string;
  start: string;
  iqamah: string | null;
};

export type OBKPrayerSchedule = {
  date: string;
  prayers: OBKPrayerTime[];
  source: string;
};

const SUPABASE_URL =
  'https://rweaoteuzlhsdjvudcmi.supabase.co';

export const OBK_PRAYER_SOURCE = 'https://obkseattle.org/';

export async function fetchOfficialOBKPrayerTimes():
  Promise<OBKPrayerSchedule> {

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/sync-daily-prayer-times`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    throw new Error(
      `OBK prayer request failed: ${response.status}`
    );
  }

  const result = await response.json();

  
const expectedPrayers = [
  'Fajr',
  'Sunrise',
  'Dhuhr',
  'Asr',
  'Maghrib',
  'Isha',
];

const validTime = (value: unknown): boolean =>
  typeof value === 'string' &&
  /^(0?[1-9]|1[0-2]):[0-5]\d (AM|PM)$/.test(value);

if (
  result.success !== true ||
  !Array.isArray(result.prayers) ||
  result.prayers.length !== 6 ||
  !result.prayers.every(
    (prayer: OBKPrayerTime, index: number) =>
      prayer?.name === expectedPrayers[index] &&
      validTime(prayer.start) &&
      (prayer.name === 'Sunrise'
        ? prayer.iqamah === null
        : validTime(prayer.iqamah))
  )
)
{
    throw new Error('Invalid OBK prayer schedule');
  }

  const today = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  if (result.date !== today) {
    throw new Error('OBK prayer schedule is not for today');
  }

  return {
    date: result.date,
    prayers: result.prayers,
    source: result.source,
  };
}
