import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Prayer = {
  name: string;
  start: string;
  iqamah?: string | null;
};

const ZONE = 'America/Los_Angeles';

function seattleParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    second: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const get = (key: string) =>
    Number(parts.find(p => p.type === key)?.value ?? 0);

  return {
    hour: get('hour'),
    minute: get('minute'),
    second: get('second'),
  };
}

function parseTime(value: string) {
  const match = value.trim().match(
    /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i
  );
  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (minute > 59 || hour > 23) return null;

  const period = match[3]?.toUpperCase();

  if (period) {
    if (hour < 1 || hour > 12) return null;
    hour = (hour % 12) + (period === 'PM' ? 12 : 0);
  }

  return hour * 60 + minute;
}

function displayTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${
    hour >= 12 ? 'PM' : 'AM'
  }`;
}

function formatCountdown(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hours, minutes, secs]
    .map(n => String(n).padStart(2, '0'))
    .join(':');
}

export default function UpcomingPrayer({
  prayers,
}: {
  prayers: Prayer[];
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const current = seattleParts(now);

  const nowMinutes =
    current.hour * 60 + current.minute + current.second / 60;

  const entries = prayers
    .filter(p =>
      ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(p.name)
    )
    .map(p => ({
      name: p.name,
      minutes: parseTime(p.start),
      iqamah: p.iqamah,
    }))
    .filter(
      (p): p is typeof p & { minutes: number } =>
        p.minutes !== null
    )
    .sort((a, b) => a.minutes - b.minutes);

  if (entries.length === 0) return null;

  const next = entries.find(p => p.minutes > nowMinutes);
  const selected = next ?? entries[0];

  const remaining = next
    ? Math.ceil((next.minutes - nowMinutes) * 60)
    : Math.ceil((1440 - nowMinutes + selected.minutes) * 60);

  const date = new Date(
    now.getTime() + (!next ? 24 * 3600000 : 0)
  );

  const dateLabel = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONE,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);

  const icon =
    selected.name === 'Fajr' || selected.name === 'Isha'
      ? '☾'
      : selected.name === 'Maghrib'
        ? '◐'
        : '☀';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.prayerIcon}>{icon}</Text>

        <View style={styles.prayerInfo}>
          <Text style={styles.heading}>
            Upcoming{' '}
            <Text style={styles.name}>{selected.name}</Text>
          </Text>

          <Text
            style={styles.time}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {displayTime(selected.minutes)}
            {selected.iqamah
              ? ` - ${selected.iqamah}`
              : ''}
          </Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.countdownGroup}>
          <Text style={styles.countdownLabel}>
            Prayer starts in
          </Text>

          <Text style={styles.countdown}>
            {formatCountdown(Math.max(0, remaining))}
          </Text>
        </View>

        <Text style={styles.date}>{dateLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#123F35',
    borderRadius: 22,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  prayerIcon: {
    width: 54,
    textAlign: 'center',
    fontSize: 36,
    color: '#D9B66F',
  },
  prayerInfo: {
    flex: 1,
    paddingLeft: 10,
  },
  heading: {
    color: '#E4EDE8',
    fontSize: 14,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  time: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 7,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countdownGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 8,
  },
  countdownLabel: {
    color: '#E4EDE8',
    fontSize: 11,
  },
  countdown: {
    color: '#D9B66F',
    fontSize: 19,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  date: {
    color: '#E4EDE8',
    fontSize: 10,
    marginLeft: 8,
    textAlign: 'right',
    flexShrink: 1,
  },
});

