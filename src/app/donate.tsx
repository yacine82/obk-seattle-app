
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  green: '#123F35',
  darkGreen: '#092C26',
  gold: '#D9B66F',
  cream: '#F8F6F0',
  muted: '#6B7772',
};

export default function DonateScreen() {
  const handleDonate = () => {
    Alert.alert(
      'Donations Coming Soon',
      'Secure donations will be available after the mosque approves and connects its official payment provider.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>SUPPORT YOUR COMMUNITY</Text>
        <Text style={styles.title}>Give With Purpose</Text>
        <Text style={styles.subtitle}>
          Help support the community and the future of our mosque.
        </Text>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>COMMUNITY GIVING</Text>
          <Text style={styles.heroTitle}>
            Every contribution makes a difference.
          </Text>
          <Text style={styles.heroDescription}>
            A dedicated space for supporting OBK Seattle's
            community initiatives.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Donation Options</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>General Donations</Text>
          <Text style={styles.cardDescription}>
            Support mosque operations and community needs.
          </Text>
          <Text style={styles.pending}>NOT YET ACTIVE</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Community Programs</Text>
          <Text style={styles.cardDescription}>
            Help support educational and community initiatives.
          </Text>
          <Text style={styles.pending}>NOT YET ACTIVE</Text>
        </View>

        <Pressable style={styles.donateButton} onPress={handleDonate}>
          <Text style={styles.donateButtonText}>
            Preview Donation Feature
          </Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          Development preview only. No payments are collected through this app.
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
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    padding: 21,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#E7E3D8',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.green,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.muted,
    marginTop: 8,
  },
  pending: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A1844E',
    marginTop: 14,
    letterSpacing: 1,
  },
  donateButton: {
    backgroundColor: COLORS.green,
    borderRadius: 15,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 15,
  },
  donateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  disclaimer: {
    fontSize: 12,
    lineHeight: 19,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 16,
  },
});
