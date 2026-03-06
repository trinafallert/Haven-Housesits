import { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { Colors, Shadows } from '@/constants/colors'

const GENDERS = ['Prefer not to say', 'Male', 'Female', 'Non-binary', 'Other']
const OCCUPATIONS = ['Employed full-time', 'Employed part-time', 'Self-employed', 'Student', 'Retired', 'Other']

const SECTIONS = [
  { key: 'details',       label: 'Profile details',   icon: '👤', complete: true },
  { key: 'about',         label: 'About you',         icon: '✏️', complete: true },
  { key: 'experience',    label: 'Experience',        icon: '🐾', complete: false },
  { key: 'preferences',   label: 'Preferences',       icon: '⚙️', complete: false },
  { key: 'verifications', label: 'Verifications',     icon: '🛡️', complete: true },
  { key: 'availability',  label: 'Availability',      icon: '📅', complete: false },
  { key: 'references',    label: 'References',        icon: '⭐', complete: false },
]

export default function EditProfileScreen() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // Profile details state
  const [firstName, setFirstName]   = useState('Trina')
  const [lastName,  setLastName]    = useState('Fallert')
  const [headline,  setHeadline]    = useState('Experienced pet lover & remote worker 🌿')
  const [intro,     setIntro]       = useState('')
  const [whySit,    setWhySit]      = useState('')
  const [location,  setLocation]    = useState('Austin, TX')
  const [gender,    setGender]      = useState('Prefer not to say')
  const [occupation, setOccupation] = useState('Employed full-time')
  const [jobTitle,  setJobTitle]    = useState('')

  const completedCount = SECTIONS.filter(s => s.complete).length
  const progress = completedCount / SECTIONS.length

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.saveBtn}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Status + progress */}
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Your profile is live ✓</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.progressLabel}>{completedCount} of {SECTIONS.length} sections complete</Text>
          </View>

          {/* Sections list */}
          <Text style={styles.sectionHeader}>Profile sections</Text>
          {SECTIONS.map(s => (
            <TouchableOpacity
              key={s.key}
              style={styles.sectionRow}
              onPress={() => {
                if (s.key === 'preferences')    router.push('/profile/edit-preferences')
                else if (s.key === 'availability') router.push('/profile/edit-availability')
                else if (s.key === 'references')  router.push('/profile/edit-references')
                else if (s.key === 'verifications') router.push('/profile/edit-verification')
                else setActiveSection(activeSection === s.key ? null : s.key)
              }}
            >
              <View style={styles.sectionIcon}>
                <Text style={{ fontSize: 20 }}>{s.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionLabel}>{s.label}</Text>
                <Text style={styles.sectionStatus}>
                  {s.complete ? '✓ Complete' : 'Incomplete — tap to edit'}
                </Text>
              </View>
              <Text style={[styles.sectionCheck, { color: s.complete ? Colors.teal : Colors.sand }]}>
                {s.complete ? '●' : '○'}
              </Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}

          {/* Inline editor for basic fields */}
          {activeSection === 'details' && (
            <View style={styles.inlineEditor}>
              <Text style={styles.editorTitle}>Profile details</Text>
              {[
                { label: 'First name', value: firstName, set: setFirstName },
                { label: 'Last name',  value: lastName,  set: setLastName },
                { label: 'Location',   value: location,  set: setLocation },
                { label: 'Job title',  value: jobTitle,  set: setJobTitle },
              ].map(f => (
                <View key={f.label} style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>{f.label}</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={f.value}
                    onChangeText={f.set}
                    placeholderTextColor={Colors.grayLight}
                  />
                </View>
              ))}

              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {GENDERS.map(g => (
                      <TouchableOpacity
                        key={g}
                        style={[styles.chip, gender === g && styles.chipActive]}
                        onPress={() => setGender(g)}
                      >
                        <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Occupation</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {OCCUPATIONS.map(o => (
                      <TouchableOpacity
                        key={o}
                        style={[styles.chip, occupation === o && styles.chipActive]}
                        onPress={() => setOccupation(o)}
                      >
                        <Text style={[styles.chipText, occupation === o && styles.chipTextActive]}>{o}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          )}

          {activeSection === 'about' && (
            <View style={styles.inlineEditor}>
              <Text style={styles.editorTitle}>About you</Text>

              {/* Avatar */}
              <View style={styles.avatarRow}>
                <Image
                  source={{ uri: 'https://randomuser.me/api/portraits/women/68.jpg' }}
                  style={styles.avatarPreview}
                  contentFit="cover"
                />
                <TouchableOpacity style={styles.changePhotoBtn}>
                  <Text style={styles.changePhotoText}>Change photo</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Profile headline <Text style={styles.charCount}>{headline.length}/80</Text></Text>
                <TextInput
                  style={styles.fieldInput}
                  value={headline}
                  onChangeText={v => v.length <= 80 && setHeadline(v)}
                  placeholderTextColor={Colors.grayLight}
                />
              </View>

              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Introduction <Text style={styles.charCount}>{intro.length}/500 (min 50)</Text></Text>
                <TextInput
                  style={[styles.fieldInput, styles.textArea]}
                  value={intro}
                  onChangeText={setIntro}
                  multiline
                  numberOfLines={4}
                  placeholder="Tell home owners about yourself..."
                  placeholderTextColor={Colors.grayLight}
                />
                {intro.length < 50 && intro.length > 0 && (
                  <Text style={styles.validationHint}>Need {50 - intro.length} more characters</Text>
                )}
              </View>

              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Why do you want to house and pet sit? <Text style={styles.charCount}>{whySit.length}/500 (min 50)</Text></Text>
                <TextInput
                  style={[styles.fieldInput, styles.textArea]}
                  value={whySit}
                  onChangeText={setWhySit}
                  multiline
                  numberOfLines={4}
                  placeholder="Share your motivation for housesitting..."
                  placeholderTextColor={Colors.grayLight}
                />
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: Colors.cream },
  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  backBtn:          { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon:         { fontSize: 22, color: Colors.navy },
  headerTitle:      { fontSize: 18, fontWeight: '700', color: Colors.navy },
  saveBtn:          { fontSize: 16, fontWeight: '700', color: Colors.teal },
  scroll:           { padding: 20, gap: 12 },
  statusCard:       { backgroundColor: Colors.white, borderRadius: 16, padding: 16, gap: 8, ...Shadows.card },
  statusRow:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.teal },
  statusText:       { fontSize: 14, fontWeight: '600', color: Colors.teal },
  progressBar:      { height: 6, backgroundColor: Colors.sand, borderRadius: 3, overflow: 'hidden' },
  progressFill:     { height: '100%', backgroundColor: Colors.teal, borderRadius: 3 },
  progressLabel:    { fontSize: 12, color: Colors.gray },
  sectionHeader:    { fontSize: 16, fontWeight: '700', color: Colors.navy, marginTop: 8 },
  sectionRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 14, padding: 14, ...Shadows.card },
  sectionIcon:      { width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.tealPale, alignItems: 'center', justifyContent: 'center' },
  sectionLabel:     { fontSize: 15, fontWeight: '600', color: Colors.navy },
  sectionStatus:    { fontSize: 12, color: Colors.gray, marginTop: 2 },
  sectionCheck:     { fontSize: 14, fontWeight: '700' },
  chevron:          { fontSize: 20, color: Colors.grayLight },
  inlineEditor:     { backgroundColor: Colors.white, borderRadius: 16, padding: 16, gap: 14, ...Shadows.card },
  editorTitle:      { fontSize: 16, fontWeight: '700', color: Colors.navy, marginBottom: 4 },
  fieldWrap:        { gap: 6 },
  fieldLabel:       { fontSize: 14, fontWeight: '600', color: Colors.navy },
  fieldInput:       { backgroundColor: Colors.grayPale, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.navy, borderWidth: 1, borderColor: Colors.sand },
  textArea:         { minHeight: 100, textAlignVertical: 'top' },
  charCount:        { fontSize: 12, color: Colors.gray, fontWeight: '400' },
  validationHint:   { fontSize: 12, color: Colors.amber, marginTop: 4 },
  avatarRow:        { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarPreview:    { width: 72, height: 72, borderRadius: 36 },
  changePhotoBtn:   { backgroundColor: Colors.tealPale, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  changePhotoText:  { fontSize: 14, fontWeight: '600', color: Colors.teal },
  chip:             { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white },
  chipActive:       { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  chipText:         { fontSize: 13, color: Colors.gray, fontWeight: '500' },
  chipTextActive:   { color: Colors.tealDark, fontWeight: '700' },
})
