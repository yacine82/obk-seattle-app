import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import QURAN from '../data/quran-uthmani.json';

const C = {
  background: '#103B32',
  header: '#103B32',
  card: '#28564D',
  cardBorder: '#426A60',
  cream: '#FFF8E9',
  gold: '#D9BD81',
  muted: '#B8C9BF',
};

const names = [
  'Al-Faatihah','Al-Baqara','Aal-i-Imraan','An-Nisaa',
  'Al-Maaida',"Al-An'aam",'Al-Araaf','Al-Anfaal',
  'At-Tawba','Yunus','Hud','Yusuf',"Ar-Ra'd",'Ibrahim',
  'Al-Hijr','An-Nahl','Al-Israa','Al-Kahf','Maryam',
  'Taa-Haa','Al-Anbiyaa','Al-Hajj','Al-Muminoon',
  'An-Noor','Al-Furqaan','Ash-Shuaraa','An-Naml',
  'Al-Qasas','Al-Ankaboot','Ar-Room','Luqman',
  'As-Sajda','Al-Ahzaab','Saba','Faatir','Yaseen',
  'As-Saaffaat','Saad','Az-Zumar','Ghafir','Fussilat',
  'Ash-Shura','Az-Zukhruf','Ad-Dukhaan','Al-Jaathiya',
  'Al-Ahqaf','Muhammad','Al-Fath','Al-Hujuraat',
  'Qaaf','Adh-Dhaariyat','At-Tur','An-Najm','Al-Qamar',
  'Ar-Rahmaan','Al-Waaqia','Al-Hadeed','Al-Mujaadila',
  'Al-Hashr','Al-Mumtahana','As-Saff','Al-Jumua',
  'Al-Munaafiqoon','At-Taghaabun','At-Talaaq',
  'At-Tahreem','Al-Mulk','Al-Qalam','Al-Haaqqa',
  'Al-Maarij','Nooh','Al-Jinn','Al-Muzzammil',
  'Al-Muddaththir','Al-Qiyaama','Al-Insaan',
  'Al-Mursalaat','An-Naba','An-Naaziaat','Abasa',
  'At-Takweer','Al-Infitaar','Al-Mutaffifeen',
  'Al-Inshiqaaq','Al-Burooj','At-Taariq','Al-Alaa',
  'Al-Ghaashiya','Al-Fajr','Al-Balad','Ash-Shams',
  'Al-Layl','Ad-Duhaa','Ash-Sharh','At-Teen',
  'Al-Alaq','Al-Qadr','Al-Bayyina','Az-Zalzala',
  'Al-Aadiyaat','Al-Qaariya','At-Takaathur',
  'Al-Asr','Al-Humaza','Al-Feel','Quraysh',
  'Al-Maaun','Al-Kawthar','Al-Kaafiroon','An-Nasr',
  'Al-Masad','Al-Ikhlaas','Al-Falaq','An-Naas',
];

