import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Colors, Shadows } from '@/constants/colors'

const APPLICANTS = [
  {
    id: '1', firstName: 'Sarah', lastName: 'Johnson', avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    rating: 4.9, reviews: 47, sits: 62, verified: true, idCheck: true, bgCheck: true,
    message: "Hi! I'm a retired teacher who has been house sitting for 4 years. I absolutely love animals and would treat your home with the utmost care. I have experience with dogs, cats, and small animals.",
    appliedAt: '2 hours ago', addOns: ['🧹 Deep Clean', '📸 Pet Photos'],
  },
  {
    id: '2', firstName: 'Marcus', lastName: 'Lee', avatar: 'https://randomuser.me/api/portraits/men/28.jpg',
    rating: 4.7, reviews: 23, sits: 31, verified: true, idCheck: true, bgCheck: false,
    message: "Hey! I work remotely so I can dedicate full attention to your pets. I have two dogs of my own (golden retrievers) so I'm very experienced. Would love to hear more about your listing!",
    appliedAt: '5 hours ago', addOns: [],
  },
  {
    id: '3', firstName: 'Emma', lastName: 'Torres', avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    rating: 5.0, reviews: 12, sits: 15, verified: true, idCheck: true, bgCheck: true,
    message: "I'm a vet tech with 8 years of experience caring for animals of all kinds. Your pets would be in excellent hands. I'm thorough, tidy, and always send daily photo updates!",
    appliedAt: '1 day ago', addOns: ['📸 Pet Photos', '🪴 Plant Care'],
  },
]

