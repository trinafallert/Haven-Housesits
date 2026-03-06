import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/colors'
import { useState } from 'react'

const { width, height } = Dimensions.get('window')

const SLIDES = [
  {
    emoji: '🌍',
    title: 'House sit anywhere\nin the world',
    sub:   'Thousands of listings across 130+ countries. Pet sits, vacant homes, paid sits, and more.',
    bg:    Colors.teal,
  },
  {
    emoji: '🐾',
    title: 'Pets love it.\nOwners trust it.',
    sub:   'Verified sitters, background checks, and a community of people who genuinely love animals.',
    bg:    Colors.navy,
  },
  {
    emoji: '💰',
    title: 'Free stays or\nearning money',
    sub:   'Browse free exchange sits or paid opportunities. You choose how you want to sit.',
    bg:    '#10B981',
  },
]

export default function WelcomeScreen() {
  const router  = useRouter()
  const [slide, setSlide] = useState(0)

  const next = () => {
    if (slide < SLIDES.length - 1) {
      setSlide(s => s + 1)
    } else {
      router.push('/(auth)/signup')
    }
  }

  const s = SLIDES[slide]

  return (
    <View style={[styles.root, { backgroundColor: s.bg }]}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.skipRow}>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <Text style={styles.emoji}>{s.emoji}</Text>
          <Text style={styles.title}>{s.title}</Text>
          <Text style={styles.sub}>{s.sub}</Text>
        </View>

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === slide && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextBtn} onPress={next}>
            <Text style={styles.nextBtnText}>
              {slide < SLIDES.length - 1 ? 'Next →' : 'Get started'}
            </Text>
          </TouchableOpacity>
          {slide === SLIDES.length - 1 && (
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLink}>Already have an account? <Text style={{ fontWeight: '700' }}>Log in</Text></Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root:       { flex: 1 },
  safe:       { flex: 1, paddingHorizontal: 28 },
  skipRow:    { alignItems: 'flex-end', paddingTop: 12 },
  skip:       { color: 'rgba(255,255,255,0.7)', fontSize: 15 },
  hero:       { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  emoji:      { fontSize: 80 },
  title:      { fontSize: 32, fontWeight: '800', color: '#fff', textAlign: 'center', lineHeight: 40 },
  sub:        { fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 24 },
  dots:       { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingBottom: 24 },
  dot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive:  { width: 24, backgroundColor: '#fff' },
  footer:     { gap: 16, paddingBottom: 32 },
  nextBtn:    { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  nextBtnText:{ fontSize: 17, fontWeight: '700', color: Colors.navy },
  loginLink:  { color: 'rgba(255,255,255,0.8)', textAlign: 'center', fontSize: 14 },
})
