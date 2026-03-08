import { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Modal, TextInput, Platform, FlatList,
  ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Colors, Shadows } from '@/constants/colors'
import { useListing, useApply } from '@/src/hooks'
import { useAuthStore } from '@/src/store/auth'

const { width } = Dimensions.get('window')

const FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
]

const ADD_ONS = [
  { id: 'deep_clean',  icon: '🧹', label: 'Deep Clean',       desc: 'Professional deep clean before you return',    price: 45 },
  { id: 'pet_photos',  icon: '📸', label: 'Pet Photo Updates', desc: 'Daily photos of your pets sent to you',         price: 25 },
  { id: 'grocery',     icon: '🛒', label: 'Grocery Stocking',  desc: 'Home stocked with your essentials on return',  price: 30 },
  { id: 'plant_care',  icon: '🪴', label: 'Plant Care',        desc: 'Watering & care for all your plants',          price: 15 },
]

const PET_ICONS: Record<string, string> = {
  DOG: '🐕', CAT: '🐈', BIRD: '🦜', FISH: '🐠',
  REPTILE: '🦎', HORSE: '🐴', SMALL_PET: '🐹', POULTRY: '🐔',
}

function PhotoGallery({ photos, isPaid }: { photos: string[]; isPaid: boolean }) {
  const [idx, setIdx] = useState(0)
  const imgs = photos.length > 0 ? photos : FALLBACK_PHOTOS
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIdx(Math.round(e.nativeEvent.contentOffset.x / width))
  return (
    <View style={styles.galleryWrap}>
      <FlatList
        data={imgs}
        keyExtractor={(_, i) => String(i)}
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onScroll={onScroll} scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.galleryPhoto} contentFit="cover" transition={200} />
        )}
      />
      {imgs.length > 1 && (
        <View style={styles.dots}>
          {imgs.map((_, i) => <View key={i} style={[styles.dot, i === idx && styles.dotActive]} />)}
        </View>
      )}
      <View style={styles.photoCount}><Text style={styles.photoCountText}>{idx + 1} / {imgs.length}</Text></View>
      {isPaid && <View style={styles.paidBadge}><Text style={styles.paidBadgeText}>💰 PAID SIT</Text></View>}
    </View>
  )
}

