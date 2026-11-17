import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = { green: '#123F35', darkGreen: '#092C26', gold: '#D9B66F', cream: '#F8F6F0', white: '#FFFFFF', muted: '#6B7772', border: '#E7E3D8' };

// Surah names are navigation metadata, not Quranic verse text.
// Ayah counts and text must be validated against the selected Mushaf dataset before release.
const SURAH_NAMES = [
'Al-Fatihah','Al-Baqarah','Ali Imran','An-Nisa','Al-Maidah','Al-Anam','Al-Araf','Al-Anfal','At-Tawbah','Yunus','Hud','Yusuf','Ar-Rad','Ibrahim','Al-Hijr','An-Nahl','Al-Isra','Al-Kahf','Maryam','Ta-Ha','Al-Anbiya','Al-Hajj','Al-Muminun','An-Nur','Al-Furqan','Ash-Shuara','An-Naml','Al-Qasas','Al-Ankabut','Ar-Rum','Luqman','As-Sajdah','Al-Ahzab','Saba','Fatir','Ya-Sin','As-Saffat','Sad','Az-Zumar','Ghafir','Fussilat','Ash-Shura','Az-Zukhruf','Ad-Dukhan','Al-Jathiyah','Al-Ahqaf','Muhammad','Al-Fath','Al-Hujurat','Qaf','Adh-Dhariyat','At-Tur','An-Najm','Al-Qamar','Ar-Rahman','Al-Waqiah','Al-Hadid','Al-Mujadilah','Al-Hashr','Al-Mumtahanah','As-Saff','Al-Jumuah','Al-Munafiqun','At-Taghabun','At-Talaq','At-Tahrim','Al-Mulk','Al-Qalam','Al-Haqqah','Al-Maarij','Nuh','Al-Jinn','Al-Muzzammil','Al-Muddaththir','Al-Qiyamah','Al-Insan','Al-Mursalat','An-Naba','An-Naziat','Abasa','At-Takwir','Al-Infitar','Al-Mutaffifin','Al-Inshiqaq','Al-Buruj','At-Tariq','Al-Ala','Al-Ghashiyah','Al-Fajr','Al-Balad','Ash-Shams','Al-Layl','Ad-Duha','Ash-Sharh','At-Tin','Al-Alaq','Al-Qadr','Al-Bayyinah','Az-Zalzalah','Al-Adiyat','Al-Qariah','At-Takathur','Al-Asr','Al-Humazah','Al-Fil','Quraysh','Al-Maun','Al-Kawthar','Al-Kafirun','An-Nasr','Al-Masad','Al-Ikhlas','Al-Falaq','An-Nas'
];

