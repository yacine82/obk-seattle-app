
import { getReminderTime } from '../services/jumuah-schedule';
import { fetchJumuahCandidate } from '../services/jumuah-sync';









import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';


import {
  ActivityIndicator,
  Alert,
  AppState,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';


import { SafeAreaView } from 'react-native-safe-area-context';


import {
  cancelJumuahReminder,
  getJumuahReminderDetails,
  isJumuahReminderScheduled,
  scheduleJumuahReminder,
  syncJumuahReminder,
} from '../services/jumuah-reminders';

import {
  fetchOfficialOBKPrayerTimes,
  type OBKPrayerSchedule,
} from '../services/obk-prayer-times';

function getSeattleDateKey(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}


const COLORS = {
  green: '#123F35',
  darkGreen: '#092C26',
  gold: '#D9B66F',
  cream: '#F8F6F0',
  white: '#FFFFFF',
  muted: '#6B7772',
};

function formatTime(time: string): string {
  const [hourText, minuteText] = time.split(':');
  const hours = Number(hourText);
  return `${hours % 12 || 12}:${minuteText} ${hours >= 12 ? 'PM' : 'AM'}`;
}

type OBKPoster = { id: string; image: string };

const EVENTS_ENDPOINT =
  'https://rweaoteuzlhsdjvudcmi.supabase.co/functions/v1/sync-obk-events';

async function fetchOBKPosters(): Promise<OBKPoster[]> {
  const response = await fetch(EVENTS_ENDPOINT);
  if (!response.ok) {
    throw new Error(`OBK posters request failed: ${response.status}`);
  }
  const data: {
    success?: boolean;
    posters?: OBKPoster[];
    error?: string;
  } = await response.json();
  if (!data.success || !Array.isArray(data.posters)) {
    throw new Error(data.error ?? 'Invalid OBK posters response');
  }
  return data.posters.filter(
    (poster) =>
      typeof poster.id === 'string' &&
      typeof poster.image === 'string' &&
      /^https:\/\/obkseattle\.org\//.test(poster.image)
  );
}

export default function HomeScreen() {

const [posters, setPosters] = useState<OBKPoster[]>([]);
const [selectedPoster, setSelectedPoster] = useState<OBKPoster | null>(null);
const [eventsLoading, setEventsLoading] = useState(true);
const [eventsError, setEventsError] = useState(false);

  const [officialSchedule, setOfficialSchedule] =
    useState<OBKPrayerSchedule | null>(null);

  const [officialLoading, setOfficialLoading] =
    useState(true);

  const [officialError, setOfficialError] =
    useState(false);


useEffect(() => {
  let active = true;
  let refreshInProgress = false;

  async function loadEvents() {
    if (refreshInProgress || !active) return;

    refreshInProgress = true;

    try {
      const fetchedPosters = await fetchOBKPosters();

      if (fetchedPosters.length === 0) {
        throw new Error('OBK poster feed unexpectedly returned no posters');
      }
      if (active) {
        setPosters(fetchedPosters);
        setEventsError(false);
      }
    } catch (error) {
      console.error('Failed to load OBK events:', error);

      if (active) {
        setEventsError(true);
      }
    } finally {
      refreshInProgress = false;

      if (active) {
        setEventsLoading(false);
      }
    }
  }

  // Fetch events when the Home screen loads.
  void loadEvents();

  // Refresh when the app returns to the foreground.
  const subscription = AppState.addEventListener(
    'change',
    (nextState) => {
      if (nextState === 'active') {
        void loadEvents();
      }
    }
  );

  // Refresh every 30 minutes while the app is active.
  const interval = setInterval(() => {
    if (AppState.currentState === 'active') {
      void loadEvents();
    }
  }, 30 * 60 * 1000);

  return () => {
    active = false;
    subscription.remove();
    clearInterval(interval);
  };
}, []);


  
  useEffect(() => {
    let active = true;
    let inProgress = false;
    let lastSuccessfulDate = '';
    let lastSuccessAt = 0;

    async function refreshPrayerTimes(force = false) {
      if (!active || inProgress) return;
      const today = getSeattleDateKey();
      if (!force && today === lastSuccessfulDate && Date.now() - lastSuccessAt < 30 * 60 * 1000) return;
      inProgress = true;
      setOfficialLoading(true);
      try {
        let schedule: OBKPrayerSchedule | null = null;
        let lastError: unknown;
        for (let attempt = 0; attempt < 2 && active; attempt++) {
          try {
            schedule = await fetchOfficialOBKPrayerTimes();
            break;
          } catch (error) {
            lastError = error;
            if (attempt === 0) await new Promise<void>(resolve => setTimeout(resolve, 1500));
          }
        }
        if (!schedule) throw lastError ?? new Error('Prayer schedule unavailable');
        const expectedDate = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Los_Angeles',
          weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
        }).format(new Date());
        if (schedule.date !== expectedDate) throw new Error(`Outdated OBK schedule: ${schedule.date}`);
        if (active) {
          setOfficialSchedule(schedule);
          setOfficialError(false);
          lastSuccessfulDate = getSeattleDateKey();
          lastSuccessAt = Date.now();
        }
      } catch (error) {
        console.error('Failed to refresh official OBK prayer times:', error);
        if (active) setOfficialError(true);
      } finally {
        inProgress = false;
        if (active) setOfficialLoading(false);
      }
    }

    void refreshPrayerTimes(true);
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') void refreshPrayerTimes();
    });
    const interval = setInterval(() => {
      if (AppState.currentState === 'active') void refreshPrayerTimes();
    }, 60 * 1000);
    return () => { active = false; subscription.remove(); clearInterval(interval); };
  }, []);

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(false);

  const [fridayReminderEnabled, setFridayReminderEnabled] =
    useState(false);

  const [reminderBusy, setReminderBusy] =
    useState(false);

  useEffect(() => {
    let active = true;

    isJumuahReminderScheduled()
      .then((scheduled) => {
        if (active) {
          setFridayReminderEnabled(scheduled);
        }
      })
      .catch((error) => {
        console.error('Reminder status error:', error);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleFridayReminder = async () => {
    if (reminderBusy) return;

    setReminderBusy(true);

    try {
      if (fridayReminderEnabled) {
        await cancelJumuahReminder();
        setFridayReminderEnabled(false);

        Alert.alert(
          'Friday Reminder Disabled',
          'Your weekly Jumu’ah reminder has been canceled.'
        );

        return;
      }

      if (!khutbahTime || loadingSchedule) {
        Alert.alert(
          'Schedule Unavailable',
          'Please refresh the website schedule before enabling reminders.'
        );

        return;
      }

      const scheduled =
        await scheduleJumuahReminder(khutbahTime);

      if (!scheduled) {
        Alert.alert(
          'Notifications Not Enabled',
          'Please allow notifications in your iPhone settings.'
        );

        return;
      }

      setFridayReminderEnabled(true);

      Alert.alert(
        'Friday Reminder Enabled',
        `Your weekly reminder is scheduled for Friday at ${formatTime(
          getReminderTime(khutbahTime)
        )} Pacific Time.`
      );
    } catch (error) {
      console.error('Friday reminder error:', error);

      Alert.alert(
        'Reminder Error',
        error instanceof Error
          ? error.message
          : 'Unable to update your Friday reminder.'
      );
    } finally {
      setReminderBusy(false);
    }
  };

  const [khutbahTime, setKhutbahTime] =
    useState<string | null>(null);

  const [loadingSchedule, setLoadingSchedule] =
    useState(true);

  const [scheduleError, setScheduleError] =
    useState<string | null>(null);

  const refreshSchedule = useCallback(async () => {
    setLoadingSchedule(true);
    setScheduleError(null);

    try {
      const candidate = await fetchJumuahCandidate();

      // Display the website-published time.
      // This is not an admin-approved schedule.
      setKhutbahTime(candidate.khutbahTime);

      // Update an existing Friday reminder if the
      // website-published Khutbah time has changed.
      try {
        const updated = await syncJumuahReminder(
          candidate.khutbahTime
        );

        if (updated) {
          console.log(
            'Friday reminder updated to match the website.'
          );
        }
      } catch (reminderError) {
        console.error(
          'Unable to synchronize Friday reminder:',
          reminderError
        );
      }

    } catch (error) {
      console.error(
        'Khutbah website synchronization failed:',
        error
      );

      // Retain the last known Khutbah time if the website is temporarily unavailable.
      setScheduleError(
        'Unable to retrieve the current website schedule.'
      );
    } finally {
      setLoadingSchedule(false);
    }
  }, []);

  useEffect(() => {
    void refreshSchedule();
    let lastCheck = Date.now();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active' && Date.now() - lastCheck >= 5 * 60 * 1000) {
        lastCheck = Date.now();
        void refreshSchedule();
      }
    });
    const interval = setInterval(() => {
      if (AppState.currentState === 'active') {
        lastCheck = Date.now();
        void refreshSchedule();
      }
    }, 30 * 60 * 1000);
    return () => { subscription.remove(); clearInterval(interval); };
  }, [refreshSchedule]);

  const handleVerifyReminder = async () => {
    try {
      const details = await getJumuahReminderDetails();

      if (!details.scheduled) {
        Alert.alert(
          'Reminder Status',
          'No weekly Jumu’ah reminder is currently scheduled.'
        );
        return;
      }

      Alert.alert(
        'Scheduled Reminder Details',
        JSON.stringify(details.trigger, null, 2)
      );
    } catch (error) {
      console.error('Reminder verification error:', error);

      Alert.alert(
        'Verification Error',
        error instanceof Error
          ? error.message
          : 'Unable to read the scheduled reminder.'
      );
    }
  };

  const handleNotifications = async () => {
    try {
      const currentPermissions =
        await Notifications.getPermissionsAsync();

      let status = currentPermissions.status;

      if (status !== 'granted') {
        const requestedPermissions =
          await Notifications.requestPermissionsAsync();

        status = requestedPermissions.status;
      }

      if (status === 'granted') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'OBK Seattle 🕌',
            body:
              'Assalamu Alaikum! This is a test notification from the OBK Seattle app.',
            sound: 'default',
          },
          trigger: {
            type:
              Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 5,
          },
        });

        setNotificationsEnabled(true);

        Alert.alert(
          'Test Notification Scheduled',
          'A test notification should arrive in approximately 5 seconds.'
        );
      } else {
        setNotificationsEnabled(false);

        Alert.alert(
          'Notifications Not Enabled',
          'You can allow notifications later in your phone settings.'
        );
      }
    } catch (error) {
      console.error('Notification error:', error);

      Alert.alert(
        'Notification Setup Error',
        error instanceof Error
          ? error.message
          : 'Unable to schedule the test notification.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>
              Assalamu Alaikum
            </Text>

            <Text style={styles.mosqueName}>
              OBK Seattle
            </Text>

            <Text style={styles.subtitle}>
              Your community. Your mosque.
            </Text>
          </View>

          <View style={styles.logo}>
            <Text style={styles.logoText}>OBK</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>
            WELCOME TO
          </Text>

          <Text style={styles.heroTitle}>
            Omar Bin Al-Khattab
          </Text>

          <Text style={styles.heroSubtitle}>
            Islamic Center · Seattle
          </Text>

          <View style={styles.heroDivider} />

          <Text style={styles.heroMessage}>
            A place for faith, connection, and community.
          </Text>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>
            Jumu’ah Prayer
          </Text>

          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>
              FRIDAY
            </Text>
          </View>
        </View>

        <View style={styles.jumuahCard}>
          <Text style={styles.jumuahLabel}>
            Friday Congregational Prayer
          </Text>

          {loadingSchedule ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={COLORS.green} />

              <Text style={styles.loadingText}>
                Checking website schedule...
              </Text>
            </View>
          ) : khutbahTime ? (
            <>
              <Text style={styles.jumuahTime}>
                Khutbah: {formatTime(khutbahTime)}
              </Text>

              <Text style={styles.jumuahDescription}>
                Website-published Khutbah time.
                Reminder target:{' '}
                {formatTime(getReminderTime(khutbahTime))}
                {' '}on Friday (Seattle time).
              </Text>

              <Text style={styles.sourceNote}>
                Source: obkseattle.org · Not independently verified
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.jumuahTime}>
                Schedule unavailable
              </Text>

              <Text style={styles.jumuahDescription}>
                {scheduleError ?? 'No Khutbah time found.'}
                {' '}Please check the mosque website
                before traveling.
              </Text>
            </>
          )}
          
          <Pressable
            style={[
              styles.reminderButton,
              fridayReminderEnabled && {
                backgroundColor: '#6B7772',
              },
            ]}
            onPress={handleFridayReminder}
            disabled={reminderBusy}
          >
            <Text style={styles.reminderButtonText}>
              {reminderBusy
                ? 'Updating Reminder...'
                : fridayReminderEnabled
                  ? 'Disable Friday Reminder'
                  : 'Enable Friday Reminder'}
            </Text>
          </Pressable>

          <Text style={styles.disclaimer}>
            Weekly reminders use your phone's timezone.
            Schedule changes require reopening the app.
          </Text>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>
            Daily Prayer Times
          </Text>

          
        
        <Text style={styles.sampleLabel}>
          OFFICIAL OBK
        </Text>


        </View>

        
        
