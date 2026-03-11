import { useRef, useState } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, StatusBar,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '@/constants/colors'

const { width, height } = Dimensions.get('window')

const SLIDES = [
  {
    tag: 'DISCOVER',
    title: 'House sit anywhere\nin the world',
    sub: 'From mountain cabins to coastal villas — find your perfect sit among thousands of homes globally.',
    pills: [
      { icon: '🌍', label: '130+ Countries' },
      { icon: '🏠', label: '50K+ Listings' },
      { icon: '⭐', label: '4.9 App Rating' },
    ],
    photo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
  },
  {
    tag: 'TRUSTED',
    title: 'Pets love it.\nOwners trust it.',
    sub: 'Every sitter is ID-verified and background-checked. Join a community of genuine animal lovers.',
    pills: [
      { icon: '🛡️', label: 'ID Verified' },
      { icon: '✅', label: 'Background Checks' },
      { icon: '💬', label: '500K+ Reviews' },
    ],
    photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80',
  },
  {
    tag: 'YOUR CHOICE',
    title: 'Free stays or\nearning money',
    sub: 'Choose a free exchange sit or earn up to $150/day on paid sits. You set the terms, every time.',
    pills: [
      { icon: '🤝', label: 'Free Exchange' },
      { icon: '💰', label: 'Earn $25–150/day' },
      { icon: '🔑', label: 'You Choose' },
    ],
    photo: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80',
  },
]

export default function WelcomeScreen() {
  const router = useRouter()
  const flatListRef = useRef<FlatList>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const isLast = activeIndex === SLIDES.length - 1

  const goNext = () => {
    if (isLast) {
      router.push('/(auth)/signup')
    } else {
      const next = activeIndex + 1
      flatListRef.current?.scrollToIndex({ index: next, animated: true })
      setActiveIndex(next)
    }
  }

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0)
    }
  }).current

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Fullbleed photo slides ── */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={{ width, height }}>
            <Image
              source={{ uri: item.photo }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(13,27,42,0.65)', 'rgba(13,27,42,0.97)']}
              locations={[0, 0.45, 0.85]}
              style={StyleSheet.absoluteFill}
            />
          </View>
        )}
      />

      {/* ── Fixed overlay ── */}
      <View style={[StyleSheet.absoluteFill, styles.overlay]}>

        {/* Logo + Skip */}
        <View style={styles.topBar}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoText}>haven</Text>
            <View style={styles.logoDot} />
          </View>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer pushes content down */}
        <View style={{ flex: 1 }} />

        {/* Slide content */}
        <View style={styles.content}>
          <Text style={styles.tag}>{SLIDES[activeIndex].tag}</Text>
          <Text style={styles.title}>{SLIDES[activeIndex].title}</Text>
          <Text style={styles.sub}>{SLIDES[activeIndex].sub}</Text>

          {/* Pills */}
          <View style={styles.pillsRow}>
            {SLIDES[activeIndex].pills.map((pill) => (
              <View key={pill.label} style={styles.pill}>
                <Text style={styles.pillIcon}>{pill.icon}</Text>
                <Text style={styles.pillLabel}>{pill.label}</Text>
              </View>
            ))}
          </View>

          {/* Dots */}
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity style={styles.ctaBtn} onPress={goNext} activeOpacity={0.88}>
            <Text style={styles.ctaBtnText}>
              {isLast ? 'Get started' : 'Next →'}
            </Text>
          </TouchableOpacity>

          {/* Log in link on last slide */}
          {isLast && (
            <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginLink}>
              <Text style={styles.loginLinkText}>
                Already have an account?{' '}
                <Text style={styles.loginLinkBold}>Log in</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#0D1B2A' },
  overlay:      { flexDirection: 'column' },

  // Top bar
  topBar:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 24 },
  logoWrap:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  logoText:     { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  logoDot:      { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.teal, marginBottom: 10 },
  skipBtn:      { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)' },
  skipText:     { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '500' },

  // Content
  content:      { paddingHorizontal: 24, paddingBottom: 52 },
  tag:          { fontSize: 11, fontWeight: '700', letterSpacing: 2, color: Colors.teal, textTransform: 'uppercase', marginBottom: 10 },
  title:        { fontSize: 38, fontWeight: '800', color: '#fff', lineHeight: 44, marginBottom: 14, letterSpacing: -0.5 },
  sub:          { fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 24, marginBottom: 22 },

  // Pills
  pillsRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
  pill:         { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  pillIcon:     { fontSize: 15 },
  pillLabel:    { color: '#fff', fontSize: 13, fontWeight: '600' },

  // Dots
  dotsRow:      { flexDirection: 'row', gap: 6, marginBottom: 24 },
  dot:          { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive:    { width: 20, backgroundColor: Colors.teal },

  // CTA
  ctaBtn:       { backgroundColor: Colors.teal, borderRadius: 16, paddingVertical: 17, alignItems: 'center', marginBottom: 14, shadowColor: Colors.teal, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  ctaBtnText:   { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  // Login link
  loginLink:    { alignItems: 'center', paddingVertical: 4 },
  loginLinkText: { color: 'rgba(255,255,255,0.55)', fontSize: 14 },
  loginLinkBold: { color: Colors.teal, fontWeight: '700' },
})
