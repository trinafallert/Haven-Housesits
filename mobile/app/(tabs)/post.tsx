import { useState } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Shadows } from '@/constants/colors'

const SIT_TYPES = [
  { id: 'standard', label: 'Standard', desc: 'Free sit exchange', icon: '🏡', color: '#E0F2F1' },
  { id: 'paid', label: 'Paid', desc: 'Compensate the sitter', icon: '💰', color: '#FEF3C7' },
  { id: 'long-term', label: 'Long-term', desc: '3+ months', icon: '📅', color: '#EDE9FE' },
  { id: 'vacant', label: 'Vacant home', desc: 'No pets, check-in only', icon: '🔑', color: '#FCE7F3' },
]

const PET_TYPES = [
  { id: 'dogs', icon: '🐕', label: 'Dogs' },
  { id: 'cats', icon: '🐈', label: 'Cats' },
  { id: 'birds', icon: '🦜', label: 'Birds' },
  { id: 'fish', icon: '🐠', label: 'Fish' },
  { id: 'rabbits', icon: '🐇', label: 'Rabbits' },
  { id: 'reptiles', icon: '🦎', label: 'Reptiles' },
  { id: 'other', icon: '🐾', label: 'Other' },
]

const STEPS = ['Sit type', 'Dates & location', 'Pets', 'Details']

