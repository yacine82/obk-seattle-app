
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LearnScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>GROW IN KNOWLEDGE</Text>
        <Text style={styles.title}>Learn & Explore</Text>
        <Text style={styles.subtitle}>
          A space for Islamic knowledge, reflection, and growth.
        </Text>

        <View style={styles.featuredCard}>
          <Text style={styles.featuredLabel}>EDUCATION</Text>
          <Text style={styles.featuredTitle}>
            Knowledge strengthens faith.
          </Text>
          <Text style={styles.featuredDescription}>
            Discover educational resources and community learning
            opportunities as they become available.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Learning Resources</Text>

        {[
          {
            title: 'Quran Studies',
            description: 'Quran learning resources and study opportunities.',
          },
          {
            title: 'Islamic Lectures',
            description: 'Educational talks and beneficial reminders.',
          },
          {
            title: 'Youth & Family',
            description: 'Learning resources for families and young people.',
          },
        ].map((item) => (
          <View key={item.title} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>
              {item.description}
            </Text>
            <Text style={styles.comingSoon}>COMING SOON</Text>
          </View>
        ))}

        <Text style={styles.note}>
          Development preview. Programs and resources are not yet published.
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
    color: '#A1844E',
    fontSize: 11,
    fontWeight: '800',
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
    color: '#6B7772',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },
  featuredCard: {
    backgroundColor: '#123F35',
    borderRadius: 24,
    padding: 26,
    marginTop: 30,
    marginBottom: 30,
  },
  featuredLabel: {
    color: '#D9B66F',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 34,
    marginTop: 15,
  },
  featuredDescription: {
    color: '#E4EDE8',
    fontSize: 14,
    lineHeight: 23,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#092C26',
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
    color: '#123F35',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6B7772',
    marginTop: 8,
  },
  comingSoon: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A1844E',
    marginTop: 14,
    letterSpacing: 1,
  },
  note: {
    fontSize: 12,
    color: '#6B7772',
    textAlign: 'center',
    marginTop: 18,
  },
});
