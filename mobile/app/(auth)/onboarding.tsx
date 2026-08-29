import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/colors'

const STEPS = [
  { key: 'role', title: 'How will you use Haven?', sub: 'You can always change this later.' },
  { key: 'pets', title: "What pets do you love?", sub: "We'll match you with sits that suit you." },
  { key: 'places', title: 'What home types?', sub: 'Select all that interest you.' },
  { key: 'remote', title: 'Any special needs?', sub: 'Helps us rank your matches.' },
  { key: 'done', title: "You're all set! 🎉", sub: 'Your profile is ready. Start exploring sits.' },
]

const PET_OPTIONS = [
  { id: 'dogs', icon: '🐕', label: 'Dogs' },
  { id: 'cats', icon: '🐈', label: 'Cats' },
  { id: 'birds', icon: '🦜', label: 'Birds' },
  { id: 'fish', icon: '🐠', label: 'Fish' },
  { id: 'rabbits', icon: '🐇', label: 'Rabbits' },
  { id: 'reptiles', icon: '🦎', label: 'Reptiles' },
  { id: 'farm', icon: '🐄', label: 'Farm animals' },
  { id: 'any', icon: '🐾', label: 'All animals!' },
]

const PLACE_OPTIONS = [
  { id: 'house', icon: '🏡', label: 'House' },
  { id: 'apartment', icon: '🏢', label: 'Apartment' },
  { id: 'cottage', icon: '🏘️', label: 'Cottage / cabin' },
  { id: 'farmhouse', icon: '🌾', label: 'Farmhouse' },
  { id: 'villa', icon: '🏰', label: 'Villa' },
  { id: 'boat', icon: '⛵', label: 'Boat / houseboat' },
]