export default function PostSitScreen() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [sitType, setSitType] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedPets, setSelectedPets] = useState<string[]>([])
  const [petCount, setPetCount] = useState(1)
  const [description, setDescription] = useState('')
  const [amenities, setAmenities] = useState<string[]>([])
  const [paidAmount, setPaidAmount] = useState('')
  const [maxApplicants, setMaxApplicants] = useState(10)
  const [remoteWorkFriendly, setRemoteWorkFriendly] = useState(false)
  const [dogWalkRequired, setDogWalkRequired] = useState(false)

  const AMENITY_LIST = ['WiFi', 'Pool', 'Garden', 'Parking', 'EV Charger', 'Hot tub', 'Gym', 'Piano', 'Sea view', 'Mountain view']

  const togglePet = (id: string) => {
    setSelectedPets(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const toggleAmenity = (a: string) => {
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  const canNext = () => {
    if (step === 0) return !!sitType
    if (step === 1) return title.length > 3 && location.length > 2 && startDate && endDate
    if (step === 2) return selectedPets.length > 0
    return description.length >= 50
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Post a sit</Text>
        <Text style={styles.stepLabel}>Step {step + 1} of {STEPS.length}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressWrap}>
        <View style={[styles.progressFill, { width: `${((step + 1) / STEPS.length) * 100}%` as any }]} />
      </View>

      {/* Step tabs */}
      <View style={styles.stepTabs}>
        {STEPS.map((s, i) => (
          <TouchableOpacity
            key={s}
            style={[styles.stepTab, i === step && styles.stepTabActive]}
            onPress={() => i < step && setStep(i)}
          >
            <Text style={[styles.stepTabText, i === step && styles.stepTabTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* ─── Step 0: Sit type ─── */}
        {step === 0 && (
          <View>
            <Text style={styles.sectionTitle}>What type of sit is this?</Text>
            <Text style={styles.sectionSub}>This helps sitters find the right fit.</Text>
            <View style={styles.typeGrid}>
              {SIT_TYPES.map(t => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.typeCard, { backgroundColor: t.color }, sitType === t.id && styles.typeCardSelected]}
                  onPress={() => setSitType(t.id)}
                >
                  <Text style={styles.typeIcon}>{t.icon}</Text>
                  <Text style={styles.typeLabel}>{t.label}</Text>
                  <Text style={styles.typeDesc}>{t.desc}</Text>
                  {sitType === t.id && (
                    <View style={styles.typeCheck}>
                      <Text style={{ color: Colors.white, fontSize: 10, fontWeight: '700' }}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {sitType === 'paid' && (
              <View style={styles.paidSection}>
                <Text style={styles.fieldLabel}>Compensation per day (USD)</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.inputInline}
                    value={paidAmount}
                    onChangeText={setPaidAmount}
                    placeholder="25"
                    keyboardType="numeric"
                    placeholderTextColor={Colors.grayLight}
                  />
                </View>
                <Text style={styles.fieldHint}>Haven fee of 8% applies. Most paid sits range $20–$60/day.</Text>
              </View>
            )}
          </View>
        )}

        {/* ─── Step 1: Dates & location ─── */}
        {step === 1 && (
          <View>
            <Text style={styles.sectionTitle}>Where and when?</Text>

            <Text style={styles.fieldLabel}>Listing title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Cozy Bungalow in Austin — 2 friendly dogs"
              placeholderTextColor={Colors.grayLight}
              maxLength={80}
            />
            <Text style={styles.charCount}>{title.length}/80</Text>

            <Text style={styles.fieldLabel}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="City, State / City, Country"
              placeholderTextColor={Colors.grayLight}
            />
            <Text style={styles.fieldHint}>We show a neighbourhood pin — your exact address stays private until confirmed.</Text>

            <View style={styles.dateRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Start date</Text>
                <TextInput
                  style={styles.input}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.grayLight}
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>End date</Text>
                <TextInput
                  style={styles.input}
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.grayLight}
                />
              </View>
            </View>

            {/* Max applicants */}
            <Text style={styles.fieldLabel}>Max applicants: <Text style={{ color: Colors.teal, fontWeight: '700' }}>{maxApplicants}</Text></Text>
            <View style={styles.sliderRow}>
              <TouchableOpacity style={styles.sliderBtn} onPress={() => setMaxApplicants(v => Math.max(5, v - 1))}>
                <Text style={styles.sliderBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${((maxApplicants - 5) / 10) * 100}%` as any }]} />
              </View>
              <TouchableOpacity style={styles.sliderBtn} onPress={() => setMaxApplicants(v => Math.min(15, v + 1))}>
                <Text style={styles.sliderBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.fieldHint}>Listing closes automatically when this limit is reached (5–15).</Text>
          </View>
        )}

        {/* ─── Step 2: Pets ─── */}
        {step === 2 && (
          <View>
            <Text style={styles.sectionTitle}>Tell us about your pets</Text>

            <Text style={styles.fieldLabel}>Pet types (select all that apply)</Text>
            <View style={styles.petGrid}>
              {PET_TYPES.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.petChip, selectedPets.includes(p.id) && styles.petChipSelected]}
                  onPress={() => togglePet(p.id)}
                >
                  <Text style={styles.petChipIcon}>{p.icon}</Text>
                  <Text style={[styles.petChipLabel, selectedPets.includes(p.id) && styles.petChipLabelSelected]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Number of pets</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity style={styles.counterBtn} onPress={() => setPetCount(v => Math.max(1, v - 1))}>
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterVal}>{petCount}</Text>
              <TouchableOpacity style={styles.counterBtn} onPress={() => setPetCount(v => v + 1)}>
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            {selectedPets.includes('dogs') && (
              <View style={styles.toggleRow}>
                <View>
                  <Text style={styles.toggleLabel}>Daily walks required?</Text>
                  <Text style={styles.toggleSub}>Sitters with confirmed walk experience are prioritised</Text>
                </View>
                <Switch
                  value={dogWalkRequired}
                  onValueChange={setDogWalkRequired}
                  trackColor={{ true: Colors.teal, false: Colors.sand }}
                  thumbColor={Colors.white}
                />
              </View>
            )}

            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>Remote work friendly?</Text>
                <Text style={styles.toggleSub}>Fast WiFi + quiet workspace available</Text>
              </View>
              <Switch
                value={remoteWorkFriendly}
                onValueChange={setRemoteWorkFriendly}
                trackColor={{ true: Colors.teal, false: Colors.sand }}
                thumbColor={Colors.white}
              />
            </View>
          </View>
        )}

        {/* ─── Step 3: Details ─── */}
        {step === 3 && (
          <View>
            <Text style={styles.sectionTitle}>Add the finishing details</Text>

            <Text style={styles.fieldLabel}>Description <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your home, neighbourhood, pets' personalities and what you're looking for in a sitter..."
              placeholderTextColor={Colors.grayLight}
              multiline
              textAlignVertical="top"
              maxLength={2000}
            />
            <Text style={[styles.charCount, description.length < 50 && styles.charCountWarn]}>
              {description.length}/2000 {description.length < 50 ? `(min 50)` : '✓'}
            </Text>

            <Text style={styles.fieldLabel}>Home amenities</Text>
            <View style={styles.amenityGrid}>
              {AMENITY_LIST.map(a => (
                <TouchableOpacity
                  key={a}
                  style={[styles.amenityChip, amenities.includes(a) && styles.amenityChipSelected]}
                  onPress={() => toggleAmenity(a)}
                >
                  <Text style={[styles.amenityText, amenities.includes(a) && styles.amenityTextSelected]}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.previewBox}>
              <Text style={styles.previewTitle}>📋 Listing preview</Text>
              <Text style={styles.previewItem}>Type: <Text style={styles.previewVal}>{sitType ? SIT_TYPES.find(t => t.id === sitType)?.label : '—'}</Text></Text>
              <Text style={styles.previewItem}>Title: <Text style={styles.previewVal}>{title || '—'}</Text></Text>
              <Text style={styles.previewItem}>Location: <Text style={styles.previewVal}>{location || '—'}</Text></Text>
              <Text style={styles.previewItem}>Dates: <Text style={styles.previewVal}>{startDate && endDate ? `${startDate} → ${endDate}` : '—'}</Text></Text>
              <Text style={styles.previewItem}>Pets: <Text style={styles.previewVal}>{selectedPets.length ? selectedPets.map(p => PET_TYPES.find(x => x.id === p)?.icon).join(' ') : '—'}</Text></Text>
            </View>
          </View>
        )}

        {/* Bottom CTA */}
        <View style={styles.ctaRow}>
          {step > 0 && (
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(s => s - 1)}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextBtn, !canNext() && styles.nextBtnDisabled, step > 0 && { flex: 1 }]}
            onPress={() => {
              if (!canNext()) return
              if (step < STEPS.length - 1) {
                setStep(s => s + 1)
              } else {
                // Submit listing
                router.replace('/(tabs)/search')
              }
            }}
            disabled={!canNext()}
          >
            <Text style={styles.nextBtnText}>
              {step === STEPS.length - 1 ? '🚀 Publish listing' : 'Continue →'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.navy, letterSpacing: -0.5 },
  stepLabel: { fontSize: 13, fontWeight: '600', color: Colors.teal },
  progressWrap: { height: 4, backgroundColor: Colors.sand, marginHorizontal: 20, borderRadius: 2, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: '100%', backgroundColor: Colors.teal, borderRadius: 2 },
  stepTabs: { flexDirection: 'row', paddingHorizontal: 20, gap: 6, marginBottom: 16 },
  stepTab: { flex: 1, paddingVertical: 6, borderRadius: 8, backgroundColor: Colors.sand, alignItems: 'center' },
  stepTabActive: { backgroundColor: Colors.teal },
  stepTabText: { fontSize: 10, fontWeight: '600', color: Colors.gray },
  stepTabTextActive: { color: Colors.white },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.navy, marginBottom: 4, letterSpacing: -0.3 },
  sectionSub: { fontSize: 14, color: Colors.gray, marginBottom: 16 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  typeCard: { width: '47%', borderRadius: 16, padding: 16, position: 'relative', borderWidth: 2, borderColor: 'transparent' },
  typeCardSelected: { borderColor: Colors.teal },
  typeIcon: { fontSize: 28, marginBottom: 8 },
  typeLabel: { fontSize: 15, fontWeight: '800', color: Colors.navy, marginBottom: 2 },
  typeDesc: { fontSize: 12, color: Colors.gray },
  typeCheck: { position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  paidSection: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, ...Shadows.card },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: Colors.navy, marginBottom: 6, marginTop: 14 },
  fieldHint: { fontSize: 11, color: Colors.grayLight, marginTop: 4, lineHeight: 16 },
  required: { color: Colors.red },
  input: { backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.navy, borderWidth: 1, borderColor: Colors.sand, ...Shadows.card },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1, borderColor: Colors.sand, paddingHorizontal: 14, ...Shadows.card },
  currencySymbol: { fontSize: 16, fontWeight: '700', color: Colors.navy, marginRight: 4 },
  inputInline: { flex: 1, paddingVertical: 12, fontSize: 14, color: Colors.navy },
  textArea: { minHeight: 120, paddingTop: 12 },
  charCount: { fontSize: 11, color: Colors.grayLight, textAlign: 'right', marginTop: 4 },
  charCountWarn: { color: Colors.red },
  dateRow: { flexDirection: 'row', marginTop: 4 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  sliderBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.tealPale, alignItems: 'center', justifyContent: 'center' },
  sliderBtnText: { fontSize: 18, fontWeight: '700', color: Colors.teal },
  sliderTrack: { flex: 1, height: 6, backgroundColor: Colors.sand, borderRadius: 3, overflow: 'hidden' },
  sliderFill: { height: '100%', backgroundColor: Colors.teal, borderRadius: 3 },
  petGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  petChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.sand },
  petChipSelected: { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  petChipIcon: { fontSize: 16 },
  petChipLabel: { fontSize: 13, fontWeight: '600', color: Colors.gray },
  petChipLabelSelected: { color: Colors.teal },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginVertical: 8 },
  counterBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.tealPale, alignItems: 'center', justifyContent: 'center' },
  counterBtnText: { fontSize: 20, fontWeight: '700', color: Colors.teal },
  counterVal: { fontSize: 22, fontWeight: '800', color: Colors.navy, minWidth: 30, textAlign: 'center' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginTop: 10, ...Shadows.card },
  toggleLabel: { fontSize: 14, fontWeight: '700', color: Colors.navy },
  toggleSub: { fontSize: 11, color: Colors.gray, marginTop: 2 },
  amenityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  amenityChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.sand },
  amenityChipSelected: { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  amenityText: { fontSize: 13, fontWeight: '600', color: Colors.gray },
  amenityTextSelected: { color: Colors.teal },
  previewBox: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginTop: 8, borderWidth: 1, borderColor: Colors.sand },
  previewTitle: { fontSize: 13, fontWeight: '700', color: Colors.navy, marginBottom: 8 },
  previewItem: { fontSize: 12, color: Colors.gray, marginBottom: 3 },
  previewVal: { color: Colors.navy, fontWeight: '600' },
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 24 },
  backBtn: { paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white },
  backBtnText: { fontSize: 15, fontWeight: '700', color: Colors.navy },
  nextBtn: { flex: 1, backgroundColor: Colors.teal, borderRadius: 14, paddingVertical: 16, alignItems: 'center', ...Shadows.card },
  nextBtnDisabled: { backgroundColor: Colors.grayLight },
  nextBtnText: { fontSize: 15, fontWeight: '800', color: Colors.white },
})
