import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Colors, Shadows } from '@/constants/colors'
import { usePublicProfile } from '../../src/hooks'

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Text key={i} style={{ fontSize: 12, color: i <= rating ? '#F59E0B' : Colors.sand }}>★</Text>
      ))}
    </View>
  )
}

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const { data, isLoading, isError } = usePublicProfile(id ?? '')

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.teal} />
        </View>
      </SafeAreaView>
    )
  }

  if (isError || !data?.profile) {
    return (
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>😕</Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.navy }}>Profile not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const p = data.profile
  const memberSince = p.createdAt ? new Date(p.createdAt as any).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Haven member'
  const location = [p.city, p.state].filter(Boolean).join(', ') || 'Location not set'
  const isVerified = p.idVerified ?? false
  const hasBgCheck = p.backgroundCheckStatus === 'APPROVED'
  const plan = (p.membershipPlan ?? 'EXPLORER').toUpperCase()

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Cover / hero */}
        <View style={styles.heroWrap}>
          <View style={[styles.cover, { backgroundColor: Colors.teal }]} />
          <View style={styles.coverOverlay} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <View style={styles.heroBottom}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: p.avatar ?? `https://ui-avatars.com/api/?name=${p.firstName}+${p.lastName}&background=5BA4A4&color=fff&size=128` }}
                style={styles.avatar}
                contentFit="cover"
              />
              {isVerified && (
                <View style={styles.verifiedDot}><Text style={{ fontSize: 9, color: Colors.white }}>✓</Text></View>
              )}
            </View>
            <View>
              <Text style={styles.heroName}>{p.firstName} {p.lastName}</Text>
              <Text style={styles.heroSub}>📍 {location} · Member since {memberSince}</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>

          {/* Stats */}
          <View style={styles.statsCard}>
            <View style={styles.stat}>
              <Text style={styles.statVal}>{p.averageRating?.toFixed(1) ?? '—'}</Text>
              <Text style={styles.statLab}>Rating</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>{p.totalSits ?? 0}</Text>
              <Text style={styles.statLab}>Sits</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>{p.totalReviews ?? 0}</Text>
              <Text style={styles.statLab}>Reviews</Text>
            </View>
          </View>

          {/* Badges */}
          <View style={styles.chips}>
            {isVerified  && <View style={styles.chip}><Text style={styles.chipText}>ID Verified ✓</Text></View>}
            {hasBgCheck  && <View style={styles.chip}><Text style={styles.chipText}>Background Check ✓</Text></View>}
            {plan === 'PREMIUM' && (
              <View style={[styles.chip, styles.premiumChip]}>
                <Text style={styles.premiumChipText}>⭐ Premium member</Text>
              </View>
            )}
            {plan === 'STANDARD' && (
              <View style={styles.chip}><Text style={styles.chipText}>Standard member</Text></View>
            )}
          </View>

          {/* Bio */}
          {p.tagline ? (
            <>
              <Text style={styles.sectionTitle}>About {p.firstName}</Text>
              <View style={styles.card}>
                <Text style={styles.bodyText}>{p.tagline}</Text>
                {p.bio ? <Text style={[styles.bodyText, { marginTop: 10 }]}>{p.bio}</Text> : null}
              </View>
            </>
          ) : (
            <View style={styles.card}>
              <Text style={styles.bodyText}>This sitter hasn't added a bio yet.</Text>
            </View>
          )}

          {/* CTA */}
          <TouchableOpacity style={styles.inviteBtn}>
            <Text style={styles.inviteBtnText}>✉️ Invite to apply</Text>
          </TouchableOpacity>
          <View style={{ height: 20 }} />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  heroWrap: { position: 'relative', height: 220 },
  cover: { width: '100%', height: '100%' },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26,46,53,0.45)' },
  backBtn: { position: 'absolute', top: 16, left: 16, width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  heroBottom: { position: 'absolute', bottom: 16, left: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: Colors.white },
  verifiedDot: { position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.teal, borderWidth: 2, borderColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  heroName: { fontSize: 20, fontWeight: '800', color: Colors.white },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  body: { padding: 20 },
  statsCard: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 14, ...Shadows.card },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '800', color: Colors.navy },
  statLab: { fontSize: 10, color: Colors.gray, marginTop: 2 },
  statDiv: { width: 1, backgroundColor: Colors.sand },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  chip: { backgroundColor: Colors.tealPale, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  chipText: { fontSize: 11, fontWeight: '700', color: Colors.tealDark },
  premiumChip: { backgroundColor: '#FEF3C7' },
  premiumChipText: { fontSize: 11, fontWeight: '700', color: '#92400E' },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.navy, marginBottom: 10, marginTop: 6 },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 16, ...Shadows.card },
  bodyText: { fontSize: 14, color: Colors.gray, lineHeight: 22 },
  inviteBtn: { backgroundColor: Colors.teal, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8, ...Shadows.card },
  inviteBtnText: { fontSize: 16, fontWeight: '800', color: Colors.white },
})