export default function ApplicantsScreen() {
  const router = useRouter()
  const [selected, setSelected]         = useState<typeof APPLICANTS[0] | null>(null)
  const [confirmedId, setConfirmedId]   = useState<string | null>(null)
  const [showReject, setShowReject]      = useState(false)
  const [rejectMsg, setRejectMsg]        = useState('')
  const [rejectTarget, setRejectTarget]  = useState<string | null>(null)

  const confirm = (id: string) => { setConfirmedId(id); setSelected(null) }
  const openReject = (id: string) => { setRejectTarget(id); setShowReject(true) }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Applicants</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.listingBanner}>
        <Text style={styles.listingTitle}>🏠 Beachside bungalow with two cats</Text>
        <Text style={styles.listingDates}>Mar 15 – Apr 10 · {APPLICANTS.length} applicants</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {APPLICANTS.map(a => (
          <TouchableOpacity key={a.id} style={[styles.card, confirmedId === a.id && styles.cardConfirmed]} onPress={() => setSelected(a)} activeOpacity={0.85}>
            <View style={styles.cardTop}>
              <Image source={{ uri: a.avatar }} style={styles.avatar} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{a.firstName} {a.lastName}</Text>
                  {confirmedId === a.id && <View style={styles.confirmedBadge}><Text style={styles.confirmedBadgeText}>✓ Confirmed</Text></View>}
                </View>
                <View style={styles.ratingRow}>
                  <Text style={{ color: '#F59E0B' }}>★</Text>
                  <Text style={styles.ratingText}>{a.rating} · {a.reviews} reviews · {a.sits} sits</Text>
                </View>
                <View style={styles.badgesRow}>
                  {a.verified  && <View style={styles.badge}><Text style={styles.badgeText}>✓ ID</Text></View>}
                  {a.bgCheck   && <View style={styles.badge}><Text style={styles.badgeText}>✓ BG Check</Text></View>}
                </View>
              </View>
              <Text style={styles.time}>{a.appliedAt}</Text>
            </View>

            <Text style={styles.msgPreview} numberOfLines={2}>{a.message}</Text>

            {a.addOns.length > 0 && (
              <View style={styles.addOnsRow}>
                <Text style={styles.addOnsLabel}>Add-ons offered: </Text>
                <Text style={styles.addOnsValue}>{a.addOns.join(' · ')}</Text>
              </View>
            )}

            {confirmedId !== a.id && (
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.rejectBtn} onPress={() => openReject(a.id)}>
                  <Text style={styles.rejectBtnText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={() => confirm(a.id)}>
                  <Text style={styles.confirmBtnText}>✓ Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Applicant detail modal */}
      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        {selected && (
          <SafeAreaView style={styles.modalSafe}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selected.firstName}'s application</Text>
              <TouchableOpacity onPress={() => setSelected(null)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
              <View style={styles.modalProfile}>
                <Image source={{ uri: selected.avatar }} style={styles.modalAvatar} contentFit="cover" />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.modalName}>{selected.firstName} {selected.lastName}</Text>
                  <Text style={styles.modalStats}>★ {selected.rating} · {selected.reviews} reviews · {selected.sits} completed sits</Text>
                  <View style={styles.badgesRow}>
                    {selected.verified  && <View style={styles.badge}><Text style={styles.badgeText}>✓ ID Verified</Text></View>}
                    {selected.idCheck   && <View style={styles.badge}><Text style={styles.badgeText}>✓ ID Check</Text></View>}
                    {selected.bgCheck   && <View style={styles.badge}><Text style={styles.badgeText}>✓ BG Check</Text></View>}
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Their message</Text>
                <Text style={styles.messageText}>{selected.message}</Text>
              </View>

              {selected.addOns.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Add-ons they'll provide</Text>
                  {selected.addOns.map((a, i) => (
                    <View key={i} style={styles.addOnRow}><Text style={styles.addOnItem}>{a}</Text></View>
                  ))}
                </View>
              )}
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.msgBtn} onPress={() => setSelected(null)}>
                <Text style={styles.msgBtnText}>💬 Message {selected.firstName}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bigConfirmBtn} onPress={() => confirm(selected.id)}>
                <Text style={styles.bigConfirmBtnText}>✓ Confirm this sitter</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )}
      </Modal>

      {/* Reject modal */}
      <Modal visible={showReject} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowReject(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Decline applicant</Text>
            <TouchableOpacity onPress={() => setShowReject(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
          </View>
          <View style={{ padding: 20, gap: 16 }}>
            <Text style={styles.rejectHint}>Send a kind note (optional — they won't see your profile after this)</Text>
            <TextInput style={[styles.input, { minHeight: 100, textAlignVertical: 'top' }]} value={rejectMsg} onChangeText={setRejectMsg} multiline placeholder="Thanks for applying! We went with someone else this time..." placeholderTextColor={Colors.grayLight} />
            <TouchableOpacity style={styles.sendDeclineBtn} onPress={() => { setShowReject(false); setRejectTarget(null) }}>
              <Text style={styles.sendDeclineBtnText}>Send & decline</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const C = Colors, S = Shadows
const styles = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: C.cream },
  header:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.sand },
  back:               { fontSize: 22, color: C.navy, padding: 4 },
  headerTitle:        { fontSize: 17, fontWeight: '700', color: C.navy },
  listingBanner:      { backgroundColor: C.navy, padding: 16, gap: 4 },
  listingTitle:       { fontSize: 15, fontWeight: '700', color: '#fff' },
  listingDates:       { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  card:               { backgroundColor: C.white, borderRadius: 16, padding: 14, gap: 10, ...S.card },
  cardConfirmed:      { borderWidth: 2, borderColor: '#10B981' },
  cardTop:            { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  avatar:             { width: 52, height: 52, borderRadius: 26 },
  nameRow:            { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name:               { fontSize: 15, fontWeight: '700', color: C.navy },
  confirmedBadge:     { backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  confirmedBadgeText: { fontSize: 11, fontWeight: '700', color: '#065F46' },
  ratingRow:          { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingText:         { fontSize: 13, color: C.gray },
  badgesRow:          { flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  badge:              { backgroundColor: C.tealPale, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText:          { fontSize: 11, fontWeight: '600', color: C.tealDark },
  time:               { fontSize: 12, color: C.grayLight },
  msgPreview:         { fontSize: 13, color: C.gray, lineHeight: 20 },
  addOnsRow:          { flexDirection: 'row', alignItems: 'center', backgroundColor: C.grayPale, borderRadius: 8, padding: 8 },
  addOnsLabel:        { fontSize: 12, fontWeight: '600', color: C.gray },
  addOnsValue:        { fontSize: 12, color: C.tealDark },
  actionsRow:         { flexDirection: 'row', gap: 10 },
  rejectBtn:          { flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1.5, borderColor: C.sand },
  rejectBtnText:      { fontSize: 14, fontWeight: '600', color: C.gray },
  confirmBtn:         { flex: 2, borderRadius: 10, paddingVertical: 10, alignItems: 'center', backgroundColor: '#10B981' },
  confirmBtnText:     { fontSize: 14, fontWeight: '700', color: '#fff' },
  modalSafe:          { flex: 1, backgroundColor: C.white },
  modalHeader:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: C.sand },
  modalTitle:         { fontSize: 18, fontWeight: '700', color: C.navy },
  modalClose:         { fontSize: 18, color: C.gray, padding: 4 },
  modalProfile:       { flexDirection: 'row', gap: 14, alignItems: 'center' },
  modalAvatar:        { width: 70, height: 70, borderRadius: 35 },
  modalName:          { fontSize: 18, fontWeight: '700', color: C.navy },
  modalStats:         { fontSize: 13, color: C.gray },
  section:            { gap: 8 },
  sectionTitle:       { fontSize: 15, fontWeight: '700', color: C.navy },
  messageText:        { fontSize: 14, color: C.gray, lineHeight: 22 },
  addOnRow:           { backgroundColor: C.tealPale, borderRadius: 10, padding: 10 },
  addOnItem:          { fontSize: 14, color: C.tealDark, fontWeight: '600' },
  modalFooter:        { padding: 20, gap: 10, borderTopWidth: 1, borderTopColor: C.sand },
  msgBtn:             { borderRadius: 12, paddingVertical: 13, alignItems: 'center', borderWidth: 1.5, borderColor: C.teal },
  msgBtnText:         { fontSize: 15, fontWeight: '600', color: C.teal },
  bigConfirmBtn:      { backgroundColor: '#10B981', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  bigConfirmBtnText:  { color: '#fff', fontSize: 16, fontWeight: '700' },
  rejectHint:         { fontSize: 14, color: C.gray },
  input:              { backgroundColor: C.grayPale, borderRadius: 12, padding: 14, fontSize: 15, color: C.navy, borderWidth: 1, borderColor: C.sand },
  sendDeclineBtn:     { backgroundColor: C.navy, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  sendDeclineBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
