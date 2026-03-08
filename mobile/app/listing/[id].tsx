import { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Modal, TextInput, Platform, ActivityIndicator,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Colors, Shadows } from '@/constants/colors'
import { useListing, useApply } from '../../src/hooks'
import { useAuthStore } from '../../src/store/auth'

const { width } = Dimensions.get('window')

const ADD_ONS = [
  { id: 'deep_clean',  icon: '🧹', label: 'Deep Clean',       desc: 'Professional deep clean before you return', price: 45 },
  { id: 'pet_photos',  icon: '📸', label: 'Pet Photo Updates', desc: 'Daily photos of your pets sent to you',      price: 25 },
  { id: 'grocery',     icon: '🛒', label: 'Grocery Stocking',  desc: 'Home stocked with your list when you return', price: 30 },
  { id: 'plant_care',  icon: '🪴', label: 'Plant Care',        desc: 'Watering & care for all your plants',         price: 15 },
]

export default function ListingDetailScreen() {
  const { id }  = useLocalSearchParams<{ id: string }>()
  const router  = useRouter()
  const user    = useAuthStore((s) => s.user)

  const { data, isLoading, isError } = useListing(id ?? '')
  const applyMutation = useApply()

  const [saved,        setSaved]        = useState(false)
  const [showApply,    setShowApply]    = useState(false)
  const [message,      setMessage]      = useState('')
  const [applied,      setApplied]      = useState(false)
  const [addOns,       setAddOns]       = useState<string[]>([])
  const [applyError,   setApplyError]   = useState('')

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.teal} />
        </View>
      </SafeAreaView>
    )
  }

  if (isError || !data?.listing) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBtn} onPress={() => router.back()}>
            <Text style={styles.topBtnText}>←</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>😕</Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.navy }}>Listing not found</Text>
          <Text style={{ fontSize: 14, color: Colors.gray, marginTop: 8 }}>This sit may have been filled or removed.</Text>
        </View>
      </SafeAreaView>
    )
  }

  const listing = data.listing
  const isPaid  = listing.sitType === 'PAID'
  const days    = Math.ceil((new Date(listing.endDate).getTime() - new Date(listing.startDate).getTime()) / 86400000)
  const total   = isPaid && listing.dailyRate ? listing.dailyRate * days : 0
  const addOnTotal = addOns.reduce((sum, id) => sum + (ADD_ONS.find(a => a.id === id)?.price ?? 0), 0)

  const petIcons: Record<string, string> = { DOG:'🐕', CAT:'🐈', BIRD:'🦜', FISH:'🐠', REPTILE:'🦎', HORSE:'🐴', SMALL_PET:'🐹' }

  const toggleAddOn = (id: string) =>
    setAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  async function handleApply() {
    if (message.length < 20) return
    setApplyError('')
    try {
      await applyMutation.mutateAsync({ listingId: listing.id, message })
      setApplied(true)
      setShowApply(false)
    } catch (e: any) {
      setApplyError(e?.message ?? 'Failed to apply. Please try again.')
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Back + heart header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBtn} onPress={() => router.back()}>
          <Text style={styles.topBtnText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBtn} onPress={() => setSaved(!saved)}>
          <Text style={{ fontSize: 22 }}>{saved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero photo */}
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: listing.photos?.[0] ?? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800' }}
            style={styles.hero}
            contentFit="cover"
            transition={300}
          />
          {isPaid && (
            <View style={styles.paidBadge}><Text style={styles.paidBadgeText}>💰 PAID SIT</Text></View>
          )}
        </View>

        <View style={styles.body}>
          {/* Title + location */}
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.location}>📍 {listing.city}, {listing.country ?? listing.state}</Text>

          {/* Dates card */}
          <View style={styles.datesCard}>
            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>FROM</Text>
              <Text style={styles.dateDay}>{new Date(listing.startDate).getDate()}</Text>
              <Text style={styles.dateMonth}>{new Date(listing.startDate).toLocaleDateString('en-US',{month:'short'})}</Text>
              <Text style={styles.dateYear}>{new Date(listing.startDate).getFullYear()}</Text>
            </View>
            <View style={styles.dateDivider}>
              <Text style={styles.dateDividerText}>{days}d</Text>
            </View>
            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>TO</Text>
              <Text style={styles.dateDay}>{new Date(listing.endDate).getDate()}</Text>
              <Text style={styles.dateMonth}>{new Date(listing.endDate).toLocaleDateString('en-US',{month:'short'})}</Text>
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
                    <Text style={styles.petEmoji}>{petIcons[p.type] ?? '🐾'}</Text>
                    <Text style={styles.petName}>{p.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Owner */}
          <View style={styles.ownerCard}>
            <Image
              source={{ uri: listing.owner?.avatar ?? 'https://randomuser.me/api/portraits/women/44.jpg' }}
              style={styles.ownerAvatar}
              contentFit="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.ownerName}>{listing.owner?.firstName} {listing.owner?.lastName}</Text>
              <View style={styles.ownerRating}>
                <Text style={{ color: '#F59E0B' }}>★</Text>
                <Text style={styles.ownerRatingText}>{listing.owner?.averageRating?.toFixed(1) ?? '5.0'} · {listing.owner?.totalReviews ?? 0} reviews</Text>
              </View>
              {listing.owner?.idVerified && (
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                  <View style={styles.badge}><Text style={styles.badgeText}>✓ ID</Text></View>
                  {listing.owner?.backgroundCheck && <View style={styles.badge}><Text style={styles.badgeText}>✓ BG Check</Text></View>}
                </View>
              )}
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏠 Home details</Text>
            <View style={styles.amenitiesRow}>
              {listing.hasWifi    && <View style={styles.amenity}><Text>📶</Text><Text style={styles.amenityText}>Wifi</Text></View>}
              {listing.hasPool    && <View style={styles.amenity}><Text>🏊</Text><Text style={styles.amenityText}>Pool</Text></View>}
              {listing.hasParking && <View style={styles.amenity}><Text>🚗</Text><Text style={styles.amenityText}>Parking</Text></View>}
              {listing.bedrooms   && <View style={styles.amenity}><Text>🛏️</Text><Text style={styles.amenityText}>{listing.bedrooms} bed</Text></View>}
              {listing.bathrooms  && <View style={styles.amenity}><Text>🛁</Text><Text style={styles.amenityText}>{listing.bathrooms} bath</Text></View>}
              <View style={styles.amenity}><Text>{listing.homeType === 'APARTMENT' ? '🏢' : '🏠'}</Text><Text style={styles.amenityText}>{listing.homeType ?? 'House'}</Text></View>
            </View>
          </View>

          {/* Description */}
          {listing.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 About this sit</Text>
              <Text style={styles.descText}>{listing.description}</Text>
            </View>
          )}

          {/* Add-ons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ Add-ons</Text>
            <Text style={styles.sectionSubtitle}>Upgrade your stay for the homeowner</Text>
            {ADD_ONS.map(a => (
              <View key={a.id} style={styles.addOnRow}>
                <View style={styles.addOnIcon}><Text style={{ fontSize: 22 }}>{a.icon}</Text></View>
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

          {/* Applications */}
          <View style={styles.appBar}>
            <View style={styles.appCount}>
              <Text style={styles.appCountNum}>{listing._count?.applications ?? 0}</Text>
              <Text style={styles.appCountLabel}>applications</Text>
            </View>
            <Text style={styles.appNote}>of {listing.maxApplications ?? 10} max spots</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky apply bar */}
      {!applied ? (
        <View style={styles.stickyBar}>
          {addOns.length > 0 && (
            <Text style={styles.addOnSummary}>+${addOnTotal} in add-ons selected</Text>
          )}
          <TouchableOpacity style={styles.applyBtn} onPress={() => setShowApply(true)}>
            <Text style={styles.applyBtnText}>
              {isPaid ? `Apply to sit · Earn $${total}` : 'Apply to sit · Free'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.stickyBar}>
          <View style={styles.appliedBanner}>
            <Text style={styles.appliedText}>✓ Application sent! We'll notify you when they respond.</Text>
          </View>
        </View>
      )}

      {/* Apply modal */}
      <Modal visible={showApply} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowApply(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Apply to sit</Text>
            <TouchableOpacity onPress={() => setShowApply(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalBody}>
            <Text style={styles.modalSubtitle}>Introduce yourself to {listing.owner?.firstName}</Text>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              placeholder={`Hi ${listing.owner?.firstName}! I'd love to sit for you. A little about me...`}
              placeholderTextColor={Colors.grayLight}
              editable={!applyMutation.isPending}
            />
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
            {applyError ? <Text style={styles.errorText}>{applyError}</Text> : null}
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.sendBtn, (message.length < 20 || applyMutation.isPending) && styles.sendBtnDisabled]}
              disabled={message.length < 20 || applyMutation.isPending}
              onPress={handleApply}
            >
              {applyMutation.isPending
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={styles.sendBtnText}>Send application</Text>
              }
            </TouchableOpacity>
            {message.length < 20 && <Text style={styles.sendHint}>Write at least 20 characters</Text>}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const S = Shadows