const arabic = ["\u0627\u0644\u0641\u0627\u062a\u062d\u0629", "\u0627\u0644\u0628\u0642\u0631\u0629", "\u0622\u0644 \u0639\u0645\u0631\u0627\u0646", "\u0627\u0644\u0646\u0633\u0627\u0621", "\u0627\u0644\u0645\u0627\u0626\u062f\u0629", "\u0627\u0644\u0623\u0646\u0639\u0627\u0645", "\u0627\u0644\u0623\u0639\u0631\u0627\u0641", "\u0627\u0644\u0623\u0646\u0641\u0627\u0644", "\u0627\u0644\u062a\u0648\u0628\u0629", "\u064a\u0648\u0646\u0633", "\u0647\u0648\u062f", "\u064a\u0648\u0633\u0641", "\u0627\u0644\u0631\u0639\u062f", "\u0625\u0628\u0631\u0627\u0647\u064a\u0645", "\u0627\u0644\u062d\u062c\u0631", "\u0627\u0644\u0646\u062d\u0644", "\u0627\u0644\u0625\u0633\u0631\u0627\u0621", "\u0627\u0644\u0643\u0647\u0641", "\u0645\u0631\u064a\u0645", "\u0637\u0647", "\u0627\u0644\u0623\u0646\u0628\u064a\u0627\u0621", "\u0627\u0644\u062d\u062c", "\u0627\u0644\u0645\u0624\u0645\u0646\u0648\u0646", "\u0627\u0644\u0646\u0648\u0631", "\u0627\u0644\u0641\u0631\u0642\u0627\u0646", "\u0627\u0644\u0634\u0639\u0631\u0627\u0621", "\u0627\u0644\u0646\u0645\u0644", "\u0627\u0644\u0642\u0635\u0635", "\u0627\u0644\u0639\u0646\u0643\u0628\u0648\u062a", "\u0627\u0644\u0631\u0648\u0645", "\u0644\u0642\u0645\u0627\u0646", "\u0627\u0644\u0633\u062c\u062f\u0629", "\u0627\u0644\u0623\u062d\u0632\u0627\u0628", "\u0633\u0628\u0623", "\u0641\u0627\u0637\u0631", "\u064a\u0633", "\u0627\u0644\u0635\u0627\u0641\u0627\u062a", "\u0635", "\u0627\u0644\u0632\u0645\u0631", "\u063a\u0627\u0641\u0631", "\u0641\u0635\u0644\u062a", "\u0627\u0644\u0634\u0648\u0631\u0649", "\u0627\u0644\u0632\u062e\u0631\u0641", "\u0627\u0644\u062f\u062e\u0627\u0646", "\u0627\u0644\u062c\u0627\u062b\u064a\u0629", "\u0627\u0644\u0623\u062d\u0642\u0627\u0641", "\u0645\u062d\u0645\u062f", "\u0627\u0644\u0641\u062a\u062d", "\u0627\u0644\u062d\u062c\u0631\u0627\u062a", "\u0642", "\u0627\u0644\u0630\u0627\u0631\u064a\u0627\u062a", "\u0627\u0644\u0637\u0648\u0631", "\u0627\u0644\u0646\u062c\u0645", "\u0627\u0644\u0642\u0645\u0631", "\u0627\u0644\u0631\u062d\u0645\u0646", "\u0627\u0644\u0648\u0627\u0642\u0639\u0629", "\u0627\u0644\u062d\u062f\u064a\u062f", "\u0627\u0644\u0645\u062c\u0627\u062f\u0644\u0629", "\u0627\u0644\u062d\u0634\u0631", "\u0627\u0644\u0645\u0645\u062a\u062d\u0646\u0629", "\u0627\u0644\u0635\u0641", "\u0627\u0644\u062c\u0645\u0639\u0629", "\u0627\u0644\u0645\u0646\u0627\u0641\u0642\u0648\u0646", "\u0627\u0644\u062a\u063a\u0627\u0628\u0646", "\u0627\u0644\u0637\u0644\u0627\u0642", "\u0627\u0644\u062a\u062d\u0631\u064a\u0645", "\u0627\u0644\u0645\u0644\u0643", "\u0627\u0644\u0642\u0644\u0645", "\u0627\u0644\u062d\u0627\u0642\u0629", "\u0627\u0644\u0645\u0639\u0627\u0631\u062c", "\u0646\u0648\u062d", "\u0627\u0644\u062c\u0646", "\u0627\u0644\u0645\u0632\u0645\u0644", "\u0627\u0644\u0645\u062f\u062b\u0631", "\u0627\u0644\u0642\u064a\u0627\u0645\u0629", "\u0627\u0644\u0625\u0646\u0633\u0627\u0646", "\u0627\u0644\u0645\u0631\u0633\u0644\u0627\u062a", "\u0627\u0644\u0646\u0628\u0623", "\u0627\u0644\u0646\u0627\u0632\u0639\u0627\u062a", "\u0639\u0628\u0633", "\u0627\u0644\u062a\u0643\u0648\u064a\u0631", "\u0627\u0644\u0627\u0646\u0641\u0637\u0627\u0631", "\u0627\u0644\u0645\u0637\u0641\u0641\u064a\u0646", "\u0627\u0644\u0627\u0646\u0634\u0642\u0627\u0642", "\u0627\u0644\u0628\u0631\u0648\u062c", "\u0627\u0644\u0637\u0627\u0631\u0642", "\u0627\u0644\u0623\u0639\u0644\u0649", "\u0627\u0644\u063a\u0627\u0634\u064a\u0629", "\u0627\u0644\u0641\u062c\u0631", "\u0627\u0644\u0628\u0644\u062f", "\u0627\u0644\u0634\u0645\u0633", "\u0627\u0644\u0644\u064a\u0644", "\u0627\u0644\u0636\u062d\u0649", "\u0627\u0644\u0634\u0631\u062d", "\u0627\u0644\u062a\u064a\u0646", "\u0627\u0644\u0639\u0644\u0642", "\u0627\u0644\u0642\u062f\u0631", "\u0627\u0644\u0628\u064a\u0646\u0629", "\u0627\u0644\u0632\u0644\u0632\u0644\u0629", "\u0627\u0644\u0639\u0627\u062f\u064a\u0627\u062a", "\u0627\u0644\u0642\u0627\u0631\u0639\u0629", "\u0627\u0644\u062a\u0643\u0627\u062b\u0631", "\u0627\u0644\u0639\u0635\u0631", "\u0627\u0644\u0647\u0645\u0632\u0629", "\u0627\u0644\u0641\u064a\u0644", "\u0642\u0631\u064a\u0634", "\u0627\u0644\u0645\u0627\u0639\u0648\u0646", "\u0627\u0644\u0643\u0648\u062b\u0631", "\u0627\u0644\u0643\u0627\u0641\u0631\u0648\u0646", "\u0627\u0644\u0646\u0635\u0631", "\u0627\u0644\u0645\u0633\u062f", "\u0627\u0644\u0625\u062e\u0644\u0627\u0635", "\u0627\u0644\u0641\u0644\u0642", "\u0627\u0644\u0646\u0627\u0633"];