type Screen = 'home' | 'surahs' | 'reader';
export default function QuranScreen() {
  const [screen, setScreen] = useState<Screen>('home');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const results = useMemo(() => SURAH_NAMES.map((name, index) => ({ name, number: index + 1 })).filter(item => item.name.toLowerCase().includes(query.trim().toLowerCase()) || String(item.number) === query.trim()), [query]);
  const goBack = () => { if (screen === 'reader') setScreen('surahs'); else setScreen('home'); };
  return <SafeAreaView style={styles.container} edges={['top']}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>OBK SEATTLE · QURAN</Text>
      <Text style={styles.title}>{screen === 'home' ? 'The Noble Quran' : screen === 'surahs' ? 'Browse Surahs' : selected ? `${selected}. ${SURAH_NAMES[selected - 1]}` : 'Quran Reader'}</Text>
      <Text style={styles.heroText}>{screen === 'home' ? 'Read, listen, memorize, and reflect.' : 'Madinah Mushaf · Hafs an Asim'}</Text>
    </View>
    {screen !== 'home' && <Pressable onPress={goBack} accessibilityRole="button" style={styles.back}><Text style={styles.backText}>‹ Back</Text></Pressable>}
    {screen === 'home' && <>
      <Text style={styles.sectionTitle}>Your Quran Journey</Text>
      {([['01','Read the Quran','Browse all 114 Surahs.','read'],['02','Listen to Recitations','Verified recitations, coming soon.','listen'],['03','Memorization','Hifz tools, coming soon.','memorize']] as const).map(([number,title,description,id]) => <Pressable key={id} style={styles.card} onPress={() => id === 'read' ? setScreen('surahs') : Alert.alert(title, 'This feature will be enabled after its content and sources are verified.')} accessibilityRole="button"><View style={styles.number}><Text style={styles.numberText}>{number}</Text></View><View style={styles.cardBody}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.muted}>{description}</Text></View><Text style={styles.arrow}>›</Text></Pressable>)}
    </>}
    {screen === 'surahs' && <>
      <TextInput style={styles.search} placeholder="Search Surah name or number" placeholderTextColor={COLORS.muted} value={query} onChangeText={setQuery} autoCorrect={false} accessibilityLabel="Search Surahs" />
      <Text style={styles.count}>{results.length} of 114 Surahs</Text>
      {results.map(item => <Pressable key={item.number} style={styles.surah} accessibilityRole="button" onPress={() => {setSelected(item.number);setScreen('reader');}}><View style={styles.number}><Text style={styles.numberText}>{item.number}</Text></View><Text style={styles.surahName}>{item.name}</Text><Text style={styles.arrow}>›</Text></Pressable>)}
    </>}
    {screen === 'reader' && <View style={styles.notice}><Text style={styles.noticeHeading}>Verified Arabic text pending</Text><Text style={styles.noticeBody}>We have not yet imported and validated the official Madinah Mushaf digital text. To avoid showing incorrect Quranic verses, reading is temporarily unavailable. Surah navigation is ready.</Text></View>}
    <View style={styles.notice}><Text style={styles.noticeHeading}>Quran text integrity</Text><Text style={styles.noticeBody}>Arabic verses will only be displayed from a verified source with confirmed usage rights. Translations and recitations will be clearly attributed.</Text></View>
    <Text style={styles.footer}>OBK Seattle · Quran section in development</Text>
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.cream},content:{paddingHorizontal:20,paddingTop:16,paddingBottom:110},hero:{backgroundColor:COLORS.green,borderRadius:24,padding:26,marginBottom:20},eyebrow:{color:COLORS.gold,fontSize:11,fontWeight:'800',letterSpacing:1.6},title:{color:COLORS.white,fontSize:30,fontWeight:'800',marginTop:12},heroText:{color:'#E4EDE8',fontSize:14,marginTop:12,lineHeight:22},sectionTitle:{color:COLORS.darkGreen,fontSize:21,fontWeight:'800',marginBottom:14},card:{flexDirection:'row',alignItems:'center',backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.border,borderRadius:18,padding:16,marginBottom:12},number:{width:44,height:44,borderRadius:13,backgroundColor:'#EDF3EE',alignItems:'center',justifyContent:'center',marginRight:14},numberText:{color:COLORS.green,fontWeight:'800',fontSize:14},cardBody:{flex:1},cardTitle:{color:COLORS.darkGreen,fontSize:16,fontWeight:'800'},muted:{color:COLORS.muted,fontSize:13,lineHeight:20,marginTop:5},arrow:{color:COLORS.green,fontSize:28,marginLeft:8},back:{marginBottom:18,alignSelf:'flex-start'},backText:{color:COLORS.green,fontSize:17,fontWeight:'700'},search:{backgroundColor:COLORS.white,borderRadius:14,borderWidth:1,borderColor:COLORS.border,padding:15,fontSize:15,color:COLORS.darkGreen,marginBottom:12},count:{color:COLORS.muted,fontSize:12,marginBottom:12},surah:{flexDirection:'row',alignItems:'center',backgroundColor:COLORS.white,borderRadius:15,padding:12,marginBottom:8,borderWidth:1,borderColor:COLORS.border},surahName:{flex:1,color:COLORS.darkGreen,fontWeight:'700',fontSize:16},notice:{backgroundColor:'#EAEFE9',borderRadius:18,padding:20,marginTop:18},noticeHeading:{color:COLORS.darkGreen,fontWeight:'800',fontSize:16},noticeBody:{color:COLORS.muted,fontSize:13,lineHeight:21,marginTop:8},footer:{color:COLORS.muted,fontSize:11,textAlign:'center',marginTop:28}
});
