
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function QuranScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>OBK SEATTLE</Text>
        <Text style={styles.title}>The Holy Quran</Text>
        <Text style={styles.description}>
          Read, learn, memorize, and reflect on the words of Allah.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.arabic}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
        <Text style={styles.translation}>
          In the name of Allah, the Most Merciful,
          the Especially Merciful.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Your Quran Journey</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Read the Quran</Text>
        <Text style={styles.cardDescription}>
          Explore all 114 surahs with Arabic text and translations.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Listen to Recitations</Text>
        <Text style={styles.cardDescription}>
          Listen to beautiful Quran recitations.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Memorization</Text>
        <Text style={styles.cardDescription}>
          Build your Hifz journey and track your progress.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F4',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  subtitle: {
    color: '#A28A53',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#123F35',
    marginTop: 12,
  },
  description: {
    fontSize: 16,
    color: '#728078',
    marginTop: 12,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#123F35',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 14,
    padding: 24,
    borderRadius: 20,
  },
  arabic: {
    fontSize: 27,
    color: '#123F35',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 48,
  },
  translation: {
    fontSize: 15,
    color: '#728078',
    textAlign: 'center',
    lineHeight: 24,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#123F35',
  },
  cardDescription: {
    fontSize: 15,
    color: '#728078',
    marginTop: 8,
    lineHeight: 23,
  },
});
