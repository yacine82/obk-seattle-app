import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  green: '#123F35',
  darkGreen: '#092C26',
  gold: '#D9B66F',
  cream: '#F8F6F0',
  muted: '#6B7772',
};

const WEBSITE = 'https://obkseattle.org/';

type Section = 'about' | 'notifications' | 'contact' | null;

export default function MoreScreen() {
  const [section, setSection] = useState<Section>(null);

  const openWebsite = async () => {
    try {
      await Linking.openURL(WEBSITE);
    } catch {
      Alert.alert(
        'Unable to Open Website',
        'Please try again later.'
      );
    }
  };

  const openMaps = async () => {
    const url =
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('Omar Bin Al-Khattab Islamic Center Seattle');

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'Unable to Open Maps',
        'Please try again later.'
      );
    }
  };

  const MenuItem = ({
    title,
    onPress,
    last = false,
  }: {
    title: string;
    onPress: () => void;
    last?: boolean;
  }) => (
    <>
      <Pressable
        style={styles.menuItem}
        onPress={onPress}
        accessibilityRole="button"
      >
        <Text style={styles.menuText}>{title}</Text>
        <Text style={styles.arrow}>{'\u203A'}</Text>
      </Pressable>
      {!last && <View style={styles.divider} />}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {section !== null ? (
          <>
            <Pressable
              onPress={() => setSection(null)}
              style={styles.backButton}
            >
              <Text style={styles.backText}>
                {'\u2039'} Back to More
              </Text>
            </Pressable>

            {section === 'about' && (
              <>
                <Text style={styles.eyebrow}>OBK SEATTLE</Text>
                <Text style={styles.title}>About the Mosque</Text>

                <View style={styles.hero}>
                  <Text style={styles.heroLabel}>
                    OUR COMMUNITY
                  </Text>
                  <Text style={styles.heroTitle}>
                    Omar Bin Al-Khattab Islamic Center
                  </Text>
                  <Text style={styles.heroDescription}>
                    Faith, knowledge, and community.
                  </Text>
                </View>

                <View style={styles.infoCard}>
                  <Text style={styles.bodyText}>
                    Learn more about the mosque, its community,
                    and its activities through the official website.
                  </Text>

                  <Pressable
                    style={styles.actionButton}
                    onPress={openWebsite}
                  >
                    <Text style={styles.actionText}>
                      Visit Official Website
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            {section === 'notifications' && (
              <>
                <Text style={styles.eyebrow}>OBK SEATTLE</Text>
                <Text style={styles.title}>
                  Prayer Notifications
                </Text>
                <Text style={styles.subtitle}>
                  Manage notification permissions on your device.
                </Text>

                <View style={styles.infoCard}>
                  <Text style={styles.infoValue}>
                    Prayer Reminders
                  </Text>

                  <Text style={styles.bodyText}>
                    Notification reminders are managed through
                    your device settings. The app's notification
                    schedule is configured separately.
                  </Text>

                  <Pressable
                    style={styles.actionButton}
                    onPress={async () => {
                      try {
                        await Linking.openSettings();
                      } catch {
                        Alert.alert(
                          'Settings Unavailable',
                          'Open your device settings manually.'
                        );
                      }
                    }}
                  >
                    <Text style={styles.actionText}>
                      Open Notification Settings
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            {section === 'contact' && (
              <>
                <Text style={styles.eyebrow}>OBK SEATTLE</Text>
                <Text style={styles.title}>
                  Contact & Directions
                </Text>
                <Text style={styles.subtitle}>
                  Find the mosque and access official contact information.
                </Text>

                <View style={styles.infoCard}>
                  <Text style={styles.infoValue}>
                    Omar Bin Al-Khattab Islamic Center
                  </Text>

                  <Pressable
                    style={styles.actionButton}
                    onPress={openMaps}
                  >
                    <Text style={styles.actionText}>
                      Open Maps
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.actionButton,
                      styles.secondaryButton,
                    ]}
                    onPress={openWebsite}
                  >
                    <Text style={styles.actionText}>
                      Official Contact Information
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </>
        ) : (
          <>
            <Text style={styles.eyebrow}>OBK SEATTLE</Text>
            <Text style={styles.title}>More</Text>
            <Text style={styles.subtitle}>
              Everything you need to stay connected with your mosque.
            </Text>

            <View style={styles.hero}>
              <Text style={styles.heroLabel}>
                OUR COMMUNITY
              </Text>
              <Text style={styles.heroTitle}>
                Omar Bin Al-Khattab Islamic Center
              </Text>
              <Text style={styles.heroDescription}>
                Faith, knowledge, and community.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Explore</Text>

            <View style={styles.menuCard}>
              <MenuItem
                title="About the Mosque"
                onPress={() => setSection('about')}
              />
              <MenuItem
                title="Prayer Notifications"
                onPress={() => setSection('notifications')}
              />
              <MenuItem
                title="Contact & Directions"
                onPress={() => setSection('contact')}
              />
              <MenuItem
                title="Official Website"
                onPress={openWebsite}
                last
              />
            </View>

            <Text style={styles.sectionTitle}>
              App Information
            </Text>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Application</Text>
              <Text style={styles.infoValue}>OBK Seattle</Text>

              <View style={styles.infoDivider} />

              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0</Text>
            </View>

            <Text style={styles.footer}>
              Built with care for the OBK Seattle community.
            </Text>
          </>
        )}
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
    padding: 22,
    paddingBottom: 110,
  },
  eyebrow: {
    color: '#A1844E',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.darkGreen,
    marginTop: 12,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },
  hero: {
    backgroundColor: COLORS.green,
    borderRadius: 24,
    padding: 26,
    marginTop: 30,
    marginBottom: 30,
  },
  heroLabel: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 34,
    marginTop: 15,
  },
  heroDescription: {
    color: '#E4EDE8',
    fontSize: 14,
    lineHeight: 23,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.darkGreen,
    marginTop: 28,
    marginBottom: 15,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E7E3D8',
  },
  menuItem: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuText: {
    color: COLORS.darkGreen,
    fontSize: 15,
    fontWeight: '700',
  },
  arrow: {
    color: COLORS.muted,
    fontSize: 23,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0EEE8',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E7E3D8',
  },
  infoLabel: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 5,
  },
  infoValue: {
    color: COLORS.darkGreen,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F0EEE8',
    marginBottom: 15,
  },
  bodyText: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 25,
    marginBottom: 18,
  },
  actionButton: {
    backgroundColor: COLORS.green,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: '#28564D',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  backButton: {
    marginTop: 12,
    marginBottom: 20,
  },
  backText: {
    color: COLORS.green,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 30,
  },
});
