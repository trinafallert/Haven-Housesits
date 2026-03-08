import { useState, useRef, useCallback } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
  Animated, FlatList, NativeSyntheticEvent, NativeScrollEvent,
  ViewToken,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '@/constants/colors'

const { width, height } = Dimensions.get('window')

// High-quality Unsplash photos that match each slide's theme
const SLIDES = [
  {
    photo:   'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
    tag:     'DISCOVER',
    title:   'House sit anywhere\nin the world',
    sub:     'From mountain cabins to coastal villas — find your perfect sit among thousands of homes globally.',
    pills:   [
      { icon: '🌍', label: '130+ Countries' },
      { icon: '🏠', label: '50K+ Listings' },
      { icon: '⭐', label: '4.9 App Rating' },
    ],
  },
  {
    photo:   'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80',
    tag:     'TRUSTED',
    title:   'Pets love it.\nOwners trust it.',
    sub:     'Every sitter is ID-verified and background-checked. Join a community of genuine animal lovers.',
    pills:   [
      { icon: '🛡️', label: 'ID Verified' },
      { icon: '✅', label: 'Background Checks' },
      { icon: '💬', label: '500K+ Reviews' },
    ],
  },
  {
    photo:   'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80',
    tag:     'YOUR CHOICE',
    title:   'Free stays or\nearning money',
    sub:     'Choose a free exchange sit or earn up to $150/day on paid sits. You set the terms, every time.',
    pills:   [
      { icon: '🤝', label: 'Free Exchange' },
      { icon: '💰', label: 'Earn $25–150/day' },
      { icon: '🔑', label: 'You Choose' },
    ],
  },
]

