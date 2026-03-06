import { useState, useCallback, useRef } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ScrollView, RefreshControl, Dimensions,
  Modal, Switch, Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Colors, Shadows } from '@/constants/colors'
import { MOCK_LISTINGS } from '@/constants/mock-data'

const { width } = Dimensions.get('window')

// ─── Tab filters ────────────────────────────────────────────────────────────
const TOP_TABS = [
  { key: 'ALL',       label: 'All' },
  { key: 'PAID',      label: 'Paid 💰' },
  { key: 'HOUSESITS', label: 'Housesits' },
  { key: 'PET_SITS',  label: 'Pet Sits' },
  { key: 'VACANT',    label: 'Vacant' },
  { key: 'LONG_TERM', label: 'Long-term' },
]

const PET_FILTERS = [
  { key: 'DOG',       label: 'Dogs',       icon: '🐕' },
  { key: 'CAT',       label: 'Cats',       icon: '🐈' },
  { key: 'REPTILE',   label: 'Reptiles',   icon: '🦎' },
  { key: 'HORSE',     label: 'Horses',     icon: '🐴' },
  { key: 'BIRD',      label: 'Birds',      icon: '🦜' },
  { key: 'SMALL_PET', label: 'Small pets', icon: '🐹' },
  { key: 'FISH',      label: 'Fish',       icon: '🐠' },
  { key: 'POULTRY',   label: 'Poultry',    icon: '🐔' },
]

const ATTRACTION_FILTERS = [
  { key: 'BEACH',       label: 'Beach',       icon: '🏖️' },
  { key: 'CITY',        label: 'City',        icon: '🏙️' },
  { key: 'COUNTRYSIDE', label: 'Countryside', icon: '🌿' },
  { key: 'MOUNTAINS',   label: 'Mountains',   icon: '⛰️' },
]

const HOME_TYPES = [
  { key: 'HOUSE',     label: 'House',   icon: '🏠' },
  { key: 'APARTMENT', label: 'Apartment', icon: '🏢' },
  { key: 'FARM',      label: 'Farm',    icon: '🚜' },
  { key: 'UNIQUE',    label: 'Unique',  icon: '🏡' },
]

