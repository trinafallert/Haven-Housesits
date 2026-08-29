import { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Switch, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Colors, Shadows } from '@/constants/colors'
import { useCreateListing } from '@/src/hooks'

const PET_OPTIONS = [
  { key: 'DOG',       label: 'Dog',       icon: '🐕' },
  { key: 'CAT',       label: 'Cat',       icon: '🐈' },
  { key: 'BIRD',      label: 'Bird',      icon: '🦜' },
  { key: 'FISH',      label: 'Fish',      icon: '🐠' },
  { key: 'REPTILE',   label: 'Reptile',   icon: '🦎' },
  { key: 'HORSE',     label: 'Horse',     icon: '🐴' },
  { key: 'SMALL_PET', label: 'Small pet', icon: '🐹' },
  { key: 'POULTRY',   label: 'Poultry',   icon: '🐔' },
]

const HOME_TYPE_MAP: Record<string, string> = {
  'House': 'HOUSE', 'Apartment': 'APARTMENT', 'Farm': 'RURAL', 'Unique stay': 'OTHER',
}
const HOME_TYPES = Object.keys(HOME_TYPE_MAP)

const ADD_ON_OPTIONS = [
  { id: 'deep_clean', icon: '🧹', label: 'Deep Clean',        price: 45 },
  { id: 'pet_photos', icon: '📸', label: 'Pet Photo Updates', price: 25 },
  { id: 'grocery',    icon: '🛒', label: 'Grocery Stocking',  price: 30 },
  { id: 'plant_care', icon: '🪴', label: 'Plant Care',        price: 15 },
]

const STEPS = ['Sit type', 'Details', 'Pets & Home', 'Add-ons', 'Review']

function parseLocation(raw: string): { city: string; state: string; country: string } {
  const parts = raw.split(',').map(s => s.trim())
  return {
    city:    parts[0] ?? raw,
    state:   parts[1] ?? parts[0] ?? '',
    country: (parts[2] ?? 'US').slice(0, 2).toUpperCase() || 'US',
  }
}

