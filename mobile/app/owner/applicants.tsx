import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Colors, Shadows } from '@/constants/colors'
import { useApplications, useUpdateApplicationStatus } from '../../src/hooks'

type App = {
  id: string
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED'
  message: string
  createdAt: string
  sitter: { id: string; firstName: string; lastName: string; avatar?: string | null; averageRating?: number | null }
  listing: { id: string; title: string; city: string; state: string; startDate: string; endDate: string }
  conversationId?: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function ApplicantsScreen() {
  const router = useRouter()
  const { listingId } = useLocalSearchParams<{ listingId?: string }>()

  const { data, isLoading } = useApplications('owner')
  const updateStatus = useUpdateApplicationStatus()

  const [selected,     setSelected]     = useState<App | null>(null)
  const [showReject,   setShowReject]    = useState(false)
  const [rejectMsg,    setRejectMsg]     = useState('')
  const [rejectTarget, setRejectTarget]  = useState<string | null>(null)

  // Filter by listingId if provided, otherwise show all
  const apps: App[] = (data?.applications ?? []).filter(
    (a: any) => !listingId || a.listing?.id === listingId
  ) as App[]

  const pending   = apps.filter(a => a.status === 'PENDING')
  const confirmed = apps.filter(a => a.status === 'ACCEPTED')
  const declined  = apps.filter(a => a.status === 'DECLINED')

  async function handleConfirm(id: string) {
    try {
      await updateStatus.mutateAsync({ id, status: 'ACCEPTED' })
      setSelected(null)
    } catch {}
  }

  async function handleDecline(id: string) {
    try {
      await updateStatus.mutateAsync({ id, status: 'DECLINED' })
      setShowReject(false)
      setRejectTarget(null)
    } catch {}
  }

  const renderCard = (a: App) => {
    const isConfirmed = a.status === 'ACCEPTED'
    const isDeclined  = a.status === 'DECLINED'

    return (
      <TouchableOpacity
        key={a.id}
        style={[styles.card, isConfirmed && styles.cardConfirmed, isDeclined && styles.cardDeclined]}
        onPress={() => !isDeclined && setSelected(a)}
        activeOpacity={0.85}
      >
        <View style={styles.cardTop}>
          <Image
            source={{ uri: a.sitter?.avatar ?? `https://ui-avatars.com/api/?name=${a.sitter?.firstName}+${a.sitter?.lastName}&background=5BA4A4&color=fff` }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{a.sitter?.firstName} {a.sitter?.lastName}</Text>
              {isConfirmed && <View style={styles.confirmedBadge}><Text style={styles.confirmedBadgeText}>✓ Confirmed</Text></View>}
              {isDeclined  && <View style={styles.declinedBadge}><Text style={styles.declinedBadgeText}>Declined</Text></View>}
            </View>
            <View style={styles.ratingRow}>
              <Text style={{ color: '#F59E0B' }}>★</Text>
              <Text style={styles.ratingText}>{a.sitter?.averageRating?.toFixed(1) ?? '5.0'}</Text>
            </View>
          </View>
          <Text style={styles.time}>{timeAgo(a.createdAt)}</Text>
        </View>

        <Text style={styles.msgPreview} numberOfLines={2}>{a.message}</Text>

        {a.status === 'PENDING' && (
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.rejectBtn} onPress={() => { setRejectTarget(a.id); setShowReject(true) }}>
              <Text style={styles.rejectBtnText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, updateStatus.isPending && { opacity: 0.6 }]}
              disabled={updateStatus.isPending}
              onPress={() => handleConfirm(a.id)}
            >
              {updateStatus.isPending && updateStatus.variables?.id === a.id
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.confirmBtnText}>✓ Confirm</Text>
              }
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Applicants</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.teal} />
        </View>
      ) : apps.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>📭</Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.navy }}>No applicants yet</Text>
          <Text style={{ fontSize: 14, color: Colors.gray, marginTop: 8, textAlign: 'center' }}>
            Applications will appear here once sitters start applying.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
          {pending.length > 0 && (
            <>
              <Text style={styles.groupLabel}>Pending ({pending.length})</Text>
              {pending.map(renderCard)}
            </>
          )}
          {confirmed.length > 0 && (
            <>
              <Text style={styles.groupLabel}>Confirmed ({confirmed.length})</Text>
              {confirmed.map(renderCard)}
            </>
          )}
          {declined.length > 0 && (
            <>
              <Text style={[styles.groupLabel, { color: Colors.gray }]}>Declined ({declined.length})</Text>
              {declined.map(renderCard)}
            </>
          )}
        </ScrollView>
      )}

      {/* Applicant detail modal */}
      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        {selected && (
          <SafeAreaView style={styles.modalSafe}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selected.sitter?.firstName}'s application</Text>
              <TouchableOpacity onPress={() => setSelected(null)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
              <View style={styles.modalProfile}>
                <Image
                  source={{ uri: selected.sitter?.avatar ?? `https://ui-avatars.com/api/?name=${selected.sitter?.firstName}&background=5BA4A4&color=fff` }}
                  style={styles.modalAvatar}
                  contentFit="cover"
                />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.modalName}>{selected.sitter?.firstName} {selected.sitter?.lastName}</Text>
                  <Text style={styles.modalStats}>★ {selected.sitter?.averageRating?.toFixed(1) ?? '5.0'}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Their message</Text>
                <Text style={styles.messageText}>{selected.message}</Text>
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              {selected.conversationId && (
                <TouchableOpacity
                  style={styles.msgBtn}
                  onPress={() => { setSelected(null); router.push(`/inbox/${selected.conversationId}`) }}
                >
                  <Text style={styles.msgBtnText}>💬 Message {selected.sitter?.firstName}</Text>
                </TouchableOpacity>
              )}
              {selected.status === 'PENDING' && (
                <TouchableOpacity
                  style={[styles.bigConfirmBtn, updateStatus.isPending && { opacity: 0.6 }]}
                  disabled={updateStatus.isPending}
                  onPress={() => handleConfirm(selected.id)}
                >
                  {updateStatus.isPending
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.bigConfirmBtnText}>✓ Confirm this sitter</Text>
                  }
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        )}
      </Modal>

      {/* Decline modal */}
      <Modal visible={showReject} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowReject(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Decline applicant</Text>
            <TouchableOpacity onPress={() => setShowReject(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
          </View>
          <View style={{ padding: 20, gap: 16 }}>
            <Text style={styles.rejectHint}>Send a kind note (optional)</Text>
            <TextInput
              style={[styles.input, { minHeight: 100, textAlignVertical: 'top' }]}
              value={rejectMsg}
              onChangeText={setRejectMsg}
              multiline
              placeholder="Thanks for applying! We went with someone else this time..."
              placeholderTextColor={Colors.grayLight}
            />
            <TouchableOpacity
              style={[styles.sendDeclineBtn, updateStatus.isPending && { opacity: 0.6 }]}
              disabled={updateStatus.isPending}
              onPress={() => rejectTarget && handleDecline(rejectTarget)}
            >
              {updateStatus.isPending
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.sendDeclineBtnText}>Send & decline</Text>
              }
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
  groupLabel:         { fontSize: 13, fontWeight: '700', color: C.tealDark, paddingVertical: 4 },
  card:               { backgroundColor: C.white, borderRadius: 16, padding: 14, gap: 10, ...S.card },
  cardConfirmed:      { borderWidth: 2, borderColor: '#10B981' },
  cardDeclined:       { opacity: 0.55 },
  cardTop:            { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  avatar:             { width: 52, height: 52, borderRadius: 26 },
  nameRow:            { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name:               { fontSize: 15, fontWeight: '700', color: C.navy },
  confirmedBadge:     { backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  confirmedBadgeText: { fontSize: 11, fontWeight: '700', color: '#065F46' },
  declinedBadge:      { backgroundColor: '#FEE2E2', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  declinedBadgeText:  { fontSize: 11, fontWeight: '700', color: '#991B1B' },
  ratingRow:          { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingText:         { fontSize: 13, color: C.gray },
  time:               { fontSize: 12, color: C.grayLight },
  msgPreview:         { fontSize: 13, color: C.gray, lineHeight: 20 },
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
