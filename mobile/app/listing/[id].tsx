import { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Modal, TextInput, ActivityIndicator,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Colors, Shadows } from '@/constants/colors'
import { MOCK_LISTINGS, PET_ICONS, SIT_TYPE_COLORS, SIT_TYPE_LABELS } from '@/constants/mock-data'

const { width } = Dimensions.get('window')

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router  = useRouter()
  const listing = MOCK_LISTINGS.find((l) => l.id === id) ?? MOCK_LISTINGS[0]

  const [saved, setSaved]         = useState(false)
  const [showApply, setShowApply] = useState(false)
  const [message, setMessage]     = useState('')
  const [applying, setApplying]   = useState(false)
  const [applied, setApplied]     = useState(false)

  const isPaid  = listing.sitType === 'PAID'
  const hasDogs = listing.pets.some((p) => p.type === 'DOG')
  const days    = Math.ceil(
    (new Date(listing.endDate).getTime() - new Date(listing.startDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  const total      = isPaid && listing.dailyRate ? listing.dailyRate * days : 0
  const sittersGet = Math.round(total * 0.92)

  async function handleApply() {
    if (message.length < 50) return
    setApplying(true)
    await new Promise((r) => setTimeout(r, 1000))
    setApplying(false)
    setApplied(true)
    setTimeout(() => { setShowApply(false); setApplied(false) }, 1800)
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Photo */}
        <View style={styles.photoWrap}>
          <Image source={{ uri: listing.photos[0] }} style={styles.photo} contentFit="cover" transition={300} />
          {/* Back + save overlay */}
          <SafeAreaView style={styles.photoOverlay}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backBtnText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={() => setSaved(!saved)}>
              <Text style={{ fontSize: 20 }}>{saved ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </SafeAreaView>
          {/* Type badge */}
          <View style={[styles.typeBadge, { backgroundColor: SIT_TYPE_COLORS[listing.sitType] }]}>
            <Text style={styles.typeBadgeText}>{SIT_TYPE_LABELS[listing.sitType]}</Text>
          </View>
        </View>

        <View style={styles.body}>

          {/* Title + location */}
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.location}>📍 {listing.city}, {listing.state}</Text>

          {/* Dates */}
          <View style={styles.datesRow}>
            <View style={styles.dateBox}>
              <Text style={styles.dateMon}>{new Date(listing.startDate).toLocaleString('en-US', { month: 'short' }).toUpperCase()}</Text>
              <Text style={styles.dateDay}>{new Date(listing.startDate).getDate()}</Text>
              <Text style={styles.dateYear}>{new Date(listing.startDate).getFullYear()}</Text>
            </View>
            <View style={styles.dateSep}><Text style={styles.dateSepText}>→</Text><Text style={styles.daysText}>{days} days</Text></View>
            <View style={styles.dateBox}>
              <Text style={styles.dateMon}>{new Date(listing.endDate).toLocaleString('en-US', { month: 'short' }).toUpperCase()}</Text>
              <Text style={styles.dateDay}>{new Date(listing.endDate).getDate()}</Text>
              <Text style={styles.dateYear}>{new Date(listing.endDate).getFullYear()}</Text>
            </View>
          </View>

          {/* Escrow notice for paid sits */}
          {isPaid && (
            <View style={styles.escrowBanner}>
              <Text style={styles.escrowIcon}>🔒</Text>
              <View>
                <Text style={styles.escrowTitle}>Payment held securely in escrow</Text>
                <Text style={styles.escrowSub}>Released to sitter 24 hrs after sit ends</Text>
              </View>
            </View>
          )}

          {/* Owner card */}
          <View style={styles.ownerCard}>
            <View style={styles.ownerAvatar}>
              <Text style={{ fontSize: 24 }}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ownerName}>{listing.owner.firstName}</Text>
              <Text style={styles.ownerMeta}>
                ⭐ {listing.owner.averageRating} · {listing.owner.totalReviews} reviews
              </Text>
              <View style={styles.verifiedChips}>
                <Text style={styles.chip}>ID ✓</Text>
                <Text style={styles.chip}>Member ✓</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.msgBtn}>
              <Text style={styles.msgBtnText}>💬 Message</Text>
            </TouchableOpacity>
          </View>

          {/* Pets */}
          {listing.pets.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pets</Text>
              <View style={styles.petsGrid}>
                {listing.pets.map((pet, i) => (
                  <View key={i} style={styles.petCard}>
                    <Text style={styles.petEmoji}>{PET_ICONS[pet.type]}</Text>
                    <Text style={styles.petName}>{pet.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {[
                listing.hasWifi && '📶 WiFi',
                listing.hasPool && '🏊 Pool',
                listing.hasParking && '🚗 Parking',
                hasDogs && '🐕 Dog walks needed',
              ].filter(Boolean).map((a) => (
                <View key={a as string} style={styles.amenityChip}>
                  <Text style={styles.amenityText}>{a as string}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Tip note */}
          <View style={styles.tipBox}>
            <Text style={styles.tipEmoji}>💛</Text>
            <View>
              <Text style={styles.tipTitle}>Tips are always welcome</Text>
              <Text style={styles.tipSub}>Haven takes 0% of tips — 100% goes to you.</Text>
            </View>
          </View>

          {/* Applications count */}
          <View style={styles.appRow}>
            <View style={styles.appBarBg}>
              <View style={[styles.appBarFill, {
                width: `${(listing.applicationCount / listing.maxApplications) * 100}%` as any
              }]} />
            </View>
            <Text style={styles.appText}>
              {listing.applicationCount} of {listing.maxApplications} applications
            </Text>
          </View>

          {/* Haven guarantee */}
          <View style={styles.guaranteeBox}>
            <Text style={styles.guaranteeTitle}>🛡️ Haven Guarantee</Text>
            <Text style={styles.guaranteeSub}>Up to $1,000 property protection included free on every sit.</Text>
          </View>

        </View>
      </ScrollView>

      {/* Sticky apply bar */}
      <View style={styles.stickyBar}>
        <View>
          {isPaid && listing.dailyRate ? (
            <>
              <Text style={styles.stickyPrice}>${listing.dailyRate}<Text style={styles.stickyUnit}>/day</Text></Text>
              <Text style={styles.stickyEarns}>You receive ${sittersGet} total</Text>
            </>
          ) : (
            <Text style={styles.stickyFree}>Free exchange</Text>
          )}
        </View>
        <TouchableOpacity style={styles.applyBtn} onPress={() => setShowApply(true)} activeOpacity={0.85}>
          <Text style={styles.applyBtnText}>Apply now</Text>
        </TouchableOpacity>
      </View>

      {/* Apply modal */}
      <Modal visible={showApply} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Apply to this sit</Text>
            <TouchableOpacity onPress={() => setShowApply(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          {applied ? (
            <View style={styles.appliedState}>
              <Text style={styles.appliedEmoji}>🎉</Text>
              <Text style={styles.appliedTitle}>Application sent!</Text>
              <Text style={styles.appliedSub}>
                {listing.owner.firstName} will be in touch soon.
              </Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.modalBody}>
              <Text style={styles.modalLabel}>
                Introduce yourself to {listing.owner.firstName}
              </Text>
              <Text style={styles.modalHint}>
                Min. 50 characters. Tell them about your experience and why you love their listing.
              </Text>
              <TextInput
                style={styles.modalTextarea}
                multiline
                numberOfLines={6}
                value={message}
                onChangeText={setMessage}
                placeholder={`Hi ${listing.owner.firstName}! I'd love to care for your home and pets…`}
                placeholderTextColor={Colors.grayLight}
              />
              <Text style={styles.charCount}>{message.length} / 1000</Text>

              <TouchableOpacity
                style={[styles.sendBtn, (message.length < 50 || applying) && styles.sendBtnDisabled]}
                onPress={handleApply}
                disabled={message.length < 50 || applying}
              >
                {applying
                  ? <ActivityIndicator color={Colors.white} />
                  : <Text style={styles.sendBtnText}>Send application</Text>
                }
              </TouchableOpacity>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  photoWrap: { height: 320, position: 'relative' },
  photo: { width: '100%', height: '100%' },
  photoOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 4,
  },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 18, color: Colors.navy },
  saveBtn: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  typeBadge: { position: 'absolute', bottom: 14, left: 16, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  typeBadgeText: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  body: { paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.navy, letterSpacing: -0.5, marginBottom: 6 },
  location: { fontSize: 14, color: Colors.gray, marginBottom: 16 },
  datesRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 },
  dateBox: { alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, padding: 12, minWidth: 72, ...Shadows.card },
  dateMon: { fontSize: 11, fontWeight: '700', color: Colors.teal, letterSpacing: 1 },
  dateDay: { fontSize: 30, fontWeight: '800', color: Colors.navy, lineHeight: 34 },
  dateYear: { fontSize: 11, color: Colors.gray },
  dateSep: { alignItems: 'center', gap: 4 },
  dateSepText: { fontSize: 20, color: Colors.grayLight },
  daysText: { fontSize: 11, color: Colors.gray, fontWeight: '600' },
  escrowBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.tealPale, borderRadius: 14, padding: 12, marginBottom: 16,
  },
  escrowIcon: { fontSize: 20 },
  escrowTitle: { fontSize: 13, fontWeight: '700', color: Colors.tealDark },
  escrowSub: { fontSize: 12, color: Colors.teal, marginTop: 1 },
  ownerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 20, ...Shadows.card,
  },
  ownerAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.tealPale, alignItems: 'center', justifyContent: 'center' },
  ownerName: { fontSize: 15, fontWeight: '700', color: Colors.navy },
  ownerMeta: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  verifiedChips: { flexDirection: 'row', gap: 6, marginTop: 4 },
  chip: { fontSize: 10, fontWeight: '700', color: Colors.tealDark, backgroundColor: Colors.tealPale, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  msgBtn: { backgroundColor: Colors.tealPale, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  msgBtnText: { fontSize: 13, fontWeight: '600', color: Colors.tealDark },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.navy, marginBottom: 10 },
  petsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  petCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 12, alignItems: 'center', minWidth: 72, ...Shadows.card },
  petEmoji: { fontSize: 28, marginBottom: 4 },
  petName: { fontSize: 11, fontWeight: '600', color: Colors.navy },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: { backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, ...Shadows.card },
  amenityText: { fontSize: 13, fontWeight: '500', color: Colors.navy },
  tipBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFBEB', borderRadius: 14, padding: 12, marginBottom: 16 },
  tipEmoji: { fontSize: 22 },
  tipTitle: { fontSize: 13, fontWeight: '700', color: '#92400E' },
  tipSub: { fontSize: 12, color: '#B45309', marginTop: 1 },
  appRow: { marginBottom: 16 },
  appBarBg: { height: 5, backgroundColor: Colors.sand, borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  appBarFill: { height: '100%', backgroundColor: Colors.teal, borderRadius: 4 },
  appText: { fontSize: 12, color: Colors.grayLight },
  guaranteeBox: { backgroundColor: Colors.navy, borderRadius: 16, padding: 14, marginBottom: 8 },
  guaranteeTitle: { fontSize: 14, fontWeight: '700', color: Colors.white, marginBottom: 4 },
  guaranteeSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  stickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, paddingHorizontal: 20, paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1, borderTopColor: Colors.sand,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    ...Shadows.strong,
  },
  stickyPrice: { fontSize: 22, fontWeight: '800', color: Colors.navy },
  stickyUnit: { fontSize: 13, fontWeight: '500', color: Colors.gray },
  stickyEarns: { fontSize: 11, color: Colors.teal, fontWeight: '600', marginTop: 2 },
  stickyFree: { fontSize: 20, fontWeight: '800', color: Colors.emerald },
  applyBtn: { backgroundColor: Colors.teal, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 16 },
  applyBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  modalSafe: { flex: 1, backgroundColor: Colors.cream },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.sand,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.navy },
  modalClose: { fontSize: 18, color: Colors.gray, padding: 4 },
  modalBody: { padding: 20 },
  modalLabel: { fontSize: 15, fontWeight: '700', color: Colors.navy, marginBottom: 4 },
  modalHint: { fontSize: 13, color: Colors.gray, marginBottom: 12, lineHeight: 18 },
  modalTextarea: {
    borderWidth: 1.5, borderColor: Colors.sand, borderRadius: 14,
    padding: 14, fontSize: 15, color: Colors.navy,
    backgroundColor: Colors.white, minHeight: 140, textAlignVertical: 'top',
  },
  charCount: { fontSize: 12, color: Colors.grayLight, textAlign: 'right', marginTop: 4, marginBottom: 20 },
  sendBtn: { backgroundColor: Colors.teal, borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  appliedState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  appliedEmoji: { fontSize: 60, marginBottom: 16 },
  appliedTitle: { fontSize: 24, fontWeight: '800', color: Colors.navy, marginBottom: 8 },
  appliedSub: { fontSize: 15, color: Colors.gray, textAlign: 'center' },
})