function parseDateToISO(raw: string): string {
  const d = new Date(raw)
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

export default function PostListingScreen() {
  const router = useRouter()
  const createListing = useCreateListing()
  const [step, setStep]       = useState(0)
  const [published, setPublished] = useState(false)
  const [sitType,    setSitType]  = useState<'FREE' | 'PAID' | 'VACANT'>('FREE')
  const [dailyRate,  setDailyRate]  = useState('')
  const [title,      setTitle]      = useState('')
  const [location,   setLocation]   = useState('')
  const [startDate,  setStartDate]  = useState('')
  const [endDate,    setEndDate]    = useState('')
  const [description,setDesc]       = useState('')
  const [pets,       setPets]       = useState<string[]>([])
  const [homeType,   setHomeType]   = useState('House')
  const [hasWifi,    setHasWifi]    = useState(true)
  const [hasCar,     setHasCar]     = useState(false)
  const [hasPool,    setHasPool]    = useState(false)
  const [enabledAddOns, setEnabledAddOns] = useState<string[]>([])

  const togglePet   = (k: string) => setPets(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k])
  const toggleAddOn = (k: string) => setEnabledAddOns(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k])

  const canNext = () => {
    if (step === 1) return title.length > 3 && location.length > 2 && startDate.length > 4 && endDate.length > 4
    return true
  }

  const handlePublish = () => {
    const loc = parseLocation(location)
    createListing.mutate(
      {
        title:       title.trim(),
        description: description.trim() || `${sitType === 'PAID' ? 'Paid' : 'Free exchange'} sit in ${loc.city}. Looking for a caring, responsible sitter.`,
        sitType:     sitType === 'VACANT' ? 'FREE' : sitType,
        homeType:    HOME_TYPE_MAP[homeType] as any,
        city:        loc.city,
        state:       loc.state || loc.city,
        country:     loc.country,
        startDate:   parseDateToISO(startDate),
        endDate:     parseDateToISO(endDate),
        dailyRate:   sitType === 'PAID' ? parseFloat(dailyRate) || 0 : undefined,
        bedrooms:    1,
        bathrooms:   1,
        hasWifi,
        hasParking:  hasCar,
        hasPool,
        pets: pets.map(type => ({ type, name: type.charAt(0) + type.slice(1).toLowerCase() })),
      },
      {
        onSuccess: () => setPublished(true),
        onError: (err: any) => Alert.alert('Could not post', err?.message ?? 'Please check your connection and try again.'),
      }
    )
  }

  if (published) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successScreen}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Your sit is live!</Text>
          <Text style={styles.successSub}>Sitters can now find and apply to your listing.</Text>
          <TouchableOpacity style={styles.successBtn} onPress={() => { setPublished(false); setStep(0); router.replace('/(tabs)/search') }}>
            <Text style={styles.successBtnText}>Browse sitters →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.successBtnSecondary} onPress={() => { setPublished(false); setStep(0) }}>
            <Text style={styles.successBtnSecondaryText}>Post another sit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const stepContent = () => {
    switch (step) {
      case 0: return (
        <View style={styles.stepBody}>
          <Text style={styles.stepTitle}>What kind of sit is this?</Text>
          <Text style={styles.stepSub}>Choose how you want to offer your sit</Text>
          {([
            { key: 'FREE',   icon: '🤝', label: 'Free exchange',  desc: 'Sitter stays free in exchange for pet care' },
            { key: 'PAID',   icon: '💰', label: 'Paid sit',       desc: 'Pay a sitter a daily rate for their help' },
            { key: 'VACANT', icon: '🏠', label: 'Vacant house',   desc: 'No pets — just need someone to watch your home' },
          ] as const).map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.typeCard, sitType === t.key && styles.typeCardActive]}
              onPress={() => setSitType(t.key)}
            >
              <Text style={styles.typeIcon}>{t.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.typeLabel, sitType === t.key && styles.typeLabelActive]}>{t.label}</Text>
                <Text style={styles.typeDesc}>{t.desc}</Text>
              </View>
              <View style={[styles.radioCircle, sitType === t.key && styles.radioCircleActive]}>
                {sitType === t.key && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
          {sitType === 'PAID' && (
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Daily rate (USD) *</Text>
              <TextInput style={styles.input} value={dailyRate} onChangeText={setDailyRate} keyboardType="numeric" placeholder="e.g. 75" placeholderTextColor={Colors.grayLight} />
            </View>
          )}
        </View>
      )

      case 1: return (
        <View style={styles.stepBody}>
          <Text style={styles.stepTitle}>Listing details</Text>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Listing title *</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Cozy beachside home with two cats" placeholderTextColor={Colors.grayLight} />
          </View>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Location * (City, State, 2-letter country code)</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Austin, TX, US" placeholderTextColor={Colors.grayLight} />
          </View>
          <View style={styles.dateRow}>
            <View style={[styles.fieldWrap, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Start date *</Text>
              <TextInput style={styles.input} value={startDate} onChangeText={setStartDate} placeholder="Mar 15 2026" placeholderTextColor={Colors.grayLight} />
            </View>
            <View style={[styles.fieldWrap, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>End date *</Text>
              <TextInput style={styles.input} value={endDate} onChangeText={setEndDate} placeholder="Apr 10 2026" placeholderTextColor={Colors.grayLight} />
            </View>
          </View>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDesc} multiline numberOfLines={4} placeholder="Tell sitters about your home, pets, neighbourhood..." placeholderTextColor={Colors.grayLight} />
          </View>
        </View>
      )

      case 2: return (
        <View style={styles.stepBody}>
          <Text style={styles.stepTitle}>Pets & home details</Text>
          <Text style={styles.fieldLabel}>Pets that need care</Text>
          <View style={styles.iconGrid}>
            {PET_OPTIONS.map(p => (
              <TouchableOpacity key={p.key} style={[styles.iconItem, pets.includes(p.key) && styles.iconItemActive]} onPress={() => togglePet(p.key)}>
                <Text style={styles.iconEmoji}>{p.icon}</Text>
                <Text style={[styles.iconLabel, pets.includes(p.key) && styles.iconLabelActive]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Home type</Text>
          <View style={styles.chipRow}>
            {HOME_TYPES.map(h => (
              <TouchableOpacity key={h} style={[styles.chip, homeType === h && styles.chipActive]} onPress={() => setHomeType(h)}>
                <Text style={[styles.chipText, homeType === h && styles.chipTextActive]}>{h}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Amenities</Text>
          {[
            { label: '📶 High-speed wifi',          state: hasWifi, set: setHasWifi },
            { label: '🚗 Car available for sitter', state: hasCar,  set: setHasCar },
            { label: '🏊 Pool',                     state: hasPool, set: setHasPool },
          ].map(({ label, state, set }) => (
            <View key={label} style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{label}</Text>
              <Switch value={state} onValueChange={set} trackColor={{ false: Colors.sand, true: Colors.teal }} thumbColor={Colors.white} />
            </View>
          ))}
        </View>
      )

      case 3: return (
        <View style={styles.stepBody}>
          <Text style={styles.stepTitle}>Add-ons marketplace</Text>
          <Text style={styles.stepSub}>Let sitters offer these paid extras to stand out in applications</Text>
          {ADD_ON_OPTIONS.map(a => (
            <View key={a.id} style={styles.addOnRow}>
              <View style={styles.addOnIcon}><Text style={{ fontSize: 22 }}>{a.icon}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.addOnLabel}>{a.label}</Text>
                <Text style={styles.addOnPrice}>+${a.price} per sit</Text>
              </View>
              <Switch value={enabledAddOns.includes(a.id)} onValueChange={() => toggleAddOn(a.id)} trackColor={{ false: Colors.sand, true: Colors.teal }} thumbColor={Colors.white} />
            </View>
          ))}
        </View>
      )

      case 4: return (
        <View style={styles.stepBody}>
          <Text style={styles.stepTitle}>Review & publish</Text>
          {[
            { label: 'Sit type', value: `${sitType}${sitType === 'PAID' ? ` · $${dailyRate}/day` : ''}` },
            { label: 'Title',    value: title || '—' },
            { label: 'Location', value: location || '—' },
            { label: 'Dates',    value: `${startDate} → ${endDate}` },
            { label: 'Pets',     value: pets.length > 0 ? pets.map(p => PET_OPTIONS.find(x => x.key === p)?.icon).join(' ') : 'None (vacant)' },
            { label: 'Home',     value: homeType },
          ].map(({ label, value }) => (
            <View key={label} style={styles.reviewCard}>
              <Text style={styles.reviewLabel}>{label}</Text>
              <Text style={styles.reviewValue} numberOfLines={1}>{value}</Text>
            </View>
          ))}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>🎉 Your listing will be live immediately and visible to sitters globally!</Text>
          </View>
        </View>
      )
      default: return null
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        {step > 0
          ? <TouchableOpacity onPress={() => setStep(s => s - 1)}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
          : <View style={{ width: 40 }} />
        }
        <Text style={styles.headerTitle}>Post a sit</Text>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.cancelBtn}>Cancel</Text></TouchableOpacity>
      </View>

      <View style={styles.progressWrap}>
        {STEPS.map((s, i) => <View key={i} style={[styles.progressStep, i <= step && styles.progressStepActive]} />)}
      </View>
      <Text style={styles.progressLabel}>{STEPS[step]} · Step {step + 1} of {STEPS.length}</Text>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {stepContent()}
        </ScrollView>
        <View style={styles.footer}>
          {step < STEPS.length - 1 ? (
            <TouchableOpacity style={[styles.nextBtn, !canNext() && styles.nextBtnDisabled]} disabled={!canNext()} onPress={() => setStep(s => s + 1)}>
              <Text style={styles.nextBtnText}>Continue →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.publishBtn, createListing.isPending && { opacity: 0.6 }]}
              disabled={createListing.isPending}
              onPress={handlePublish}
            >
              {createListing.isPending
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={styles.publishBtnText}>🚀 Publish listing</Text>
              }
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const C = Colors, S = Shadows
const styles = StyleSheet.create({
  safe:                    { flex: 1, backgroundColor: C.cream },
  successScreen:           { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16 },
  successEmoji:            { fontSize: 64 },
  successTitle:            { fontSize: 28, fontWeight: '800', color: C.navy, textAlign: 'center' },
  successSub:              { fontSize: 15, color: C.gray, textAlign: 'center', lineHeight: 22 },
  successBtn:              { backgroundColor: C.teal, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 16, marginTop: 8 },
  successBtnText:          { color: C.white, fontSize: 16, fontWeight: '700' },
  successBtnSecondary:     { paddingVertical: 10 },
  successBtnSecondaryText: { color: C.teal, fontSize: 15, fontWeight: '600' },
  header:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.sand },
  backBtn:            { fontSize: 22, color: C.navy, padding: 4 },
  headerTitle:        { fontSize: 17, fontWeight: '700', color: C.navy },
  cancelBtn:          { fontSize: 15, color: C.gray },
  progressWrap:       { flexDirection: 'row', gap: 4, paddingHorizontal: 16, paddingTop: 12 },
  progressStep:       { flex: 1, height: 4, borderRadius: 2, backgroundColor: C.sand },
  progressStepActive: { backgroundColor: C.teal },
  progressLabel:      { fontSize: 12, color: C.gray, paddingHorizontal: 16, paddingTop: 6, marginBottom: 4 },
  stepBody:           { padding: 20, gap: 14 },
  stepTitle:          { fontSize: 20, fontWeight: '800', color: C.navy },
  stepSub:            { fontSize: 14, color: C.gray, marginTop: -8 },
  typeCard:           { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, borderWidth: 1.5, borderColor: C.sand, backgroundColor: C.white },
  typeCardActive:     { borderColor: C.teal, backgroundColor: C.tealPale },
  typeIcon:           { fontSize: 28 },
  typeLabel:          { fontSize: 15, fontWeight: '700', color: C.navy },
  typeLabelActive:    { color: C.tealDark },
  typeDesc:           { fontSize: 13, color: C.gray, marginTop: 2 },
  radioCircle:        { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: C.sand, alignItems: 'center', justifyContent: 'center' },
  radioCircleActive:  { borderColor: C.teal },
  radioDot:           { width: 10, height: 10, borderRadius: 5, backgroundColor: C.teal },
  fieldWrap:          { gap: 6 },
  fieldLabel:         { fontSize: 14, fontWeight: '600', color: C.navy },
  input:              { backgroundColor: C.white, borderRadius: 12, padding: 12, fontSize: 15, color: C.navy, borderWidth: 1, borderColor: C.sand },
  textArea:           { minHeight: 100, textAlignVertical: 'top' },
  dateRow:            { flexDirection: 'row', gap: 12 },
  iconGrid:           { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  iconItem:           { alignItems: 'center', width: 80, padding: 10, borderRadius: 12, borderWidth: 1.5, borderColor: C.sand, backgroundColor: C.white, gap: 4 },
  iconItemActive:     { borderColor: C.teal, backgroundColor: C.tealPale },
  iconEmoji:          { fontSize: 24 },
  iconLabel:          { fontSize: 11, color: C.gray, textAlign: 'center' },
  iconLabelActive:    { color: C.tealDark, fontWeight: '700' },
  chipRow:            { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:               { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: C.sand, backgroundColor: C.white },
  chipActive:         { borderColor: C.teal, backgroundColor: C.tealPale },
  chipText:           { fontSize: 14, color: C.gray },
  chipTextActive:     { color: C.tealDark, fontWeight: '700' },
  toggleRow:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.grayPale },
  toggleLabel:        { fontSize: 15, color: C.navy },
  addOnRow:           { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 14, padding: 14, ...S.card },
  addOnIcon:          { width: 44, height: 44, borderRadius: 12, backgroundColor: C.tealPale, alignItems: 'center', justifyContent: 'center' },
  addOnLabel:         { fontSize: 14, fontWeight: '700', color: C.navy },
  addOnPrice:         { fontSize: 13, color: '#10B981', fontWeight: '600' },
  reviewCard:         { backgroundColor: C.white, borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', ...S.card },
  reviewLabel:        { fontSize: 14, color: C.gray },
  reviewValue:        { fontSize: 14, fontWeight: '600', color: C.navy, maxWidth: '60%', textAlign: 'right' },
  infoBox:            { backgroundColor: C.tealPale, borderRadius: 14, padding: 14 },
  infoText:           { fontSize: 14, color: C.tealDark },
  footer:             { padding: 20, borderTopWidth: 1, borderTopColor: C.sand, backgroundColor: C.white },
  nextBtn:            { backgroundColor: C.teal, borderRadius: 14, paddingVertical: 16, alignItems: 'center', ...S.card },
  nextBtnDisabled:    { backgroundColor: C.grayLight },
  nextBtnText:        { color: C.white, fontSize: 16, fontWeight: '700' },
  publishBtn:         { backgroundColor: C.navy, borderRadius: 14, paddingVertical: 16, alignItems: 'center', ...S.strong },
  publishBtnText:     { color: C.white, fontSize: 16, fontWeight: '700' },
})
