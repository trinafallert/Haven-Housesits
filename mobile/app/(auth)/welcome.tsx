import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/colors'

const { width, height } = Dimensions.get('window')

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
]

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: HERO_IMAGES[0] }}
        style={styles.bg}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(26,46,53,0.6)', 'rgba(26,46,53,0.97)']}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safe}>
            {/* Logo */}
            <View style={styles.logoWrap}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoEmoji}>🏡</Text>
              </View>
              <Text style={styles.logoText}>Haven</Text>
            </View>

            {/* Hero copy */}
            <View style={styles.hero}>
              <Text style={styles.tagline}>House sitting,{'\n'}done right.</Text>
              <Text style={styles.sub}>
                Free exchanges, paid sits, verified sitters.{'\n'}
                Join thousands of travellers worldwide.
              </Text>

              {/* Stats row */}
              <View style={styles.statsRow}>
                {[
                  { value: '50k+', label: 'Sitters' },
                  { value: '30k+', label: 'Listings' },
                  { value: '98%', label: 'Happy sits' },
                ].map((s) => (
                  <View key={s.label} style={styles.stat}>
                    <Text style={styles.statValue}>{s.value}</Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* CTAs */}
            <View style={styles.ctas}>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => router.push('/(auth)/signup')}
                activeOpacity={0.85}
              >
                <Text style={styles.btnPrimaryText}>Get started free — 3 months</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => router.push('/(auth)/login')}
                activeOpacity={0.85}
              >
                <Text style={styles.btnSecondaryText}>I already have an account</Text>
              </TouchableOpacity>

              <Text style={styles.legal}>
                By continuing you agree to our{' '}
                <Text style={styles.link}>Terms</Text> &{' '}
                <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { flex: 1, width, height },
  gradient: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 24 },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
  },
  logoCircle: {
    width: 40, height: 40,
    borderRadius: 12,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 20 },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  hero: { flex: 1, justifyContent: 'flex-end', paddingBottom: 32 },
  tagline: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 48,
    letterSpacing: -1,
    marginBottom: 12,
  },
  sub: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 24,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.tealLight },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  ctas: { paddingBottom: 8, gap: 12 },
  btnPrimary: {
    backgroundColor: Colors.teal,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  btnPrimaryText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  legal: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 4,
  },
  link: { color: 'rgba(255,255,255,0.7)', textDecorationLine: 'underline' },
})
