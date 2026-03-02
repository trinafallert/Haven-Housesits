import { useState } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, TextInput, ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Colors, Shadows } from '@/constants/colors'

const TABS = ['Applications', 'Past sits'] as const
type Tab = typeof TABS[number]

const APP_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  PENDING:   { label: 'Pending',   color: Colors.gray,    bg: Colors.grayPale,   icon: '⏳' },
  ACCEPTED:  { label: 'Confirmed', color: '#065F46',       bg: '#D1FAE5',          icon: '✅' },
  DECLINED:  { label: 'Declined',  color: '#991B1B',       bg: '#FEE2E2',          icon: '✕' },
  COMPLETED: { label: 'Completed', color: Colors.tealDark, bg: Colors.tealPale,    icon: '🏡' },
}

const MOCK_OPEN = [
  {
    id: 'a1', status: 'PENDING',
    listing: { id: '2', title: 'Two golden retrievers in Lexington', city: 'Lexington', state: 'KY', startDate: '2026-03-10', endDate: '2026-04-12', photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=70' },
    pets: ['🐕', '🐕'],
  },
  {
    id: 'a2', status: 'ACCEPTED',
    listing: { id: '3', title: 'SF apartment with two cats', city: 'San Francisco', state: 'CA', startDate: '2026-04-01', endDate: '2026-04-14', photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&q=70' },
    pets: ['🐈'],
  },
]

const MOCK_PAST = [
  {
    id: 'p1', status: 'COMPLETED',
    listing: { id: '1', title: 'Beachside bungalow with two cats', city: 'Redondo Beach', state: 'CA', startDate: '2025-12-01', endDate: '2025-12-21', photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&q=70' },
    owner: { firstName: 'Sandra' },
    rating: 5, tipReceived: 20, reviewLeft: false,
    pets: ['🐈', '🐈'],
  },
]

function TipModal({ sit, onClose }: { sit: any; onClose: () => void }) {
  const PRESETS = [10, 20, 30, 50]
  const [selected, setSelected] = useState<number | null>(null)
  const [custom, setCustom]     = useState('')
  const [sent, setSent]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const amount = selected ?? (custom ? parseFloat(custom) : 0)

  async function send() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false); setSent(true)
  }

  return (
    <Modal visible animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={tipStyles.safe}>
        {sent ? (
          <View style={tipStyles.success}>
            <Text style={tipStyles.successEmoji}>🎉</Text>
            <Text style={tipStyles.successTitle}>Tip sent!</Text>
            <Text style={tipStyles.successSub}>${amount} on its way to {sit.owner.firstName}!</Text>
            <TouchableOpacity style={tipStyles.doneBtn} onPress={onClose}>
              <Text style={tipStyles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={tipStyles.body}>
            <View style={tipStyles.header}>
              <Text style={tipStyles.title}>Leave a tip 💛</Text>
              <TouchableOpacity onPress={onClose}><Text style={tipStyles.close}>✕</Text></TouchableOpacity>
            </View>
            <Text style={tipStyles.sub}>Show {sit.owner.firstName} some appreciation. 100% goes to them.</Text>
            <View style={tipStyles.presets}>
              {PRESETS.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[tipStyles.preset, selected === p && tipStyles.presetActive]}
                  onPress={() => { setSelected(p); setCustom('') }}
                >
                  <Text style={[tipStyles.presetText, selected === p && tipStyles.presetTextActive]}>${p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={tipStyles.customWrap}>
              <Text style={tipStyles.dollar}>$</Text>
              <TextInput
                style={tipStyles.customInput}
                value={custom}
                onChangeText={(v) => { setCustom(v); setSelected(null) }}
                placeholder="Custom amount"
                placeholderTextColor={Colors.grayLight}
                keyboardType="decimal-pad"
              />
            </View>
            <TouchableOpacity
              style={[tipStyles.sendBtn, (!amount || amount <= 0) && tipStyles.sendBtnDisabled]}
              onPress={send}
              disabled={!amount || amount <= 0 || loading}
            >
              {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={tipStyles.sendBtnText}>Send ${amount > 0 ? amount : '—'}</Text>}
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  )
}

const tipStyles = StyleSheet.create({
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

export default function MySitsScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('Applications')
  const [tipSit, setTipSit]       = useState<any>(null)

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Sits</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Applications */}
      {activeTab === 'Applications' && (
        <FlatList
          data={MOCK_OPEN}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const sc = APP_STATUS_CONFIG[item.status]
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
                    📍 {item.listing.city} · {new Date(item.listing.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(item.listing.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                  <View style={styles.petsRow}>
                    {item.pets.map((p, i) => <Text key={i} style={{ fontSize: 14 }}>{p}</Text>)}
                    <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: sc.color }]}>{sc.label}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            )
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyTitle}>No active applications</Text>
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
          data={MOCK_PAST}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.pastCard}>
              <Image source={{ uri: item.listing.photo }} style={styles.pastPhoto} contentFit="cover" />
              <View style={styles.pastBody}>
                <Text style={styles.pastTitle} numberOfLines={1}>{item.listing.title}</Text>
                <Text style={styles.pastMeta}>
                  {new Date(item.listing.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(item.listing.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {item.listing.city}
                </Text>

                {/* Stars */}
                <View style={styles.stars}>
                  {[1,2,3,4,5].map((s) => (
                    <Text key={s} style={{ fontSize: 14 }}>{s <= item.rating ? '⭐' : '☆'}</Text>
                  ))}
                  {item.tipReceived > 0 && (
                    <Text style={styles.tipBadge}>+${item.tipReceived} tip 💛</Text>
                  )}
                </View>

                <View style={styles.pastActions}>
                  {!item.reviewLeft && (
                    <TouchableOpacity style={styles.reviewBtn}>
                      <Text style={styles.reviewBtnText}>Leave review</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.tipBtn}
                    onPress={() => setTipSit(item)}
                  >
                    <Text style={styles.tipBtnText}>💛 Tip</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.chatBtn}>
                    <Text style={styles.chatBtnText}>💬</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🏡</Text>
              <Text style={styles.emptyTitle}>No past sits yet</Text>
            </View>
          }
        />
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

      {tipSit && <TipModal sit={tipSit} onClose={() => setTipSit(null)} />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: Colors.navy, letterSpacing: -0.5 },
  tabsRow: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 16, backgroundColor: Colors.grayPale, borderRadius: 12, padding: 3 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.white, ...Shadows.card },
  tabText: { fontSize: 14, fontWeight: '600', color: Colors.gray },
  tabTextActive: { color: Colors.navy },
  list: { paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
  appCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, ...Shadows.card },
  statusDot: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  appInfo: { flex: 1 },
  appTitle: { fontSize: 14, fontWeight: '700', color: Colors.navy, marginBottom: 3 },
  appMeta: { fontSize: 12, color: Colors.gray, marginBottom: 6 },
  petsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  chevron: { fontSize: 22, color: Colors.grayLight },
  pastCard: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden', ...Shadows.card },
  pastPhoto: { width: '100%', height: 160 },
  pastBody: { padding: 14 },
  pastTitle: { fontSize: 15, fontWeight: '700', color: Colors.navy, marginBottom: 4 },
  pastMeta: { fontSize: 12, color: Colors.gray, marginBottom: 8 },
  stars: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 12 },
  tipBadge: { fontSize: 12, fontWeight: '700', color: '#92400E', backgroundColor: '#FFFBEB', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 },
  pastActions: { flexDirection: 'row', gap: 8 },
  reviewBtn: { flex: 1, backgroundColor: Colors.tealPale, borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
  reviewBtnText: { fontSize: 13, fontWeight: '600', color: Colors.tealDark },
  tipBtn: { backgroundColor: '#FFFBEB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9 },
  tipBtnText: { fontSize: 13, fontWeight: '600', color: '#92400E' },
  chatBtn: { backgroundColor: Colors.grayPale, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9 },
  chatBtnText: { fontSize: 14 },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: Colors.navy, textAlign: 'center', marginBottom: 20 },
  findBtn: { backgroundColor: Colors.teal, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 },
  findBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
  quickActions: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1, borderTopColor: Colors.sand },
  quickBtn: { flex: 1, backgroundColor: Colors.white, borderRadius: 12, paddingVertical: 12, alignItems: 'center', ...Shadows.card },
  quickBtnText: { fontSize: 14, fontWeight: '600', color: Colors.navy },
})
