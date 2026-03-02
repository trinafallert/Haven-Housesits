import { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/colors'

type Role = 'SITTER' | 'OWNER' | 'BOTH'

const ROLES: { key: Role; icon: string; label: string; desc: string }[] = [
  { key: 'SITTER', icon: '🧳', label: 'Sitter', desc: 'I want to house sit & travel' },
  { key: 'OWNER',  icon: '🏠', label: 'Owner',  desc: 'I need someone for my home' },
  { key: 'BOTH',   icon: '🔄', label: 'Both',   desc: 'I do both' },
]

function isStudentEmail(email: string) {
  return ['.edu', '.ac.uk', '.edu.au', '.ac.nz'].some((d) => email.toLowerCase().endsWith(d))
}

export default function SignupScreen() {
  const router  = useRouter()
  const [step, setStep]         = useState<1 | 2>(1)
  const [role, setRole]         = useState<Role>('BOTH')
  const [firstName, setFirst]   = useState('')
  const [lastName, setLast]     = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const isStudent = isStudentEmail(email)

  async function handleSignup() {
    if (!firstName || !lastName || !email || !password) { setError('Please fill in all fields'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    router.replace('/(auth)/onboarding')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={styles.back} onPress={() => step === 2 ? setStep(1) : router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Progress */}
          <View style={styles.progressRow}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressLine, step === 2 && styles.progressLineActive]} />
            <View style={[styles.progressDot, step === 2 && styles.progressDotActive]} />
          </View>

          {/* Step 1 — Role picker */}
          {step === 1 && (
            <View>
              <Text style={styles.title}>I want to…</Text>
              <Text style={styles.sub}>You can always change this later.</Text>

              <View style={styles.roleGrid}>
                {ROLES.map((r) => (
                  <TouchableOpacity
                    key={r.key}
                    style={[styles.roleCard, role === r.key && styles.roleCardActive]}
                    onPress={() => setRole(r.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.roleEmoji}>{r.icon}</Text>
                    <Text style={[styles.roleLabel, role === r.key && styles.roleLabelActive]}>{r.label}</Text>
                    <Text style={[styles.roleDesc, role === r.key && styles.roleDescActive]}>{r.desc}</Text>
                    {role === r.key && <View style={styles.roleCheck}><Text style={{ color: Colors.white, fontSize: 12 }}>✓</Text></View>}
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.btn} onPress={() => setStep(2)} activeOpacity={0.85}>
                <Text style={styles.btnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2 — Details */}
          {step === 2 && (
            <View>
              <Text style={styles.title}>Create your account</Text>
              <Text style={styles.sub}>Join Haven free for 3 months. No credit card needed.</Text>

              {/* Google */}
              <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
                <Text style={styles.googleText}>🔵  Continue with Google</Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.line} /><Text style={styles.orText}>or</Text><View style={styles.line} />
              </View>

              <View style={styles.nameRow}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>First name</Text>
                  <TextInput style={styles.input} value={firstName} onChangeText={setFirst} placeholder="Jordan" placeholderTextColor={Colors.grayLight} autoCapitalize="words" />
                </View>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Last name</Text>
                  <TextInput style={styles.input} value={lastName} onChangeText={setLast} placeholder="Rivera" placeholderTextColor={Colors.grayLight} autoCapitalize="words" />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.grayLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {isStudent && (
                  <View style={styles.studentBadge}>
                    <Text style={styles.studentBadgeText}>🎓 Student email detected — 30% off!</Text>
                  </View>
                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Min. 8 characters"
                  placeholderTextColor={Colors.grayLight}
                  secureTextEntry
                />
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.btn, loading && styles.btnDisabled]}
                onPress={handleSignup}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading
                  ? <ActivityIndicator color={Colors.white} />
                  : <Text style={styles.btnText}>Create account — free</Text>
                }
              </TouchableOpacity>

              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                  <Text style={styles.loginLink}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  back: { paddingVertical: 16 },
  backText: { color: Colors.gray, fontSize: 15 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.sand },
  progressDotActive: { backgroundColor: Colors.teal, width: 12, height: 12, borderRadius: 6 },
  progressLine: { flex: 1, height: 2, backgroundColor: Colors.sand, marginHorizontal: 6 },
  progressLineActive: { backgroundColor: Colors.teal },
  title: { fontSize: 28, fontWeight: '800', color: Colors.navy, letterSpacing: -0.5, marginBottom: 6 },
  sub: { fontSize: 15, color: Colors.gray, marginBottom: 24 },
  roleGrid: { gap: 12, marginBottom: 24 },
  roleCard: {
    borderWidth: 2,
    borderColor: Colors.sand,
    borderRadius: 16,
    padding: 16,
    backgroundColor: Colors.white,
  },
  roleCardActive: { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  roleEmoji: { fontSize: 28, marginBottom: 6 },
  roleLabel: { fontSize: 17, fontWeight: '700', color: Colors.navy, marginBottom: 2 },
  roleLabelActive: { color: Colors.tealDark },
  roleDesc: { fontSize: 13, color: Colors.gray },
  roleDescActive: { color: Colors.teal },
  roleCheck: {
    position: 'absolute', top: 12, right: 12,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.teal,
    alignItems: 'center', justifyContent: 'center',
  },
  btn: {
    backgroundColor: Colors.teal,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: Colors.white, fontSize: 17, fontWeight: '700' },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.sand, borderRadius: 14,
    paddingVertical: 15, backgroundColor: Colors.white, marginBottom: 20,
  },
  googleText: { fontSize: 16, fontWeight: '600', color: Colors.navy },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  line: { flex: 1, height: 1, backgroundColor: Colors.sand },
  orText: { fontSize: 13, color: Colors.grayLight },
  nameRow: { flexDirection: 'row', gap: 12, marginBottom: 0 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.navy, marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: Colors.sand, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: Colors.navy, backgroundColor: Colors.white,
  },
  studentBadge: {
    marginTop: 6, backgroundColor: Colors.tealPale,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7,
  },
  studentBadgeText: { fontSize: 13, fontWeight: '600', color: Colors.tealDark },
  error: { color: Colors.red, fontSize: 13, textAlign: 'center', marginBottom: 8 },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: 14, color: Colors.gray },
  loginLink: { fontSize: 14, fontWeight: '700', color: Colors.teal },
})
