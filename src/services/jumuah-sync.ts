
import {
    createWebsiteCandidate,
    JUMUAH_CONFIG,
    type JumuahSchedule,
} from './jumuah-schedule';

// Supabase project URL.
// This is a public project URL, not a secret.
const SUPABASE_URL =
  'https://rweaoteuzlhsdjvudcmi.supabase.co';

// We will set this to your Supabase publishable key
// in the next step.
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_EImII71b33o5526vSi2nCQ_f1e0jwOB';

type LiveJumuahSchedule = {
  id: number;
  khutbah_time: string;
  timezone: string;
  source_url: string;
  last_checked_at: string;
  updated_at: string;
};

/**
 * Convert the database time into HH:mm.
 *
 * Example:
 * 12:30:00 -> 12:30
 */
function normalizeTime(time: string): string {
  const match = time.match(
    /^([01]\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/
  );

  if (!match) {
    throw new Error(
      'Invalid Khutbah time received from Supabase.'
    );
  }

  return `${match[1]}:${match[2]}`;
}

/**
 * Fetch the current Jumu'ah schedule from Supabase.
 *
 * The Edge Function updates this database record
 * automatically through Supabase Cron.
 */
export async function fetchJumuahCandidate():
  Promise<JumuahSchedule> {
  if (!SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      'Supabase publishable key has not been configured.'
    );
  }

  const endpoint =
    `${SUPABASE_URL}/rest/v1/jumuah_live_schedule` +
    '?id=eq.1&select=*';

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Accept: 'application/json',
    },
  });

  
    if (!response.ok) {
    const errorDetails = await response.text();

    throw new Error(
        `Supabase request failed: ${response.status} - ${errorDetails}`
    );
    }


  const records =
    (await response.json()) as LiveJumuahSchedule[];

  if (!Array.isArray(records) || records.length === 0) {
    throw new Error(
      'No Jumuah schedule is available in Supabase.'
    );
  }

  const schedule = records[0];

  if (schedule.timezone !== JUMUAH_CONFIG.timezone) {
    throw new Error(
      'Unexpected timezone in Supabase schedule.'
    );
  }

  if (schedule.source_url !== JUMUAH_CONFIG.sourceUrl) {
    throw new Error(
      'Unexpected schedule source in Supabase.'
    );
  }

  const khutbahTime = normalizeTime(
    schedule.khutbah_time
  );

  // Preserve the existing schedule format expected
  // by the Home screen and reminder service.
  return createWebsiteCandidate(
    khutbahTime,
    schedule.updated_at
  );
}
