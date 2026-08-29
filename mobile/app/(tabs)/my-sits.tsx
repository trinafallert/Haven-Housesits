import { useState } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, TextInput, ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Colors, Shadows } from '@/constants/colors'
import { useApplications } from '@/src/hooks'
import type { Application } from '@/src/api/client'

const TABS = ['Applications', 'Past sits'] as const
type Tab = typeof TABS[number]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  PENDING:   { label: 'Pending',   color: Colors.gray,    bg: Colors.grayPale, icon: '⏳' },
  ACCEPTED:  { label: 'Confirmed', color: '#065F46',       bg: '#D1FAE5',       icon: '✅' },
  DECLINED:  { label: 'Declined',  color: '#991B1B',       bg: '#FEE2E2',       icon: '✕' },
  COMPLETED: { label: 'Completed', color: Colors.tealDark, bg: Colors.tealPale, icon: '🏡' },
}

const PET_ICONS: Record<string, string> = {
  DOG: '🐕', CAT: '🐈', BIRD: '🦜', FISH: '🐠',
  REPTILE: '🦎', HORSE: '🐴', SMALL_PET: '🐹', POULTRY: '🐔',
}

// ─── Tip Modal ────────────────────────────────────────────────────────────────

function TipModal({ app, onClose }: { app: Application; onClose: () => void }) {
  const PRESETS = [10, 20, 30, 50]
  const [selected, setSelected] = useState<number | null>(null)
  const [custom, setCustom]     = useState('')
  const [sent, setSent]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const amount = selected ?? (custom ? parseFloat(custom) : 0)

  const ownerName = app.sitter?.firstName ?? 'them'

  async function send() {
    if (!amount || amount <= 0) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setSent(true)
  }

  return (
    <Modal visible animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={tipS.safe}>
        {sent ? (
          <View style={tipS.success}>
            <Text style={tipS.successEmoji}>🎉</Text>
            <Text style={tipS.successTitle}>Tip sent!</Text>
            <Text style={tipS.successSub}>${amount} on its way to {ownerName}!</Text>
            <TouchableOpacity style={tipS.doneBtn} onPress={onClose}>
              <Text style={tipS.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={tipS.body}>
            <View style={tipS.header}>
              <Text style={tipS.title}>Leave a tip 💛</Text>
              <TouchableOpacity onPress={onClose}><Text style={tipS.close}>✕</Text></TouchableOpacity>
            </View>
            <Text style={tipS.sub}>Show {ownerName} some appreciation. 100% goes to them.</Text>
            <View style={tipS.presets}>
              {PRESETS.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[tipS.preset, selected === p && tipS.presetActive]}
                  onPress={() => { setSelected(p); setCustom('') }}
                >
                  <Text style={[tipS.presetText, selected === p && tipS.presetTextActive]}>${p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={tipS.customWrap}>
              <Text style={tipS.dollar}>$</Text>
              <TextInput
                style={tipS.customInput}
                value={custom}
                onChangeText={v => { setCustom(v); setSelected(null) }}
                placeholder="Custom amount"
                placeholderTextColor={Colors.grayLight}
                keyboardType="decimal-pad"
              />
            </View>
            <TouchableOpacity
              style={[tipS.sendBtn, (!amount || amount <= 0) && tipS.sendBtnDisabled]}
              onPress={send}
              disabled={!amount || amount <= 0 || loading}
            >
              {loading
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={tipS.sendBtnText}>Send ${amount > 0 ? amount : '—'}</Text>
              }
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  )
}

const tipS = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  body: { padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.navy },
  close: { fontSize: 18, color: Colors.gray },
  sub: { fontSize: 14, color: Colors.gray, marginBottom: 20, lineHeight: 20 },
  presets: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  preset: { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.sand, alignItems: 'center', backgroundColor: Colors.white },
  presetActive: { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  presetText: { fontSize: 16, fontWeight: '700', color: Colors.navy },
  presetTextActive: { color: Colors.tealDark },
  customWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.sand, borderRadius: 14, paddingHorizontal: 14, backgroundColor: Colors.white, marginBottom: 20 },
  dollar: { fontSize: 16, color: Colors.gray, marginRight: 4 },
  customInput: { flex: 1, fontSize: 16, color: Colors.navy, paddingVertical: 14 },
  sendBtn: { backgroundColor: Colors.teal, borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnText: { color: Colors.white, fontSize: 17, fontWeight: '700' },
  success: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  successEmoji: { fontSize: 60, marginBottom: 16 },
  successTitle: { fontSize: 26, fontWeight: '800', color: Colors.navy, marginBottom: 8 },
  successSub: { fontSize: 15, color: Colors.gray, textAlign: 'center', marginBottom: 32 },
  doneBtn: { backgroundColor: Colors.teal, borderRadius: 14, paddingHorizontal: 40, paddingVertical: 16 },
  doneBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
})

// ─── Application Card ─────────────────────────────────────────────────────────

function AppCard({ item }: { item: Application }) {
  const router = useRouter()
  const sc = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.PENDING
  const pets = item.listing.pets ?? []

  return (
    <TouchableOpacity
      style={styles.appCard}
      onPress={() => router.push(`/listing/${item.listing.id}`)}
    >
      <View style={[styles.statusDot, { backgroundColor: sc.bg }]}>
        <Text style={{ fontSize: 14 }}>{sc.icon}</Text>
      </View>
      <View style={styles.appInfo}>
        <Text style={styles.appTitle} numberOfLines={1}>{item.listing.title}</Text>
        <Text style={styles.appMeta}>
          📍 {item.listing.city}
          {'  ·  '}
          {new Date(item.listing.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {' – '}
          {new Date(item.listing.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </Text>
        <View style={styles.petsRow}>
          {pets.slice(0, 4).map((p, i) => (
            <Text key={i} style={{ fontSize: 14 }}>{PET_ICONS[p.type] ?? '🐾'}</Text>
          ))}
          <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
            <Text style={[styles.statusBadgeText, { color: sc.color }]}>{sc.label}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MySitsScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('Applications')
  const [tipApp, setTipApp] = useState<Application | null>(null)

  // Active/pending applications
  const { data: openData, isLoading: openLoading, refetch: refetchOpen } =
    useApplications('sitter', undefined)

  // Completed sits
  const { data: pastData, isLoading: pastLoading, refetch: refetchPast } =
    useApplications('sitter', 'COMPLETED')

  const openApps = (openData?.applications ?? []).filter(
    a => a.status !== 'COMPLETED'
  )
  const pastApps = pastData?.applications ?? []

  const isLoading = activeTab === 'Applications' ? openLoading : pastLoading
  const refetch   = activeTab === 'Applications' ? refetchOpen : refetchPast

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Sits</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.teal} />
        </View>
      ) : (
        <>
          {/* Applications */}
          {activeTab === 'Applications' && (
            <FlatList
              data={openApps}
              keyExtractor={a => a.id}
              contentContainerStyle={styles.list}
              onRefresh={refetchOpen}
              refreshing={openLoading}
              renderItem={({ item }) => <AppCard item={item} />}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyEmoji}>📋</Text>
                  <Text style={styles.emptyTitle}>No active applications</Text>
                  <Text style={styles.emptySub}>Apply to sits to see them here</Text>
                  <TouchableOpacity style={styles.findBtn} onPress={() => router.push('/(tabs)/search')}>
                    <Text style={styles.findBtnText}>Find a sit</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          )}

          {/* Past sits */}
          {activeTab === 'Past sits' && (
            <FlatList
              data={pastApps}
              keyExtractor={a => a.id}
              contentContainerStyle={styles.list}
              onRefresh={refetchPast}
              refreshing={pastLoading}
              renderItem={({ item }) => (
                <View style={styles.pastCard}>
                  <Image
                    source={{ uri: item.listing.photos?.[0] ?? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&q=70' }}
                    style={styles.pastPhoto}
                    contentFit="cover"
                  />
                  <View style={styles.pastBody}>
                    <Text style={styles.pastTitle} numberOfLines={1}>{item.listing.title}</Text>
                    <Text style={styles.pastMeta}>
                      {new Date(item.listing.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {' – '}
                      {new Date(item.listing.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {'  ·  '}
                      {item.listing.city}
                    </Text>

                    {/* Pets */}
                    <View style={styles.petsRow}>
                      {(item.listing.pets ?? []).slice(0, 4).map((p, i) => (
                        <Text key={i} style={{ fontSize: 16 }}>{PET_ICONS[p.type] ?? '🐾'}</Text>
                      ))}
                    </View>

                    <View style={styles.pastActions}>
                      <TouchableOpacity style={styles.reviewBtn}>
                        <Text style={styles.reviewBtnText}>Leave review</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.tipBtn}
                        onPress={() => setTipApp(item)}
                      >
                        <Text style={styles.tipBtnText}>💛 Tip</Text>
                      </TouchableOpacity>
                      {item.conversationId && (
                        <TouchableOpacity
                          style={styles.chatBtn}
                          onPress={() => router.push(`/inbox/${item.conversationId}`)}
                        >
                          <Text style={styles.chatBtnText}>💬</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyEmoji}>🏡</Text>
                  <Text style={styles.emptyTitle}>No past sits yet</Text>
                  <Text style={styles.emptySub}>Your completed sits will appear here</Text>
                </View>
              }
            />
          )}
        </>
      )}

      {/* Quick actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(tabs)/search')}>
          <Text style={styles.quickBtnText}>🔍 Find a sit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(tabs)/post')}>
          <Text style={styles.quickBtnText}>➕ Post a sit</Text>
        </TouchableOpacity>
      </View>

      {tipApp && <TipModal app={tipApp} onClose={() => setTipApp(null)} />}
    </SafeAreaView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: Colors.cream },
  header:          { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  headerTitle:     { fontSize: 26, fontWeight: '800', color: Colors.navy, letterSpacing: -0.5 },
  tabsRow:         { flexDirection: 'row', marginHorizontal: 20, marginBottom: 16, backgroundColor: Colors.grayPale, borderRadius: 12, padding: 3 },
  tab:             { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabActive:       { backgroundColor: Colors.white, ...Shadows.card },
  tabText:         { fontSize: 14, fontWeight: '600', color: Colors.gray },
  tabTextActive:   { color: Colors.navy },
  loadingWrap:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list:            { paddingHorizontal: 20, paddingBottom: 20, gap: 12 },

  // Application card
  appCard:         { backgroundColor: Colors.white, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, ...Shadows.card },
  statusDot:       { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  appInfo:         { flex: 1 },
  appTitle:        { fontSize: 14, fontWeight: '700', color: Colors.navy, marginBottom: 3 },
  appMeta:         { fontSize: 12, color: Colors.gray, marginBottom: 6 },
  petsRow:         { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusBadge:     { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  chevron:         { fontSize: 22, color: Colors.grayLight },

  // Past card
  pastCard:        { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden', ...Shadows.card },
  pastPhoto:       { width: '100%', height: 160 },
  pastBody:        { padding: 14 },
  pastTitle:       { fontSize: 15, fontWeight: '700', color: Colors.navy, marginBottom: 4 },
  pastMeta:        { fontSize: 12, color: Colors.gray, marginBottom: 8 },
  pastActions:     { flexDirection: 'row', gap: 8, marginTop: 10 },
  reviewBtn:       { flex: 1, backgroundColor: Colors.tealPale, borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
  reviewBtnText:   { fontSize: 13, fontWeight: '600', color: Colors.tealDark },
  tipBtn:          { backgroundColor: '#FFFBEB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9 },
  tipBtnText:      { fontSize: 13, fontWeight: '600', color: '#92400E' },
  chatBtn:         { backgroundColor: Colors.grayPale, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9 },
  chatBtnText:     { fontSize: 14 },

  // Empty
  empty:           { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyEmoji:      { fontSize: 48, marginBottom: 12 },
  emptyTitle:      { fontSize: 16, fontWeight: '600', color: Colors.navy, textAlign: 'center', marginBottom: 6 },
  emptySub:        { fontSize: 13, color: Colors.gray, textAlign: 'center', marginBottom: 20 },
  findBtn:         { backgroundColor: Colors.teal, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 },
  findBtnText:     { color: Colors.white, fontSize: 15, fontWeight: '700' },

  // Quick actions
  quickActions:    { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1, borderTopColor: Colors.sand },
  quickBtn:        { flex: 1, backgroundColor: Colors.white, borderRadius: 12, paddingVertical: 12, alignItems: 'center', ...Shadows.card },
  quickBtnText:    { fontSize: 14, fontWeight: '600', color: Colors.navy },
})