const meanings = [
  'The Opener','The Cow','Family of Imran','The Women',
  'The Table Spread','The Cattle','The Heights',
  'The Spoils of War','The Repentance','Jonah','Hud',
  'Joseph','The Thunder','Abraham','The Rocky Tract',
  'The Bee','The Night Journey','The Cave','Mary',
  'Ta-Ha','The Prophets','The Pilgrimage','The Believers',
  'The Light','The Criterion','The Poets','The Ant',
  'The Stories','The Spider','The Romans','Luqman',
  'The Prostration','The Confederates','Sheba',
  'The Originator','Ya-Sin','Those Who Set the Ranks',
  'Sad','The Groups','The Forgiver','Explained in Detail',
  'The Consultation','The Ornaments of Gold','The Smoke',
  'The Kneeling','The Sand Dunes','Muhammad','The Victory',
  'The Rooms','Qaf','The Winnowing Winds','The Mount',
  'The Star','The Moon','The Most Merciful','The Event',
  'The Iron','The Pleading Woman','The Exile',
  'The Examined Woman','The Ranks','Friday',
  'The Hypocrites','Mutual Loss and Gain','The Divorce',
  'The Prohibition','The Sovereignty','The Pen',
  'The Reality','The Ascending Stairways','Noah',
  'The Jinn','The Enshrouded One','The Cloaked One',
  'The Resurrection','The Human','Those Sent Forth',
  'The Great News','Those Who Pull Out','He Frowned',
  'The Overthrowing','The Cleaving','The Defrauding',
  'The Splitting Open','The Constellations',
  'The Nightcomer','The Most High','The Overwhelming',
  'The Dawn','The City','The Sun','The Night',
  'The Morning Brightness','The Relief','The Fig',
  'The Clinging Clot','The Night of Decree',
  'The Clear Proof','The Earthquake','The Chargers',
  'The Calamity','Competition in Increase','Time',
  'The Slanderer','The Elephant','Quraysh',
  'Small Kindnesses','Abundance','The Disbelievers',
  'The Help','The Palm Fiber','Sincerity','Daybreak',
  'Mankind',
];

const juzStarts: [number, number][] = [
  [1,1],[2,142],[2,253],[3,93],[4,24],[4,148],
  [5,82],[6,111],[7,88],[8,41],[9,93],[11,6],
  [12,53],[15,1],[17,1],[18,75],[21,1],[23,1],
  [25,21],[27,56],[29,46],[33,31],[36,28],
  [39,32],[41,47],[46,1],[51,31],[58,1],
  [67,1],[78,1],
];

const verses = QURAN as string[][];

type Tab = 'Read' | 'Learn' | 'My Progress';
type Mode = 'Sura' | 'Juz';