export default function ListingDetailScreen() {
  const { id }  = useLocalSearchParams<{ id: string }>()
  const router  = useRouter()
  const user    = useAuthStore(s => s.user)
  const { data, isLoading, error } = useListing(id)
  const applyMutation = useApply()

  const [saved,       setSaved]       = useState(false)
  const [showApply,   setShowApply]   = useState(false)
  const [message,     setMessage]     = useState('')
  const [applied,     setApplied]     = useState(false)
  const [addOns,      setAddOns]      = useState<string[]>([])
  const [applyError,  setApplyError]  = useState('')

  const listing = data?.listing
  const isPaid  = listing?.sitType === 'PAID'
  const days    = listing
    ? Math.ceil((new Date(listing.endDate).getTime() - new Date(listing.startDate).getTime()) / 86400000)
    : 0
  const total      = isPaid && listing?.dailyRate ? listing.dailyRate * days : 0
  const addOnTotal = addOns.reduce((sum, id) => sum + (ADD_ONS.find(a => a.id === id)?.price ?? 0), 0)
  const isOwner    = listing?.owner?.id === user?.id

  const toggleAddOn = (id: string) =>
    setAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleApply = () => {
    if (!listing) return
    setApplyError('')
    applyMutation.mutate(
      { listingId: listing.id, message },
      {
        onSuccess: () => { setApplied(true); setShowApply(false) },
        onError: (err: any) => setApplyError(err?.message ?? 'Failed to send application.'),
      }
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBtn} onPress={() => router.back()}><Text style={styles.topBtnText}>←</Text></TouchableOpacity>
        </View>
        <View style={styles.loadingWrap}><ActivityIndicator size="large" color={Colors.teal} /></View>
      </SafeAreaView>
    )
  }

  if (error || !listing) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBtn} onPress={() => router.back()}><Text style={styles.topBtnText}>←</Text></TouchableOpacity>
        </View>
        <View style={styles.loadingWrap}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>😕</Text>
          <Text style={styles.errorText}>Couldn't load this listing</Text>
          <TouchableOpacity onPress={() => router.back()}><Text style={styles.errorBack}>Go back</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBtn} onPress={() => router.back()}><Text style={styles.topBtnText}>←</Text></TouchableOpacity>
        <TouchableOpacity style={styles.topBtn} onPress={() => setSaved(!saved)}><Text style={{ fontSize: 22 }}>{saved ? '❤️' : '🤍'}</Text></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <PhotoGallery photos={listing.photos ?? []} isPaid={isPaid} />

        <View style={styles.body}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.location}>📍 {listing.city}, {listing.country ?? listing.state}</Text>

          {/* Dates card */}
          <View style={styles.datesCard}>
            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>FROM</Text>
              <Text style={styles.dateDay}>{new Date(listing.startDate).getDate()}</Text>
              <Text style={styles.dateMonth}>{new Date(listing.startDate).toLocaleDateString('en-US', { month: 'short' })}</Text>
              <Text style={styles.dateYear}>{new Date(listing.startDate).getFullYear()}</Text>
            </View>
            <View style={styles.dateDivider}>
              <Text style={styles.dateDividerText}>{days}d</Text>
            </View>
            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>TO</Text>
              <Text style={styles.dateDay}>{new Date(listing.endDate).getDate()}</Text>
              <Text style={styles.dateMonth}>{new Date(listing.endDate).toLocaleDateString('en-US', { month: 'short' })}</Text>
              <Text style={styles.dateYear}>{new Date(listing.endDate).getFullYear()}</Text>
            </View>
            {isPaid && listing.dailyRate && (
              <View style={styles.rateBlock}>
                <Text style={styles.rateLabel}>TOTAL PAY</Text>
                <Text style={styles.rateAmount}>${total}</Text>
                <Text style={styles.rateBreak}>${listing.dailyRate}/day</Text>
              </View>
            )}
          </View>

          {/* Pets */}
          {(listing.pets ?? []).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🐾 Pets</Text>
              <View style={styles.petsRow}>
                {(listing.pets ?? []).map((p, i) => (
                  <View key={i} style={styles.petChip}>
                    <Text style={styles.petEmoji}>{PET_ICONS[p.type] ?? '🐾'}</Text>
                    <View>
                      <Text style={styles.petName}>{p.name}</Text>
                      {p.breed && <Text style={styles.petBreed}>{p.breed}</Text>}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Owner */}
          <TouchableOpacity style={styles.ownerCard} onPress={() => router.push(`/profile/${listing.owner.id}`)} activeOpacity={0.85}>
            {listing.owner.avatar ? (
              <Image source={{ uri: listing.owner.avatar }} style={styles.ownerAvatar} contentFit="cover" />
            ) : (
              <View style={[styles.ownerAvatar, { backgroundColor: Colors.grayPale, alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ fontSize: 22 }}>👤</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.ownerName}>{listing.owner.firstName} {listing.owner.lastName}</Text>
              <View style={styles.ownerRatingRow}>
                <Text style={{ color: '#F59E0B' }}>★</Text>
                <Text style={styles.ownerRatingText}>{listing.owner.averageRating?.toFixed(1) ?? '5.0'} · {listing.owner.totalReviews ?? 0} reviews</Text>
                {listing.owner.idVerified && (
                  <View style={styles.ownerVerified}><Text style={styles.ownerVerifiedText}>✓ ID</Text></View>
                )}
              </View>
            </View>
            <Text style={{ fontSize: 20, color: Colors.grayLight }}>›</Text>
          </TouchableOpacity>

          {/* Home details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏠 Home details</Text>
            <View style={styles.amenitiesGrid}>
              {listing.hasWifi    && <View style={styles.amenity}><Text>📶</Text><Text style={styles.amenityText}>Wifi</Text></View>}
              {listing.hasPool    && <View style={styles.amenity}><Text>🏊</Text><Text style={styles.amenityText}>Pool</Text></View>}
              {listing.hasParking && <View style={styles.amenity}><Text>🚗</Text><Text style={styles.amenityText}>Parking</Text></View>}
              {(listing as any).hasBackyard && <View style={styles.amenity}><Text>🌿</Text><Text style={styles.amenityText}>Backyard</Text></View>}
              {(listing as any).remoteWorkFriendly && <View style={styles.amenity}><Text>💻</Text><Text style={styles.amenityText}>Remote-friendly</Text></View>}
              {listing.isFamilyFriendly && <View style={styles.amenity}><Text>👨‍👩‍👧</Text><Text style={styles.amenityText}>Family-friendly</Text></View>}
              <View style={styles.amenity}>
                <Text>{listing.homeType === 'APARTMENT' ? '🏢' : listing.homeType === 'FARM' ? '🚜' : listing.homeType === 'VILLA' ? '🏯' : '🏠'}</Text>
                <Text style={styles.amenityText}>{listing.homeType ?? 'House'}</Text>
              </View>
              {listing.bedrooms  && <View style={styles.amenity}><Text>🛏</Text><Text style={styles.amenityText}>{listing.bedrooms} bed</Text></View>}
              {listing.bathrooms && <View style={styles.amenity}><Text>🛁</Text><Text style={styles.amenityText}>{listing.bathrooms} bath</Text></View>}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 About this sit</Text>
            <Text style={styles.descText}>
              {listing.description ?? `Welcome to ${listing.city}! We are looking for a caring sitter who will treat our home and pets like their own.${isPaid ? ` This is a paid sit — you will earn $${listing.dailyRate}/day.` : ' This is a free exchange sit.'}`}
            </Text>
          </View>

          {/* Add-ons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ Add-ons marketplace</Text>
            <Text style={styles.sectionSubtitle}>Offer these extras to stand out as an applicant</Text>
            {ADD_ONS.map(a => (
              <View key={a.id} style={styles.addOnRow}>
                <View style={styles.addOnIconWrap}><Text style={{ fontSize: 22 }}>{a.icon}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.addOnLabel}>{a.label}</Text>
                  <Text style={styles.addOnDesc}>{a.desc}</Text>
                </View>
                <View style={styles.addOnRight}>
                  <Text style={styles.addOnPrice}>+${a.price}</Text>
                  <TouchableOpacity
                    style={[styles.addOnBtn, addOns.includes(a.id) && styles.addOnBtnActive]}
                    onPress={() => toggleAddOn(a.id)}
                  >
                    <Text style={[styles.addOnBtnText, addOns.includes(a.id) && styles.addOnBtnTextActive]}>
                      {addOns.includes(a.id) ? '✓ Added' : 'Add'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Applications counter */}
          <View style={styles.appBar}>
            <View>
              <Text style={styles.appCountNum}>{listing._count?.applications ?? 0}</Text>
              <Text style={styles.appCountLabel}>applications sent</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <View style={styles.appProgressBg}>
                <View style={[styles.appProgressFill, { width: `${Math.min(100, ((listing._count?.applications ?? 0) / (listing.maxApplications ?? 10)) * 100)}%` as any }]} />
              </View>
              <Text style={styles.appNote}>{listing.maxApplications ?? 10} max spots</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bar */}
      {isOwner ? (
        <View style={styles.stickyBar}>
          <TouchableOpacity
            style={[styles.applyBtn, { backgroundColor: Colors.navy }]}
            onPress={() => router.push(`/owner/applicants?listingId=${listing.id}`)}
          >
            <Text style={styles.applyBtnText}>View applicants ({listing._count?.applications ?? 0})</Text>
          </TouchableOpacity>
        </View>
      ) : !applied ? (
        <View style={styles.stickyBar}>
          {addOns.length > 0 && <Text style={styles.addOnSummaryTop}>✨ +${addOnTotal} in add-ons selected</Text>}
          <TouchableOpacity style={styles.applyBtn} onPress={() => setShowApply(true)}>
            <Text style={styles.applyBtnText}>{isPaid ? `Apply to sit · Earn $${total + addOnTotal}` : 'Apply to sit · Free'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.stickyBar}>
          <View style={styles.appliedBanner}>
            <Text style={styles.appliedText}>✓ Application sent! You will be notified when they respond.</Text>
          </View>
        </View>
      )}

      {/* Apply modal */}
      <Modal visible={showApply} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowApply(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Apply to sit</Text>
            <TouchableOpacity onPress={() => setShowApply(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalBody}>
            <Text style={styles.modalSubtitle}>Introduce yourself to {listing.owner.firstName}</Text>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              multiline numberOfLines={6}
              placeholder={`Hi ${listing.owner.firstName}! I would love to sit for you...`}
              placeholderTextColor={Colors.grayLight}
              editable={!applyMutation.isPending}
            />
            <Text style={styles.charCount}>{message.length} / 20 min characters</Text>
            {applyError ? <View style={styles.errorBanner}><Text style={styles.errorBannerText}>{applyError}</Text></View> : null}
            {addOns.length > 0 && (
              <View style={styles.addOnSummaryCard}>
                <Text style={styles.addOnSummaryTitle}>Your selected add-ons:</Text>
                {addOns.map(id => {
                  const a = ADD_ONS.find(x => x.id === id)!
                  return <Text key={id} style={styles.addOnSummaryItem}>{a.icon} {a.label} · +${a.price}</Text>
                })}
                <Text style={styles.addOnSummaryTotal}>Total add-ons: +${addOnTotal}</Text>
              </View>
            )}
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.sendBtn, (message.length < 20 || applyMutation.isPending) && styles.sendBtnDisabled]}
              disabled={message.length < 20 || applyMutation.isPending}
              onPress={handleApply}
            >
              {applyMutation.isPending
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={styles.sendBtnText}>Send application →</Text>
              }
            </TouchableOpacity>
            {message.length < 20 && <Text style={styles.sendHint}>{20 - message.length} more characters needed</Text>}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const S = Shadows, C = Colors
const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: C.cream },
  loadingWrap:      { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  errorText:        { fontSize: 16, color: C.gray },
  errorBack:        { fontSize: 15, color: C.teal, fontWeight: '600', marginTop: 8 },
  topBar:           { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 10 },
  topBtn:           { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', ...S.card },
  topBtnText:       { fontSize: 20, color: C.navy },
  galleryWrap:      { position: 'relative', height: 300 },
  galleryPhoto:     { width, height: 300 },
  dots:             { position: 'absolute', bottom: 14, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot:              { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive:        { backgroundColor: C.white, width: 18 },
  photoCount:       { position: 'absolute', bottom: 14, right: 14, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  photoCountText:   { color: C.white, fontSize: 12, fontWeight: '600' },
  paidBadge:        { position: 'absolute', top: Platform.OS === 'ios' ? 100 : 60, left: 16, backgroundColor: '#10B981', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  paidBadgeText:    { color: '#fff', fontWeight: '700', fontSize: 13 },
  body:             { padding: 20, gap: 18 },
  title:            { fontSize: 22, fontWeight: '800', color: C.navy, lineHeight: 28 },
  location:         { fontSize: 14, color: C.gray, marginTop: -10 },
  datesCard:        { backgroundColor: C.white, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', ...S.card },
  dateBlock:        { alignItems: 'center', gap: 2 },
  dateLabel:        { fontSize: 10, fontWeight: '700', color: C.gray, letterSpacing: 1 },
  dateDay:          { fontSize: 32, fontWeight: '800', color: C.navy },
  dateMonth:        { fontSize: 14, fontWeight: '600', color: C.teal },
  dateYear:         { fontSize: 12, color: C.gray },
  dateDivider:      { alignItems: 'center' },
  dateDividerText:  { fontSize: 13, fontWeight: '700', color: C.gray, backgroundColor: C.grayPale, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  rateBlock:        { alignItems: 'center', borderLeftWidth: 1, borderLeftColor: C.sand, paddingLeft: 16 },
  rateLabel:        { fontSize: 10, fontWeight: '700', color: C.gray, letterSpacing: 1 },
  rateAmount:       { fontSize: 24, fontWeight: '800', color: '#10B981' },
  rateBreak:        { fontSize: 12, color: C.gray },
  section:          { gap: 12 },
  sectionTitle:     { fontSize: 16, fontWeight: '700', color: C.navy },
  sectionSubtitle:  { fontSize: 13, color: C.gray, marginTop: -6 },
  petsRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  petChip:          { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.tealPale, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10 },
  petEmoji:         { fontSize: 20 },
  petName:          { fontSize: 14, fontWeight: '600', color: C.tealDark },
  petBreed:         { fontSize: 12, color: C.gray },
  ownerCard:        { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 16, padding: 14, ...S.card },
  ownerAvatar:      { width: 52, height: 52, borderRadius: 26 },
  ownerName:        { fontSize: 15, fontWeight: '700', color: C.navy },
  ownerRatingRow:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2, flexWrap: 'wrap' },
  ownerRatingText:  { fontSize: 13, color: C.gray },
  ownerVerified:    { backgroundColor: C.tealPale, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  ownerVerifiedText:{ fontSize: 11, fontWeight: '700', color: C.tealDark },
  amenitiesGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenity:          { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.white, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, ...S.card },
  amenityText:      { fontSize: 13, color: C.navy, fontWeight: '500' },
  descText:         { fontSize: 14, color: C.gray, lineHeight: 22 },
  addOnRow:         { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 14, padding: 14, ...S.card },
  addOnIconWrap:    { width: 44, height: 44, borderRadius: 12, backgroundColor: C.tealPale, alignItems: 'center', justifyContent: 'center' },
  addOnLabel:       { fontSize: 14, fontWeight: '700', color: C.navy },
  addOnDesc:        { fontSize: 12, color: C.gray, marginTop: 2 },
  addOnRight:       { alignItems: 'center', gap: 6 },
  addOnPrice:       { fontSize: 13, fontWeight: '700', color: '#10B981' },
  addOnBtn:         { backgroundColor: C.grayPale, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1.5, borderColor: C.sand },
  addOnBtnActive:   { backgroundColor: C.tealPale, borderColor: C.teal },
  addOnBtnText:     { fontSize: 13, fontWeight: '600', color: C.gray },
  addOnBtnTextActive: { color: C.tealDark },
  appBar:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.white, borderRadius: 14, padding: 14, ...S.card },
  appCountNum:      { fontSize: 28, fontWeight: '800', color: C.navy },
  appCountLabel:    { fontSize: 13, color: C.gray },
  appProgressBg:    { width: 100, height: 6, backgroundColor: C.sand, borderRadius: 3, overflow: 'hidden' },
  appProgressFill:  { height: '100%', backgroundColor: C.teal, borderRadius: 3 },
  appNote:          { fontSize: 12, color: C.gray },
  stickyBar:        { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.sand, padding: 16, paddingBottom: Platform.OS === 'ios' ? 28 : 16, gap: 8 },
  addOnSummaryTop:  { fontSize: 13, color: '#10B981', fontWeight: '600', textAlign: 'center' },
  applyBtn:         { backgroundColor: C.teal, borderRadius: 14, paddingVertical: 16, alignItems: 'center', ...S.strong },
  applyBtnText:     { color: C.white, fontSize: 16, fontWeight: '700' },
  appliedBanner:    { backgroundColor: '#D1FAE5', borderRadius: 14, padding: 14, alignItems: 'center' },
  appliedText:      { fontSize: 14, color: '#065F46', fontWeight: '600', textAlign: 'center' },
  modalSafe:        { flex: 1, backgroundColor: C.white },
  modalHeader:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: C.sand },
  modalTitle:       { fontSize: 18, fontWeight: '700', color: C.navy },
  modalClose:       { fontSize: 18, color: C.gray, padding: 4 },
  modalBody:        { padding: 20, gap: 12 },
  modalSubtitle:    { fontSize: 14, color: C.gray },
  messageInput:     { backgroundColor: C.grayPale, borderRadius: 14, padding: 14, fontSize: 15, color: C.navy, minHeight: 140, textAlignVertical: 'top', borderWidth: 1, borderColor: C.sand },
  charCount:        { fontSize: 12, color: C.grayLight, textAlign: 'right', marginTop: -4 },
  errorBanner:      { backgroundColor: '#FEE2E2', borderRadius: 12, padding: 12 },
  errorBannerText:  { fontSize: 13, color: '#991B1B', fontWeight: '500' },
  addOnSummaryCard: { backgroundColor: C.tealPale, borderRadius: 14, padding: 14, gap: 6 },
  addOnSummaryTitle:{ fontSize: 14, fontWeight: '700', color: C.navy },
  addOnSummaryItem: { fontSize: 13, color: C.tealDark },
  addOnSummaryTotal:{ fontSize: 14, fontWeight: '700', color: '#10B981', marginTop: 4 },
  modalFooter:      { padding: 20, gap: 8, borderTopWidth: 1, borderTopColor: C.sand },
  sendBtn:          { backgroundColor: C.teal, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  sendBtnDisabled:  { backgroundColor: C.grayLight },
  sendBtnText:      { color: C.white, fontSize: 16, fontWeight: '700' },
  sendHint:         { fontSize: 12, color: C.gray, textAlign: 'center' },
})
