
export type DailyPrayer = {
  name: string;
  time: string;
};

type PrayerApiResponse = {
  code: number;
  data: {
    timings: Record<string, string>;
  };
};

const PRAYER_NAMES = [
  'Fajr',
  'Sunrise',
  'Dhuhr',
  'Asr',
  'Maghrib',
  'Isha',
] as const;

function formatPrayerTime(value: string): string {
  const match = value.match(/^(\d{1,2}):(\d{2})/);

  if (!match) {
    throw new Error('Invalid prayer time received');
  }

  const hours = Number(match[1]);
  const minutes = match[2];

  return `${hours % 12 || 12}:${minutes} ${
    hours >= 12 ? 'PM' : 'AM'
  }`;
}

export async function fetchDailyPrayerTimes():
  Promise<DailyPrayer[]> {
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const [year, month, day] = date.split('-');

  const url =
    `https://api.aladhan.com/v1/timings/${day}-${month}-${year}` +
    '?latitude=47.6062' +
    '&longitude=-122.3321' +
    '&method=2';

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Unable to retrieve prayer times');
  }

  const result =
    (await response.json()) as PrayerApiResponse;

  if (result.code !== 200 || !result.data?.timings) {
    throw new Error('Invalid prayer schedule response');
  }

  return PRAYER_NAMES.map((name) => ({
    name,
    time: formatPrayerTime(result.data.timings[name]),
  }));
}
