import { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Shadows } from '@/constants/colors'
import { useRegister, useLogin } from '../../src/hooks'

const ROLES = [
  { key: 'SITTER', icon: '🐾', title: 'I want to house sit',    sub: 'Find sits, care for pets, travel for free or earn money' },
  { key: 'OWNER',  icon: '🏠', title: 'I need a house sitter', sub: 'Post listings, find trusted sitters, go away stress-free' },
  { key: 'BOTH',   icon: '✨', title: 'Both!',                  sub: 'Do both — switch between sitter and owner modes anytime' },
]

const STEPS = ['Your role', 'Account', 'About you']

export default function SignupScreen() {
  const router = useRouter()
  const registerMutation = useRegister()
  const loginMutation    = useLogin()

  const [step,      setStep]  = useState(0)
  const [role,      setRole]  = useState('')
  const [email,     setEmail] = useState('')
  const [password,  setPass]  = useState('')
  const [firstName, setFirst] = useState('')
  const [lastName,  setLast]  = useState('')
  const [error,     setError] = useState('')

  const loading = registerMutation.isPending || loginMutation.isPending

  const canNext = () => {
    if (step === 0) return role !== ''
    if (step === 1) return email.includes('@') && password.length >= 8
    if (step === 2) return firstName.length > 1
    return false
  }

  const next = async () => {
    if (step < STEPS.length - 1) { setStep(s => s + 1); return }

    // Final step — register then auto-login
    setError('')
    try {
      await registerMutation.mutateAsync({
        firstName: firstName.trim(),
        lastName:  lastName.trim() || 'User',
        email:     email.trim().toLowerCase(),
        password,
        role: role as 'SITTER' | 'OWNER' | 'BOTH',
      })
      // Auto-login after registration
      await loginMutation.mutateAsync({ email: email.trim().toLowerCase(), password })
      router.replace('/(tabs)/search')
    } catch (e: any) {
      setError(e?.message ?? 'Registration failed. Please try again.')
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        {step > 0
          ? <TouchableOpacity onPress={() => setStep(s => s - 1)}><Text style={styles.back}>←</Text></TouchableOpacity>
          : <View style={{ width: 40 }} />
        }
        <Text style={styles.logo}>🌿 Haven</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.progressRow}>
        {STEPS.map((s, i) => (
          <View key={i} style={[styles.progressBar, i <= step && styles.progressBarFill]} />
        ))}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

          {step === 0 && (
            <>
              <Text style={styles.title}>How do you want to use Haven?</Text>
              <Text style={styles.sub}>You can always switch later</Text>
              {ROLES.map(r => (
                <TouchableOpacity
                  key={r.key}
                  style={[styles.roleCard, role === r.key && styles.roleCardActive]}
                  onPress={() => setRole(r.key)}
                >
                  <Text style={styles.roleIcon}>{r.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.roleTitle, role === r.key && styles.roleTitleActive]}>{r.title}</Text>
                    <Text style={styles.roleSub}>{r.sub}</Text>
                  </View>
                  <View style={[styles.radio, role === r.key && styles.radioActive]}>
                    {role === r.key && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {step === 1 && (
            <>
              <Text style={styles.title}>Create your account</Text>
              <Text style={styles.sub}>Free forever — no credit card needed</Text>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={styles.input} value={email} onChangeText={setEmail}
                  keyboardType="email-address" autoCapitalize="none"
                  placeholder="you@example.com" placeholderTextColor={Colors.grayLight}
                  editable={!loading}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Password</Text>
                <TextInput
                  style={styles.input} value={password} onChangeText={setPass}
                  secureTextEntry placeholder="8+ characters"
                  placeholderTextColor={Colors.grayLight} editable={!loading}
                />
              </View>
              <View style={styles.termsRow}>
                <Text style={styles.termsText}>
                  By continuing you agree to Haven's{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.title}>What's your name?</Text>
              <Text style={styles.sub}>This will appear on your profile</Text>
              <View style={styles.nameRow}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>First name</Text>
                  <TextInput
                    style={styles.input} value={firstName} onChangeText={setFirst}
                    placeholder="Jane" placeholderTextColor={Colors.grayLight}
                    editable={!loading}
                  />
                </View>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>Last name</Text>
                  <TextInput
                    style={styles.input} value={lastName} onChangeText={setLast}
                    placeholder="Smith" placeholderTextColor={Colors.grayLight}
                    editable={!loading}
                  />
                </View>
              </View>
              <View style={styles.planCard}>
                <Text style={styles.planTitle}>🎉 3 months free!</Text>
                <Text style={styles.planSub}>Try Haven Premium free for 3 months. Then just $13.25/mo or $129/yr. Cancel anytime.</Text>
              </View>
            </>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btn, (!canNext() || loading) && styles.btnDisabled]}
            disabled={!canNext() || loading}
            onPress={next}
          >
            {loading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.btnText}>{step < STEPS.length - 1 ? 'Continue →' : '🚀 Create account'}</Text>
            }
          </TouchableOpacity>
          {step === 0 && (
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLink}>Already have an account? <Text style={{ fontWeight: '700', color: Colors.teal }}>Log in</Text></Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const C = Colors, S = Shadows
const styles = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: C.cream },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  back:            { fontSize: 22, color: C.navy, padding: 4 },
  logo:            { fontSize: 18, fontWeight: '800', color: C.navy },
  progressRow:     { flexDirection: 'row', gap: 4, paddingHorizontal: 16, paddingBottom: 8 },
  progressBar:     { flex: 1, height: 4, borderRadius: 2, backgroundColor: C.sand },
  progressBarFill: { backgroundColor: C.teal },
  body:            { padding: 24, gap: 16, paddingBottom: 40 },
  title:           { fontSize: 24, fontWeight: '800', color: C.navy },
  sub:             { fontSize: 14, color: C.gray, marginTop: -10 },
  roleCard:        { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, borderWidth: 1.5, borderColor: C.sand, backgroundColor: C.white },
  roleCardActive:  { borderColor: C.teal, backgroundColor: C.tealPale },
  roleIcon:        { fontSize: 30 },
  roleTitle:       { fontSize: 15, fontWeight: '700', color: C.navy },
  roleTitleActive: { color: C.tealDark },
  roleSub:         { fontSize: 13, color: C.gray, marginTop: 2 },
  radio:           { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: C.sand, alignItems: 'center', justifyContent: 'center' },
  radioActive:     { borderColor: C.teal },
  radioDot:        { width: 10, height: 10, borderRadius: 5, backgroundColor: C.teal },
  field:           { gap: 6 },
  fieldLabel:      { fontSize: 14, fontWeight: '600', color: C.navy },
  input:           { backgroundColor: C.white, borderRadius: 12, padding: 14, fontSize: 15, color: C.navy, borderWidth: 1, borderColor: C.sand },
  termsRow:        { marginTop: 4 },
  termsText:       { fontSize: 12, color: C.gray, lineHeight: 18, textAlign: 'center' },
  termsLink:       { color: C.teal },
  nameRow:         { flexDirection: 'row', gap: 12 },
  planCard:        { backgroundColor: C.tealPale, borderRadius: 16, padding: 16, gap: 6, borderWidth: 1.5, borderColor: C.teal },
  planTitle:       { fontSize: 16, fontWeight: '700', color: C.tealDark },
  planSub:         { fontSize: 13, color: C.tealDark, lineHeight: 20 },
  error:           { color: C.red, fontSize: 13, textAlign: 'center' },
  footer:          { padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: C.sand, backgroundColor: C.white },
  btn:             { backgroundColor: C.teal, borderRadius: 14, paddingVertical: 16, alignItems: 'center', ...S.card },
  btnDisabled:     { backgroundColor: C.grayLight },
  btnText:         { color: '#fff', fontSize: 16, fontWeight: '700' },
  loginLink:       { textAlign: 'center', fontSize: 14, color: C.gray },
})
