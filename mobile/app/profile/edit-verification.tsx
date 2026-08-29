import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Colors, Shadows } from '@/constants/colors'

const VERIFICATIONS = [
  { icon: '📧', label: 'Email address',    status: 'VERIFIED',  desc: 'renae@example.com' },
  { icon: '📱', label: 'Phone number',     status: 'VERIFIED',  desc: '+1 512 555 0192' },
  { icon: '🪪', label: 'ID Check',         status: 'VERIFIED',  desc: 'Powered by Evident · Passed ✓' },
  { icon: '🔍', label: 'Background Check', status: 'VERIFIED',  desc: 'Powered by Evident · Passed ✓' },
]

export default function EditVerificationScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>
          Verified profiles get 3× more applications and sit invites. All checks are powered by Evident.
        </Text>

        {VERIFICATIONS.map(v => (
          <TouchableOpacity key={v.label} style={styles.verifyRow} activeOpacity={0.7}>
            <View style={styles.verifyIcon}>
              <Text style={{ fontSize: 22 }}>{v.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.verifyLabel}>{v.label}</Text>
              <Text style={styles.verifyDesc}>{v.desc}</Text>
            </View>
            <View style={[styles.statusPill, v.status === 'VERIFIED' ? styles.verified : styles.pending]}>
              <Text style={[styles.statusText, v.status === 'VERIFIED' ? styles.verifiedText : styles.pendingText]}>
                {v.status === 'VERIFIED' ? '✓ Verified' : 'Add'}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Duo sitter upsell */}
        <View style={styles.duoCard}>
          <Text style={styles.duoTitle}>👫 Get your co-sitter verified too</Text>
          <Text style={styles.duoDesc}>
            Both sitters verified = more trust from home owners. Invite your co-sitter to complete their own Haven verification.
          </Text>
          <View style={styles.duoBenefits}>
            {['2× more sit invites', 'Co-sitter badge on profile', 'Higher match scores'].map(b => (
              <View key={b} style={styles.duoBenefit}>
                <Text style={styles.duoCheck}>✓</Text>
                <Text style={styles.duoBenefitText}>{b}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.duoBtn}>
            <Text style={styles.duoBtnText}>Invite co-sitter →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: Colors.cream },
  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  backBtn:          { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon:         { fontSize: 22, color: Colors.navy },
  headerTitle:      { fontSize: 18, fontWeight: '700', color: Colors.navy },
  scroll:           { padding: 20, gap: 12 },
  subtitle:         { fontSize: 14, color: Colors.gray, lineHeight: 20 },
  verifyRow:        { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 14, padding: 14, ...Shadows.card },
  verifyIcon:       { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.tealPale, alignItems: 'center', justifyContent: 'center' },
  verifyLabel:      { fontSize: 15, fontWeight: '600', color: Colors.navy },
  verifyDesc:       { fontSize: 12, color: Colors.gray, marginTop: 2 },
  statusPill:       { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  verified:         { backgroundColor: '#D1FAE5' },
  pending:          { backgroundColor: Colors.tealPale },
  statusText:       { fontSize: 12, fontWeight: '700' },
  verifiedText:     { color: '#065F46' },
  pendingText:      { color: Colors.teal },
  chevron:          { fontSize: 20, color: Colors.grayLight },
  duoCard:          { backgroundColor: Colors.navy, borderRadius: 18, padding: 20, gap: 12, marginTop: 8 },
  duoTitle:         { fontSize: 17, fontWeight: '700', color: Colors.white },
  duoDesc:          { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 18 },
  duoBenefits:      { gap: 8 },
  duoBenefit:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  duoCheck:         { color: Colors.teal, fontWeight: '700', fontSize: 14 },
  duoBenefitText:   { color: Colors.white, fontSize: 13 },
  duoBtn:           { backgroundColor: Colors.teal, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  duoBtnText:       { color: Colors.white, fontSize: 15, fontWeight: '700' },
})