export default function OnboardingScreen() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [role, setRole] = useState<string | null>(null)
  const [pets, setPets] = useState<string[]>([])
  const [places, setPlaces] = useState<string[]>([])
  const [remoteWork, setRemoteWork] = useState(false)
  const [noSmoking, setNoSmoking] = useState(false)
  const [noChildren, setNoChildren] = useState(false)

  const toggle = (arr: string[], set: (v: string[]) => void, id: string) => {
    set(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id])
  }

  const canNext = () => {
    if (step === 0) return !!role
    if (step === 1) return pets.length > 0
    if (step === 2) return places.length > 0
    return true
  }

  const stepData = STEPS[step]

  return (
    <SafeAreaView style={styles.safe}>
      {/* Progress dots */}
      <View style={styles.dots}>
        {STEPS.slice(0, -1).map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive, i < step && styles.dotDone]} />
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{stepData.title}</Text>
        <Text style={styles.sub}>{stepData.sub}</Text>

        {/* ─── Step 0: Role ─── */}
        {step === 0 && (
          <View style={styles.roleGrid}>
            {[
              { id: 'sitter', icon: '🧳', label: 'House sitter', desc: 'I want to sit for others' },
              { id: 'owner', icon: '🏡', label: 'Home owner', desc: 'I need someone to sit my home' },
              { id: 'both', icon: '🔄', label: 'Both', desc: 'I do both — sit and host' },
            ].map(r => (
              <TouchableOpacity
                key={r.id}
                style={[styles.roleCard, role === r.id && styles.roleCardSelected]}
                onPress={() => setRole(r.id)}
              >
                <Text style={styles.roleIcon}>{r.icon}</Text>
                <Text style={styles.roleLabel}>{r.label}</Text>
                <Text style={styles.roleDesc}>{r.desc}</Text>
                {role === r.id && <View style={styles.roleCheck}><Text style={{ color: Colors.white, fontSize: 11, fontWeight: '800' }}>✓</Text></View>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ─── Step 1: Pets ─── */}
        {step === 1 && (
          <View style={styles.chipGrid}>
            {PET_OPTIONS.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[styles.bigChip, pets.includes(p.id) && styles.bigChipSelected]}
                onPress={() => toggle(pets, setPets, p.id)}
              >
                <Text style={styles.bigChipIcon}>{p.icon}</Text>
                <Text style={[styles.bigChipLabel, pets.includes(p.id) && styles.bigChipLabelSelected]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ─── Step 2: Place types ─── */}
        {step === 2 && (
          <View style={styles.chipGrid}>
            {PLACE_OPTIONS.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[styles.bigChip, places.includes(p.id) && styles.bigChipSelected]}
                onPress={() => toggle(places, setPlaces, p.id)}
              >
                <Text style={styles.bigChipIcon}>{p.icon}</Text>
                <Text style={[styles.bigChipLabel, places.includes(p.id) && styles.bigChipLabelSelected]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ─── Step 3: Special needs ─── */}
        {step === 3 && (
          <View style={styles.toggleList}>
            {[
              { label: 'Remote work friendly', sub: 'Show only sits with fast WiFi + workspace', val: remoteWork, set: setRemoteWork },
              { label: 'No smoking household', sub: 'Filter out listings where smoking is allowed', val: noSmoking, set: setNoSmoking },
              { label: 'No young children', sub: 'Prefer quieter, adult-only homes', val: noChildren, set: setNoChildren },
            ].map(item => (
              <View key={item.label} style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleLabel}>{item.label}</Text>
                  <Text style={styles.toggleSub}>{item.sub}</Text>
                </View>
                <Switch
                  value={item.val}
                  onValueChange={item.set}
                  trackColor={{ true: Colors.teal, false: Colors.sand }}
                  thumbColor={Colors.white}
                />
              </View>
            ))}
            <Text style={styles.prefNote}>You can update these preferences anytime from your profile.</Text>
          </View>
        )}

        {/* ─── Step 4: Done ─── */}
        {step === 4 && (
          <View style={styles.doneWrap}>
            <Text style={styles.doneEmoji}>🎉</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Your preferences</Text>
              <Text style={styles.summaryItem}>Role: <Text style={styles.summaryVal}>{role === 'sitter' ? 'House sitter' : role === 'owner' ? 'Home owner' : 'Both'}</Text></Text>
              <Text style={styles.summaryItem}>Pets: <Text style={styles.summaryVal}>{pets.map(p => PET_OPTIONS.find(x => x.id === p)?.icon).join(' ')}</Text></Text>
              <Text style={styles.summaryItem}>Homes: <Text style={styles.summaryVal}>{places.map(p => PLACE_OPTIONS.find(x => x.id === p)?.label).join(', ')}</Text></Text>
              {remoteWork && <Text style={styles.summaryItem}>✓ Remote work friendly</Text>}
            </View>
            <Text style={styles.doneNote}>
              Haven will use these to calculate your Match Score on every listing — the better the match, the higher it ranks in your feed.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom buttons */}
      <View style={styles.bottom}>
        {step === 4 ? (
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => router.replace('/(tabs)/search')}
          >
            <Text style={styles.nextBtnText}>Start exploring sits →</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.btnRow}>
            {step > 0 && (
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(s => s - 1)}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.nextBtn, !canNext() && styles.nextBtnDisabled, step > 0 && { flex: 1 }]}
              onPress={() => canNext() && setStep(s => s + 1)}
              disabled={!canNext()}
            >
              <Text style={styles.nextBtnText}>Continue →</Text>
            </TouchableOpacity>
          </View>
        )}
        {step < 3 && (
          <TouchableOpacity style={styles.skipBtn} onPress={() => router.replace('/(tabs)/search')}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: 16, paddingBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.sand },
  dotActive: { backgroundColor: Colors.teal, width: 20 },
  dotDone: { backgroundColor: Colors.tealDark },
  scroll: { paddingHorizontal: 24, paddingBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.navy, letterSpacing: -0.5, marginBottom: 6, marginTop: 16 },
  sub: { fontSize: 15, color: Colors.gray, marginBottom: 24, lineHeight: 22 },
  roleGrid: { gap: 12 },
  roleCard: { backgroundColor: Colors.white, borderRadius: 18, padding: 18, borderWidth: 2, borderColor: 'transparent', position: 'relative' },
  roleCardSelected: { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  roleIcon: { fontSize: 32, marginBottom: 8 },
  roleLabel: { fontSize: 17, fontWeight: '800', color: Colors.navy, marginBottom: 2 },
  roleDesc: { fontSize: 13, color: Colors.gray },
  roleCheck: { position: 'absolute', top: 16, right: 16, width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bigChip: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 2, borderColor: 'transparent' },
  bigChipSelected: { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  bigChipIcon: { fontSize: 22 },
  bigChipLabel: { fontSize: 13, fontWeight: '700', color: Colors.gray },
  bigChipLabelSelected: { color: Colors.teal },
  toggleList: { gap: 10 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, padding: 14, gap: 12 },
  toggleLabel: { fontSize: 14, fontWeight: '700', color: Colors.navy },
  toggleSub: { fontSize: 11, color: Colors.gray, marginTop: 2 },
  prefNote: { fontSize: 12, color: Colors.grayLight, textAlign: 'center', marginTop: 12, lineHeight: 18 },
  doneWrap: { alignItems: 'center' },
  doneEmoji: { fontSize: 64, marginBottom: 16 },
  summaryCard: { backgroundColor: Colors.white, borderRadius: 18, padding: 18, width: '100%', marginBottom: 16 },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: Colors.navy, marginBottom: 10 },
  summaryItem: { fontSize: 13, color: Colors.gray, marginBottom: 5 },
  summaryVal: { fontWeight: '700', color: Colors.navy },
  doneNote: { fontSize: 13, color: Colors.gray, textAlign: 'center', lineHeight: 20 },
  bottom: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 },
  btnRow: { flexDirection: 'row', gap: 10 },
  backBtn: { paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white },
  backBtnText: { fontSize: 15, fontWeight: '700', color: Colors.navy },
  nextBtn: { flex: 1, backgroundColor: Colors.teal, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  nextBtnDisabled: { backgroundColor: Colors.grayLight },
  nextBtnText: { fontSize: 16, fontWeight: '800', color: Colors.white },
  skipBtn: { alignItems: 'center', paddingTop: 12 },
  skipText: { fontSize: 14, color: Colors.grayLight },
})
