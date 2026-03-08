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

          {/* Tagline / Bio */}
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

  id: '1',
  firstName: 'Sam',
  lastName: 'Chen',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  coverPhoto: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  headline: 'Passionate animal lover & remote worker 🐾',
  location: 'San Francisco, CA',
  memberSince: 'March 2022',
  rating: 4.96,
  totalReviews: 28,
  totalSits: 28,
  responseRate: 98,
  responseTime: '< 1 hour',
  idVerified: true,
  backgroundCheck: true,
  membershipPlan: 'PREMIUM',
  about: "Hi! I'm Sam — a software engineer who loves working remotely from beautiful homes while caring for your furry family members. I grew up with dogs, cats, and even the occasional rabbit, so I'm comfortable with all sorts of pets.\n\nI treat every home like my own: clean, respectful, and attentive. I'm a great communicator — you'll get daily photo updates of your pets!",
  whyHousesit: "I love the flexibility of remote work and the chance to experience different neighbourhoods and lifestyles. House sitting gives me the opportunity to slow travel while giving pets the love and attention they deserve.",
  photos: [
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&q=80',
    'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&q=80',
  ],
  petExperience: ['Dogs', 'Cats', 'Fish', 'Rabbits'],
  homeTypes: ['House', 'Apartment', 'Cottage', 'Villa'],
  skills: ['Dog walking', 'Medication admin', 'Puppy training', 'Overnight stays'],
  availability: [
    { from: 'Apr 1', to: 'Apr 14' },
    { from: 'May 15', to: 'Jun 30' },
    { from: 'Aug 1', to: 'Aug 31' },
  ],
  coSitter: {
    name: 'Jamie',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    relationship: 'Partner',
  },
  references: [
    { name: 'Maria D.', text: "Sam is absolutely wonderful. Left my home spotless and my dog was clearly well-loved. Will invite back every time!", date: 'Jan 2024' },
    { name: 'Tom R.', text: "Reliable, communicative, and genuinely cares about animals. Exactly what you want in a sitter.", date: 'Nov 2023' },
    { name: 'Priya S.', text: "My cat is very shy but bonded immediately with Sam. Came home to a happy, well-fed cat!", date: 'Sep 2023' },
  ],
  reviews: [
    { ownerName: 'Jessica L.', ownerAvatar: 'https://randomuser.me/api/portraits/women/22.jpg', rating: 5, text: "Sam was incredible — sent daily updates and left everything perfect. Our dog Max absolutely loved him!", date: 'Feb 2024', listing: 'Austin family home — 2 labs' },
    { ownerName: 'David K.', ownerAvatar: 'https://randomuser.me/api/portraits/men/55.jpg', rating: 5, text: "Professional, warm, and trustworthy. Sam handled our three cats with ease and kept in great contact throughout.", date: 'Dec 2023', listing: 'Denver apartment — 3 cats' },
    { ownerName: 'Sofia M.', ownerAvatar: 'https://randomuser.me/api/portraits/women/33.jpg', rating: 5, text: "Left my villa in perfect condition, sent beautiful photos every day. Will definitely have Sam back!", date: 'Oct 2023', listing: 'Barcelona villa — golden retriever' },
  ],
}

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
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const p = MOCK_PROFILE

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Cover / hero */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: p.coverPhoto }} style={styles.cover} contentFit="cover" />
          <View style={styles.coverOverlay} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <View style={styles.heroBottom}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: p.avatar }} style={styles.avatar} contentFit="cover" />
              {p.idVerified && (
                <View style={styles.verifiedDot}><Text style={{ fontSize: 9, color: Colors.white }}>✓</Text></View>
              )}
            </View>
            <View>
              <Text style={styles.heroName}>{p.firstName} {p.lastName}</Text>
              <Text style={styles.heroSub}>📍 {p.location} · Member since {p.memberSince}</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>

          {/* Stats */}
          <View style={styles.statsCard}>
            <View style={styles.stat}>
              <Text style={styles.statVal}>{p.rating}</Text>
              <Text style={styles.statLab}>Rating</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>{p.totalSits}</Text>
              <Text style={styles.statLab}>Sits</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>{p.responseRate}%</Text>
              <Text style={styles.statLab}>Response</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>{p.responseTime}</Text>
              <Text style={styles.statLab}>Reply time</Text>
            </View>
          </View>

          {/* Badges */}
          <View style={styles.chips}>
            {p.idVerified && <View style={styles.chip}><Text style={styles.chipText}>ID Verified ✓</Text></View>}
            {p.backgroundCheck && <View style={styles.chip}><Text style={styles.chipText}>Background Check ✓</Text></View>}
            <View style={[styles.chip, styles.premiumChip]}>
              <Text style={styles.premiumChipText}>⭐ Premium member</Text>
            </View>
          </View>

          {/* About */}
          <Text style={styles.sectionTitle}>About {p.firstName}</Text>
          <View style={styles.card}>
            <Text style={styles.bodyText}>{p.about}</Text>
          </View>

          {/* Why housesit */}
          <Text style={styles.sectionTitle}>Why {p.firstName} house sits</Text>
          <View style={styles.card}>
            <Text style={styles.bodyText}>{p.whyHousesit}</Text>
          </View>

          {/* Photos */}
          <Text style={styles.sectionTitle}>Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
            {p.photos.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.photo} contentFit="cover" />
            ))}
          </ScrollView>

          {/* Experience */}
          <Text style={styles.sectionTitle}>Pet experience</Text>
          <View style={styles.chipRow}>
            {p.petExperience.map(e => (
              <View key={e} style={styles.expChip}><Text style={styles.expChipText}>{e}</Text></View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Home types</Text>
          <View style={styles.chipRow}>
            {p.homeTypes.map(h => (
              <View key={h} style={styles.expChip}><Text style={styles.expChipText}>{h}</Text></View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.chipRow}>
            {p.skills.map(s => (
              <View key={s} style={[styles.expChip, { backgroundColor: Colors.tealPale }]}>
                <Text style={[styles.expChipText, { color: Colors.teal }]}>✓ {s}</Text>
              </View>
            ))}
          </View>

          {/* Co-sitter */}
          {p.coSitter && (
            <>
              <Text style={styles.sectionTitle}>Co-sitter</Text>
              <View style={styles.coCard}>
                <Image source={{ uri: p.coSitter.avatar }} style={styles.coAvatar} contentFit="cover" />
                <View>
                  <Text style={styles.coName}>{p.coSitter.name}</Text>
                  <Text style={styles.coRel}>{p.coSitter.relationship}</Text>
                </View>
              </View>
            </>
          )}

          {/* Availability */}
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.availList}>
            {p.availability.map((a, i) => (
              <View key={i} style={styles.availRow}>
                <Text style={styles.availDot}>●</Text>
                <Text style={styles.availText}>{a.from} → {a.to}</Text>
              </View>
            ))}
          </View>

          {/* References */}
          <Text style={styles.sectionTitle}>Personal references ({p.references.length})</Text>
          {p.references.map((r, i) => (
            <View key={i} style={styles.refCard}>
              <View style={styles.refHeader}>
                <Text style={styles.refName}>{r.name}</Text>
                <Text style={styles.refDate}>{r.date}</Text>
              </View>
              <Text style={styles.refText}>"{r.text}"</Text>
            </View>
          ))}

          {/* Reviews */}
          <Text style={styles.sectionTitle}>Reviews ({p.totalReviews})</Text>
          {p.reviews.map((r, i) => (
            <View key={i} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: r.ownerAvatar }} style={styles.reviewAvatar} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewName}>{r.ownerName}</Text>
                  <StarRow rating={r.rating} />
                </View>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
              <Text style={styles.reviewListing}>🏡 {r.listing}</Text>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}

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
  photoScroll: { marginBottom: 16, marginHorizontal: -20 },
  photo: { width: 180, height: 130, borderRadius: 14, marginRight: 10, marginLeft: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  expChip: { backgroundColor: Colors.sand, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  expChipText: { fontSize: 13, fontWeight: '600', color: Colors.navy },
  coCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 16, ...Shadows.card },
  coAvatar: { width: 48, height: 48, borderRadius: 24 },
  coName: { fontSize: 15, fontWeight: '700', color: Colors.navy },
  coRel: { fontSize: 12, color: Colors.gray },
  availList: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 16, gap: 8, ...Shadows.card },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  availDot: { color: Colors.teal, fontSize: 10 },
  availText: { fontSize: 14, fontWeight: '600', color: Colors.navy },
  refCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10, ...Shadows.card },
  refHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  refName: { fontSize: 13, fontWeight: '700', color: Colors.navy },
  refDate: { fontSize: 11, color: Colors.grayLight },
  refText: { fontSize: 13, color: Colors.gray, fontStyle: 'italic', lineHeight: 20 },
  reviewCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10, ...Shadows.card },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18 },
  reviewName: { fontSize: 13, fontWeight: '700', color: Colors.navy, marginBottom: 2 },
  reviewDate: { fontSize: 11, color: Colors.grayLight },
  reviewListing: { fontSize: 11, color: Colors.grayLight, marginBottom: 6 },
  reviewText: { fontSize: 13, color: Colors.gray, lineHeight: 20 },
  inviteBtn: { backgroundColor: Colors.teal, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8, ...Shadows.card },
  inviteBtnText: { fontSize: 16, fontWeight: '800', color: Colors.white },
})