const C = Colors
const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: C.cream },
  topBar:           { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 10 },
  topBtn:           { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', ...S.card },
  topBtnText:       { fontSize: 20, color: C.navy },
  heroWrap:         { position: 'relative', height: 280 },
  hero:             { width: '100%', height: '100%' },
  paidBadge:        { position: 'absolute', bottom: 14, left: 16, backgroundColor: '#10B981', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  paidBadgeText:    { color: '#fff', fontWeight: '700', fontSize: 13 },
  body:             { padding: 20, gap: 16 },
  title:            { fontSize: 22, fontWeight: '800', color: C.navy, lineHeight: 28 },
  location:         { fontSize: 14, color: C.gray },
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
  section:          { gap: 10 },
  sectionTitle:     { fontSize: 16, fontWeight: '700', color: C.navy },
  sectionSubtitle:  { fontSize: 13, color: C.gray, marginTop: -6 },
  petsRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  petChip:          { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.tealPale, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  petEmoji:         { fontSize: 18 },
  petName:          { fontSize: 14, fontWeight: '600', color: C.tealDark },
  badge:            { backgroundColor: C.tealPale, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText:        { fontSize: 11, fontWeight: '600', color: C.tealDark },
  ownerCard:        { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 16, padding: 14, ...S.card },
  ownerAvatar:      { width: 52, height: 52, borderRadius: 26 },
  ownerName:        { fontSize: 15, fontWeight: '700', color: C.navy },
  ownerRating:      { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ownerRatingText:  { fontSize: 13, color: C.gray },
  amenitiesRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  amenity:          { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.white, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, ...S.card },
  amenityText:      { fontSize: 13, color: C.navy, fontWeight: '500' },
  descText:         { fontSize: 14, color: C.gray, lineHeight: 22 },
  addOnRow:         { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 14, padding: 14, ...S.card },
  addOnIcon:        { width: 44, height: 44, borderRadius: 12, backgroundColor: C.tealPale, alignItems: 'center', justifyContent: 'center' },
  addOnLabel:       { fontSize: 14, fontWeight: '700', color: C.navy },
  addOnDesc:        { fontSize: 12, color: C.gray, marginTop: 2 },
  addOnRight:       { alignItems: 'center', gap: 6 },
  addOnPrice:       { fontSize: 13, fontWeight: '700', color: '#10B981' },
  addOnBtn:         { backgroundColor: C.grayPale, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1.5, borderColor: C.sand },
  addOnBtnActive:   { backgroundColor: C.tealPale, borderColor: C.teal },
  addOnBtnText:     { fontSize: 13, fontWeight: '600', color: C.gray },
  addOnBtnTextActive: { color: C.tealDark },
  appBar:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.white, borderRadius: 14, padding: 14, ...S.card },
  appCount:         { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  appCountNum:      { fontSize: 28, fontWeight: '800', color: C.navy },
  appCountLabel:    { fontSize: 13, color: C.gray },
  appNote:          { fontSize: 13, color: C.gray },
  stickyBar:        { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.sand, padding: 16, gap: 8 },
  addOnSummary:     { fontSize: 13, color: '#10B981', fontWeight: '600', textAlign: 'center' },
  applyBtn:         { backgroundColor: C.teal, borderRadius: 14, paddingVertical: 16, alignItems: 'center', ...S.strong },
  applyBtnText:     { color: C.white, fontSize: 16, fontWeight: '700' },
  appliedBanner:    { backgroundColor: '#D1FAE5', borderRadius: 14, padding: 14, alignItems: 'center' },
  appliedText:      { fontSize: 14, color: '#065F46', fontWeight: '600', textAlign: 'center' },
  errorText:        { color: Colors.red, fontSize: 13, textAlign: 'center' },
  modalSafe:        { flex: 1, backgroundColor: C.white },
  modalHeader:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: C.sand },
  modalTitle:       { fontSize: 18, fontWeight: '700', color: C.navy },
  modalClose:       { fontSize: 18, color: C.gray, padding: 4 },
  modalBody:        { padding: 20, gap: 16 },
  modalSubtitle:    { fontSize: 14, color: C.gray },
  messageInput:     { backgroundColor: C.grayPale, borderRadius: 14, padding: 14, fontSize: 15, color: C.navy, minHeight: 140, textAlignVertical: 'top', borderWidth: 1, borderColor: C.sand },
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