// Single slide rendered inside FlatList
function Slide({ item }: { item: typeof SLIDES[0] }) {
  return (
    <View style={{ width, height }}>
      {/* Full-bleed hero photo */}
      <Image
        source={{ uri: item.photo }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={400}
      />
      {/* Gradient: transparent top → deep navy bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(13,27,42,0.55)', 'rgba(13,27,42,0.97)']}
        locations={[0.25, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  )
}

export default function WelcomeScreen() {
  const router   = useRouter()
  const flatRef  = useRef<FlatList>(null)
  const scrollX  = useRef(new Animated.Value(0)).current
  const [index,  setIndex]  = useState(0)

  const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) setIndex(viewableItems[0].index ?? 0)
  })
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 })

  const goNext = useCallback(() => {
    if (index < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: index + 1, animated: true })
    } else {
      router.push('/(auth)/signup')
    }
  }, [index])

  const current = SLIDES[index]

  return (
    <View style={styles.root}>
      {/* ── Swipeable full-screen photo slides ── */}
      <FlatList
        ref={flatRef}
        data={SLIDES}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfig.current}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => <Slide item={item} />}
      />

      {/* ── Fixed overlay UI (logo, skip, content, CTAs) ── */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

          {/* Top row: logo + skip */}
          <View style={styles.topRow}>
            <View style={styles.logoWrap}>
              <View style={styles.logoDot} />
              <Text style={styles.logoText}>haven</Text>
            </View>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => router.push('/(auth)/signup')}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Spacer pushes content down */}
          <View style={{ flex: 1 }} />

          {/* ── Slide content ── */}
          <View style={styles.content}>

            {/* Category tag */}
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>{current.tag}</Text>
            </View>

            {/* Headline */}
            <Text style={styles.title}>{current.title}</Text>

            {/* Subtitle */}
            <Text style={styles.sub}>{current.sub}</Text>

            {/* Social proof pills */}
            <View style={styles.pillsRow}>
              {current.pills.map((p, i) => (
                <View key={i} style={styles.pill}>
                  <Text style={styles.pillIcon}>{p.icon}</Text>
                  <Text style={styles.pillLabel}>{p.label}</Text>
                </View>
              ))}
            </View>

            {/* Progress dots */}
            <View style={styles.dotsRow}>
              {SLIDES.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
                const dotWidth = scrollX.interpolate({
                  inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp',
                })
                const opacity = scrollX.interpolate({
                  inputRange, outputRange: [0.4, 1, 0.4], extrapolate: 'clamp',
                })
                return (
                  <Animated.View
                    key={i}
                    style={[styles.dot, { width: dotWidth, opacity }]}
                  />
                )
              })}
            </View>

            {/* Primary CTA */}
            <TouchableOpacity style={styles.primaryBtn} onPress={goNext} activeOpacity={0.88}>
              <Text style={styles.primaryBtnText}>
                {index < SLIDES.length - 1 ? 'Continue  →' : 'Create a free account  →'}
              </Text>
            </TouchableOpacity>

            {/* Secondary — sign in link (always visible for returning users) */}
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              style={styles.secondaryBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryBtnText}>
                Already a member?{'  '}
                <Text style={styles.secondaryBtnBold}>Sign in</Text>
              </Text>
            </TouchableOpacity>

            {/* Fine print on last slide */}
            {index === SLIDES.length - 1 && (
              <Text style={styles.finePrint}>
                Free to join · No credit card required
              </Text>
            )}
          </View>

        </SafeAreaView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.navy,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // ── Top bar ──
  topRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingTop:     4,
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
  },
  logoDot: {
    width:           10,
    height:          10,
    borderRadius:    5,
    backgroundColor: Colors.teal,
  },
  logoText: {
    fontSize:   22,
    fontWeight: '800',
    color:      '#fff',
    letterSpacing: 1.5,
  },
  skipBtn: {
    paddingHorizontal: 14,
    paddingVertical:   7,
    borderRadius:      20,
    backgroundColor:   'rgba(255,255,255,0.15)',
  },
  skipText: {
    color:      '#fff',
    fontSize:   14,
    fontWeight: '500',
  },

  // ── Slide content ──
  content: {
    gap:           14,
    paddingBottom: 8,
  },
  tagPill: {
    alignSelf:         'flex-start',
    backgroundColor:   Colors.teal,
    borderRadius:      20,
    paddingHorizontal: 12,
    paddingVertical:   5,
  },
  tagText: {
    color:         '#fff',
    fontSize:      11,
    fontWeight:    '700',
    letterSpacing: 1.8,
  },
  title: {
    fontSize:      36,
    fontWeight:    '800',
    color:         '#fff',
    lineHeight:    43,
    letterSpacing: -0.5,
  },
  sub: {
    fontSize:   15,
    color:      'rgba(255,255,255,0.78)',
    lineHeight: 22,
  },

  // ── Social proof pills ──
  pillsRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           8,
    marginTop:     2,
  },
  pill: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               6,
    backgroundColor:   'rgba(255,255,255,0.13)',
    borderWidth:       1,
    borderColor:       'rgba(255,255,255,0.2)',
    borderRadius:      24,
    paddingHorizontal: 12,
    paddingVertical:   7,
  },
  pillIcon:  { fontSize: 14 },
  pillLabel: { fontSize: 13, color: '#fff', fontWeight: '600' },

  // ── Progress dots ──
  dotsRow: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            6,
    marginVertical: 4,
  },
  dot: {
    height:          4,
    borderRadius:    2,
    backgroundColor: '#fff',
  },

  // ── CTAs ──
  primaryBtn: {
    backgroundColor: Colors.teal,
    borderRadius:    16,
    paddingVertical: 18,
    alignItems:      'center',
    shadowColor:     Colors.teal,
    shadowOffset:    { width: 0, height: 6 },
    shadowOpacity:   0.45,
    shadowRadius:    16,
    elevation:       8,
  },
  primaryBtnText: {
    color:      '#fff',
    fontSize:   16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius:    14,
    paddingVertical: 14,
    alignItems:      'center',
    borderWidth:     1,
    borderColor:     'rgba(255,255,255,0.2)',
  },
  secondaryBtnText: {
    color:      'rgba(255,255,255,0.8)',
    fontSize:   14,
  },
  secondaryBtnBold: {
    color:      '#fff',
    fontWeight: '700',
  },
  finePrint: {
    color:     'rgba(255,255,255,0.45)',
    fontSize:  12,
    textAlign: 'center',
    marginTop: -4,
  },
})
