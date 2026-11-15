
import {
    createWebsiteCandidate,
    JUMUAH_CONFIG,
    type JumuahSchedule,
} from './jumuah-schedule';

/**
 * Convert a 12-hour time into 24-hour HH:mm format.
 *
 * Examples:
 * 12:30 PM -> 12:30
 * 1:30 PM  -> 13:30
 * 12:00 AM -> 00:00
 */
export function convertTo24Hour(
  hourText: string,
  minuteText: string,
  periodText: string
): string {
  let hours = Number(hourText);
  const minutes = Number(minuteText);
  const period = periodText.toUpperCase();

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 1 ||
    hours > 12 ||
    minutes < 0 ||
    minutes > 59 ||
    !['AM', 'PM'].includes(period)
  ) {
    throw new Error('Invalid website time.');
  }

  if (period === 'AM' && hours === 12) {
    hours = 0;
  } else if (period === 'PM' && hours !== 12) {
    hours += 12;
  }

  return (
    String(hours).padStart(2, '0') +
    ':' +
    String(minutes).padStart(2, '0')
  );
}

/**
 * Extract the Khutbah time from website text.
 *
 * Returns null if no recognizable time is found.
 * This does not approve the time.
 */
export function extractKhutbahTime(
  websiteText: string
): string | null {
  const headingIndex = websiteText.search(/Khutbah/i);

  if (headingIndex === -1) {
    return null;
  }

  // Look for a time near the Khutbah heading.
  const nearbyText = websiteText.slice(
    headingIndex,
    headingIndex + 150
  );

  const match = nearbyText.match(
    /(\d{1,2}):(\d{2})\s*(AM|PM)/i
  );

  if (!match) {
    return null;
  }

  try {
    return convertTo24Hour(
      match[1],
      match[2],
      match[3]
    );
  } catch {
    return null;
  }
}

/**
 * Fetch the OBK Seattle homepage and create
 * a candidate pending admin verification.
 *
 * This does not approve or publish a schedule.
 */
export async function fetchJumuahCandidate():
  Promise<JumuahSchedule> {
  const response = await fetch(
    JUMUAH_CONFIG.sourceUrl
  );

  if (!response.ok) {
    throw new Error(
      `Website request failed: ${response.status}`
    );
  }

  const html = await response.text();

  // Remove scripts, styles, and HTML tags.
  const websiteText = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();

  const khutbahTime = extractKhutbahTime(
    websiteText
  );

  if (!khutbahTime) {
    throw new Error(
      'Could not find a Khutbah time on the website.'
    );
  }

  return createWebsiteCandidate(
    khutbahTime,
    new Date().toISOString()
  );
}
