
export type OBKEvent = {
  id: string;
  title: string;
  date: string;
  time: string | null;
  url: string;
};

export type OBKEventsResponse = {
  success: boolean;
  count: number;
  events: OBKEvent[];
  source: string;
};

const EVENTS_URL =
  "https://rweaoteuzlhsdjvudcmi.supabase.co/functions/v1/sync-obk-events";

export async function fetchOBKEvents(): Promise<OBKEvent[]> {
  const response = await fetch(EVENTS_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch OBK events: ${response.status}`
    );
  }

  const data: OBKEventsResponse = await response.json();

  if (!data.success || !Array.isArray(data.events)) {
    throw new Error("Invalid OBK events response");
  }

  return data.events;
}
