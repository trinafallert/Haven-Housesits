import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Colors, Shadows } from '@/constants/colors'

const PLACE_TYPES = [
  { key: 'BEACH',       label: 'Beach',       icon: '🏖️' },
  { key: 'CITY',        label: 'City',        icon: '🏙️' },
  { key: 'COUNTRYSIDE', label: 'Countryside', icon: '🌿' },
  { key: 'MOUNTAINS',   label: 'Mountains',   icon: '⛰️' },
]

const ANIMALS = [
  { key: 'DOG',   label: 'Dogs',       icon: '🐕' },
  { key: 'CAT',   label: 'Cats',       icon: '🐈' },
  { key: 'FISH',  label: 'Fish',       icon: '🐠' },
  { key: 'REPTILE', label: 'Reptiles', icon: '🦎' },
  { key: 'HORSE', label: 'Horses',     icon: '🐴' },
  { key: 'BIRD',  label: 'Birds',      icon: '🦜' },
  { key: 'SMALL', label: 'Small pets', icon: '🐹' },
  { key: 'POULTRY', label: 'Poultry', icon: '🐔' },
]

const DOG_SIZES = ['XS', 'S', 'M', 'L', 'XL']
const WALK_DURATIONS = ['Not able', '30 min', '60 min', '2hr+']

export default function EditPreferencesScreen() {
  const router = useRouter()
  const [placePref, setPlacePref] = useState<string[]>(['BEACH', 'CITY'])
  const [anywherePref, setAnywherePref] = useState(true)
  const [animals, setAnimals] = useState<string[]>(['DOG', 'CAT'])
  const [remoteWork, setRemoteWork] = useState(true)
  const [videoCall, setVideoCall] = useState(true)
  const [meetInPerson, setMeetInPerson] = useState(false)
  const [walkDuration, setWalkDuration] = useState('60 min')
  const [dogSizes, setDogSizes] = useState<string[]>(['M', 'L'])

  const toggle = (arr: string[], setArr: Function, key: string) =>
    setArr((prev: string[]) => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferences</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.saveBtn}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Place types */}
        <Text style={styles.sectionTitle}>Place types</Text>
        <Text style={styles.sectionSub}>What kind of locations do you prefer?</Text>
        <View style={styles.iconGrid}>
          {PLACE_TYPES.map(p => (
            <TouchableOpacity
              key={p.key}
              style={[styles.iconItem, placePref.includes(p.key) && styles.iconItemActive]}
              onPress={() => toggle(placePref, setPlacePref, p.key)}
            >
              <Text style={styles.iconEmoji}>{p.icon}</Text>
              <Text style={[styles.iconLabel, placePref.includes(p.key) && styles.iconLabelActive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sit location */}
        <Text style={styles.sectionTitle}>Sit location</Text>
        {[
          { label: '🌍 Anywhere in the world', value: true },
          { label: '📍 Specific countries only', value: false },
        ].map(opt => (
          <TouchableOpacity
            key={String(opt.value)}
            style={[styles.radioRow, anywherePref === opt.value && styles.radioRowActive]}
            onPress={() => setAnywherePref(opt.value)}
          >
            <View style={[styles.radioCircle, anywherePref === opt.value && styles.radioCircleActive]}>
              {anywherePref === opt.value && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>{opt.label}</Text>
          </TouchableOpacity>
        ))}

        {/* Animals */}
        <Text style={styles.sectionTitle}>Animals I'm interested in</Text>
        <View style={styles.iconGrid}>
          {ANIMALS.map(a => (
            <TouchableOpacity
              key={a.key}
              style={[styles.iconItem, animals.includes(a.key) && styles.iconItemActive]}
              onPress={() => toggle(animals, setAnimals, a.key)}
            >
              <Text style={styles.iconEmoji}>{a.icon}</Text>
              <Text style={[styles.iconLabel, animals.includes(a.key) && styles.iconLabelActive]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Toggles */}
        <Text style={styles.sectionTitle}>Sit preferences</Text>
        {[
          { label: '💻 Open to remote working sits', state: remoteWork, set: setRemoteWork },
          { label: '📹 Happy to video call with owner', state: videoCall, set: setVideoCall },
          { label: '🤝 Happy to meet owner in person', state: meetInPerson, set: setMeetInPerson },
        ].map(({ label, state, set }) => (
          <View key={label} style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{label}</Text>
            <Switch value={state} onValueChange={set} trackColor={{ false: Colors.sand, true: Colors.teal }} thumbColor={Colors.white} />
          </View>
        ))}

        {/* Dog walk */}
        <Text style={styles.sectionTitle}>Dog walk duration</Text>
        <View style={styles.chipRow}>
          {WALK_DURATIONS.map(d => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, walkDuration === d && styles.chipActive]}
              onPress={() => setWalkDuration(d)}
            >
              <Text style={[styles.chipText, walkDuration === d && styles.chipTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dog sizes */}
        <Text style={styles.sectionTitle}>Dog sizes I'm comfortable with</Text>
        <View style={styles.chipRow}>
          {DOG_SIZES.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, dogSizes.includes(s) && styles.chipActive]}
              onPress={() => toggle(dogSizes, setDogSizes, s)}
            >
              <Text style={[styles.chipText, dogSizes.includes(s) && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: Colors.cream },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  backBtn:        { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon:       { fontSize: 22, color: Colors.navy },
  headerTitle:    { fontSize: 18, fontWeight: '700', color: Colors.navy },
  saveBtn:        { fontSize: 16, fontWeight: '700', color: Colors.teal },
  scroll:         { padding: 20, gap: 8 },
  sectionTitle:   { fontSize: 16, fontWeight: '700', color: Colors.navy, marginTop: 16, marginBottom: 4 },
  sectionSub:     { fontSize: 13, color: Colors.gray, marginBottom: 10 },
  iconGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  iconItem:       { alignItems: 'center', width: 76, padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white, gap: 4 },
  iconItemActive: { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  iconEmoji:      { fontSize: 26 },
  iconLabel:      { fontSize: 11, color: Colors.gray, textAlign: 'center', fontWeight: '500' },
  iconLabelActive:{ color: Colors.tealDark, fontWeight: '700' },
  radioRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white, marginBottom: 8 },
  radioRowActive: { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  radioCircle:    { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.sand, alignItems: 'center', justifyContent: 'center' },
  radioCircleActive: { borderColor: Colors.teal },
  radioDot:       { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.teal },
  radioLabel:     { fontSize: 15, color: Colors.navy, fontWeight: '500' },
  toggleRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.grayPale },
  toggleLabel:    { fontSize: 15, color: Colors.navy, fontWeight: '500', flex: 1, paddingRight: 12 },
  chipRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip:           { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white },
  chipActive:     { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  chipText:       { fontSize: 14, color: Colors.gray, fontWeight: '500' },
  chipTextActive: { color: Colors.tealDark, fontWeight: '700' },
})