export default function QuranScreen() {
  const [fontsLoaded] = useFonts({
    ScheherazadeNew: require('../../assets/fonts/ScheherazadeNew-Regular.ttf'),
  });

  const [tab, setTab] = useState<Tab>('Read');
  const [mode, setMode] = useState<Mode>('Sura');
  const [dropdown, setDropdown] = useState(false);
  const [reader, setReader] = useState(false);
  const [surah, setSurah] = useState(1);
  const [ayahStart, setAyahStart] = useState(1);
  const [searchVisible, setSearchVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [readSurahs, setReadSurahs] = useState<number[]>([]);
  const [last, setLast] = useState<[number, number] | null>(null);
  const [fontSize, setFontSize] = useState(30);
  
const [english, setEnglish] = useState<string[]>([]);
const [transliteration, setTransliteration] = useState<string[]>([]);
const [translationLoading, setTranslationLoading] = useState(false);
const [translationError, setTranslationError] = useState(false);

useEffect(() => {
  if (!reader) return;

  let active = true;

  async function loadTranslations() {
    setTranslationLoading(true);
    setTranslationError(false);
    setEnglish([]);
    setTransliteration([]);

    try {
      const [enResponse, trResponse] = await Promise.all([
        fetch(
          `https://api.alquran.cloud/v1/surah/${surah}/en.sahih`
        ),
        fetch(
          `https://api.alquran.cloud/v1/surah/${surah}/en.transliteration`
        ),
      ]);

      if (!enResponse.ok || !trResponse.ok) {
        throw new Error('Unable to load Quran translations');
      }

      const [enData, trData] = await Promise.all([
        enResponse.json(),
        trResponse.json(),
      ]);

      if (
        !Array.isArray(enData.data?.ayahs) ||
        !Array.isArray(trData.data?.ayahs) ||
        enData.data.ayahs.length !== verses[surah - 1]?.length ||
        trData.data.ayahs.length !== verses[surah - 1]?.length
      ) {
        throw new Error('Incomplete Quran data');
      }

      if (active) {
        setEnglish(enData.data.ayahs.map((a: any) => a.text));
        setTransliteration(
          trData.data.ayahs.map((a: any) => a.text)
        );
      }
    } catch {
      if (active) setTranslationError(true);
    } finally {
      if (active) setTranslationLoading(false);
    }
  }

  loadTranslations();

  return () => {
    active = false;
  };
}, [reader, surah]);

  const openReader = (n: number, a = 1) => {
    setSurah(n);
    setAyahStart(a);
    setLast([n, a]);
    setReader(true);
    setDropdown(false);
  };

  const goBack = () => {
    if (!fontsLoaded) return null;

  if (reader) {
      setReader(false);
    } else if (bookmarksOnly) {
      setBookmarksOnly(false);
    } else {
      setTab('Read');
    }
  };

  const toggleBookmark = (n: number, a: number) => {
    const key = `${n}:${a}`;
    setBookmarks(old =>
      old.includes(key)
        ? old.filter(v => v !== key)
        : [...old, key]
    );
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (bookmarksOnly) {
      return bookmarks.filter(key => {
        const [n] = key.split(':').map(Number);
        return `${names[n - 1]} ${key}`
          .toLowerCase()
          .includes(q);
      });
    }

    const length = mode === 'Sura' ? 114 : 30;

    return Array.from({ length }, (_, i) => i + 1)
      .filter(n => {
        const label =
          mode === 'Sura'
            ? `${n} ${names[n - 1]} ${meanings[n - 1]}`
            : `${n} juz ${n}`;
        return label.toLowerCase().includes(q);
      });
  }, [mode, search, bookmarksOnly, bookmarks]);

  const header = (
    <>
      <View style={s.header}>
        <Pressable
          style={s.iconButton}
          onPress={goBack}
          accessibilityLabel="Back"
        >
          <Ionicons
            name="chevron-back"
            size={31}
            color={C.cream}
          />
        </Pressable>

        <Text style={s.headerTitle} numberOfLines={1}>
          {reader
            ? names[surah - 1]
            : bookmarksOnly
            ? 'Bookmarks'
            : 'Quran'}
        </Text>

        <View style={{ flex: 1 }} />

        <Pressable
          style={s.iconButton}
          onPress={() => {
            setReader(false);
            setBookmarksOnly(true);
            setTab('Read');
          }}
          accessibilityLabel="My bookmarks"
        >
          <Ionicons
            name="bookmark"
            size={26}
            color={C.cream}
          />
        </Pressable>

        <Pressable
          style={s.iconButton}
          onPress={() => setSearchVisible(v => !v)}
          accessibilityLabel="Search"
        >
          <Ionicons
            name="search-outline"
            size={31}
            color={C.cream}
          />
        </Pressable>
      </View>

      {searchVisible && !reader && (
        <TextInput
          style={s.searchInput}
          placeholder="Search Sura or Juz"
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
      )}
    </>
  );

  if (!fontsLoaded) return null;

  if (reader) {
    const current = verses[surah - 1] ?? [];
    const bismillah = verses[0]?.[0] ?? '';

    return (
      <SafeAreaView style={s.root}>
        {header}

        <FlatList
          key={`${surah}-${ayahStart}`}
          data={current.slice(ayahStart - 1)}
          keyExtractor={(_, i) => String(i + ayahStart)}
          contentContainerStyle={s.readerList}
          ListHeaderComponent={
            <View style={s.readerIntro}>
              <Text style={s.readerSurahArabic}>
                {arabic[surah - 1]}
              </Text>
              <Text style={s.readerSurahName}>
                {names[surah - 1]}
              </Text>
              <Text style={s.readerInfo}>
                {current.length} Ayahs
              </Text>
              {surah !== 1 && surah !== 9 && ayahStart === 1 && (
                <Text style={s.bismillah}>
                  {bismillah}
                </Text>
              )}
            </View>
          }
          renderItem={({ item, index }) => {
            const a = index + ayahStart;
            const marked = bookmarks.includes(`${surah}:${a}`);

            const verseText =
              a === 1 &&
              surah !== 1 &&
              surah !== 9 &&
              bismillah &&
              item.startsWith(bismillah)
                ? item.slice(bismillah.length).trim()
                : item;

            return (
              <View style={s.verseCard}>
  <View style={s.verseToolbar}>
    <Text style={s.verseLabel}>
      {surah}:{a}
    </Text>

    <Pressable onPress={() => toggleBookmark(surah, a)}>
      <Ionicons
        name={marked ? 'bookmark' : 'bookmark-outline'}
        size={25}
        color={marked ? C.gold : C.cream}
      />
    </Pressable>
  </View>

  <View style={s.ayahContent}>
    <Text
      selectable
      style={[
        s.verseText,
        {
          fontSize,
          lineHeight: fontSize * 2.05,
        },
      ]}
    >
      {verseText}
    </Text>

    {transliteration[a - 1] ? (
      <Text selectable style={s.transliteration}>
        {transliteration[a - 1]}
      </Text>
    ) : null}

    {english[a - 1] ? (
      <Text selectable style={s.translation}>
        {english[a - 1]}
      </Text>
    ) : null}

    {translationLoading && a === ayahStart ? (
      <Text style={s.loadingText}>
        Loading translation and transliteration...
      </Text>
    ) : null}

    {translationError && a === ayahStart ? (
      <Text style={s.loadingText}>
        Translation unavailable. Check your internet connection.
      </Text>
    ) : null}
  </View>

  <Pressable onPress={() => setLast([surah, a])}>
    <Text style={s.position}>
      Set reading position
    </Text>
  </Pressable>
</View>
            );
          }}

        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.root}>
      {header}

      {!bookmarksOnly && (
        <View style={s.tabs}>
          {(['Read', 'My Progress'] as Tab[]).map(t => (
            <Pressable
              key={t}
              style={[s.tab, tab === t && s.activeTab]}
              onPress={() => {
                setTab(t);
                setDropdown(false);
              }}
            >
              <Text
                style={[
                  s.tabText,
                  tab === t && s.activeTabText,
                ]}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {tab === 'Read' || bookmarksOnly ? (
        <View style={{ flex: 1 }}>
          <View style={s.listHeading}>
            <Text style={s.listTitle}>
              {bookmarksOnly
                ? 'My Bookmarks'
                : mode === 'Sura'
                ? 'Sura list'
                : 'Juz list'}
            </Text>

            {!bookmarksOnly && (
              <Pressable
                style={s.dropdownButton}
                onPress={() => setDropdown(v => !v)}
              >
                <Text style={s.dropdownText}>
                  View: {mode}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={17}
                  color={C.cream}
                />
              </Pressable>
            )}
          </View>

          <FlatList
            data={filtered.map(String)}
            keyExtractor={item => String(item)}
            contentContainerStyle={s.list}
            renderItem={({ item }) => {
              if (bookmarksOnly) {
                const [n, a] = String(item)
                  .split(':')
                  .map(Number);

                return (
                  <Pressable
                    style={s.suraCard}
                    onPress={() => openReader(n, a)}
                  >
                    <Text style={s.number}>{a}</Text>
                    <Text style={s.arabicName}>
                      {arabic[n - 1]}
                    </Text>
                    <View style={s.cardDetails}>
                      <Text style={s.englishName}>
                        {names[n - 1]}
                      </Text>
                      <Text style={s.meaning}>
                        Ayah {a}
                      </Text>
                    </View>
                  </Pressable>
                );
              }

              const n = Number(item);

              if (mode === 'Juz') {
                const [sn, an] = juzStarts[n - 1];

                return (
                  <Pressable
                    style={s.suraCard}
                    onPress={() => openReader(sn, an)}
                  >
                    <Text style={s.number}>{n}</Text>
                    <Text style={s.arabicName}>
                      {arabic[sn - 1]}
                    </Text>
                    <View style={s.cardDetails}>
                      <Text style={s.englishName}>
                        Juz {n}
                      </Text>
                      <Text style={s.meaning}>
                        {names[sn - 1]} Ãƒâ€šÃ‚Â· {sn}:{an}
                      </Text>
                    </View>
                  </Pressable>
                );
              }

              return (
                <Pressable
                  style={s.suraCard}
                  onPress={() => openReader(n)}
                >
                  <Text style={s.number}>{n}</Text>
                  <Text style={s.arabicName}>
                    {arabic[n - 1]}
                  </Text>
                  <View style={s.cardDetails}>
                    <Text
                      style={s.englishName}
                      numberOfLines={1}
                    >
                      {names[n - 1]}
                    </Text>
                    <Text
                      style={s.meaning}
                      numberOfLines={1}
                    >
                      {meanings[n - 1]}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <Text style={s.empty}>
                {bookmarksOnly
                  ? 'No bookmarks yet.'
                  : 'No results found.'}
              </Text>
            }
          />

          {dropdown && (
            <>
              <Pressable
                style={s.dropdownDismiss}
                onPress={() => setDropdown(false)}
              />
              <View style={s.dropdownMenu}>
                {(['Sura', 'Juz'] as Mode[]).map(m => (
                  <Pressable
                    key={m}
                    style={s.dropdownItem}
                    onPress={() => {
                      setMode(m);
                      setDropdown(false);
                      setSearch('');
                    }}
                  >
                    <Text style={s.dropdownItemText}>{m}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </View>
      ) : tab === 'Learn' ? (
        <ScrollView contentContainerStyle={s.centerPage}>
          <Ionicons
            name="school-outline"
            size={52}
            color={C.gold}
          />
          <Text style={s.pageTitle}>Learn Quran</Text>
          <Text style={s.pageDescription}>
            Explore the Surahs and begin your Quran learning journey.
          </Text>
          <Pressable
            style={s.actionButton}
            onPress={() => setTab('Read')}
          >
            <Text style={s.actionText}>Explore Quran</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={s.centerPage}>
          <Ionicons
            name="stats-chart-outline"
            size={52}
            color={C.gold}
          />
          <Text style={s.pageTitle}>My Progress</Text>

          <View style={s.progressCard}>
            <Text style={s.progressNumber}>
              {readSurahs.length} / 114
            </Text>
            <Text style={s.progressDescription}>
              Surahs marked as read
            </Text>
          </View>

          <View style={s.progressCard}>
            <Text style={s.progressNumber}>
              {bookmarks.length}
            </Text>
            <Text style={s.progressDescription}>
              Saved bookmarks
            </Text>
          </View>

          {last && (
            <Pressable
              style={s.actionButton}
              onPress={() => openReader(last[0], last[1])}
            >
              <Text style={s.actionText}>
                Continue Reading
              </Text>
            </Pressable>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  ayahContent: {
    paddingVertical: 12,
  },

  transliteration: {
    color: '#B8C9BF',
    fontSize: 16,
    lineHeight: 26,
    fontStyle: 'italic',
    marginTop: 12,
    marginBottom: 8,
  },

  translation: {
    color: '#FFF8E9',
    fontSize: 17,
    lineHeight: 29,
    marginTop: 8,
    marginBottom: 12,
  },

  loadingText: {
    color: '#D9BD81',
    fontSize: 14,
    marginTop: 10,
  },

  root: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    height: 78,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.header,
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 27,
    fontWeight: '700',
    color: C.cream,
    marginLeft: 8,
    maxWidth: '55%',
  },
  searchInput: {
    marginHorizontal: 22,
    marginBottom: 10,
    padding: 13,
    borderRadius: 12,
    backgroundColor: C.card,
    color: C.cream,
    fontSize: 16,
  },
  tabs: {
    height: 65,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.cardBorder,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#1B493F',
    borderBottomWidth: 2,
    borderBottomColor: C.gold,
  },
  tabText: {
    fontSize: 17,
    color: C.muted,
  },
  activeTabText: {
    color: C.cream,
    fontWeight: '700',
  },
  listHeading: {
    height: 90,
    paddingHorizontal: 19,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: C.cream,
  },
  dropdownButton: {
    borderWidth: 1.5,
    borderColor: C.cream,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dropdownText: {
    fontSize: 15,
    color: C.cream,
    fontWeight: '600',
  },
  dropdownDismiss: {
    ...StyleSheet.absoluteFill,
    zIndex: 5,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 74,
    right: 19,
    width: 155,
    borderRadius: 18,
    backgroundColor: '#3C675C',
    zIndex: 10,
    elevation: 12,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#62877D',
  },
  dropdownItemText: {
    fontSize: 17,
    color: C.cream,
  },
  list: {
    paddingHorizontal: 17,
    paddingBottom: 95,
  },
  suraCard: {
    minHeight: 115,
    borderRadius: 21,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
    marginBottom: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  number: {
    width: 42,
    textAlign: 'center',
    color: C.cream,
    fontSize: 24,
    fontWeight: '700',
  },
  arabicName: {
    width: 113,
    textAlign: 'center',
    writingDirection: 'rtl',
    color: C.cream,
    fontSize: 28,
    marginHorizontal: 5,
  },
  cardDetails: {
    flex: 1,
    paddingLeft: 4,
  },
  englishName: {
    color: C.cream,
    fontFamily: 'serif',
    fontSize: 23,
    fontWeight: '600',
  },
  meaning: {
    color: C.muted,
    fontSize: 15,
    marginTop: 5,
  },
  empty: {
    color: C.muted,
    textAlign: 'center',
    marginTop: 35,
  },
  readerList: {
    paddingHorizontal: 17,
    paddingBottom: 50,
  },
  readerIntro: {
    backgroundColor: C.card,
    borderRadius: 20,
    alignItems: 'center',
    padding: 25,
    marginBottom: 16,
  },
  readerSurahArabic: {
    fontFamily: 'ScheherazadeNew',
    fontSize: 39,
    color: C.gold,
    lineHeight: 65,
  },
  readerSurahName: {
    fontSize: 23,
    fontWeight: '700',
    color: C.cream,
  },
  readerInfo: {
    color: C.muted,
    marginTop: 8,
  },
  bismillah: {
    fontFamily: 'ScheherazadeNew',
    color: C.cream,
    fontSize: 28,
    lineHeight: 60,
    textAlign: 'center',
    writingDirection: 'rtl',
    marginTop: 20,
  },
  verseCard: {
    backgroundColor: C.card,
    borderRadius: 17,
    padding: 18,
    marginBottom: 12,
  },
  verseToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verseLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: C.gold,
  },
  verseText: {
    fontFamily: 'ScheherazadeNew',
    color: C.cream,
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingVertical: 22,
  },
  position: {
    color: C.gold,
    textAlign: 'right',
    fontSize: 12,
  },
  readerFooter: {
    height: 60,
    backgroundColor: '#174C3D',
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerControl: {
    fontSize: 23,
    fontWeight: '800',
    color: C.cream,
  },
  footerMiddle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.gold,
  },
  centerPage: {
    padding: 25,
    paddingTop: 60,
    alignItems: 'center',
    gap: 18,
  },
  pageTitle: {
    color: C.cream,
    fontSize: 27,
    fontWeight: '800',
  },
  pageDescription: {
    color: C.muted,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 25,
  },
  progressCard: {
    width: '100%',
    padding: 26,
    borderRadius: 19,
    backgroundColor: C.card,
    alignItems: 'center',
  },
  progressNumber: {
    color: C.gold,
    fontSize: 33,
    fontWeight: '800',
  },
  progressDescription: {
    color: C.muted,
    fontSize: 14,
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: C.gold,
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 13,
    marginTop: 12,
  },
  actionText: {
    color: C.background,
    fontSize: 15,
    fontWeight: '800',
  },
});