// ─── Listing Card ────────────────────────────────────────────────────────────
function ListingCard({ item }: { item: typeof MOCK_LISTINGS[0] }) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const isPaid = item.sitType === 'PAID'
  const isNew = true // in real app: createdAt within 48h
  const isLastMin = false // in real app: startDate within 7 days
  const isLowApps = (item.applicationCount ?? 0) < 3 && (item.applicationCount ?? 0) > 0

  const petIcons: Record<string, string> = {
    DOG: '🐕', CAT: '🐈', BIRD: '🦜', FISH: '🐠',
    REPTILE: '🦎', HORSE: '🐴', SMALL_PET: '🐹',
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/listing/${item.id}`)}
      activeOpacity={0.93}
    >
      {/* ── Photo ── */}
      <View style={styles.photoWrap}>
        <Image
          source={{ uri: (item as any).photos?.[0] ?? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600' }}
          style={styles.photo}
          contentFit="cover"
          transition={200}
        />

        {/* Top-left badges */}
        <View style={styles.badgesLeft}>
          {isNew && (
            <View style={[styles.badge, { backgroundColor: Colors.teal }]}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
          {isLastMin && (
            <View style={[styles.badge, { backgroundColor: '#F59E0B' }]}>
              <Text style={styles.badgeText}>LAST MIN</Text>
            </View>
          )}
          {isLowApps && (
            <View style={[styles.badge, { backgroundColor: Colors.purple }]}>
              <Text style={styles.badgeText}>LOW APPLICATIONS</Text>
            </View>
          )}
          {isPaid && (
            <View style={[styles.badge, { backgroundColor: '#10B981' }]}>
              <Text style={styles.badgeText}>💰 PAID</Text>
            </View>
          )}
        </View>

        {/* Heart */}
        <TouchableOpacity style={styles.heartBtn} onPress={() => setSaved(!saved)}>
          <Text style={{ fontSize: 22 }}>{saved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Body ── */}
      <View style={styles.cardBody}>
        {/* Title + match */}
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.matchPill}>
            <Text style={styles.matchText}>{item.matchScore}%</Text>
          </View>
        </View>

        {/* Location */}
        <Text style={styles.cardLocation}>
          📍 {(item as any).city}, {(item as any).country ?? (item as any).state}
        </Text>

        {/* Dates */}
        <Text style={styles.cardDates}>
          {new Date((item as any).startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {' – '}
          {new Date((item as any).endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Text>

        {/* Pets + paid rate row */}
        <View style={styles.cardFooter}>
          <View style={styles.petsRow}>
            {((item as any).pets ?? []).slice(0, 4).map((p: any, i: number) => (
              <Text key={i} style={styles.petIcon}>{petIcons[p.type] ?? '🐾'}</Text>
            ))}
            {((item as any).pets ?? []).length === 0 && (
              <Text style={styles.noePets}>🏠 Vacant sit</Text>
            )}
          </View>
          {isPaid && (item as any).dailyRate && (
            <View style={styles.ratePill}>
              <Text style={styles.rateText}>${(item as any).dailyRate}/day</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

// ─── Filter Panel (Modal) ─────────────────────────────────────────────────────
function FilterPanel({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [sortBy, setSortBy] = useState('RECOMMENDED')
  const [selectedPets, setSelectedPets] = useState<string[]>([])
  const [selectedAttractions, setSelectedAttractions] = useState<string[]>([])
  const [selectedHomeTypes, setSelectedHomeTypes] = useState<string[]>([])
  const [wifi, setWifi] = useState(false)
  const [carIncluded, setCarIncluded] = useState(false)
  const [familyFriendly, setFamilyFriendly] = useState(false)

  const toggle = (arr: string[], setArr: Function, key: string) => {
    setArr((prev: string[]) => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.filterContainer}>
        {/* Header */}
        <View style={styles.filterHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.filterClose}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.filterTitle}>Filters</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.filterClear}>Clear all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filterScroll} showsVerticalScrollIndicator={false}>

          {/* Sort */}
          <Text style={styles.filterSection}>Sort by</Text>
          <View style={styles.sortRow}>
            {['Recommended', 'Newest', 'Start date', 'Distance'].map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.sortChip, sortBy === s.toUpperCase().replace(' ', '_') && styles.sortChipActive]}
                onPress={() => setSortBy(s.toUpperCase().replace(' ', '_'))}
              >
                <Text style={[styles.sortChipText, sortBy === s.toUpperCase().replace(' ', '_') && styles.sortChipTextActive]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Pets */}
          <Text style={styles.filterSection}>Pets</Text>
          <View style={styles.iconGrid}>
            {PET_FILTERS.map(p => (
              <TouchableOpacity
                key={p.key}
                style={[styles.iconGridItem, selectedPets.includes(p.key) && styles.iconGridItemActive]}
                onPress={() => toggle(selectedPets, setSelectedPets, p.key)}
              >
                <Text style={styles.iconGridEmoji}>{p.icon}</Text>
                <Text style={[styles.iconGridLabel, selectedPets.includes(p.key) && styles.iconGridLabelActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Local attractions */}
          <Text style={styles.filterSection}>Local attractions</Text>
          <View style={styles.iconGrid}>
            {ATTRACTION_FILTERS.map(a => (
              <TouchableOpacity
                key={a.key}
                style={[styles.iconGridItem, selectedAttractions.includes(a.key) && styles.iconGridItemActive]}
                onPress={() => toggle(selectedAttractions, setSelectedAttractions, a.key)}
              >
                <Text style={styles.iconGridEmoji}>{a.icon}</Text>
                <Text style={[styles.iconGridLabel, selectedAttractions.includes(a.key) && styles.iconGridLabelActive]}>
                  {a.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Home type */}
          <Text style={styles.filterSection}>Home type</Text>
          <View style={styles.iconGrid}>
            {HOME_TYPES.map(h => (
              <TouchableOpacity
                key={h.key}
                style={[styles.iconGridItem, selectedHomeTypes.includes(h.key) && styles.iconGridItemActive]}
                onPress={() => toggle(selectedHomeTypes, setSelectedHomeTypes, h.key)}
              >
                <Text style={styles.iconGridEmoji}>{h.icon}</Text>
                <Text style={[styles.iconGridLabel, selectedHomeTypes.includes(h.key) && styles.iconGridLabelActive]}>
                  {h.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Amenities */}
          <Text style={styles.filterSection}>Amenities</Text>
          {[
            { label: '📶 High-speed wifi',    state: wifi,          set: setWifi },
            { label: '🚗 Car included',        state: carIncluded,   set: setCarIncluded },
            { label: '👨‍👩‍👧 Family friendly',    state: familyFriendly, set: setFamilyFriendly },
          ].map(({ label, state, set }) => (
            <View key={label} style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{label}</Text>
              <Switch
                value={state}
                onValueChange={set}
                trackColor={{ false: Colors.sand, true: Colors.teal }}
                thumbColor={Colors.white}
              />
            </View>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Apply button */}
        <View style={styles.filterFooter}>
          <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
            <Text style={styles.applyBtnText}>Show results</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SearchScreen() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }, [])

  const filteredListings = MOCK_LISTINGS.filter(l => {
    if (activeTab === 'PAID')      return (l as any).sitType === 'PAID'
    if (activeTab === 'HOUSESITS') return ['FREE', 'PAID'].includes((l as any).sitType)
    if (activeTab === 'PET_SITS')  return ((l as any).pets ?? []).length > 0
    if (activeTab === 'VACANT')    return ((l as any).pets ?? []).length === 0
    if (activeTab === 'LONG_TERM') return (l as any).sitType === 'LONG_TERM'
    return true
  })

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Search bar ── */}
      <View style={styles.searchBarWrap}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Where would you like to go?"
            placeholderTextColor={Colors.grayLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ color: Colors.gray, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
          <Text style={styles.filterBtnIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* ── Top tabs ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}
      >
        {TOP_TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Listings ── */}
      <FlatList
        data={filteredListings}
        keyExtractor={i => i.id}
        renderItem={({ item }) => <ListingCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.teal} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌍</Text>
            <Text style={styles.emptyTitle}>No sits found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters or search in a different location</Text>
          </View>
        }
      />

      {/* ── Filter modal ── */}
      <FilterPanel visible={filterVisible} onClose={() => setFilterVisible(false)} />
    </SafeAreaView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: Colors.cream },
  searchBarWrap:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  searchBar:        { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderWidth: 1, borderColor: Colors.sand, ...Shadows.card },
  searchIcon:       { fontSize: 16 },
  searchInput:      { flex: 1, fontSize: 15, color: Colors.navy },
  filterBtn:        { backgroundColor: Colors.teal, borderRadius: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', ...Shadows.card },
  filterBtnIcon:    { fontSize: 20 },

  tabsScroll:       { maxHeight: 48, flexGrow: 0 },
  tabsContent:      { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  tab:              { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.sand },
  tabActive:        { backgroundColor: Colors.teal, borderColor: Colors.teal },
  tabText:          { fontSize: 14, fontWeight: '500', color: Colors.gray },
  tabTextActive:    { color: Colors.white, fontWeight: '700' },

  listContent:      { padding: 16, gap: 16, paddingBottom: 32 },

  card:             { backgroundColor: Colors.white, borderRadius: 18, overflow: 'hidden', ...Shadows.card },
  photoWrap:        { position: 'relative', height: 200 },
  photo:            { width: '100%', height: '100%' },
  badgesLeft:       { position: 'absolute', top: 10, left: 10, gap: 6, flexDirection: 'column' },
  badge:            { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  badgeText:        { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  heartBtn:         { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },

  cardBody:         { padding: 14, gap: 4 },
  cardTitleRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardTitle:        { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.navy },
  matchPill:        { backgroundColor: Colors.tealPale, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  matchText:        { fontSize: 12, fontWeight: '700', color: Colors.tealDark },
  cardLocation:     { fontSize: 13, color: Colors.gray },
  cardDates:        { fontSize: 13, color: Colors.gray, marginTop: 2 },
  cardFooter:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  petsRow:          { flexDirection: 'row', gap: 4 },
  petIcon:          { fontSize: 20 },
  noePets:          { fontSize: 13, color: Colors.gray },
  ratePill:         { backgroundColor: '#ECFDF5', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  rateText:         { fontSize: 13, fontWeight: '700', color: '#059669' },

  emptyState:       { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyEmoji:       { fontSize: 48 },
  emptyTitle:       { fontSize: 20, fontWeight: '700', color: Colors.navy },
  emptySubtitle:    { fontSize: 14, color: Colors.gray, textAlign: 'center', maxWidth: 260 },

  // Filter panel
  filterContainer:  { flex: 1, backgroundColor: Colors.white },
  filterHeader:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  filterClose:      { fontSize: 18, color: Colors.gray, padding: 4 },
  filterTitle:      { fontSize: 18, fontWeight: '700', color: Colors.navy },
  filterClear:      { fontSize: 15, color: Colors.teal, fontWeight: '600' },
  filterScroll:     { flex: 1 },
  filterSection:    { fontSize: 16, fontWeight: '700', color: Colors.navy, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },

  sortRow:          { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 8 },
  sortChip:         { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white },
  sortChipActive:   { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  sortChipText:     { fontSize: 14, color: Colors.gray, fontWeight: '500' },
  sortChipTextActive: { color: Colors.tealDark, fontWeight: '700' },

  iconGrid:         { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8 },
  iconGridItem:     { alignItems: 'center', width: (width - 64) / 4, padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white, gap: 4 },
  iconGridItemActive: { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  iconGridEmoji:    { fontSize: 26 },
  iconGridLabel:    { fontSize: 11, color: Colors.gray, textAlign: 'center', fontWeight: '500' },
  iconGridLabelActive: { color: Colors.tealDark, fontWeight: '700' },

  toggleRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.grayPale },
  toggleLabel:      { fontSize: 15, color: Colors.navy, fontWeight: '500' },

  filterFooter:     { padding: 20, borderTopWidth: 1, borderTopColor: Colors.sand },
  applyBtn:         { backgroundColor: Colors.teal, borderRadius: 16, paddingVertical: 16, alignItems: 'center', ...Shadows.card },
  applyBtnText:     { color: Colors.white, fontSize: 16, fontWeight: '700' },
})
