import { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import QURAN from '../data/quran-uthmani.json';

const C = { green: '#123F35', dark: '#092C26', gold: '#D9B66F', cream: '#F8F6F0', white: '#FFFFFF', muted: '#6B7772', border: '#E7E3D8' };
const EXPECTED = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
const VALID = QURAN.length === 114 && QURAN.every((v, i) => Array.isArray(v) && v.length === EXPECTED[i] && v.every(t => typeof t === 'string' && t.trim().length > 0));

type Page = 'home' | 'list' | 'reader';
export default function QuranScreen() {
  const [page, setPage] = useState<Page>('home');
  const [surah, setSurah] = useState(1);
  const [query, setQuery] = useState('');
  const [fontSize, setFontSize] = useState(29);
  const chapters = useMemo(() => Array.from({length:114},(_,i)=>i+1).filter(n => !query.trim() || String(n).includes(query.trim())),[query]);
  const openSurah = (n: number) => {setSurah(n);setPage('reader');};
  return <SafeAreaView style={s.root}>
    <View style={s.header}>
      {page !== 'home' && <Pressable onPress={() => setPage(page === 'reader' ? 'list' : 'home')} accessibilityRole="button"><Text style={s.back}>‹  Back</Text></Pressable>}
      <Text style={s.eyebrow}>OBK SEATTLE · QURAN</Text>
      <Text style={s.title}>{page === 'reader' ? `Surah ${surah}` : 'The Noble Quran'}</Text>
      <Text style={s.headerSub}>Arabic · Uthmani · Tanzil Quran Project</Text>
    </View>
    {!VALID ? <View style={s.notice}><Text style={s.noticeTitle}>Quran data unavailable</Text><Text style={s.muted}>The local text failed validation and will not be displayed.</Text></View> : page === 'home' ? <View style={s.body}>
      <Pressable style={s.card} onPress={() => setPage('list')}><Text style={s.cardTitle}>Read the Quran  ›</Text><Text style={s.muted}>114 Surahs · 6,236 Ayahs · Offline Arabic text</Text></Pressable>
      <View style={s.notice}><Text style={s.noticeTitle}>Source integrity</Text><Text style={s.muted}>Arabic text is copied unchanged from the supplied Tanzil Uthmani file. The app checks verse counts; independent text verification and device typography review are still required before publication.</Text></View>
      <Text style={s.credit}>Quran text: Tanzil Quran Project · tanzil.net</Text>
    </View> : page === 'list' ? <View style={{flex:1}}>
      <TextInput value={query} onChangeText={setQuery} placeholder="Search Surah number (1–114)" keyboardType="number-pad" style={s.search}/>
      <FlatList data={chapters} keyExtractor={n=>String(n)} contentContainerStyle={{padding:18,paddingBottom:100}} renderItem={({item})=><Pressable style={s.row} onPress={()=>openSurah(item)}><View style={s.number}><Text style={s.numberText}>{item}</Text></View><View style={{flex:1}}><Text style={s.cardTitle}>Surah {item}</Text><Text style={s.muted}>{EXPECTED[item-1]} Ayahs</Text></View><Text style={s.arrow}>›</Text></Pressable>}/>
    </View> : <View style={{flex:1}}>
      <View style={s.controls}><Text style={s.muted}>{EXPECTED[surah-1]} Ayahs</Text><View style={{flexDirection:'row',gap:14,alignItems:'center'}}><Pressable onPress={()=>setFontSize(n=>Math.max(22,n-2))}><Text style={s.control}>A−</Text></Pressable><Pressable onPress={()=>setFontSize(n=>Math.min(40,n+2))}><Text style={s.control}>A+</Text></Pressable></View></View>
      <FlatList key={surah} data={QURAN[surah-1]} keyExtractor={(_,i)=>`${surah}:${i+1}`} contentContainerStyle={{padding:18,paddingBottom:110}} renderItem={({item,index})=><View style={s.verse}><Text style={s.verseNumber}>{surah}:{index+1}</Text><Text selectable style={[s.arabic,{fontSize,lineHeight:fontSize*2.05}]}>{item}</Text></View>}/>
      <View style={s.footer}><Pressable disabled={surah===1} onPress={()=>setSurah(n=>n-1)}><Text style={[s.footerAction,surah===1&&s.disabled]}>‹ Previous</Text></Pressable><Text style={s.muted}>{surah} / 114</Text><Pressable disabled={surah===114} onPress={()=>setSurah(n=>n+1)}><Text style={[s.footerAction,surah===114&&s.disabled]}>Next ›</Text></Pressable></View>
    </View>}
  </SafeAreaView>;
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:C.cream},header:{backgroundColor:C.green,padding:22,paddingTop:30},eyebrow:{color:C.gold,fontSize:11,fontWeight:'800',letterSpacing:1.5},title:{color:C.white,fontSize:28,fontWeight:'800',marginTop:10},headerSub:{color:'#E4EDE8',marginTop:8,fontSize:12},back:{color:C.white,fontSize:15,marginBottom:15},body:{padding:20},card:{backgroundColor:C.white,padding:22,borderRadius:18,borderWidth:1,borderColor:C.border,marginBottom:16},cardTitle:{fontSize:17,fontWeight:'800',color:C.dark,marginBottom:5},muted:{color:C.muted,fontSize:13,lineHeight:21},notice:{margin:20,backgroundColor:'#EAEFE9',padding:20,borderRadius:18},noticeTitle:{fontSize:16,fontWeight:'800',color:C.dark,marginBottom:7},credit:{fontSize:11,color:C.muted,textAlign:'center'},search:{margin:18,marginBottom:0,padding:14,backgroundColor:C.white,borderRadius:12,borderColor:C.border,borderWidth:1,fontSize:15},row:{flexDirection:'row',alignItems:'center',backgroundColor:C.white,borderRadius:15,padding:14,marginBottom:9},number:{height:42,width:42,borderRadius:12,backgroundColor:'#EDF3EE',justifyContent:'center',alignItems:'center',marginRight:14},numberText:{color:C.green,fontWeight:'800'},arrow:{fontSize:25,color:C.green},controls:{paddingHorizontal:20,paddingVertical:13,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},control:{fontWeight:'800',color:C.green,fontSize:18},verse:{backgroundColor:C.white,padding:20,borderRadius:16,marginBottom:12,borderWidth:1,borderColor:C.border},verseNumber:{color:C.green,fontWeight:'700',fontSize:12},arabic:{color:C.dark,textAlign:'right',writingDirection:'rtl',marginTop:10},footer:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,paddingVertical:14,backgroundColor:C.white,borderTopWidth:1,borderColor:C.border},footerAction:{color:C.green,fontWeight:'800'},disabled:{opacity:0.3}});