<View style={styles.prayerCard}>
  {officialLoading ? (
    <ActivityIndicator
      color={COLORS.green}
      style={{ marginVertical: 20 }}
    />
  ) : !officialSchedule ? (
    <Text style={styles.prayerDisclaimer}>
      Official OBK prayer times are unavailable.
      Please check obkseattle.org.
    </Text>
  ) : (
    <>
      <Text style={styles.prayerDisclaimer}>
        {officialSchedule.date}{officialError ? ' · Last loaded schedule (verify before travel)' : ''}
      </Text>

      <View style={styles.prayerRow}>
        <Text style={[styles.prayerName, { width: '30%' }]}>
          PRAYER
        </Text>
        <Text style={[styles.prayerName, { width: '35%' }]}>
          START
        </Text>
        <Text style={[styles.prayerName, { width: '35%' }]}>
          IQAMAH
        </Text>
      </View>

      {officialSchedule.prayers.map((prayer, index) => (
        <View
          key={prayer.name}
          style={[
            styles.prayerRow,
            index === officialSchedule.prayers.length - 1 && {
              borderBottomWidth: 0,
            },
          ]}
        >
          <Text style={[styles.prayerName, { width: '30%' }]}>
            {prayer.name}
          </Text>

          <Text style={[styles.prayerTime, { width: '35%', fontSize: 12 }]}>
            {prayer.start}
          </Text>

          <Text style={[styles.prayerTime, { width: '35%', fontSize: 12 }]}>
            {prayer.iqamah ?? '—'}
          </Text>
        </View>
      ))}
    </>
  )}
