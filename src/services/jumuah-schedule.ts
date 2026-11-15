
export const JUMUAH_CONFIG = {
  sourceUrl: 'https://obkseattle.org/',
  timezone: 'America/Los_Angeles',
  reminderMinutesBefore: 30,
} as const;

export type ScheduleStatus =
  | 'pending'
  | 'approved'
  | 'rejected';

export type ScheduleSource =
  | 'website'
  | 'admin_override';

export interface JumuahSchedule {
  id: string;
  khutbahTime: string;
  timezone: 'America/Los_Angeles';
  source: ScheduleSource;
  sourceUrl: string | null;
  status: ScheduleStatus;
  observedAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  effectiveFrom: string | null;
  effectiveUntil: string | null;
}

export function isValidTime(time: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

export function createWebsiteCandidate(
  khutbahTime: string,
  observedAt: string
): JumuahSchedule {
  if (!isValidTime(khutbahTime)) {
    throw new Error('Invalid Khutbah time. Use HH:mm.');
  }

  return {
    id: `website-${observedAt}`,
    khutbahTime,
    timezone: JUMUAH_CONFIG.timezone,
    source: 'website',
    sourceUrl: JUMUAH_CONFIG.sourceUrl,
    status: 'pending',
    observedAt,
    approvedAt: null,
    approvedBy: null,
    effectiveFrom: null,
    effectiveUntil: null,
  };
}

export function getReminderTime(
  khutbahTime: string
): string {
  if (!isValidTime(khutbahTime)) {
    throw new Error('Invalid Khutbah time.');
  }

  const [hours, minutes] = khutbahTime
    .split(':')
    .map(Number);

  const totalMinutes =
    hours * 60 +
    minutes -
    JUMUAH_CONFIG.reminderMinutesBefore;

  const normalizedMinutes =
    ((totalMinutes % 1440) + 1440) % 1440;

  const reminderHours = Math.floor(
    normalizedMinutes / 60
  );

  const reminderMinutes = normalizedMinutes % 60;

  return (
    String(reminderHours).padStart(2, '0') +
    ':' +
    String(reminderMinutes).padStart(2, '0')
  );
}

export function getApprovedSchedule(
  schedules: JumuahSchedule[]
): JumuahSchedule | null {
  const approved = schedules.filter(
    (schedule) =>
      schedule.status === 'approved' &&
      schedule.approvedAt !== null &&
      schedule.approvedBy !== null
  );

  if (approved.length === 0) {
    return null;
  }

  return [...approved].sort((a, b) => {
    const aOverride =
      a.source === 'admin_override' ? 1 : 0;

    const bOverride =
      b.source === 'admin_override' ? 1 : 0;

    if (aOverride !== bOverride) {
      return bOverride - aOverride;
    }

    return (b.approvedAt ?? '').localeCompare(
      a.approvedAt ?? ''
    );
  })[0];
}

