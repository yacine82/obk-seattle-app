
import {
    Alert,
    Linking,
    Pressable,
    ScrollView,
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
  muted: '#6B7772',
};

export default function MoreScreen() {
  const showComingSoon = (feature: string) => {
    Alert.alert(
      feature,
      'This feature will be available in a future version of the OBK Seattle app.'
    );
  };

  const openWebsite = async () => {
    try {
      await Linking.openURL('https://obkseattle.org/');
    } catch {
      Alert.alert('Unable to Open Website', 'Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>OBK SEATTLE</Text>
        <Text style={styles.title}>More</Text>
        <Text style={styles.subtitle}>
          Everything you need to stay connected with your mosque.
        </Text>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>OUR COMMUNITY</Text>
          <Text style={styles.heroTitle}>
            Omar Bin Al-Khattab Islamic Center
          </Text>
          <Text style={styles.heroDescription}>
            Faith, knowledge, and community.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Explore</Text>

        <View style={styles.menuCard}>
          <Pressable
            style={styles.menuItem}
            onPress={() => showComingSoon('About the Mosque')}
          >
            <Text style={styles.menuText}>About the Mosque</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.menuItem}
            onPress={() => showComingSoon('Prayer Notifications')}
          >
            <Text style={styles.menuText}>Prayer Notifications</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.menuItem}
            onPress={() => showComingSoon('Contact & Directions')}
          >
            <Text style={styles.menuText}>Contact & Directions</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.menuItem} onPress={openWebsite}>
            <Text style={styles.menuText}>Official Website</Text>
            <Text style={styles.arrow}>↗</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>App Information</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Application</Text>
          <Text style={styles.infoValue}>OBK Seattle</Text>

          <View style={styles.infoDivider} />

          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>Development Preview 0.1</Text>

          <View style={styles.infoDivider} />

          <Text style={styles.infoLabel}>Status</Text>
          <Text style={styles.infoValue}>
            Independent prototype · Not an official mosque app
          </Text>
        </View>

        <Text style={styles.footer}>
          Built with care for the OBK Seattle community.
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
  footer: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 30,
  },
});