</View>


        
        
<Text style={styles.prayerDisclaimer}>
  Source: obkseattle.org. START is the prayer beginning
  time. IQAMAH is the congregational prayer time.
  Times are displayed in Seattle local time.
</Text>


        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Current Events</Text>
          <Text style={styles.posterHint}>Swipe to explore →</Text>
        </View>

        {eventsLoading ? (
          <ActivityIndicator color={COLORS.green} style={{ marginVertical: 24 }} />
        ) : eventsError && posters.length === 0 ? (
          <Text style={styles.posterMessage}>Unable to load OBK posters right now.</Text>
        ) : posters.length === 0 ? (
          <Text style={styles.posterMessage}>No event posters available.</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.posterCarousel}
            nestedScrollEnabled
          >
            {posters.map((poster) => (
              <Pressable
                key={poster.id}
                accessibilityRole="button"
                accessibilityLabel={`Enlarge OBK event poster ${poster.id}`}
                onPress={() => setSelectedPoster(poster)}
                style={styles.posterCard}
              >
                <Image
                  source={{ uri: poster.image }}
                  style={styles.posterImage}
                  resizeMode="contain"
                />
              </Pressable>
            ))}
          </ScrollView>
        )}

        <View style={[styles.announcementCard, { marginTop: 20 }]}>
          <Text style={styles.announcementTitle}>Stay Connected With OBK</Text>
          <Text style={styles.announcementBody}>
            Mosque announcements, programs, events,
            and community updates will appear here.
          </Text>
        </View>

        <Text style={styles.footer}>
          OBK Seattle · App Development Preview
        </Text>
      </ScrollView>
      <Modal
        visible={selectedPoster !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setSelectedPoster(null)}
      >
        <View style={styles.posterModal}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close poster preview"
            onPress={() => setSelectedPoster(null)}
            style={styles.posterCloseButton}
          >
            <Text style={styles.posterCloseText}>✕  Close</Text>
          </Pressable>
          {selectedPoster && (
            <Image
              source={{ uri: selectedPoster.image }}
              style={styles.posterFullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  posterHint: { fontSize: 12, color: COLORS.muted },
  posterMessage: { color: COLORS.muted, marginVertical: 16 },
  posterCarousel: { paddingRight: 20, gap: 12 },
  posterCard: {
    width: 220,
    height: 290,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7E3D8',
  },
  posterImage: { width: '100%', height: '100%' },
  posterModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  posterCloseButton: {
    position: 'absolute',
    top: 55,
    right: 20,
    zIndex: 2,
    padding: 12,
  },
  posterCloseText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  posterFullImage: { width: '100%', height: '82%' },
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  welcome: {
    fontSize: 14,
    color: COLORS.muted,
  },

  mosqueName: {
    fontSize: 27,
    fontWeight: '800',
    color: COLORS.darkGreen,
    marginTop: 3,
  },

  subtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },

  logo: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoText: {
    color: COLORS.gold,
    fontWeight: '900',
    fontSize: 18,
  },

  hero: {
    backgroundColor: COLORS.green,
    borderRadius: 25,
    padding: 26,
    marginBottom: 28,
  },

  heroEyebrow: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },

  heroTitle: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: '800',
    marginTop: 14,
    lineHeight: 34,
  },

  heroSubtitle: {
    color: '#E4EDE8',
    fontSize: 15,
    marginTop: 5,
  },

  heroDivider: {
    width: 50,
    height: 3,
    backgroundColor: COLORS.gold,
    marginVertical: 20,
    borderRadius: 3,
  },

  heroMessage: {
    color: '#E4EDE8',
    fontSize: 14,
    lineHeight: 22,
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.darkGreen,
  },

  featuredBadge: {
    backgroundColor: '#E9E0CB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  featuredText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.darkGreen,
  },

  jumuahCard: {
    backgroundColor: COLORS.white,
    padding: 23,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E7E3D8',
    marginBottom: 28,
  },

  jumuahLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.muted,
  },

  jumuahTime: {
    fontSize: 23,
    fontWeight: '800',
    color: COLORS.green,
    marginTop: 12,
  },

  jumuahDescription: {
    fontSize: 13,
    lineHeight: 21,
    color: COLORS.muted,
    marginTop: 12,
  },

  reminderButton: {
    backgroundColor: COLORS.green,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },

  reminderButtonText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 14,
  },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },

  loadingText: {
    color: COLORS.muted,
    marginLeft: 10,
    fontSize: 13,
  },

  sourceNote: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 8,
  },

  refreshText: {
    color: COLORS.green,
    fontWeight: '700',
    fontSize: 13,
    marginTop: 14,
    textDecorationLine: 'underline',
  },

  disclaimer: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 12,
  },

  sampleLabel: {
    color: '#9A7636',
    fontSize: 11,
    fontWeight: '800',
  },

  prayerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ECE9E1',
  },

  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEE8',
  },

  prayerName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkGreen,
  },

  prayerTime: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.green,
  },

  prayerDisclaimer: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 10,
    marginBottom: 28,
    lineHeight: 17,
  },

  announcementCard: {
    backgroundColor: '#EAEFE9',
    borderRadius: 20,
    padding: 22,
  },

  announcementCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: '#658073',
    letterSpacing: 1.5,
  },

  announcementTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.darkGreen,
    marginTop: 10,
  },

  announcementBody: {
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 21,
    marginTop: 10,
  },

  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 30,
  },
});
