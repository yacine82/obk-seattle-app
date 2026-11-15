
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  green: '#123F35',
  darkGreen: '#092C26',
  gold: '#D9B66F',
  cream: '#F8F6F0',
  white: '#FFFFFF',
  muted: '#6B7772',
};

const prayers = [
  { name: 'Fajr', time: '5:45 AM' },
  { name: 'Sunrise', time: '7:15 AM' },
  { name: 'Dhuhr', time: '12:10 PM' },
  { name: 'Asr', time: '2:45 PM' },
  { name: 'Maghrib', time: '4:35 PM' },
  { name: 'Isha', time: '6:15 PM' },
];

export default function HomeScreen() {
  const [notificationsEnabled, setNotificationsEnabled] =
    useState(false);

  const handleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);

    Alert.alert(
      'Notification Preview',
      'Real Jumu’ah notifications will be available after we connect the notification service.'
    );
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
            <Text style={styles.welcome}>Assalamu Alaikum</Text>
            <Text style={styles.mosqueName}>OBK Seattle</Text>
            <Text style={styles.subtitle}>
              Your community. Your mosque.
            </Text>
          </View>

          <View style={styles.logo}>
            <Text style={styles.logoText}>OBK</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>WELCOME TO</Text>
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
          <Text style={styles.sectionTitle}>Jumu’ah Prayer</Text>
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>FRIDAY</Text>
          </View>
        </View>

        <View style={styles.jumuahCard}>
          <Text style={styles.jumuahLabel}>
            Friday Congregational Prayer
          </Text>

          <Text style={styles.jumuahTime}>
            Schedule to be confirmed
          </Text>

          <Text style={styles.jumuahDescription}>
            Official Khutbah and Salah times will be
            displayed here once verified by the mosque.
          </Text>

          <Pressable
            style={styles.reminderButton}
            onPress={handleNotifications}
          >
            <Text style={styles.reminderButtonText}>
              {notificationsEnabled
                ? 'Reminder Preview Selected'
                : 'Preview Friday Reminder'}
            </Text>
          </Pressable>

          <Text style={styles.disclaimer}>
            Preview only · Notifications are not active yet
          </Text>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>
            Daily Prayer Times
          </Text>
          <Text style={styles.sampleLabel}>SAMPLE</Text>
        </View>

        <View style={styles.prayerCard}>
          {prayers.map((prayer, index) => (
            <View
              key={prayer.name}
              style={[
                styles.prayerRow,
                index === prayers.length - 1 && {
                  borderBottomWidth: 0,
                },
              ]}
            >
              <Text style={styles.prayerName}>
                {prayer.name}
              </Text>
              <Text style={styles.prayerTime}>
                {prayer.time}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.prayerDisclaimer}>
          Sample times for interface testing only.
          Not valid for prayer scheduling.
        </Text>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>
            Community Announcements
          </Text>
        </View>

        <View style={styles.announcementCard}>
          <Text style={styles.announcementCategory}>
            COMING SOON
          </Text>
          <Text style={styles.announcementTitle}>
            Stay Connected With OBK
          </Text>
          <Text style={styles.announcementBody}>
            Mosque announcements, programs, events,
            and community updates will appear here.
          </Text>
        </View>

        <Text style={styles.footer}>
          OBK Seattle · App Development Preview
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
