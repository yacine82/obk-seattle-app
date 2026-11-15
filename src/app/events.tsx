
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>OBK SEATTLE</Text>
        <Text style={styles.title}>Community Events</Text>
        <Text style={styles.subtitle}>
          Stay connected with your mosque and community.
        </Text>

        <View style={styles.card}>
          <Text style={styles.badge}>COMING SOON</Text>
          <Text style={styles.cardTitle}>
            Upcoming Events & Programs
          </Text>
          <Text style={styles.description}>
            Community gatherings, Islamic lectures, educational
            programs, and special announcements will appear here
            once published by mosque administrators.
          </Text>
        </View>

        <Text style={styles.note}>
          Development preview. No events have been published yet.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
  content: {
    padding: 22,
    paddingBottom: 110,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A1844E',
    letterSpacing: 2,
    marginTop: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#092C26',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7772',
    marginTop: 10,
    lineHeight: 23,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 25,
    marginTop: 35,
    borderWidth: 1,
    borderColor: '#E7E3D8',
  },
  badge: {
    color: '#A1844E',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#123F35',
    marginTop: 15,
  },
  description: {
    fontSize: 15,
    color: '#6B7772',
    lineHeight: 24,
    marginTop: 12,
  },
  note: {
    fontSize: 12,
    color: '#6B7772',
    textAlign: 'center',
    marginTop: 25,
  },
});
