import { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/colors'
import { useLogin } from '../../src/hooks'

export default function LoginScreen() {
  const router  = useRouter()
  const loginMutation = useLogin()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')

  async function handleLogin() {
    if (!email.trim() || !password) { setError('Please fill in all fields'); return }
    setError('')
    try {
      await loginMutation.mutateAsync({ email: email.trim().toLowerCase(), password })
      router.replace('/(tabs)/search')
    } catch (e: any) {
      setError(e?.message ?? 'Login failed. Check your credentials.')
    }
  }

  const loading = loginMutation.isPending

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.logoEmoji}>🏡</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.sub}>Sign in to your Haven account</Text>
          </View>

          <View style={styles.fields}>
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
                autoComplete="email"
                editable={!loading}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor={Colors.grayLight}
                secureTextEntry
                autoComplete="password"
                editable={!loading}
              />
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.loginBtnText}>Sign in</Text>
            }
          </TouchableOpacity>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/signup')}>
              <Text style={styles.signupLink}>Sign up free</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: Colors.cream },
  scroll:            { paddingHorizontal: 24, paddingBottom: 40 },
  back:              { paddingVertical: 16 },
  backText:          { color: Colors.gray, fontSize: 15 },
  header:            { alignItems: 'center', marginBottom: 28 },
  logoEmoji:         { fontSize: 40, marginBottom: 12 },
  title:             { fontSize: 28, fontWeight: '800', color: Colors.navy, letterSpacing: -0.5 },
  sub:               { fontSize: 15, color: Colors.gray, marginTop: 6 },
  fields:            { gap: 16, marginBottom: 8 },
  field:             {},
  label:             { fontSize: 13, fontWeight: '600', color: Colors.navy, marginBottom: 6 },
  input:             {
    borderWidth: 1.5, borderColor: Colors.sand, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: Colors.navy, backgroundColor: Colors.white,
  },
  error:             { color: Colors.red, fontSize: 13, textAlign: 'center', marginVertical: 8 },
  loginBtn:          {
    backgroundColor: Colors.teal, borderRadius: 16,
    paddingVertical: 18, alignItems: 'center', marginTop: 16, marginBottom: 20,
  },
  loginBtnDisabled:  { opacity: 0.6 },
  loginBtnText:      { color: Colors.white, fontSize: 17, fontWeight: '700' },
  signupRow:         { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signupText:        { fontSize: 14, color: Colors.gray },
  signupLink:        { fontSize: 14, fontWeight: '700', color: Colors.teal },
})
