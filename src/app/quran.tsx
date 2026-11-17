import { quranImages } from '../quranImages';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Keyboard, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';

// Madani Hafs page images (Quran for Android image service).
// These are images of printed pages, NOT Quran strings rendered with a device font.
// Source: https://github.com/quran/quran_android
const TOTAL_PAGES = 604;
const pageUrl = (page: number) =>
  `https://files.quran.app/hafs/madani/width_1024/page${String(page).padStart(3, '0')}.png`;

const C = { paper: '#FCF6E5', ink: '#30291E', green: '#173F34', gold: '#B59A61', muted: '#807969', border: '#E5DCC5' };

export default function QuranScreen() {
  const { width, height } = useWindowDimensions();
  const [page, setPage] = useState(1);
  const [input, setInput] = useState('1');
  const [showJump, setShowJump] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [bookmarked, setBookmarked] = useState<number | null>(null);

  const goTo = (next: number) => {
    const p = Math.min(TOTAL_PAGES, Math.max(1, Math.round(next)));
    if (p !== page) { setLoading(true); setFailed(false); }
    setPage(p); setInput(String(p)); setShowJump(false); setZoom(1);
    Keyboard.dismiss();
  };
  const submit = () => {
    const parsed = Number(input);
    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= TOTAL_PAGES) goTo(parsed);
  };
  // The printed page is portrait. Maintain its natural ratio without cropping text.
  const displayWidth = Math.max(260, width - 18) * zoom;
  const displayHeight = displayWidth * (2038 / 1260);
  const viewHeight = Math.max(240, height - 240);

  return (
    <SafeAreaView style={s.root}>
      <View style={s.top}>
        <Pressable accessibilityLabel="Previous Mushaf page" disabled={page === 1} onPress={() => goTo(page - 1)} style={s.circle}>
          <Text style={[s.topIcon, page === 1 && s.disabled]}>‹</Text>
        </Pressable>
        <Pressable accessibilityLabel="Choose Mushaf page" onPress={() => setShowJump(v => !v)} style={s.heading}>
          <Text style={s.title}>Madinah Mushaf⌄</Text>
          <Text style={s.subtitle}>Hafs · Page {page} of {TOTAL_PAGES}</Text>
        </Pressable>
        <Pressable accessibilityLabel="Next Mushaf page" disabled={page === TOTAL_PAGES} onPress={() => goTo(page + 1)} style={s.circle}>
          <Text style={[s.topIcon, page === TOTAL_PAGES && s.disabled]}>›</Text>
        </Pressable>
      </View>
      {showJump && (
        <View style={s.jump}>
          <Text style={s.jumpLabel}>Go to page (1–604)</Text>
          <TextInput value={input} onChangeText={setInput} keyboardType="number-pad" returnKeyType="go" onSubmitEditing={submit} style={s.input} selectTextOnFocus />
          <Pressable onPress={submit} style={s.go}><Text style={s.goText}>Go</Text></Pressable>
          <Pressable onPress={() => goTo(bookmarked ?? 1)} style={s.bookmarkGo}><Text style={s.bookmarkGoText}>{bookmarked ? `Bookmark: ${bookmarked}` : 'Page 1'}</Text></Pressable>
        </View>
      )}
      <View style={s.pageArea}>
        <ScrollView
          key={page}
          style={{ flex: 1 }}
          contentContainerStyle={{ minHeight: viewHeight, alignItems: 'center', justifyContent: 'flex-start', paddingVertical: 8 }}
          maximumZoomScale={3}
          minimumZoomScale={1}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={false}
        >
          <Image
            source={quranImages[page - 1]}
            style={{ width: displayWidth, height: displayHeight, opacity: failed ? 0 : 1 }}
            resizeMode="contain"
            onLoadStart={() => { setLoading(true); setFailed(false); }}
            onLoadEnd={() => setLoading(false)}
            onError={() => { setFailed(true); setLoading(false); }}
            accessibilityLabel={`Printed Madinah Mushaf page ${page}`}
          />
          {loading && !failed && <View style={s.overlay}><ActivityIndicator size="large" color={C.green}/><Text style={s.status}>Loading Mushaf page {page}…</Text></View>}
          {failed && <View style={s.overlay}><Text style={s.errorTitle}>Page image could not load</Text><Text style={s.error}>Connect to the internet and check the page image source. No substitute Quran text will be shown.</Text><Pressable onPress={() => goTo(page === 604 ? 603 : page + 1)} style={s.retry}><Text style={s.goText}>Test another page</Text></Pressable></View>}
        </ScrollView>
      </View>
      <View style={s.tools}>
        <Pressable onPress={() => setZoom(z => Math.max(1, +(z - 0.2).toFixed(1)))} accessibilityLabel="Zoom out"><Text style={s.toolText}>A−</Text></Pressable>
        <Pressable onPress={() => setZoom(1)}><Text style={s.pageCount}>{page} / 604</Text></Pressable>
        <Pressable onPress={() => setZoom(z => Math.min(2.2, +(z + 0.2).toFixed(1)))} accessibilityLabel="Zoom in"><Text style={s.toolText}>A+</Text></Pressable>
        <Pressable onPress={() => setBookmarked(page)} accessibilityLabel="Bookmark current page"><Text style={s.toolText}>{bookmarked === page ? '★' : '☆'}</Text></Pressable>
      </View>
      <Text style={s.credit}>Madinah Mushaf · King Fahd Glorious Quran Printing Complex · Page images require internet</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.paper },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  circle: { width: 46, height: 46, borderRadius: 25, backgroundColor: '#FFFEF7', alignItems: 'center', justifyContent: 'center' },
  topIcon: { color: C.ink, fontSize: 34, lineHeight: 39 }, disabled: { opacity: 0.25 },
  heading: { flex: 1, alignItems: 'center' }, title: { fontSize: 20, color: C.ink, fontWeight: '700' }, subtitle: { fontSize: 12, color: C.muted, marginTop: 3 },
  jump: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, gap: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  jumpLabel: { fontSize: 11, color: C.muted }, input: { width: 58, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: C.border, padding: 8, color: C.ink, textAlign: 'center' },
  go: { backgroundColor: C.green, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }, goText: { color: '#FFF', fontWeight: '700' },
  bookmarkGo: { flex: 1 }, bookmarkGoText: { color: C.green, fontSize: 12, textAlign: 'right' },
  pageArea: { flex: 1 }, overlay: { position: 'absolute', top: 90, left: 20, right: 20, backgroundColor: C.paper, padding: 24, borderRadius: 12, alignItems: 'center', gap: 12 },
  status: { color: C.muted }, errorTitle: { fontWeight: '700', fontSize: 17, color: C.ink }, error: { color: C.muted, textAlign: 'center', lineHeight: 22 }, retry: { backgroundColor: C.green, padding: 12, borderRadius: 8 },
  tools: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 9, borderTopWidth: 1, borderTopColor: C.border },
  toolText: { color: C.green, fontSize: 21, fontWeight: '700' }, pageCount: { color: C.ink, fontSize: 14, fontWeight: '600' },
  credit: { fontSize: 9, textAlign: 'center', color: C.muted, paddingBottom: 4 },
});

